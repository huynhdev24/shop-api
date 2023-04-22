const History = require('../models/history.model');
// const User = require('../models/user.model');

const historyService = {
    getAll: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit
        return await Promise.all([
            History.countDocuments(query), 
            // History.find(query).populate('user').skip(skip).limit(limit).sort(sort)])
            History.find()])
    },
    getById: async(id) => {
        return await History.findById(id)
    },
    create: async({title}) => {
        const newHistory = new History({title})
        return await newHistory.save()
    },
    updateById: async(id, {title}) => {
        return await History.findByIdAndUpdate(id, { title: title }, {new: true})
    },
    deleteById: async(id) => {
        // Khi xóa 1 NXB=> Cần update lại các sách có NXB cần xóa = null
        // await History.updateMany({history: id }, { history: null})
        return await History.findByIdAndDelete(id)
    }
}

module.exports = historyService;
