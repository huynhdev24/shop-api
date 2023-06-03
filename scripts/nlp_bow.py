import pandas as pd
import sys 
import json
# Đọc file Dataset CSV
data = pd.read_csv('C:/shop/shop-api/data/bookstore/books.csv')

print('STEP 1 \n')
print(data.head(5), end='\n')

# Tạo 1 cột mới có tên là description_name dựa trên thông tin của cột description (mô tả sách) + thông tin cột name (tên sách)
# data['description_name'] = data['description'] + " " + data['name']
# data['other_info'] = data['_id'] + "|___|" + str(data['price']) + "|___|" +  str(data['discount']) + "|___|" +  data['imageUrl'] + "|___|" +  data['slug']
data['book_info'] = data['_id'] + "|___|" +  data['name'] + "|___|" +  data['description']

print('STEP 2 \n')
print(data["book_info"].head(5), end='\n')

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

print('STEP 3 \n')
print(en_stopwords, end='\n')

# khởi tạo stemmer
stemmer = PorterStemmer()

print('STEP 4 \n')
print(stemmer, end='\n')

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
print('STEP 5 \n')
print(test, end='\n')

from nltk.stem import WordNetLemmatizer
lemma = WordNetLemmatizer()

print('STEP 6 \n')
print(test, end='\n')
print('STEP 7 \n')
print(lemma, end='\n')

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

print('STEP 8 \n')
print(test, end='\n')

# clean cho bản ghi test ở trên
print('STEP 8-A \n')
print(clean(test), end='\n')
print(cleanlemma(test), end='\n')

# giai đoạn Vector hóa văn bản
from sklearn.feature_extraction.text import TfidfVectorizer

# khởi tạo vectorizer
vectorizer = TfidfVectorizer()

print('STEP 9 \n')
print(vectorizer, end='\n')

# fit vector
test_matrix = vectorizer.fit_transform(data.book_info)

print('STEP 10 \n')
print(test_matrix, end='\n')

# liệt kê các ma trận từ vector
test_matrix = test_matrix.toarray()

print('STEP 11 \n')
print(test_matrix, end='\n')

# thêm hàm hỗ trợ cosine_similarity
from sklearn.metrics.pairwise import cosine_similarity

score = cosine_similarity(test_matrix)

print('STEP 12 \n')
print(score, end='\n')

# optimize
def Recommend_neighbor_by_cosine(book):
    # row_num = data[data['book_info'] == book].index.values[0] #getting the index of the book
    row_num = data[data['_id'] == book].index.values[0] #getting the index of the book
    print('STEP 13 \n')
    print(row_num, end='\n')
    similarity_score = list(enumerate(score[row_num])) #similar books
    print('STEP 14 \n')
    print(similarity_score, end='\n')
    sorted_score = sorted(similarity_score, key=lambda x:x[1], reverse= True)[1:9] #sorting similar books and returning the first 5
    print('STEP 15 \n')
    print(sorted_score, end='\n')
    # recommendations = {}
    listbook = []
    for item in sorted_score:
        book_info = data[data.index == item[0]]["book_info"].values[0] #getting the book name
        print('STEP 16 \n')
        print(book_info)
        print(book_info.split("|___|")[0], end='\n')
        book_info_split_id = book_info.split("|___|")[0]
        listbook.append(book_info_split_id)
    return json.dumps(listbook) #returns the 5 nearest bookinfo

# |___|6000|___|20|___|https://res.cloudinary.com/dbynglvwk/image/upload/v1653963583/bookstore/hpfjebw8i5cygplpl5zi.jpg|___|lich-su-7
# book = '64181be7929948a83fd25110|___|Lịch Sử 7 (2021)|___|Sách giáo khoa Lịch Sử lớp 7 (Tái bản 2021)'
# book = '64708a5f3cd4c49d331d712d|___|Harry Potter and the Goblet of Fire|___|Hay'
# book = '6479bc4e5a8ce8897f4b5f7a|___|Kỹ Năng Sống Dành Cho Học Sinh Tiểu Học - 50 Điều Cần Thiết Cho Học Sinh Tiểu Học (Tập 1)|___|<p>Khi trẻ bắt đầu đến trường sẽ có muôn vàn điều bỡ ngỡ và có nhiều thắc mắc. Là cha mẹ, ắt hẳn tâm lý lo lắng cũng không kém con em mình. Tập sách&nbsp;<strong>Kỹ Năng Sống Dành Cho Học Sinh Tiểu Học&nbsp;</strong>sẽ&nbsp;rèn luyện kỹ năng cho bé khi bé bước vào lớp 1. Sách ngắn gọn, trình bày dễ hiểu, sống động sẽ giúp con bạn rèn được nhiều kỹ năng bổ ích.</p><p>Cuốn sách sẽ là hành trang giúp bé vững vàng hơn ở ngưỡng cửa Tiểu Học.</p>'
# book = sys.argv[1]
# book =  sys.argv[1]
book = '6476015cb0d3d985c58fc42f'

print('STEP 17 \n')
print(Recommend_neighbor_by_cosine(book), end='\n')
