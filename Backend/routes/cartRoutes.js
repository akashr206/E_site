const express = require('express');
const isAuthenticated = require('../middlewares/auth');
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

router.post('/add',isAuthenticated, addToCart);
router.get('/user', isAuthenticated, getCart);
router.put('/update', updateCartQuantity);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.get('/total', getCartTotalPrice);
router.get('/count', getCartCount);

module.exports = router;
 