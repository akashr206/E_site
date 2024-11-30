const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

// Define the Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
  async function (accessToken, refreshToken, profile, done) {

    const existingUser = await User.findOne({ email: profile.emails[0].value });
    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      uId: profile.id,
      phone : "-----",
      isAdmin : false
    });
    await newUser.save();
    return done(null, newUser);
  }

));

// Serialize the user into the session (for storing user information)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

