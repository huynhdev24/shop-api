var url = require('url')
// ObjectId = require('mongodb').ObjectID;
const bookService = require('../services/books.service');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
const pythonsController = {
    testPythonShell: async (req, res) => {
        try {
            console.log(req.query.bookinfo);
            var spawn = require('child_process').spawn;
            var process = spawn('python', [
                'C:/shop/shop-api/scripts/nlp_cosine.py',
                req.query.bookinfo
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

                    // res.send(JSON.parse(data));
                    let listBookNLP_Final = [];
                    for (let i = 0; i < listData.length; i++) {
                        const book = await bookService.getById(listData[i]);
                        listBookNLP_Final.push(book);
                    }
                    // res.send(listBookNLP_Final);
                    res.status(200).json({
                        message: 'success',
                        error: 0,
                        listBookNLP_Final,
                    })
                } else {
                    res.status(500).json({
                        message: `Có lỗi xảy ra! ${error.message}`,
                        error: 1,
                    })
                }
            });
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }

    }
}

module.exports = pythonsController;