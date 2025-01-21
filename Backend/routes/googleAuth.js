const express = require('express');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_CALLBACK_URL;

router.get('/', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;
  res.redirect(googleAuthUrl);
});

router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Authorization code missing');
    }

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

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = await profileResponse.json();
    
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        uId: profile.sub,
        phone: ' ', 
        isAdmin: false, 
      });
      await user.save();
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
      maxAge: 3600000 * 48, 
    });

    res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (error) {
    console.error('Error during Google OAuth:', error.message);
    res.status(500).send('Authentication failed. Please try again.');
  }
});



module.exports = router;
