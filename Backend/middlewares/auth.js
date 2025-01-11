const User = require('../models/User');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.find({email : decoded.email})
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = isAuthenticated;
