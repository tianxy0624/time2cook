import json
import time
from urllib import request
from urllib.error import HTTPError, URLError
from bs4 import BeautifulSoup

import sys
from os import path
import argparse

import config
from recipe_scrapers import scrape_me

sys.path.append(config.path_scrapers)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
}


def get_recipe(url):
    try:
        scrape = scrape_me(url)
    except:
        print('Could not scrape URL {}'.format(url))
        return {}

    try:
        title = scrape.title()
    except AttributeError:
        title = None

    try:
        ingredients = scrape.ingredients()
    except AttributeError:
        ingredients = None

    try:
        instructions = scrape.instructions()
    except AttributeError:
        instructions = None

    try:
        image_link = scrape.image()
    except AttributeError:
        image_link = None

    return {
        'title': title,
        'ingredients': ingredients,
        'instructions': instructions,
        'picture_link': image_link,
    }


def get_all_recipes_fn(page_str, page_num):
    base_url = 'http://www.foodnetwork.com'
    search_url_str = 'recipes/recipes-a-z'
    url = '{}/{}/{}/p/{}'.format(base_url, search_url_str, page_str, page_num)

    try:
        soup = BeautifulSoup(request.urlopen(
            request.Request(url, headers=HEADERS)).read(), "html.parser")
        recipe_link_items = soup.select('div.o-Capsule__m-Body ul.m-PromoList li a')
        recipe_links = ["http:" + r.attrs['href'] for r in recipe_link_items]
        print('Read {} recipe links from {}'.format(len(recipe_links), url))
        return recipe_links
    except (HTTPError, URLError):
        print('Could not parse page {}'.format(url))
        return []


def scrape_recipe_box(scraper, site_str, page_iter, status_interval):
    recipes = {}
    start = time.time()
    for i in page_iter:
        recipes.update(scraper(i))
        if i % status_interval == 0:
            print('Scraping page {} of {}'.format(i, max(page_iter)))
            quick_save(site_str, recipes)

    print('Scraped {} recipes from {} in {:.0f} minutes'.format(
        len(recipes), site_str, (time.time() - start) / 60))
    quick_save(site_str, recipes)


def get_fn_letter_links():
    # get list of pages with links to recipes
    base_url = 'http://www.foodnetwork.com'
    search_url_str = 'recipes/recipes-a-z'
    url = '{}/{}/{}'.format(base_url, search_url_str, '')

    try:
        soup = BeautifulSoup(request.urlopen(
            request.Request(url, headers=HEADERS)).read(), "html.parser")
        page_link_items = soup.select('ul.o-IndexPagination__m-List li a')
        letter_links = [p['href'] for p in page_link_items]

        return letter_links
    except (HTTPError, URLError):
        print('Could not parse page {}'.format(url))


def get_fn_recipe_links(pages):
    letter_links = get_fn_letter_links()
    recipe_links = {}
    page_tracker = 0

    for page in letter_links:
        recipe_set = True
        page_num = 1
        lag0 = 0
        while recipe_set and page_num <= pages:
            t0 = time.time()
            recipe_set = get_all_recipes_fn(path.basename(page), page_num)
            lag1 = time.time() - t0
            recipe_links[page_tracker] = []
            recipe_links[page_tracker].extend(recipe_set)
            page_num += 1
            page_tracker += 1
            time.sleep(lag1 * .5 + lag0 * .5)
            lag0 = lag1
    return recipe_links


def scrape_fn(page_num):
    global recipe_links_dict
    recipe_links = recipe_links_dict[page_num]
    return {r: get_recipe(r) for r in recipe_links}


def quick_load(site_str):
    return load_recipes(path.join(
        config.path_data, 'recipes_raw_{}.json'.format(site_str)))


def load_recipes(filename):
    with open(filename, 'r') as f:
        return json.load(f)


def quick_save(site_str, recipes):
    save_recipes(
        path.join(config.path_data, 'recipes_raw_{}.json'.format(site_str)),
        recipes)


def save_recipes(filename, recipes):
    with open(filename, 'w') as f:
        json.dump(recipes, f)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--status', type=int, default=5, help='Print status interval')
    parser.add_argument('--pages', type=int, default=1, help='Number of pages to scrape')

    args = parser.parse_args()

    recipe_links_dict = get_fn_recipe_links(args.pages)
    page_iter = range(0, len(recipe_links_dict))
    scrape_recipe_box(scrape_fn, 'fn', page_iter, args.status)
