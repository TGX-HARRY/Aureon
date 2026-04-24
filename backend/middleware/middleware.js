const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// this function checks if the user is logged in
const protect = (req, res, next) => {
    // get token from cookies
    const token = req.cookies.token;

    // if no token, send error message
    if (!token) {
        return res.status(401).json({ message: "Please login first!" });
    }

    try {
        // check if token is valid
        const verification = jwt.verify(token, process.env.JWT_SECRET);
        
        // save user info in request for later use
        req.userId = verification.userId;
        req.username = verification.username; 
        
        next(); // go to next function
    }
    catch (error) {
        return res.status(401).json({ message: "Session expired or invalid token!" });
    }
}

// this function checks if the user is an admin
const isAdmin = async (req, res, next) => {
    // get token from cookies
    const token = req.cookies.token;

    // if no token, send error message
    if (!token) {
        return res.status(401).json({ message: "Please login first!" });
    }

    try {
        // check if token is valid
        const verification = jwt.verify(token, process.env.JWT_SECRET);
        
        // find user in database to check their role
        const user = await userModel.findById(verification.userId);

        // check if user exists and is an admin
        if (user && user.role === "admin") {
            req.userId = verification.userId;
            req.username = verification.username;
            next(); // user is admin, go ahead
        } else {
            return res.status(403).json({ message: "Access denied! Only admins can do this." });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Session expired or invalid token!" });
    }
}

module.exports = { protect, isAdmin };
