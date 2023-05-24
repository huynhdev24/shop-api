const Book = require('../models/books.model');
const mongoose = require("mongoose");

const pythonsService = {
    getBooksRecommend: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit
        return await Promise.all([
            Book.countDocuments(query), 
            Book.find(query).populate('genre author publisher').skip(skip).limit(limit).sort(sort)])
    },
}

module.exports = pythonsService;