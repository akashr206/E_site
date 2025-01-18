const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  }
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '2 Days' }
  );
};

module.exports = generateToken;
