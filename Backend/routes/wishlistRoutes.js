const router = require("express").Router();
const {
    createWishlist,
    getWishlists,
    checkWishlist,
    removeWishlist,
} = require("../controllers/wishlistController");

router.get("/", getWishlists);
router.get("/:id", checkWishlist);
router.post("/", createWishlist);
router.delete("/", removeWishlist);

module.exports = router;
