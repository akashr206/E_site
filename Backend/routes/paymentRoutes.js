const router = require("express").Router();
const {
    createPaymentOrder,
    validatePayment,
} = require("../controllers/paymentController");

router.post("/order/create", createPaymentOrder);
router.post("/validate", validatePayment);

module.exports = router;
