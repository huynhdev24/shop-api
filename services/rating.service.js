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
    getAverage: async({user, product}) => {
        const countRatings = await Rating.countDocuments();
        const listRatings = await Rating.where(x => x.user === user && x.product === product);
        let totalStar = 0;
        for(let i = 0; i < listRatings.length; i++) {
            totalStar = totalStar + listRatings.rating; 
        }
        if(countRatings) return Math.round(totalStar / countRatings) / 10;
        return 3;
    },
}

module.exports = ratingService;
