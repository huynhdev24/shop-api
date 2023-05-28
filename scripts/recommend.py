#ignore warnings
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=DeprecationWarning)

# Importing the Dependencies and Loading the Data

import pandas as pd
import numpy as np
from rake_nltk import Rake
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
# import nltk
# nltk.download('punkt')

df = pd.read_csv('C:/Users/pc/Downloads/IMDB_Top250Engmovies2_OMDB_Detailed.csv')
df.head()

# data overview
print('Rows x Columns : ', df.shape[0], 'x', df.shape[1])
print('Features: ', df.columns.tolist())
print('nUnique values:')
print(df.nunique())

# type of entries, how many missing values/null fields
df.info()
print('nMissing values:  ', df.isnull().sum().values.sum())
df.isnull().sum()

df.describe().T

# Text Preprocessing with NLP

# to remove punctuations from Plot
df['Plot'] = df['Plot'].str.replace('[^ws]','')
# to extract key words from Plot to a list
df['Key_words'] = ''   # initializing a new column
r = Rake()   # using Rake to remove stop words

for index, row in df.iterrows():
    r.extract_keywords_from_text(row['Plot'])   # to extract key words 
    key_words_dict_scores = r.get_word_degrees()    # to get dictionary with key words and their similarity scores
    row['Key_words'] = list(key_words_dict_scores.keys())   # to assign it to new column

df

# to extract all genre into a list, only the first three actors into a list, and all directors into a list
df['Genre'] = df['Genre'].map(lambda x: x.split(','))
df['Actors'] = df['Actors'].map(lambda x: x.split(',')[:3])
df['Director'] = df['Director'].map(lambda x: x.split(','))

# create unique names by merging firstname & surname into one word, & convert to lowercase 
for index, row in df.iterrows():
    row['Genre'] = [x.lower().replace(' ','') for x in row['Genre']]
    row['Actors'] = [x.lower().replace(' ','') for x in row['Actors']]
    row['Director'] = [x.lower().replace(' ','') for x in row['Director']]

# Generating Word Representations using Bag of Words

# to combine 4 lists (4 columns) of key words into 1 sentence under Bag_of_words column
df['Bag_of_words'] = ''
columns = ['Genre', 'Director', 'Actors', 'Key_words']

for index, row in df.iterrows():
    words = ''
    for col in columns:
        words += ' '.join(row[col]) + ' '
    row['Bag_of_words'] = words
    
# strip white spaces infront and behind, replace multiple whitespaces (if any)
df['Bag_of_words'] = df['Bag_of_words'].str.strip().str.replace('   ', ' ').str.replace('  ', ' ')

df = df[['Title','Bag_of_words']]

# Vectorizing BoW and Creating the Similarity Matrix

# to generate the count matrix
count = CountVectorizer()
count_matrix = count.fit_transform(df['Bag_of_words'])
count_matrix
cosine_sim = cosine_similarity(count_matrix, count_matrix)
print(cosine_sim)

indices = pd.Series(df['Title'])

# Training and Testing Our Recommendation Engine

# this function takes in a movie title as input and returns the top 5 recommended (similar) movies

def recommend(title, cosine_sim = cosine_sim):
    recommended_movies = []
    idx = indices[indices == title].index[0]   # to get the index of the movie title matching the input movie
    score_series = pd.Series(cosine_sim[idx]).sort_values(ascending = False)   # similarity scores in descending order
    top_5_indices = list(score_series.iloc[1:6].index)   # to get the indices of top 6 most similar movies
    # [1:6] to exclude 0 (index 0 is the input movie itself)
    
    for i in top_5_indices:   # to append the titles of top 10 similar movies to the recommended_movies list
        recommended_movies.append(list(df['Title'])[i])
        
    return recommended_movies

print(recommend('The Avengers'))
