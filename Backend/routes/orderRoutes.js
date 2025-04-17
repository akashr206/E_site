const express = require("express");
const router = express.Router();
const {
    addOrder,
    getOrder,
    getUserOrders,
    getAllOrders,
    deleteAll
} = require("../controllers/orderController");

//admin
router.get("/all", getAllOrders);
router.get("/deleteall", deleteAll);

router.post("/", addOrder);
router.get("/:orderId", getOrder);
router.get("/", getUserOrders);

module.exports = router;
