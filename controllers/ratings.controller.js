const ratingService = require('../services/rating.service');

const ratingController = {
    getAll: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 0
            const sortByDate = req.query.sortByDate

            let sort = {}
            if (sortByDate) sort.createdAt = sortByDate === "asc" ? 1 : -1

            const [count, data ] = await ratingService.getAll({page, limit, sort})
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
    getById: async(req, res) => {
        try {
            const { id } = req.params
            const [data, ratings] = await ratingService.getById(id)

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(404).json({
                    message: 'Không tìm thấy ratings!',
                    error: 1,
                    data: null
                })
            }
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    create: async(req, res) => {
        try {
            const data = await ratingService.create(req.body)
            res.status(201).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getAverage: async(req, res) => {
        try {
            const data = await ratingService.getAverage({
                user: req.body.user, 
                product: req.body.product,
            });
            res.status(201).json({
                message: 'success',
                error: 0,
                data
            });
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    }
}

module.exports = ratingController;
