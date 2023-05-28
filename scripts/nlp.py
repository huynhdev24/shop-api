import numpy as np
import pandas as pd
# import json ;
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import sys 

data = pd.read_csv('data/bookstore/books.csv')
books_title = data[['bookId', 'name']]

tf = TfidfVectorizer(analyzer = 'word', ngram_range = (1,2), min_df = 0, stop_words = 'english')
tfidf_matrix = tf.fit_transform(books_title['name'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
cosine_sim

titles = books_title['name']
indices = pd.Series(books_title.index, index = books_title['name']) #converting all titles into a Series

def book_recommendations(title, n):
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    # sim_scores = sorted(sim_scores)
    sim_scores = sorted(sim_scores, key = lambda x:x[1], reverse = True)
    sim_scores = sim_scores[1:n+1]
    book_indices = [i[0] for i in sim_scores]
    return titles.iloc[book_indices]

print((book_recommendations(sys.argv[1],20)).to_json(orient="split"))