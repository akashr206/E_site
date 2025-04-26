const Order = require("../models/Order");
const { clearUserCart } = require("../services/cart");
const { getAddress } = require("../services/address");
const { reduceStock } = require("../services/products");
const { generateId } = require("../utils/generateId");

const addOrder = async (req, res) => {
    try {
        const user = req.user;
        const orderId = await generateId(10);
        if (!user || !user.uId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = user.uId;

        const { items, addressId, summary } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Order must contain items" });
        }

        if (!addressId) {
            return res
                .status(400)
                .json({ error: "Shipping address is required" });
        }

        if (!summary) {
            return res.status(400).json({ error: "Valid summary is required" });
        }
        const order = await Order.create({
            userId,
            id: orderId,
            customerName: user.name,
            items,
            shippingAddress: addressId,
            summary,
            payment: {
                method: "upi",
                status: "paid",
                transactionId: "1234",
            },
            shipping: {
                method: "domestic",
                status: "pending",
                estimatedDeliveryDate: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ),
            },
            orderDate: new Date(),
            status: "confirmed",
        });
        await Promise.all(
            items.map((item) => {
                reduceStock(
                    item.productId,
                    item.quantity,
                    item.variant.color,
                    item.variant.size
                );
            })
        );
        await clearUserCart(userId);
        return res.status(201).json({
            message: "Order created successfully",
            orderId: order._id,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: "Failed to create order" });
    }
};

const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        const user = req.user;
        if (!user || !user.uId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        let order = await Order.findById(orderId);
        let orderData = order.toObject();
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.userId.toString() !== user.uId && user.role !== "admin") {
            return res
                .status(403)
                .json({ error: "Not authorized to view this order" });
        }
        const shippingAddress = await getAddress(order.shippingAddress);
        if (shippingAddress != -1) orderData.shippingAddress = shippingAddress;

        return res.status(200).json({
            order: orderData,
        });
    } catch (error) {
        console.error("Error fetching order:", error);

        if (error.name === "CastError" && error.kind === "ObjectId") {
            return res.status(400).json({ error: "Invalid order ID format" });
        }

        return res.status(500).json({ error: "Failed to fetch order details" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.uId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = user.uId;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ userId });

        return res.status(200).json({
            orders,
            pagination: {
                total: totalOrders,
                page,
                limit,
                pages: Math.ceil(totalOrders / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ error: "Failed to fetch orders" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const allOrders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalOrders = await Order.countDocuments();
        return res.status(200).json({
            allOrders,
            pagination: {
                total: totalOrders,
                page,
                limit,
                pages: Math.ceil(totalOrders / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ error: "Failed to fetch orders" });
    }
};

//temporary
const deleteAll = async (req, res) => {
    await Order.deleteMany({});
    return res.json({ message: "deleted successfully" });
};

const getMonthlyRevenue = async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        );

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    "payment.status": "paid",
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                        month: { $month: "$orderDate" },
                    },
                    totalRevenue: { $sum: "$summary.totalAmount" },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);

        return res.status(200).json({ monthlyRevenue });
    } catch (error) {
        console.error("Error calculating monthly revenue:", error);
        return res
            .status(500)
            .json({ error: "Failed to calculate monthly revenue" });
    }
};

module.exports = {
    addOrder,
    getOrder,
    getUserOrders,
    getAllOrders,
    deleteAll,
    getMonthlyRevenue,
};
