const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                productName: String,
                variant: {
                    color: String,
                    size: String,
                },
                quantity: Number,
                price: Number,
                totalItemPrice: Number,
            },
        ],

        shippingAddress: {
            fullName: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
            phone: String,
        },

        payment: {
            method: String,
            status: String,
            transactionId: String,
        },

        shipping: {
            method: String,
            status: String,
            estimatedDeliveryDate: Date,
        },

        summary: {
            subTotal: Number,
            tax: Number,
            shippingCost: Number,
            discount: Number,
            totalAmount: Number,
        },

        notes: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);
