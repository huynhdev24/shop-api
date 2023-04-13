const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historySchema = new Schema({
    action: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    title: { 
        type: Number 
    },
    link: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },  
}, {
    timestamps: true
})

module.exports = mongoose.model('History', historySchema);
