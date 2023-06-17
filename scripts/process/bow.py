import pandas as pd
import sys 
import json
# Đọc file Dataset CSV
data = pd.read_csv('C:/shop/shop-api/data/bookstore/books.csv')

# Tạo 1 cột mới có tên là description_name dựa trên thông tin của cột description (mô tả sách) + thông tin cột name (tên sách)
# data['description_name'] = data['description'] + " " + data['name']
# data['other_info'] = data['_id'] + "|___|" + str(data['price']) + "|___|" +  str(data['discount']) + "|___|" +  data['imageUrl'] + "|___|" +  data['slug']
# data['book_info'] = data['_id'] + "|___|" +  data['name'] + "|___|" +  data['description']
# data['book_info'] = data['_id'] + "|___|" +  data['name'] + "|___|" +  data['genre'] + data['author']
data['book_info'] = data['_id'] + "|___|" +  data['name']

# print(data['book_info'].head(5))

# Xóa bỏ 2 cột không cần dùng đến description và name nữa vì đã có description_name
# data.drop(columns = ['description', 'name', '_id'], axis = 1, inplace = True)

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
# import nltk
# nltk.download('stopwords')

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
test = data.book_info.iloc[0]
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
test = data.book_info[3]
test

# clean cho bản ghi test ở trên
clean(test)
cleanlemma(test)

# giai đoạn Vector hóa văn bản
from sklearn.feature_extraction.text import TfidfVectorizer

# khởi tạo vectorizer
vectorizer = TfidfVectorizer()

# fit vector
test_matrix = vectorizer.fit_transform(data.book_info)

# liệt kê các ma trận từ vector
test_matrix = test_matrix.toarray()

# thêm hàm hỗ trợ cosine_similarity
from sklearn.metrics.pairwise import cosine_similarity

score = cosine_similarity(test_matrix)

# optimize
def Neighbor_by_cosine(book):
    row_num = data[data['_id'] == book].index.values[0] #getting the index of the book
    print("ROW NUM \n")
    print(row_num)
    similarity_score = list(enumerate(score[row_num])) #similar books
    print("SIMILARITY SCORE \n")
    print(similarity_score)
    sorted_score = sorted(similarity_score, key=lambda x:x[1], reverse= True)[1:8] #sorting similar books and returning the first 7
    print("SORTED SCORE \n")
    print(sorted_score)
    # recommendations = {}
    listbook = []
    print("LIST BOOK \n")
    for item in sorted_score:
        book_info = data[data.index == item[0]]["book_info"].values[0] #getting the book name
        print("BOOK INFO" + str(item) + '\n')
        book_info_split_id = book_info.split("|___|")[0]
        print("BOOK INFO SPLIT ID" + str(book_info_split_id) + '\n')
        listbook.append(book_info_split_id)
    return json.dumps(listbook) #returns the 5 nearest bookinfo

# book = '64181be7929948a83fd25110|___|Lịch Sử 7 (2021)|___|Sách giáo khoa Lịch Sử lớp 7 (Tái bản 2021)'
# book = sys.argv[1]
# book =  sys.argv[1]
book = '6476015cb0d3d985c58fc42f'

print(Neighbor_by_cosine(book))
