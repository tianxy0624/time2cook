from gensim.models import Word2Vec
import json
from ingredient_parser import ingredient_parser


# get corpus with the documents sorted in alphabetical order
def get_and_sort_corpus(data):
    corpus_sorted = []
    for recipe in data:
        doc = recipe["ingredients"]
        doc.sort()
        corpus_sorted.append(doc)
    return corpus_sorted


# calculate average length of each document
def get_window(corpus):
    lengths = [len(doc) for doc in corpus]
    avg_len = float(sum(lengths)) / len(lengths)
    return round(avg_len)


if __name__=="__main__":
    # get corpus
    input_path = "/tmp/recipes_raw.json"
    input_file = open(input_path)
    recipes = json.load(input_file)

    for recipe in recipes:
        recipe["ingredients"] = ingredient_parser(recipe["ingredients"])
    output_path = "/tmp/recipes.json"
    with open(output_path, "w") as outfile:
        json.dump(recipes, outfile)

    corpus = get_and_sort_corpus(recipes)
    print(f"Length of corpus: {len(corpus)}")
    # train and save CBOW Word2Vec model
    model_cbow = Word2Vec(corpus, sg=0, window=get_window(corpus), min_count=1, vector_size=100)
    model_cbow.save('/tmp/model_cbow.bin')
    print("Word2Vec model successfully trained")