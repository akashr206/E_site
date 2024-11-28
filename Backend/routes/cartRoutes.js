const express = require('express');
const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotalPrice,
    getCartCount,
} = require('../controllers/cartController');

const router = express.Router();

router.post('/add', addToCart);
router.get('/user', getCart);
router.put('/update', updateCartQuantity);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.get('/total', getCartTotalPrice);
router.get('/count', getCartCount);

module.exports = router;
 