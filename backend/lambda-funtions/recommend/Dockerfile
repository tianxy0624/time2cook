FROM public.ecr.aws/lambda/python:3.7

# Install the function's dependencies using file requirements.txt
# from your project folder.

COPY requirements.txt  .
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}" && \
    mkdir "/var/lang/nltk_data" && \
    python -m nltk.downloader -d "/var/lang/nltk_data" punkt && \
    python -m nltk.downloader -d "/var/lang/nltk_data" wordnet && \
    python -m nltk.downloader -d "/var/lang/nltk_data" stopwords && \
    python -m nltk.downloader -d "/var/lang/nltk_data" averaged_perceptron_tagger


# Copy function code
COPY lambda_function.py ${LAMBDA_TASK_ROOT}
COPY ingredient_parser.py ${LAMBDA_TASK_ROOT}
COPY tfidf_embeddings.py ${LAMBDA_TASK_ROOT}
COPY word2vec_train.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "lambda_function.lambda_handler" ]