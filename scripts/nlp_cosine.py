import pandas as pd
import sys 

# Đọc file Dataset CSV
data = pd.read_csv('C:/shop/shop-api/data/bookstore/books.csv')

# Tạo 1 cột mới có tên là description_name dựa trên thông tin của cột description (mô tả sách) + thông tin cột name (tên sách)
# data['description_name'] = data['description'] + " " + data['name']
data['id_name_description'] = data['_id'] + "|___|" + data['name'] + "|___|" +  data['description']

# Xóa bỏ 2 cột không cần dùng đến description và name nữa vì đã có description_name
data.drop(columns = ['description', 'name', '_id'], axis = 1, inplace = True)

# loại bỏ data bị trùng lắp
data.drop_duplicates(inplace = True)

# reset lại index (chỉ mục) của đataframe
data.reset_index(drop = True, inplace = True)

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
test = data.id_name_description.iloc[0]
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
test = data.id_name_description[3]
test

# clean cho bản ghi test ở trên
clean(test)
cleanlemma(test)

# giai đoạn Vector hóa văn bản
from sklearn.feature_extraction.text import TfidfVectorizer

# khởi tạo vectorizer
vectorizer = TfidfVectorizer()

# fit vector
test_matrix = vectorizer.fit_transform(data.id_name_description)

# liệt kê các ma trận từ vector
test_matrix = test_matrix.toarray()

# thêm hàm hỗ trợ cosine_similarity
from sklearn.metrics.pairwise import cosine_similarity

score = cosine_similarity(test_matrix)

def Neighbor_by_cosine(book):
    row_num = data[data['id_name_description'] == book].index.values[0] #getting the index of the book
    similarity_score = list(enumerate(score[row_num])) #similar books
    sorted_score = sorted(similarity_score, key=lambda x:x[1], reverse= True)[1:9] #sorting similar books and returning the first 5
    
    i = 0
    for item in sorted_score:
        id_name_description = data[data.index == item[0]]["id_name_description"].values[0] #getting the book name
        recommendations = print(i+1, id_name_description) 
        i = i + 1
    return recommendations #returns the 5 nearest article titles

# book = '64181be7929948a83fd25110|___|Lịch Sử 7 (2021)|___|Sách giáo khoa Lịch Sử lớp 7 (Tái bản 2021)'
# book = sys.argv[1]
book =  sys.argv[1]

Neighbor_by_cosine(book)
