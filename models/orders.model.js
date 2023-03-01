const mongoose = require('mongoose')
const { methodEnum, orderStatusEnum, paymentStatusEnum } = require('../utils/enum')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', require: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
        totalItem: { type: Number }
    }],
    delivery: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
    },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },
    cost: { 
        subTotal: { type: Number },
        shippingFee: { type: Number, default: 0 },
        discount: { type: Number },
        total: { type: Number },
    },
    method: { 
        code: {  type: Number, default: methodEnum?.cash?.code },
        text: {  type: String, default: methodEnum?.cash?.text },
    },
    paymentId: { type: String },
    paymentStatus: { 
        code: { type: Number, default: paymentStatusEnum?.unPaid?.code },
        text: { type: String, default: paymentStatusEnum?.unPaid?.text }
     },
    orderStatus: { 
        code: { type: Number, default: orderStatusEnum?.awaitingCheckPayment?.code },
        text: { type: String, default: orderStatusEnum?.awaitingCheckPayment?.text }
     },
    tracking: [{
        status: { type: mongoose.Schema.Types.String },
        time: { type: mongoose.Schema.Types.Date },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
  
}, {
    timestamps: true
})


module.exports = mongoose.model('Order', orderSchema)
