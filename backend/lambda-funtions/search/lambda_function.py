import json
import boto3
import io
from datetime import datetime
import urllib.parse
from requests_aws4auth import AWS4Auth
import requests
import base64


def lambda_handler(event, context):
    # open search
    region = 'us-east-1'
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
    queries =  list(set([i.lower() for i in event['queryStringParameters']['q'].split(",")]))
    userId = event['queryStringParameters']['usr']
    host = 'https://search-time2cook-4y46a2hvfmepy3llsqkyfuxsne.us-east-1.es.amazonaws.com'
    index = 'recipes'
    url = host + '/' + index + '/_search?' + "q=ingredients:"
    recipe_list = set()
    
    # dynamoDB
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('history')
    prev_data = table.get_item(Key={'usrId': userId})
    if 'Item' not in prev_data:
        item = {
            "usrId": userId,
            "search": json.dumps(queries)
        }
    else:
        prev = json.loads(prev_data['Item']['search'])
        item = {
            "usrId": userId,
            "search": json.dumps(list(set(queries+prev)))
        }
        
        
    table.put_item(Item = item)

    for q in queries:
        r = requests.get(url + q, auth=awsauth)
        response = r.json()
        for recipe in response['hits']['hits']:
            recipe_list.add(recipe['_source']['recipeid'])
            
    # dynamodb
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('recipes')
    size = 10
    recipe_list = list(recipe_list)
    res_body = []
    
    for i in range(min(size, len(recipe_list))):
        res_id = recipe_list[i]
        response = table.get_item(Key={'id': res_id})
        res_body.append(response['Item'])

    return {
        "statusCode": 200,
        "headers": {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(res_body),
    }
