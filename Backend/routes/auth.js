const router = require('express').Router();
const isAuthenticated = require('../middlewares/auth');


router.get('/check', isAuthenticated, (req, res) => {
        res.status(200).json(req.user);
    });

module.exports = router;