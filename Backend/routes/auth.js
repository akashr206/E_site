const router = require('express').Router();
const isAuthenticated = require('../middlewares/auth');

router.get('/check', isAuthenticated, (req, res) => {
    res.status(200).json(req.user);
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    path: '/', 
  });

  res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;