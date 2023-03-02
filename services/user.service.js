const User = require('../models/users.model')

const userService = {
    getAll: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit

        return Promise.all([
            User.countDocuments(query), 
            User.find(query).skip(skip).limit(limit).sort(sort)])
    },
    create: async({email, fullName, avatar, service, serviceId, status}) => {
        const newUser = new User({
                email, fullName, avatar, service, serviceId, status
            })
        return await newUser.save()
    },
    getById: async(id) => {
        return await User.findById(id)
    },
    getByEmailRegister: async(email) => {
        return await User.findOne({email: email, "serviceId": {$exists: false}})
    },
    getByEmail: async(email) => {
        return await User.findOne({email})
    },
    getByServiceId: async(serviceId) => {
        return await User.findOne({serviceId: serviceId})
    },
    getAddressByUserId: async(userId) => {
        return await User.findById(userId).select({"address": 1})
    },
    getCartByUserId: async(userId) => {
        return await User.findById(userId).select({"cart": 1}).populate("cart.product")
    },
    addAddressByUserId: async(userId, { addressId, address }) => {
        return await User.findByIdAndUpdate(userId, {
            $push: {
                address: { ...address, _id: addressId }
            }
        }, { new: true })
    },
    register: async({email, fullName, password}) => {
        const newUser = new User({email, password, fullName})
        return await newUser.save()
    },
    createStaff: async({email, fullName, password, phoneNumber, role, status}) => {
        const newUser = new User({email, password, fullName, phoneNumber, role, status})
        return await newUser.save()
    },
    handleResetPassword: async(userId, {password}) => {
        return await User.findByIdAndUpdate(userId, {
            password: password,
        })
    },
    addToCart: async (userId, productId) =>{
        try {
             const result = await User.findOneAndUpdate({_id: userId}, {
               $push: {
                   cart: {product: productId, quantity:  1}
               }
            })
            return { data: result }
        } catch (err) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateCart: async (userId, cart) =>{
        return await User.findByIdAndUpdate(userId, { cart: cart }, {new: true})
    },
    updateStatus: async (userId, {status}) =>{
        return await User.findByIdAndUpdate(userId, { status: status }, {new: true})
    },
    updateProfileById: async(userId, {fullName, gender, birthday, phoneNumber}) => {
        return await User.findByIdAndUpdate(userId, {
                fullName, gender, birthday, phoneNumber
            }, {new: true})
    },
    updateAvatar: async (userId, {avatar}) => {
        return await User.findByIdAndUpdate(userId, { avatar: avatar }, {new: true})
    },
    updateDefaultAddressById: async(userId, addressId) => {
            // Trước khi update address mặc định mới, => tìm address có isDefault = true,
            // set lại bằng false
        await User.updateOne({_id: userId, "address.isDefault": true}, {
            $set: {
                "address.$.isDefault": false
            }
        }) 
        return await User.updateOne({_id: userId, "address._id": addressId}, {
            $set: {
                "address.$.isDefault": true
            }
        })
    },
    deleteAddressById: async(userId, addressId) => {
        return await User.updateOne({_id: userId}, {
                $pull: { address: {_id: addressId} }
            })
    },
    deleteById: async(userId) => {
        return await User.findByIdAndDelete(userId)
    }
}

module.exports = userService
