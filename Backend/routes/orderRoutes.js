const express = require("express");
const router = express.Router();
const {
    addOrder,
    getOrder,
    getUserOrders,
    getAllOrders,
    deleteAll,
    getMonthlyRevenue
} = require("../controllers/orderController");

//admin
router.get("/all", getAllOrders);
router.get("/revenue", getMonthlyRevenue);
router.get("/deleteall", deleteAll);

//user
router.post("/", addOrder);
router.get("/:orderId", getOrder);
router.get("/", getUserOrders);

module.exports = router;
