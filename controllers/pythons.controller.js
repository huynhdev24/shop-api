const bookService = require('../services/books.service');

const pythonsController = {
    testPythonShell: async(req, res) => {
        try {
            var spawn = require('child_process').spawn;
        var process = spawn('python', [
            'C:/shop/shop-api/scripts/nlp_cosine.py',
            req.query.bookinfo
        ]);
        process.stdout.on('data', async function(data) {
            console.log(data.toString());
            
            // handle data get from Python train NLP
            // const res = JSON.parse(data)
            // console.log(res);
            if(data) {
                let listBookNLP = JSON.parse(data);
                let listData = []
                for(let i = 0; i < listBookNLP.length; i++){
                    listData.push(listBookNLP[i].split("|___|")[0])
                }

                // res.send(JSON.parse(data));
                let listBookNLP_Final = [];
                for(let i = 0; i < listData.length; i++) {
                    const book = await bookService.getById(listData[i]);
                    listBookNLP_Final.push(book);
                }
                // res.send(listBookNLP_Final);
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    listBookNLP_Final,
                    // count,
                    // pagination: {
                    //     page,
                    //     limit,
                    //     totalPage,
                    // }
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