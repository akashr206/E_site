const { default: mongoose, Schema } = require("mongoose");

const reviewSchema = new Schema(
    {
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
        product: { type: String, ref: "Product", required: true },
        user: {
            name: { type: String, required: true },
            image: { type: String, required: true },
        },
        uId : { type: String, required: true },
        createdAt: { type: Date, default: Date.now() },
    },
    (timeStamps = true)
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
