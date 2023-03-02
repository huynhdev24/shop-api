const Genre = require('../models/genres.model')
const Book = require('../models/books.model')

const genreService = {
    getAll: async({page, limit}) => {
        return await Genre.find({})
    },
    getById: async(id) => {
        return await Genre.findById(id)
    },
    getBySlug: async(slug) => {
        return await Genre.findOne({slug})
    },
    create: async({name}) => {
        const newGenre = new Genre({name})
        return await newGenre.save()
    },
    updateById: async(id, {name}) => {
        return await Genre.findByIdAndUpdate(id, { name: name }, {new: true})
    },
    deleteById: async(id) => {

        await Book.updateMany({genre: id}, {
            $pull: { genre: id }
        })
        return await Genre.findByIdAndDelete(id)
    }
}

module.exports = genreService
