/**
 *   
 *  Mô hình bag of words chuyển đổi từ python sang javascript 
 *  giúp cải thiện hiệu xuất thực thi
 * 
 *  */ 

// Chuyển một chuỗi thành dãy ký tự char
function string2CharCodes(string) {
    return string.split('')
        .map(function (char) {
            return char.charCodeAt(0);
        });
}

// Đếm số vector có trong mảng
function countValuesInArray(vector) {
    let count = {};

    vector.forEach(function (i) {
        count[i] = (count[i] || 0) + 1;
    });

    return count;
}

// Sắp xếp đối tượng theo khóa
function sortObjectByKey(unorderedObject) {
    const orderedObject = {};

    Object.keys(unorderedObject)
        .sort()
        .forEach(function (key) {
            orderedObject[key] = unorderedObject[key];
        });

    return orderedObject;
}

// Phân tích các thuộc tính cho đối tượng đầu tiên
function parseAttributesForFirstObject(mainObject, objectToParse) {
    let finalObject = {};

    //parsing attributes from secondary object
    Object.keys(objectToParse)
        .map(function (key) {
            finalObject[key] = mainObject[key] || 0;
        });

    //parsing attributes from main object
    Object.keys(mainObject)
        .map(function (key) {
            finalObject[key] = mainObject[key] || 0;
        });

    return finalObject;
}

// Tính tần số của một ký tự
function charFrequencies(sentence) {
    return countValuesInArray(string2CharCodes(sentence.toLowerCase())
        .sort(function sortAscending(a, b) {
            return a - b;
        }));
}

// Tính tần xuất của 1 Term trong câu
function termFrequencies(sentence) {
    let termCollection = {};

    sentence.toLowerCase().split(/\s+/g)
        .map(function (word) {
            if (!termCollection[word]) {
                termCollection[word] = 1;
            }
            else {
                termCollection[word]++;
            }
        });

    return sortObjectByKey(termCollection);
}

// Tính cosine giữa 2 vector A và B (2 văn bản sau khi chuyển thành 2 vector)
function getCosine(A, B) {
    // COS(theta) = SUM(A*B)/( SQUARE(SUM(A^2))*SQUARE(SUM(B^2)) )

    // Trong đó: AB = SUM(A*B) | Kiến thức toán học về tích vô hướng của 2 vector A và B 
    let AB = A.map(function (el, index) {
        return el * B[index];
    })
        .reduce(function (pv, cv) {
            return pv + cv;
        });

    //SA2 = (SUM(A^2))
    let SA2 = A.map(function (el) {
        return el * el;
    })
        .reduce(function (pv, cv) {
            return pv + cv;
        });

    //B2 = (SUM(B^2)
    let SB2 = B.map(function (el) {
        return el * el;
    })
        .reduce(function (pv, cv) {
            return pv + cv;
        });

    return AB / (Math.sqrt(SA2) * Math.sqrt(SB2));
}

/**
 * Đo độ tương tự giữa hai câu (văn bản - chuỗi) tính cosin của góc giữa chúng.
 * @param {string} string1
 * @param {string} string2
 * @param {boolean} termFrequency
 * @return {*} - Trả về giá trị từ 0 đến 1. Cosin của góc giữa các đầu vào.
 */
function cosSimilarity(string1, string2, termFrequency = false) {
    let v1;
    let v2;

    if (!termFrequency) {
        // loại bỏ ký tự trống
        string1 = string1.replace(/\s+/g, '');
        string2 = string2.replace(/\s+/g, '');
        // lấy tần số char của 2 câu
        v1 = charFrequencies(string1);
        v2 = charFrequencies(string2);
    }
    else {
        // loại bỏ ký tự đặc biệt
        string1 = string1.replace(/[^a-zA-Z0-9]/gmi, ' ');
        string2 = string2.replace(/[^a-zA-Z0-9]/gmi, ' ');
        // lấy tần số term của 2 câu
        v1 = termFrequencies(string1);
        v2 = termFrequencies(string2);
    }

    const A = Object.values(sortObjectByKey(parseAttributesForFirstObject(v1, v2)));
    const B = Object.values(sortObjectByKey(parseAttributesForFirstObject(v2, v1)));

    return getCosine(A, B);
}


module.exports = cosSimilarity;