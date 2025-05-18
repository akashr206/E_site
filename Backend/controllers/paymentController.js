const Razorpay = require("razorpay");
const { checkOrderbyPaymentId } = require("../services/order");
const { verifyPayment } = require("../services/paymentServices");
const createPaymentOrder = async (req, res) => {
    let { amount, receipt, notes } = req.body;

    if (!amount || !receipt) {
        return res
            .status(400)
            .json({ message: "Amount or receipt are required." });
    }

    var razorpay = new Razorpay({
        key_id: process.env.RAZOR_PAY_ID,
        key_secret: process.env.RAZOR_PAY_SECRET,
    });

    const orderRes = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt,
    });

    if (!orderRes) {
        return res.status(500).json({ message: "Something went wrong!" });
    }

    res.status(200).json(orderRes);
};

const validatePayment = async (req, res) => {
    const { paymentId, orderId, signature } = req.body;
    const exists = (await checkOrderbyPaymentId(paymentId)) ? true : false;

    const expectedSignature = verifyPayment(orderId, paymentId, signature);

    if (expectedSignature) {
        return res.json({
            valid: true,
            exists,
        });
    } else {
        return res
            .status(400)
            .json({ valid: false, error: "Invalid payment signature" });
    }
};

module.exports = {
    createPaymentOrder,
    validatePayment,
};
