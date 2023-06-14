const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Genre', genreSchema);
