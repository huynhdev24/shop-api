const Author = require('../models/authors.model')
const Book = require('../models/books.model')

const authorService = {
    getAll: async({page, limit, sort}) => {
        const skip = (page - 1) * limit
        return await Promise.all([Author.countDocuments({}), Author.find({}).skip(skip).limit(limit).sort(sort)])

    },
    getById: async(id) => {
        return await Promise.all([Author.findById(id), Book.find({author: {$in: id}})])
    },
    create: async({name, year}) => {
        const newAuthor = new Author({name, year})
        return await newAuthor.save()
    },
    updateById: async(id, {name, year}) => {
        return await Author.findByIdAndUpdate(id, { name: name, year: year }, {new: true})
    },
    deleteById: async(id) => {
        //     // Khi xóa 1 tác giả => Cần update lại các sách có tác giả cần xóa = null
        await Book.updateMany({author: id}, {
            $pull: { author: id }
        })
        return await Author.findByIdAndDelete(id)
    }
}

module.exports = authorService
