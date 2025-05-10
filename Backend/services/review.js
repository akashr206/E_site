const Review = require("../models/Review");
const Order = require("../models/Order");

const createReview = async (review) => {
    const newReview = await Review.create(review);
    return newReview;
};

const findAllReviews = async (productId) => {
    const reviews = await Review.find({ product: productId });
    return reviews;
};

const findRatings = async (productId) => {
    const reviews = await Review.find({ product: productId });
    const ratings = reviews.map((review) => review.rating);
    let averageRating = 0;
    if (ratings.length > 0) {
        averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        averageRating = averageRating.toFixed(2);
    }
    return {
        averageRating,
        totalReviews: reviews.length,
    };
};

const checkBought = async (productId, userId) => {
    const orders = await Order.find({ userId });
    let bought = false;
    orders.forEach((order) => {
        let check = false;
        order.items.forEach((item) => {
            if (item.productId == productId) {
                check = true;
            }
        });

        if (check) {
            bought = true;
        }
    });

    return bought ? true : false;
};
const checkExists = async (productId, userId) => {
    const review = await Review.findOne({ product: productId, uId: userId });
    console.log(review);

    return review ? true : false;
};

module.exports = {
    createReview,
    findAllReviews,
    findRatings,
    checkBought,
    checkExists,
};
