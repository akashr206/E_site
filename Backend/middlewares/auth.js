
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // Assuming token is stored in an HTTP-only cookie
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = isAuthenticated;
