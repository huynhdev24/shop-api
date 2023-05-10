const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    rating: {
        type: Number,
        required: true
    },  
}, {
    timestamps: true
})


module.exports = mongoose.model('Rating', ratingSchema);
