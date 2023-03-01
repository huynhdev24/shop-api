const mongoose = require('mongoose')

const Schema = mongoose.Schema

const voucherSchema = new Schema({
    minimum: {
        type: Number,
        default: 0
    },
    code: { type: String, required: true, unique: true },
    name: { type: String },
    by: { type: String },
    value: { type: Number },
    start: { type: Date },
    end: { type: Date }
}, {
    timestamps: true
})

module.exports = mongoose.model('Voucher', voucherSchema)
