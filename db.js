const mongoose = require('mongoose')

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("Kết nối MongoDB thành công!")

    } catch (error) {
        console.log("Kết nối MongoDB thất bại!" + error)
    }
}

module.exports = connectMongoDB