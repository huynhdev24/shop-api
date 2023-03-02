const Voucher = require('../models/vouchers.model')

const voucherService = {
    getAll: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit
        return Promise.all([Voucher.countDocuments(query), Voucher.find(query).skip(skip).limit(limit).sort(sort)])

    },
    getById: async(id) => {
        return await Voucher.findById(id)
    },
    getByCode: async(code) => {
        return await Voucher.findOne({code: code})
    },
    create: async({name, code, by, value, start, end, minimum}) => {
        const newVoucher = new Voucher({name, code, by, value, start, end, minimum})
        return await newVoucher.save()
    },
    updateById: async(id, {name, start, end}) => {
        return await Voucher.findByIdAndUpdate(id, {
                name, start, end
            }, {new: true})
    },
    updateUsedQuantity: async(id, value) => {
        return await Voucher.findByIdAndUpdate(id,
                { $inc: { used_quantity: value } }
            )
    },
    deleteById: async(id) => {
        return await Voucher.findByIdAndDelete(id)
    }
}

module.exports = voucherService
