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
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({ message: "Server error" });
    }
}

module.exports=protect;