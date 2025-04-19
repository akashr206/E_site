const router = require("express").Router();
const { getAllUsers, makeAdmin, getActiveUsers } = require("../controllers/userController");

router.get("/all", getAllUsers);
router.post("/make-admin", makeAdmin);
router.get("/active", getActiveUsers);

module.exports = router;
