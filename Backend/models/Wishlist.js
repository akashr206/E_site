const { default: mongoose, Schema } = require("mongoose");

const wishlistSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
