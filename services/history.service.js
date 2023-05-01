const History = require('../models/history.model');
// const User = require('../models/user.model');

const historyService = {
    getAll: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit
        return await Promise.all([
            History.countDocuments(query), 
            History.find(query).skip(skip).limit(limit).sort(sort)])
            // History.find()])
    },
    getById: async(id) => {
        return await History.findById(id)
    },
    create: async({action, type, title, link, user}) => {
        const newHistory = new History({action, type, title, link, user})
        return await newHistory.save()
    },
    updateById: async(id, {action, type, title, link}) => {
        return await History.findByIdAndUpdate(id, { title: title }, {new: true})
    },
    deleteById: async(id) => {
        // Khi xóa 1 NXB=> Cần update lại các sách có NXB cần xóa = null
        // await History.updateMany({history: id }, { history: null})
        return await History.findByIdAndDelete(id)
    }
}

module.exports = historyService;
