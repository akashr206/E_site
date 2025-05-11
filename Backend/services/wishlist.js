const Wishlist = require("../models/Wishlist");

const findWishlists = async (userId) => {
    const wishlists = await Wishlist.find({ userId });
    return wishlists;
};

const addWishlist = async (userId, productId) => {
    const wishlist = await Wishlist.create({ userId, productId });
    return wishlist;
};

const findWishlist = async (userId, productId) => {
    const wishlist = await Wishlist.findOne({userId, productId });
    if (wishlist) return true;
    else return false;
};

const deleteWishlist = async (userId, productId) => {
    await Wishlist.deleteOne({ userId, productId });
    return true;
};

module.exports = { findWishlists, addWishlist, findWishlist, deleteWishlist };
