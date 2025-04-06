const CartItem = require('../models/CartItem');
const Product = require('../models/Product'); // Product model for stock validation

// Create a cart item
const createCartItem = async (item) => {
    const createdItem = await CartItem.create(item);
    return createdItem;
};

// Retrieve all cart items for a specific user
const getUserCartItems = async (userId) => {
    const userCartItems = await CartItem.find({ userId });
    return userCartItems;
};

// Update the quantity of a product in the cart directly
const updateCartItemQuantity = async (id, quantity) => {
    const updatedItem = await CartItem.findByIdAndUpdate(
        id,
        { quantity },
        { new: true }
    );
    return updatedItem;
};

// Update the variant of a product in the cart
const updateCartItemVariant = async (id, color, size) => {
    const updatedItem = await CartItem.findByIdAndUpdate(
        id,
        { color, size, quantity : 1 },
        { new: true }
    );
    return updatedItem;
};

// Remove a product from the cart
const removeProductFromCart = async (itemId) => {
    const removedProduct = await CartItem.findByIdAndDelete(itemId);
    return removedProduct;
};

// Clear all items from the user's cart
const clearUserCart = async (userId) => {
    const clearedCart = await CartItem.deleteMany({ userId });
    return clearedCart;
};

// Check if a product is already in the user's cart
const isProductInCart = async (productId, userId) => {
    const product = await CartItem.findOne({ productId, userId });
    return product?._id
};

// Retrieve the total price of all products in the user's cart
const getCartTotal = async (userId) => {
    const cartItems = await CartItem.find({ userId });
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total;
};

// Retrieve the total number of items in the user's cart
const getCartItemCount = async (userId) => {
    const cartItems = await CartItem.find({ userId });
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return itemCount;
};

// Validate if the requested quantity is available in stock for a product variant
const validateStock = async (productId, color, size, quantity) => {
    try {
        // Find the product by ID
        const product = await Product.findOne({ id: productId });
        if (!product) {
            throw new Error('Product not found');
        }

        // Find the specific variant
        const variant = product.variants.find(v => v.color === color && v.size === size);
        if (!variant) {
            throw new Error('Variant not found');
        }

        // Check if the stock is sufficient
        return variant.stock >= quantity;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

module.exports = {
    createCartItem,
    getUserCartItems,
    updateCartItemQuantity,
    removeProductFromCart,
    clearUserCart,
    isProductInCart,
    getCartTotal,
    getCartItemCount,
    validateStock,
    updateCartItemVariant
};
