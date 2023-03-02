const Publisher = require('../models/publishers.model')
const Book = require('../models/books.model')

const publisherService = {
    getAll: async({page, limit}) => {
        return await Publisher.find({})
    },
    getById: async(id) => {
        return await Publisher.findById(id)
    },
    create: async({name}) => {
        const newPublisher = new Publisher({name})
        return await newPublisher.save()
    },
    updateById: async(id, {name}) => {
        return await Publisher.findByIdAndUpdate(id, { name: name }, {new: true})
    },
    deleteById: async(id) => {
            // Khi xóa 1 NXB=> Cần update lại các sách có NXB cần xóa = null
        await Book.updateMany({publisher: id }, { publisher: null})
        return await Publisher.findByIdAndDelete(id)
    }
}

module.exports = publisherService
