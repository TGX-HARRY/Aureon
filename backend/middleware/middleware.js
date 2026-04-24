const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protect = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        window.location.replace("/login");
        return;
    }
    try {
        const verification = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verification.userId;
        req.username = verification.username; 
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({ message: "Server error" });
    }
}
const isAdmin = async (req, res, next) => {
    try {
        const verification = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(verification.userId);
        if (user == null || user.role !== "admin") {
            return res
            .status(401)
            .json({message : "Not an admin ID!"})
        }

        req.userId = verification.userId;
        req.username = verification.username; 
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({ message: "Server error" });
    }
}

module.exports={protect, isAdmin};