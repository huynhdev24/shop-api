const Recommend = require('../models/recommends.model');

const recommendService = {
    // getAll: async({query, page, limit, sort}) => {
    //     const skip = (page - 1) * limit
    //     return await Promise.all([
    //         Recommend.countDocuments(query), 
    //         Recommend.find(query).skip(skip).limit(limit).sort(sort)])
    // },
    getById: async(id) => {
        return await Recommend.findById(id).populate("product")
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
}

module.exports = recommendService;
