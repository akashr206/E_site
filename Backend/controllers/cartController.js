const {
    createCartItem,
    getUserCartItems,
    updateCartItemQuantity,
    removeProductFromCart,
    clearUserCart,
    isProductInCart,
    getCartTotal,
    getCartItemCount,
    validateStock,
} = require('../services/cart');

// Add a product to the cart
const addToCart = async (req, res) => {
    const { productId, name, images, price, color, size, quantity } = req.body;
    const userId = req.user.id;

    try {
        // Validate stock
        const isStockAvailable = await validateStock(productId, color, size, quantity);
        if (!isStockAvailable) {
            return res.status(400).json({ message: 'Insufficient stock for the requested product variant' });
        }

        // Check if product is already in the cart
        const productExists = await isProductInCart(productId, userId);
        if (productExists) {
            return res.status(400).json({ message: 'Product is already in the cart' });
        }

        // Add the product to the cart
        const cartItem = await createCartItem({ productId, name, images, color, price, size, quantity, userId });
        res.status(201).json({ message: 'Product added to cart', cartItem });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: error.message });
    }
};

// Get the user's cart
const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await getUserCartItems(userId);
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update the quantity of a product in the cart
const updateCartQuantity = async (req, res) => {
    const { cartItemId, quantity } = req.body;

    try {
        const updatedItem = await updateCartItemQuantity(cartItemId, quantity);
        if (!updatedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json({ message: 'Cart item updated', updatedItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const removedProduct = await removeProductFromCart(productId, userId);
        if (!removedProduct) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        res.status(200).json({ message: 'Product removed from cart', removedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear all items from the cart
const clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        await clearUserCart(userId);
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the total price of items in the cart
const getCartTotalPrice = async (req, res) => {
    const userId = req.user.id;

    try {
        const totalPrice = await getCartTotal(userId);
        res.status(200).json({ totalPrice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the total item count in the cart
const getCartCount = async (req, res) => {
    const userId = req.user.id;
    try {
        const itemCount = await getCartItemCount(userId);
        res.status(200).json({ itemCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotalPrice,
    getCartCount,
};
