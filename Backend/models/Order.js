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
                    type: String, 
                    ref: "Product",
                    required: true,
                },
                productName: {
                    type: String,
                    required: true,
                },
                variant: {
                    color: String,
                    size: String,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"],
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, "Price cannot be negative"],
                },
            },
        ],

        shippingAddress: {
            type: String,
            required: true,
        },

        payment: {
            method: {
                type: String,
                required: true,
                enum: ["upi", "card", "cod", "wallet", "netbanking"],
            },
            status: {
                type: String, 
                required: true,
                enum: ["pending", "paid", "failed", "refunded"],
            },
            transactionId: String,
        },

        shipping: {
            method: {
                type: String,
                required: true,
                enum: ["domestic", "international", "express", "standard"],
            },
            status: {
                type: String,
                required: true,
                enum: ["pending", "shipped", "delivered", "cancelled"],
                default: "pending",
            },
            estimatedDeliveryDate: {
                type: Date,
                required: true,
            },
        },

        summary: {
            subTotal: {
                type: Number,
                required: true,
                min: [0, "Subtotal cannot be negative"],
            },
            tax: {
                type: Number,
                required: true,
                default: 0,
                min: [0, "Tax cannot be negative"],
            },
            shippingCost: {
                type: Number,
                required: true,
                default: 0,
                min: [0, "Shipping cost cannot be negative"],
            },
            discount: {
                type: Number,
                default: 0,
                min: [0, "Discount cannot be negative"],
            },
            totalAmount: {
                type: Number,
                required: true,
                min: [0, "Total amount cannot be negative"],
            },
        },
        
        status: {
            type: String,
            required: true,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },

        notes: String,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;