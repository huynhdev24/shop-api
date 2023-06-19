const recommendService = require('../services/recommend.service');
const pythonsController = require('../controllers/pythons.controller');
const bookService = require('../services/books.service');
const recommendController = {
    trainNLP: async(req, res) => {
        try {
            const bookList = await bookService.getAllBookData();
            console.log(bookList)
            const data = await recommendService.trainList(bookList);
            // if (data === 0) {
            //     res.status(200).json({
            //         message: 'Training success!',
            //         error: 0,
            //         data
            //     })
            // } else {
            //     res.status(200).json({
            //         message: 'Không tìm thấy sách!',
            //         error: 1,
            //         data
            //     })
            // }
        } catch (error) {
            // res.status(500).json({
            //     message: `Có lỗi xảy ra! ${error.message}`,
            //     error: 1,
            // })
        }
    },
    getAll: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 0
            const sortByDate = req.query.sortByDate

            let sort = {}
            if (sortByDate) sort.createdAt = sortByDate === "asc" ? 1 : -1

            const [count, data ] = await recommendService.getAll({page, limit, sort})
            const totalPage = Math.ceil(count / limit)

            res.status(200).json({
                message: 'success',
                error: 0,
                count,
                data,
                pagination: {
                    page,
                    limit,
                    totalPage,
                }
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const data = await recommendService.getById(id)
            if (data) {
                let listBookNLP_Final = data.product
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    // data
                    listBookNLP_Final
                })
            } else {
                // res.status(404).json({
                //     message: 'Không tìm thấy kết quả Training!',
                //     error: 1,
                //     data: null
                // })
                // const result = await pythonsController.testPythonShell()
                // let listBookNLP_Final = [];
                // listBookNLP_Final = result.listBookNLP_Final;
                // res.status(200).json({
                //     message: 'success',
                //     error: 0,
                //     listBookNLP_Final
                // })

                console.log(id);
                var spawn = require('child_process').spawn;
                var process = spawn('python', [
                    'C:/shop/shop-api/scripts/nlp/nlp_cosine.py',
                    id
                ]);
                process.stdout.on('data', async function (_data) {
                    console.log(_data.toString());

                    // handle data get from Python train NLP
                    if (_data) {
                        let listBookNLP = JSON.parse(_data);
                        let listData = []
                        for (let i = 0; i < listBookNLP.length; i++) {
                            // listData.push(listBookNLP[i].split("|___|")[0])
                            // const objectId = new ObjectId(listBookNLP[i])  
                            listData.push(listBookNLP[i])
                        }

                        //get data of book_info
                        const book_info_data = await bookService.getById(id);
                        // res.send(JSON.parse(data));
                        let listBookNLP_Final = [];
                        listBookNLP_Final.push(book_info_data)
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
            }
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    create: async (req, res) => {
        try {
            const bookId = req.body.productRecommendId;
            const isExist = await recommendService.checkExistById(bookId);
            if (isExist) {
                // return res.status(400).json({message: "Sách này đã được lưu kết quả training!", error: 1})
                const data = await recommendService.update(req.body)
                res.status(201).json({
                    message: 'Kết quả training đã được cập nhật!',
                    error: 0,
                    data
                })
                // const del = await recommendService.delete(bookId)
                // const data = await recommendService.create(req.body)
                // res.status(201).json({
                //     message: 'Kết quả training đã được cập nhật!',
                //     error: 0,
                //     data
                // })
            } else {
                const data = await recommendService.create(req.body)
                res.status(201).json({
                    message: 'success',
                    error: 0,
                    data
                })
            }
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    deleteAll: async(req, res) => {
        try {
            const data = await recommendService.deleteAll();
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Xóa cache thất bại`,
                    error: 1,
                    data
                })
            }
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    }
}

module.exports = recommendController;
