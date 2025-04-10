const express = require("express");
const router = express.Router();
const {
    addOrder,
    getOrder,
    getUserOrders,
} = require("../controllers/orderController");

router.post("/", addOrder);
router.get("/:orderId", getOrder);
router.get("/", getUserOrders);

module.exports = router;
