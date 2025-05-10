const { default: mongoose, Schema } = require("mongoose");

const AddressSchema = new Schema({
    street: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    postalCode: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        default: "India",
        trim: true,
    },
    landmark: {
        type: String,
        trim: true,
    },
    tag :{
        type : String,
        trim : true
    }
});

const AddressModel = mongoose.model("Address", AddressSchema)

module.exports = AddressModel