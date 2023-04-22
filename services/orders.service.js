const Order = require('../models/orders.model');

const orderService = {
    getAll: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit
        return await Promise.all([
            Order.countDocuments(query), 
            Order.find(query).skip(skip).limit(limit).sort(sort)])
    },
    getById: async(id) => {
        return await Order.findById(id).populate("user voucher").populate("products.product").populate("tracking.user", "fullName")
    },
    create: async({ userId, products, delivery, voucherId, cost, method, paymentId }) => {
        const newOrder = new Order({
            user: userId, 
            products,
            delivery, 
            voucher: voucherId, 
            cost, 
            method, 
            paymentId
        })
        return await newOrder.save()
    },
    updatePaymentStatusByPaymentId: async(paymentId, { paymentStatus, method }) => {
        return await Order.findOneAndUpdate({ paymentId: paymentId },  { paymentStatus, method }, {new: true})
    },
    updateStatus: async(id, { orderStatus, paymentStatus }) => {
        return await Order.findByIdAndUpdate(id, {
            orderStatus,
            paymentStatus
        }, {new: true})
    },
    updatePaymentId: async(orderId, { paymentId }) => {
        return await Order.findByIdAndUpdate(orderId,  { paymentId }, {new: true})
    },
    addTracking: async (orderId, { status, time, userId }) =>{
        return await Order.findByIdAndUpdate(orderId, {
            $push: {
                tracking: { status, time, user: userId }
            }
        }, { new: true })
    },
    // Thong ke
    getTotalRevenue: async() => {
        return await Order.aggregate([
            {
                $project: {
                    createdAt: 1,
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$totalCost" },
                },
               
            },
        ])
    },
    getRevenueWeek: async(query) => {
        const { start, end } = query
        return await Order.aggregate([
            {
                $project: {
                    createdAt: 1,
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $match: {
                    createdAt: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalCost" },
                },
            },
            { $sort: { _id: 1 } },
        ])
    },
    getRevenueLifeTime: async() => {
        return await Order.aggregate([
            {
                $project: {
                    createdAt: 1,
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalCost" },
                },
            },
            { $sort: { _id: 1 } },
        ])
    },
    getCountOrderLifeTime: async() => {
        return await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ])
       
    },
    getBestSeller: async() => {
        return await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.product", 
                    count: { $sum: "$products.quantity" }
                }
            },
            {
                $lookup: {
                    from: "books", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ])
    },
}

module.exports = orderService;
