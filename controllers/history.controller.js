const historyService = require('../services/history.service');

const historyController = {
    // lấy danh sách lịch sử có phân trang
    getAll: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 0
            const sort = req.query.sort ? req.query.sort : { createdAt: -1 }
            const { query } = req.query

            const queryObj = !!query ? query : {}
            
            const [count, data] = await historyService.getAll({query: queryObj, page, limit, sort})
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
    // lấy 1 record lịch sử thao tác theo ID
    getById: async(req, res) => {
        try {
            const { id } = req.params
            const data = await historyService.getById(id)
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(404).json({
                    message: 'Không tìm thấy Lịch sử!',
                    error: 1,
                    data
                })
            }
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    // tạo lịch sử cho thao tác
    create: async(req, res) => {
        try {
            const data = await historyService.create(req.body)
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
    // cập nhật lịch sử theo ID
    updateById: async(req, res) => {
        try {
            const { id } = req.params
            const data = await historyService.updateById(id, req.body)
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy Lịch sử có id:${id}`,
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
    },
    // xóa lịch sử theo ID
    deleteById: async(req, res) => {
        try {
            const { id } = req.params
            const data = await historyService.deleteById(id)
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy Lịch sử có id:${id}`,
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

module.exports = historyController;
