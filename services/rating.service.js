const Rating = require('../models/ratings.model');

const ratingService = {
    getAll: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit
        return await Promise.all([
            Rating.countDocuments(query), 
            Rating.find(query).skip(skip).limit(limit).sort(sort)])
    },
    getById: async(id) => {
        return await Rating.findById(id).populate("user product")
    },
    create: async({ user, product, rating }) => {
        console.log(user + ' ' + product + ' ' + rating);
        const newRating = new Rating({
            user, 
            product,
            rating
        })
        return await newRating.save()
    },
}

module.exports = ratingService;
