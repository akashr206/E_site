const express = require("express");
const router = express.Router();
const {
    getAddress,
    addAddress,
    deleteAddress,
    updateAddress,
} = require("../controllers/addressController");

router.get("/", getAddress);
router.post("/", addAddress);
router.delete("/", deleteAddress);
router.put("/", updateAddress);

module.exports = router;
