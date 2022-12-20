import json
from gensim.models import Word2Vec
from sklearn.metrics.pairwise import cosine_similarity
from word2vec_train import get_and_sort_corpus
from ingredient_parser import ingredient_parser
from tfidf_embeddings import TfidfEmbeddingVectorizer
import boto3
import random


def get_recommendations(N, data, scores):
    """
    Rank scores and output a pandas data frame containing all the details of the top N recipes.
    :param scores: list of cosine similarities
    """
    # order the scores with and filter to get the highest N scores
    top = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:N]
    # create dataframe to load in recommendations
    ids = []
    for i in top:
        ids.append(data[i]["id"])
    return ids


def get_recs(ingredients, N=5):
    """
    Get the top N recipe recomendations.
    :param ingredients: comma seperated string listing ingredients
    :param N: number of recommendations
    :param mean: False if using tfidf weighted embeddings, True if using simple mean
    """
    # load in word2vec model
    model = Word2Vec.load("/tmp/model_cbow.bin")
    # normalize embeddings
    model.init_sims(replace=True)
    if model:
        print("Successfully loaded model")
    # load in data
    data = json.load(open("/tmp/recipes.json"))
    # create corpus
    corpus = get_and_sort_corpus(data)

    # use TF-IDF as weights for each word embedding
    tfidf_vec_tr = TfidfEmbeddingVectorizer(model)
    tfidf_vec_tr.fit(corpus)
    doc_vec = tfidf_vec_tr.transform(corpus)
    doc_vec = [doc.reshape(1, -1) for doc in doc_vec]
    assert len(doc_vec) == len(corpus)

    # create embeddings for input text
    input = ingredients
    # create tokens with elements
    input = input.split(",")
    # parse ingredient list
    input = ingredient_parser(input)
    # get embeddings for ingredient doc
    input_embedding = tfidf_vec_tr.transform([input])[0].reshape(1, -1)

    # get cosine similarity between input embedding and all the document embeddings
    cos_sim = map(lambda x: cosine_similarity(input_embedding, x)[0][0], doc_vec)
    scores = list(cos_sim)
    # Filter top N recommendations
    ids = get_recommendations(N, data, scores)
    return ids


def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket = "recommendation6998"

    model_s3 = "models/model_cbow.bin"
    recipe_s3 = "data/recipes.json"
    model_tmp = "/tmp/model_cbow.bin"
    recipe_tmp = "/tmp/recipes.json"

    s3.download_file(bucket, model_s3, model_tmp)
    s3.download_file(bucket, recipe_s3, recipe_tmp)

    userId = event['queryStringParameters']['usr']

    # dynamoDB
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('history')
    prev_data = table.get_item(Key={'usrId': userId})

    if 'Item' not in prev_data:
        history = ""
    else:
        prev = json.loads(prev_data['Item']['search'])
        history = ", ".join(prev)

    size = 10
    if history == "":
        ids = random.sample(range(0, 1216), size)
        id_list = [str(i * 6) for i in ids]
    else:
        ids = get_recs(history, size)
        id_list = [str(i) for i in ids]


    # dynamodb
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('recipes')
    res_body = []

    for i in range(len(id_list)):
        res_id = id_list[i]
        response = table.get_item(Key={'id': res_id})
        res_body.append(response['Item'])

    return {
        "statusCode": 200,
        "headers": {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(res_body),
    }
