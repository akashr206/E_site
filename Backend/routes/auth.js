const router = require('express').Router();
const isAuthenticated = require('../middlewares/auth');


router.get('/check', isAuthenticated, (req, res) => {
        console.log(req.user);
        res.status(200).send(req.user);
    });

module.exports = router;