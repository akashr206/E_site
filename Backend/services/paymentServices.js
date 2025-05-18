const crypto = require("crypto");

const verifyPayment = (orderId, paymentId, signature) => {
    const key = crypto
        .createHmac("sha256", process.env.RAZOR_PAY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    return key === signature;
};

module.exports = { verifyPayment };
