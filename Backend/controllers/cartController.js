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
    updateCartItemVariant,
} = require("../services/cart");

// Add a product to the cart
const addToCart = async (req, res) => {
    const { productId, name, images, price, mrp, color, size, quantity } =
        req.body;
    const userId = req.user.uId;

    try {
        // Validate stock
        const isStockAvailable = await validateStock(
            productId,
            color,
            size,
            quantity
        );
        if (!isStockAvailable) {
            return res.status(400).json({
                message: "Insufficient stock for the requested product variant",
            });
        }

        // Check if product is already in the cart
        const productExists = await isProductInCart(productId, userId);

        if (productExists) {
            updateCartItemVariant(productExists, color, size);
            return res.status(200).json({ message: "Cart updated" });
        }
        // Add the product to the cart
        const cartItem = await createCartItem({
            productId,
            name,
            images,
            color,
            price,
            mrp,
            size,
            quantity,
            userId,
        });
        res.status(201).json({ message: "Product added to cart", cartItem });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error.message });
    }
};

// Get the user's cart
const getCart = async (req, res) => {
    const userId = req.user.uId;

    try {
        let cartItems = await getUserCartItems(userId);

        cartItems = await Promise.all(
            cartItems.map(async (item) => {
                const inStock = await validateStock(
                    item.productId,
                    item.color,
                    item.size,
                    item.quantity
                );

                return {
                    ...item._doc,
                    inStock,
                };
            })
        );

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
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.status(200).json({ message: "Cart item updated", updatedItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
    const { itemId } = req.params;

    try {
        const removedProduct = await removeProductFromCart(itemId);
        if (!removedProduct) {
            return res
                .status(404)
                .json({ message: "Product not found in cart" });
        }
        res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear all items from the cart
const clearCart = async (req, res) => {
    const userId = req.user.uId;

    try {
        await clearUserCart(userId);
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the total price of items in the cart
const getCartTotalPrice = async (req, res) => {
    const userId = req.user.uId;
    try {
        let cartItems = await getUserCartItems(userId);
        cartItems = await Promise.all(
            cartItems.map(async (item) => {
                const inStock = await validateStock(
                    item.productId,
                    item.color,
                    item.size,
                    item.quantity
                );
                return inStock ? item : null;
            })
        );
        cartItems = cartItems.filter(Boolean);
        console.log(cartItems);
        
        const mrp =
            cartItems.reduce(
                (sum, item) => sum + item.mrp * item.quantity,
                0
            ) || 0;
        const total =
            cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ) || 0;

        const totalPrice = { mrp, totalPrice: total };
        res.status(200).json(totalPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the total item count in the cart
const getCartCount = async (req, res) => {
    const userId = req.user.uId;
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
