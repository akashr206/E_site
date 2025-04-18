const router = require("express").Router();
const { getAllUsers, makeAdmin } = require("../controllers/userController");

router.get("/all", getAllUsers);
router.post("/make-admin", makeAdmin);

module.exports = router;
