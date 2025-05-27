const {
    addWishlist,
    findWishlists,
    findWishlist,
    deleteWishlist,
} = require("../services/wishlist");
const { findProductById } = require("../services/products");

const createWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const check = await findWishlist(user.id, productId);
        if(check){
            res.status(400).json({ message: "Product already in wishlist" });
        }
        await addWishlist(user.id, productId);
        res.status(201).json({ message: "wishlist added successfully" });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getWishlists = async (req, res) => {
    try {
        const user = req.user;
        const wishlists = await findWishlists(user.id);
        const products = await Promise.all(
            wishlists.map((wishlist) => findProductById(wishlist.productId))
        );
        res.json({products});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const checkWishlist = async (req, res) => {
    try {
        const productId = req.params.id;
        const user = req.user;
        const wishlist = await findWishlist(user.id, productId);
        res.json({ isWishlist: wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const deleted = deleteWishlist(user.id, productId);
        if (deleted)
            return res.json({ message: "Product removed from your wishlist" });
        else return res.json({ message: "There was an error removing" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    getWishlists,
    createWishlist,
    checkWishlist,
    removeWishlist,
};
