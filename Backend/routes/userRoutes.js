const router = require("express").Router();
const {
    getAllUsers,
    makeAdmin,
    getActiveUsers,
    getUserCount,
} = require("../controllers/userController");
const isAdmin = require("../middlewares/isAdmin");

router.get("/all", isAdmin, getAllUsers);
router.get("/count", isAdmin, getUserCount);
router.post("/make-admin", isAdmin, makeAdmin);
router.get("/active", isAdmin, getActiveUsers);

module.exports = router;
