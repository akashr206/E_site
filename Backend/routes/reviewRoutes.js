const router = require("express").Router();
const {
    addReview,
    getReviews,
    getRatings,
} = require("../controllers/reviewController");
const isAuthenticated = require("../middlewares/auth");

router.post("/", isAuthenticated, addReview);
router.get("/:id", getReviews);
router.get("/ratings/:id", getRatings);

module.exports = router;
