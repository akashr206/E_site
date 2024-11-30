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
    console.log(req.user);
    
    // On success, redirect to the dashboard or home page
    res.redirect('http://localhost:5173/');
  }
);

router.get('/check', (req, res) => {
  
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    res.status(200).json({ message: 'User is authenticated', user: req.user });
  }
});

// Route for logging out
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('http://localhost:5173/');
  });
});

module.exports = router;
