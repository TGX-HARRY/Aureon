const { getUserById, findUserByEmail, changeUserData, addUser } = require("../services/user.service");
const { getMoviesCount } = require("../services/movie.service");
const { getUsersData, userLookupWithID } = require("../utils/file.utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// ADD ADMIN
exports.addAdmin = async (req, res) => {  
    try {
        const id = req.userId;

        if (!id) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        const { username, fullName, email, password } = req.body;

        if (!email || !username) {
            return res.status(400).json({ message: "Required fields missing!" });
        }

        const present = await findUserByEmail(email);

        // If user exists → make admin
        if (present) {
            const adminData = await getUserById(present);

            const newAdmin = {
                username: username || adminData.username,
                fullName: fullName || adminData.fullName,
                role: "admin"
            };

            const changeStatus = await changeUserData(present, adminData, newAdmin);

            if (!changeStatus) {
                return res.status(500).json({
                    message: "Failed to update user!"
                });
            }

            return res.status(200).json({
                message: "User upgraded to admin successfully!"
            });
        }

        // New admin creation
        if (!password) {
            return res.status(400).json({ message: "Password required!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const uploadStatus = await addUser(username, email, hashedPassword, "admin");

        if (!uploadStatus) {
            return res.status(500).json({
                message: "Failed to create admin!"
            });
        }

        return res.status(200).json({
            message: "Admin created successfully!"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// GET ADMINS
exports.getAdmins = async (req, res) => {
    try {
        const adminid = req.params.id;

        if (!adminid) {
            return res.status(400).json({ message: "ID not provided!" });
        }

        const validID = await userLookupWithID(adminid, "admin");

        if (!validID) {
            return res.status(403).json({ message: "Permission Denied" });
        }

        const existingData = await getUsersData();

        const adminsNames = (existingData.admins || []).map(admin => admin.name);

        if (adminsNames.length === 0) {
            return res.status(404).json({ message: "No admins found" });
        }

        return res.status(200).json({ data: adminsNames });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.getMovieCount = async (req, res) => {
    try {
        const movieCount = await getMoviesCount();
        return res.status(200).json({ count: movieCount });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getUserCount = async (req, res) => {
    try {
        const count = await userModel.countDocuments();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ADMIN LOGIN
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Fields Missing!" });
        }

        const admin = await userModel.findOne({ email });

        if (!admin || admin.role !== "admin") {
            return res.status(401).json({ message: "Admin not found!" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { userId: admin._id, username: admin.username, role: "admin" },
            process.env.JWT_SECRET || "aureon_jwt_secret",
            { expiresIn: "1d" }
        );

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({ message: "Admin logged in successfully!" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.checkAdminID = async (req, res) => {
    try {
        const adminid = req.params.id;
        const isValid = await userLookupWithID(adminid, "admin");
        if (isValid) {
            return res.status(200).json({ valid: true });
        } else {
            return res.status(401).json({ valid: false, message: "Invalid Admin ID" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
