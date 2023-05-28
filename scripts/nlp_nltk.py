import pandas as pd
import sys 

# Đọc file Dataset CSV
data = pd.read_csv('C:/shop/shop-api/data/bookstore/books.csv')

# Lấy ra 5 record đầu tiên của file books.csv
data.head(5)

# Tạo 1 cột mới có tên là description_name dựa trên thông tin của cột description (mô tả sách) + thông tin cột name (tên sách)
data['description_name'] = data['description'] + " " + data['name']

# Xem nội dung cột mới tạo description_name
data['description_name']

# Xóa bỏ 2 cột không cần dùng đến description và name nữa vì đã có description_name
data.drop(columns = ['description', 'name'], axis = 1, inplace = True)

# xem thông tin của Dataframe
data.info()

# tính tổng số data chứa NaN - thông tin bỏ trống
data.isna().sum()

# tính tổng số data chứa các thông tin trùng lắp
data.duplicated().sum()

# loại bỏ data bị trùng lắp
data.drop_duplicates(inplace = True)

# reset lại index (chỉ mục) của đataframe
data.reset_index(drop = True, inplace = True)

# Test xem thử lại data
data

# Xem thông tin của dataframe
data.info()

# thêm hàm của nltk để tiền xử lý ngôn ngữ
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

# download stopwords
import nltk
nltk.download('stopwords')

# chỉ định stopwords là tiếng Anh
en_stopwords = stopwords.words("english")

# khởi tạo stemmer
stemmer = PorterStemmer()

# xây dựng hàm clean cho đoan text - văn bản thô (data sẽ xử lý chính là data['description_name] cần xử lý)
def clean(text):
    text = re.sub("[^A-Za-z1-9 ]", "", text)
    text = text.lower()
    tokens = word_tokenize(text)
    clean_list = []
    for token in tokens:
        if token not in en_stopwords:
            clean_list.append(stemmer.stem(token))
    return " ".join(clean_list)

# kiểm tra data
test = data.description_name.iloc[0]
from nltk.stem import WordNetLemmatizer
lemma = WordNetLemmatizer()

# xây dựng cleanlemma cho đoạn text cần kiểm tra tương tự clean
def cleanlemma(text):
    text = re.sub("[^A-Za-z1-9 ]", "", text)
    text = text.lower()
    tokens = word_tokenize(text)
    clean_list = []
    for token in tokens:
        if token not in en_stopwords:
            clean_list.append(lemma.lemmatize(token))
    return " ".join(clean_list)

# kiểm tra 1 bản ghi bất kì trong data.description_name
test = data.description_name[3]
test

# clean cho bản ghi test ở trên
clean(test)

# giai đoạn Vector hóa văn bản
from sklearn.feature_extraction.text import TfidfVectorizer

# khởi tạo vectorizer
vectorizer = TfidfVectorizer()

# fit vector
test_matrix = vectorizer.fit_transform(data.description_name)

# liệt kê các ma trận từ vector
test_matrix = test_matrix.toarray()

# thêm hàm đếm tần số xuất hiện của các vector
from sklearn.feature_extraction.text import CountVectorizer

# khởi tạo
bow = CountVectorizer()

# 
bowmatrix = bow.fit_transform(data.description_name).toarray()

# 
from sklearn.neighbors import NearestNeighbors

#
nn = NearestNeighbors()

nn.fit(test_matrix)

#clean
#transform
#nneighbors
def Recommender(text):
    text = clean(text)
    text_matrix = vectorizer.transform([text])
    return nn.kneighbors(n_neighbors=5, X = text_matrix, return_distance=False)

# 
test = data.description_name[23]
test

Recommender(test)

data.iloc[[30,  1, 16, 23,  4]].description_name

bownn = NearestNeighbors()

bownn.fit(bowmatrix)

def Recommender_BOW(text):
    text = clean(text)
    bowmatrix = vectorizer.transform([text])
    return bownn.kneighbors(n_neighbors=5, X = bowmatrix, return_distance=False)

Recommender_BOW(test)

from sklearn.cluster import KMeans

X = data.description_name

sse = []
k_range = range(1, 11)  # 1, 10
for k in k_range:
    model = KMeans(n_clusters=k)
    model.fit(bowmatrix)
    sse.append(model.inertia_)
sse

model = KMeans(n_clusters = 2)
model.fit(bowmatrix)

label = model.labels_

label

data['Label'] = label

data.Label.value_counts()

from sklearn.metrics.pairwise import cosine_similarity

score = cosine_similarity(test_matrix)

def Neighbor_by_cosine(book):
    row_num = data[data['description_name'] == book].index.values[0] #getting the index of the article
    similarity_score = list(enumerate(score[row_num])) #similar articles
    sorted_score = sorted(similarity_score, key=lambda x:x[1], reverse= True)[1:6] #sorting similar articles and returning the first 5
    
    i = 0
    for item in sorted_score:
        article_title = data[data.index == item[0]]["description_name"].values[0] #getting the article title
        recommendations = print(i+1, article_title) 
        i = i + 1
    return recommendations #returns the 5 nearest article titles

book = 'Sách giáo khoa Lịch Sử lớp 7 (Tái bản 2021) Lịch Sử 7 (2021)'

Neighbor_by_cosine(book)
