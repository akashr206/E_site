const User = require("../models/User");
const Address = require("../models/Adress");
const Order = require("../models/Order");

const getAllUsers = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        let allUsers = await User.find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalUsers = await User.countDocuments();
        allUsers = await Promise.all(
            allUsers.map(async (e) => {
                const [addressesCount, ordersCount] = await Promise.all([
                    Address.countDocuments({ userId: e.uId }),
                    Order.countDocuments({ userId: e.uId }),
                ]);

                return {
                    ...(e.toObject ? e.toObject() : e),
                    addresses: addressesCount,
                    orders: ordersCount,
                };
            })
        );

        return res.json({
            allUsers,
            pagination: {
                totalUsers,
                pages: Math.ceil(totalUsers / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ error: "Failed to get Users" });
    }
};

const makeAdmin = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log(userId);
        
        await User.updateOne({ uId: userId }, { isAdmin: true });
        return res.status(201).json({ message: "Successfully made admin" });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ error: "Failed to make admin" });
    }
};

const getActiveUsers = async (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        const activeUsers = await User.aggregate([
            {
                $facet: {
                    last24Hours: [
                        { $match: { lastActive: { $gte: oneDayAgo } } },
                        { $count: "count" }
                    ],
                    last7Days: [
                        { $match: { lastActive: { $gte: sevenDaysAgo } } },
                        { $count: "count" }
                    ],
                    last30Days: [
                        { $match: { lastActive: { $gte: thirtyDaysAgo } } },
                        { $count: "count" }
                    ],
                }
            }
        ]);

        const result = activeUsers[0];
        return res.json({
            statistics: {
                last24Hours: result.last24Hours[0]?.count || 0,
                last7Days: result.last7Days[0]?.count || 0,
                last30Days: result.last30Days[0]?.count || 0
            },
            recentActiveUsers: result.recentUsers
        });
    } catch (error) {
        console.error("Error fetching active users:", error);
        return res.status(500).json({ error: "Failed to get active users" });
    }
};

module.exports = { getAllUsers, makeAdmin, getActiveUsers };
