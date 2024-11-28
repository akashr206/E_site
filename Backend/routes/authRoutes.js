const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to initiate Google login
router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
});

// Route to handle Google callback after authentication
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // On success, redirect to the dashboard or home page
    res.status(200).json({ message: 'Authentication successful' });
  }
);

// Route for logging out
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect('/');
  });
});

module.exports = router;
