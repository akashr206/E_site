const Order = require("../models/Order");

/**
 * Add a new order to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response
 */
const addOrder = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = user.id;

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
        if (!user || !user.id) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.userId.toString() !== user.id && user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to view this order" });
        }

        return res.status(200).json({
            order
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ error: "Invalid order ID format" });
        }
        
        return res.status(500).json({ error: "Failed to fetch order details" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = user.id;
        
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
                pages: Math.ceil(totalOrders / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ error: "Failed to fetch orders" });
    }
};

module.exports = { addOrder, getOrder, getUserOrders };