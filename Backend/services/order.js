const Order = require("../models/Order");

const checkOrderbyPaymentId = async (paymentId) => {
    const order = await Order.findOne({ paymentId });
    return order;
};

module.exports = { checkOrderbyPaymentId };
