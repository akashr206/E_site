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
router.put('/update',isAuthenticated, updateCartQuantity);
router.delete('/remove/:itemId',isAuthenticated, removeFromCart);
router.delete('/clear',isAuthenticated, clearCart);
router.get('/total',isAuthenticated, getCartTotalPrice);
router.get('/count', getCartCount);

module.exports = router;
 