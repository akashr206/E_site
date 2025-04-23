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

        const startOfCurrentMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const startOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const endOfPreviousMonth = new Date(startOfCurrentMonth);

        const activeUsers = await User.aggregate([
            {
                $facet: {
                    currentMonth: [
                        {
                            $match: {
                                lastActive: {
                                    $gte: startOfCurrentMonth,
                                    $lt: startOfNextMonth,
                                },
                            },
                        },
                        { $count: "count" },
                    ],
                    previousMonth: [
                        {
                            $match: {
                                lastActive: {
                                    $gte: startOfPreviousMonth,
                                    $lt: endOfPreviousMonth,
                                },
                            },
                        },
                        { $count: "count" },
                    ],
                },
            },
        ]);

        const result = activeUsers[0];
        return res.json({
            thisMonth: result.currentMonth[0]?.count || 0,
            lastMonth: result.previousMonth[0]?.count || 0,
        });
    } catch (error) {
        console.error("Error fetching active users:", error);
        return res.status(500).json({ error: "Failed to get active users" });
    }
};

module.exports = { getAllUsers, makeAdmin, getActiveUsers };
