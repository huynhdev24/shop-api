const trainItem = async(bookId) => {
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
const trainList = async(data) => {
    try {
        data.array.forEach(async (book) => {
            const { bookId, listBookNLP_Final } = await this.trainItem(book._id);
            console.log(bookId + ' và ' + listBookNLP_Final)
            const productRecommendId = bookId;
            const product = listBookNLP_Final;
            const newRecommend = new Recommend({
                productRecommendId, 
                product,
            })
            console.log(newRecommend);
            await newRecommend.save();
        });
        return 0;
    } catch (error) {
        return error;
    }
}