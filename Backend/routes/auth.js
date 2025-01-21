const router = require('express').Router();
const isAuthenticated = require('../middlewares/auth');


router.get('/check', isAuthenticated, (req, res) => {
    res.status(200).json(req.user);
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;