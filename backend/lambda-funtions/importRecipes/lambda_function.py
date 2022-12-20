import json
import boto3
import io
from datetime import datetime
import urllib.parse
from requests_aws4auth import AWS4Auth
import requests

def lambda_handler(event, context):
    region = 'us-east-1'
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

    host = 'https://search-time2cook-4y46a2hvfmepy3llsqkyfuxsne.us-east-1.es.amazonaws.com'
    index = 'recipes'
    type = '_doc'
    url = host + '/' + index + '/' + type
    headers = {"Content-Type": "application/json"}

    aws_session = boto3.Session()
    client = aws_session.client('s3', region_name="us-east-1")
    # bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    # key = "chinese.json"
    json_obj = client.get_object(Bucket="time2cook", Key=key)
    file_content = json_obj['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    

    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('recipes')
    
    id = 0
    for link in json_content:
        value = json_content[link]
        if id%6==0:
            item = {
                "id":str(id),
                "title":value["title"],
                "ingredients":"|".join(value["ingredients"]),
                "instructions":value["instructions"],
                "picture_link":value["picture_link"]
            }
            response = table.put_item(Item=item)
            document = {"recipeid": item["id"], "ingredients": item["ingredients"]}
            r = requests.post(url, auth=awsauth, json=document, headers=headers)
        id+=1
        
    return {
        'statusCode': 200,
        'message': r.text
    }

