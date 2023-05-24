const pythonsController = {
    getBooksRecommend: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 0
            const sort = req.query.sort ? req.query.sort : { createdAt: -1 }
            const { query } = req.query

            const queryObj = !!query ? query : {}
            
            const [count, data] = await bookService.getAll({query: queryObj, page, limit, sort})
            const totalPage = Math.ceil(count / limit)
            
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
                count,
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
    testPythonShell: async(req, res) => {
        var spawn = require('child_process').spawn;
        
        // E.g : http://localhost:3000/name?firstname=van&lastname=nghia
        var process = spawn('python', [
            'C:/shop/shop-api/scripts/nlp.py'
            // req.query.firstname,
            // req.query.lastname
        ]);
        process.stdout.on('data', function(data) {
            console.log(data.toString());
        
            res.send(data.toString());
        });
    }
}

module.exports = pythonsController;