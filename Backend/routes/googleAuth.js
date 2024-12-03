const express = require('express');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Google OAuth endpoints
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_CALLBACK_URL;

// Redirect to Google OAuth
router.get('/', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;
  res.redirect(googleAuthUrl);
});

// Google OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // If there's no code, return an error
    if (!code) {
      return res.status(400).send('Authorization code missing');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).send('Error retrieving token from Google.');
    }

    const { id_token, access_token } = tokenData;

    // Get user profile using the access token
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = await profileResponse.json();

    // Check if user exists in DB
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      // Create new user if not exists
      user = new User({
        name: profile.name,
        email: profile.email,
        uId: profile.sub,
        phone: '-----',  // Placeholder value for now
        isAdmin: false,  // Set to false initially or update as needed
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    // Send JWT as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production for secure cookies
      sameSite: 'strict',
      maxAge: 3600000 * 24, // Set cookie expiration to 1 hour (or adjust as needed)
    });

    // Redirect to the frontend dashboard after login
    res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (error) {
    console.error('Error during Google OAuth:', error.message);
    res.status(500).send('Authentication failed. Please try again.');
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // Clear the token cookie to log the user out
  res.clearCookie('token');
  res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;
