const express = require("express");
const router = express.Router();
const {
    addOrder,
    getOrder,
    getUserOrders,
    getAllOrders,
    deleteAll,
    getMonthlyRevenue,
} = require("../controllers/orderController");
const  isAdmin  = require("../middlewares/isAdmin");

//admin
router.get("/all", isAdmin, getAllOrders);
router.get("/revenue", isAdmin, getMonthlyRevenue);
router.get("/deleteall", isAdmin, deleteAll);

//user
router.post("/", addOrder);
router.get("/:orderId", getOrder);
router.get("/", getUserOrders);

module.exports = router;
