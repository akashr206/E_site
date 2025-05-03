const {
    createReview,
    findAllReviews,
    findRatings,
    checkBought,
    checkExists,
} = require("../services/review");

const addReview = async (req, res) => {
    const { product, comment, user, rating } = req.body;
    const { uId } = req.user;
    if (comment.length === 0 || rating === 0) {
        return res
            .status(400)
            .json({ message: "Comment and rating are required" });
    } else if (comment.length < 10 || comment.length > 350) {
        res.status(400).json({
            message: "Comment must be between 10 and 350 characters",
        });
    }
    const review = {
        product,
        comment,
        rating,
        user,
        uId,
    };
    const exists = await checkExists(product, uId);
    if (exists) {
        return res
            .status(400)
            .json({ message: "You have already reviewed this product." });
    }
    const bought = await checkBought(product, uId);
    if (!bought) {
        return res.status(400).json({
            message: "You should have bought this product to add a review.",
        });
    }
    const newReview = await createReview(review);
    res.status(201).json(newReview);
};

const getReviews = async (req, res) => {
    const productId = req.params.id;
    const reviews = await findAllReviews(productId);
    res.status(200).json(reviews);
};

const getRatings = async (req, res) => {
    const productId = req.params.id;
    const reviews = await findRatings(productId);
    res.status(200).json(reviews);
};

module.exports = { addReview, getReviews, getRatings };
