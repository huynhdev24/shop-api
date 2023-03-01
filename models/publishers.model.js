const mongoose = require('mongoose')

const Schema = mongoose.Schema

const publisherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Publisher', publisherSchema)
