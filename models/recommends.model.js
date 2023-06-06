const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recommendSchema = new Schema({
    productRecommendId: mongoose.Schema.Types.ObjectId,
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
}, {
    timestamps: true
})


module.exports = mongoose.model('Recommend', recommendSchema);
