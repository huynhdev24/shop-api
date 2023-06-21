const Recommend = require('../models/recommends.model');
const Book = require('../models/books.model');
const cosineSimilarity = require('../nlp/bagofword');
const bookService = require('../services/books.service');
const recommendService = {
    // getAll: async({query, page, limit, sort}) => {
    //     const skip = (page - 1) * limit
    //     return await Promise.all([
    //         Recommend.countDocuments(query), 
    //         Recommend.find(query).skip(skip).limit(limit).sort(sort)])
    // },
    getById: async(id) => {
        // return await Recommend.findById(id).populate("product")
        return await Recommend.findOne({productRecommendId: id}).populate("product")
    },
    checkExistById: async(bookId) => {
        return await Recommend.findOne({productRecommendId: bookId}).populate("product")
    },
    create: async({ productRecommendId, product}) => {
        console.log(productRecommendId + ' ' + product);
        const newRecommend = new Recommend({
            productRecommendId, 
            product,
        })
        return await newRecommend.save()
    },
    update: async({ productRecommendId, product}) => {
        console.log(productRecommendId + ' ' + product);
        return await Recommend.findOneAndUpdate({productRecommendId: productRecommendId}, {product: product}).populate("product")
    },
    delete: async(id) => {
        return await Recommend.findOneAndDelete({productRecommendId: id}).populate("product")
    },
    deleteAll: async() => {
        return await Recommend.deleteMany();
    },
    trainItem: async(bookId) => {
        try {
            console.log(bookId);
            var spawn = require('child_process').spawn;
            var process = spawn('python', [
                'C:/shop/shop-api/scripts/nlp/nlp_cosine.py',
                bookId
            ]);
            process.stdout.on('data', async function (data) {
                console.log(data.toString());

                // handle data get from Python train NLP
                if (data) {
                    let listBookNLP = JSON.parse(data);
                    let listData = []
                    for (let i = 0; i < listBookNLP.length; i++) {
                        // listData.push(listBookNLP[i].split("|___|")[0])
                        // const objectId = new ObjectId(listBookNLP[i])  
                        listData.push(listBookNLP[i])
                    }
                    
                    //get data of book_info
                    const book_info_data = await bookService.getById(bookId);
                    // res.send(JSON.parse(data));
                    let listBookNLP_Final = [];
                    listBookNLP_Final.push(book_info_data)
                    for (let i = 0; i < listData.length; i++) {
                        const book = await bookService.getById(listData[i]);
                        listBookNLP_Final.push(book);
                    }
                    // res.send(listBookNLP_Final);
                    // res.status(200).json({
                    //     message: 'success',
                    //     error: 0,
                    //     listBookNLP_Final,
                    // })
                    return { bookId, listBookNLP_Final }
                } else {
                    return null
                }
            });
        } catch (error) {
            return null
        }
    },
    trainList: async(data) => {
        try {
	        const listResult = [];
            await data.map(async (book) => {
                const { bookId, listBookNLP_Final } = await recommendService.trainItem(book._id);
                console.log(bookId + ' và ' + listBookNLP_Final)
                const productRecommendId = bookId;
                const product = listBookNLP_Final;
                console.log(data);
	            listResult.push({productRecommendId, product})
                console.log(listResult);
            });
	        // listResult.map(async item => await recommendService.create(item));
            await Recommend.insertMany(listResult);
            return 0;
        } catch (error) {
            return error;
        }
    },
    search: async({key, bookList, limit}) => {
        let trainResult = [];
        const book_info_data = await bookService.getById(key);
        console.log(book_info_data);

        for(let i = 0; i < bookList.length; i++) {
            let string1 = book_info_data.name;
            let string2 = bookList[i].name;
            let bookId = bookList[i]._id;
            let cosineResult = cosineSimilarity(string1, string2);
            trainResult.push({string1, string2, bookId, cosineResult});
        }

        const trainSorted = trainResult.sort((a,b) => a.cosineResult - b.cosineResult).reverse();
        const getTopN = trainSorted.slice(0, 30);
        console.log(getTopN);
        //get data of book_info
        // res.send(JSON.parse(data));
        let listBookNLP_Final = [];
        // listBookNLP_Final.push(book_info_data)
        for (let i = 0; i < getTopN.length; i++) {
            const book = await bookService.getById(getTopN[i].bookId);
            listBookNLP_Final.push(book);
        }

        return listBookNLP_Final;
    },
}

module.exports = recommendService;
