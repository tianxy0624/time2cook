from nltk.stem import WordNetLemmatizer
import unidecode
import nltk


def ingredient_parser(ingredients):
    lemmatizer = WordNetLemmatizer()

    condiments = ["sauce", "ketchup", "mustard", "peanut", "barbecue", "sauce", "nutella", "honey",
                  "ranch", "tartar", "vinegar", "salt", "wasabi", "soy", "oil", "olive"]

    measures = ["ml", "mL", "milliliter", "millilitre", "cc", "l", "L", "liter", "litre", "dl", "dL",
                "deciliter", "decilitre", "teaspoon", "t", "tsp.", "tablespoon", "T", "tbl.", "tbs.",
                "tbsp.", "ounce", "oz", "gill", "cup", "pint", "p", "pt", "quart", "q", "qt", "gallon",
                "g", "gal", "mg", "g", "kg", "milligram", "milligramme", "gram", "gramme", "kilogram",
                "kilogramme", "pound", "lb", "mm", "millimeter", "millimetre", "cm", "centimeter",
                "centimetre", "m", "meter", "metre", "inch", "in", "yard", "°F", "°C", "degree", "celsius", "Farenheit"]

    parsed_ingredients = []
    for i in ingredients:
        # Split up the string
        items = nltk.word_tokenize(i)
        # Get rid of words containing non alphabet letters
        items = [word for word in items if word.isalpha()]
        # Turn everything to lowercase
        items = [word.lower() for word in items]
        # remove accents
        items = [unidecode.unidecode(word) for word in items]
        # lemmatize words so we can compare words to measuring words
        items = [lemmatizer.lemmatize(word) for word in items]
        # get rid of stop words
        stop_words = set(nltk.corpus.stopwords.words('english'))
        items = [word for word in items if word not in stop_words]
        # Gets rid of measuring words/phrases, e.g. heaped teaspoon
        items = [word for word in items if word not in measures]
        # Get rid of condiments
        items = [word for word in items if word not in condiments]
        # Only keep nouns
        noun_tags = ["NN", "NNS", "NNP", "NNPS"]
        tags = nltk.pos_tag(items)
        items = [word for word, pos in tags if (pos in noun_tags)]

        if items:
            parsed_ingredients.append(' '.join(items))

    return parsed_ingredients