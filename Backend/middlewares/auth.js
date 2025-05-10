const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOneAndUpdate(
          { email: decoded.email },
          { lastActive: Date.now() },
          { new: true }
        );
        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(400).send("Invalid token.");
    }
};

module.exports = isAuthenticated;
