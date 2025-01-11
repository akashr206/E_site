const {mongoose, Schema} = require('mongoose')

const UserSchema = new Schema({
    uId : {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: {type: String},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password: {type: String},
    isAdmin: {type: Boolean, required: true, default: false}
})

const User = mongoose.model('User', UserSchema)

module.exports = User