import numpy as np
import pandas as pd
import json
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

data = pd.read_csv('C:/shop/shop-api/data/goodbook-10k/books.csv')
data.head()

data.columns

data.isnull().sum()

#Trích xuất các cột có liên quan sẽ ảnh hưởng đến xếp hạng của sách dựa trên tên sách.
books_title = data[['book_id', 'title']]
books_title.head()

#Hãy vector hóa tất cả các tiêu đề này
from sklearn.feature_extraction.text import CountVectorizer

#khởi tạo vectorizer
vect = CountVectorizer(analyzer = 'word', ngram_range = (1,2), stop_words = 'english', min_df = 0.002) #min_df = rare words, max_df = most used words
#ngram_range = (1,2) - if used more than  1(value), lots of features or noise

#Fit into the title
vect.fit(books_title['title'])
title_matrix = vect.transform(books_title['title'])
title_matrix.shape

#Lets find vocabulary/features
features = vect.get_feature_names_out()
features

from sklearn.metrics.pairwise import cosine_similarity
cosine_sim_titles = cosine_similarity(title_matrix, title_matrix)
cosine_sim_titles.shape

#Nhận sách tương tự với một tiêu đề nhất định
title_id = 100
books_title['title'].iloc[title_id]

#Tìm hiểu xem các tính năng nào đã được vectorizer xem xét cho một tiêu đề nhất định?
feature_array = np.squeeze(title_matrix[title_id].toarray()) #squeeze activity matrix into array
idx = np.where(feature_array > 0)
idx[0]
[features[x] for x in idx[0]]

# Tìm chỉ số của tính năng
idx[0]

#Cosine similarity with other similar titles
n = 15 #có bao nhiêu cuốn sách được giới thiệu
top_n_idx = np.flip(np.argsort(cosine_sim_titles[title_id,]), axis = 0)[0:n]
top_n_sim_values = cosine_sim_titles[title_id, top_n_idx]
top_n_sim_values

#find top n with values > 0
top_n_idx = top_n_idx[top_n_sim_values > 0]
#Matching books
books_title['title'].iloc[top_n_idx]

# lets wrap the above code in a function
def return_sim_books(title_id, title_matrix, vectorizer, top_n = 10):
    
    # generate sim matrix
    sim_matrix = cosine_similarity(title_matrix, title_matrix)
    features = vectorizer.get_feature_names_out()

    top_n_idx = np.flip(np.argsort(sim_matrix[title_id,]),axis=0)[0:top_n]
    top_n_sim_values = sim_matrix[title_id, top_n_idx]
    
    # find top n with values > 0
    top_n_idx = top_n_idx[top_n_sim_values > 0]
    scores = top_n_sim_values[top_n_sim_values > 0]
    
    
    # find features from the vectorized matrix
    sim_books_idx = books_title['title'].iloc[top_n_idx].index
    words = []
    for book_idx in sim_books_idx:
        try:
            feature_array = np.squeeze(title_matrix[book_idx,].toarray())
        except:
            feature_array = np.squeeze(title_matrix[book_idx,])
        idx = np.where(feature_array > 0)
        words.append([" , ".join([features[i] for i in idx[0]])])
        
    # collate results
    res = pd.DataFrame({"book_title" : books_title['title'].iloc[title_id],
           "sim_books": books_title['title'].iloc[top_n_idx].values,"words":words,
           "scores":scores}, columns = ["book_title","sim_books","scores","words"])
    
    
    return res

vect = CountVectorizer(analyzer='word',ngram_range=(1,2),stop_words='english', min_df = 0.001)
vect.fit(books_title['title'])
title_matrix = vect.transform(books_title['title'])
books_title['title'][10]
return_sim_books(10,title_matrix,vect,top_n=10)

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

tf = TfidfVectorizer(analyzer = 'word', ngram_range = (1,2), min_df = 0, stop_words = 'english')
tfidf_matrix = tf.fit_transform(books_title['title'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
cosine_sim

titles = books_title['title']
indices = pd.Series(books_title.index, index = books_title['title']) #converting all titles into a Series

#Function that gets book recommendations based on the cosine similarity score of book titles
def book_recommendations(title, n):
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key = lambda x:x[1], reverse = True)
    sim_scores = sim_scores[1:n+1]
    book_indices = [i[0] for i in sim_scores]
    return titles.iloc[book_indices]

#Recommend n books for a book having index 1
book_index = 10
n = 20

books_title['title'][book_index]
book_recommendations(books_title.title[book_index],n)

print((book_recommendations('A Tale of Two Cities',10)).to_json(orient="split"))

# import sys 

# print("Output from Python") 
# print("First name: " + sys.argv[1]) 
# print("Last name: " + sys.argv[2]) 

# Recommendation 3 books
# {
#     "name":"title",
#     "index":[5871,2697,1699],
#     "data":["A Tale of Two Cities \/ Great Expectations","Invisible Cities","A Tale for the Time Being"]
# }

# Recommendation 10 books
# {
#     "name":"title",
#     "index":[
#         5871,
#         2697,
#         1699,
#         4754,
#         6416,
#         6006,
#         8028,
#         8212,
#         9865,
#         118],
#     "data":[
#         "A Tale of Two Cities \/ Great Expectations",
#         "Invisible Cities",
#         "A Tale for the Time Being",
#         "Winter's Tale",
#         "The Winter's Tale",
#         "Cities of the Plain (The Border Trilogy, #3)",
#         "City of Stairs (The Divine Cities, #1)",
#         "The Tale of Three Trees",
#         "A Twist in the Tale",
#         "The Handmaid's Tale"]
# }