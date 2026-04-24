const { getUserById, findUserByEmail, changeUserData, addUser } = require("../services/user.service");
const { getMoviesCount } = require("../services/movie.service");
const {getUsersData, userLookupWithID, checkUserData} = require("../utils/file.utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

exports.addAdmin = async (req, res) => {  
    // userId is of admin creating account of another admin
    const id = req.userId; // userId is attached to request by middleware
    if (!id) {
        return res.status(401).json({message : "No ID provided!"});
    }

    const {username, fullName, email, password} = req.body;
    const present = await findUserByEmail(email);
    if (present) {
        const adminData = await getUserById(present);
        const newAdmin = {};
        newAdmin.username = username || adminData.username;
        newAdmin.fullName = fullName || adminData.fullName;
        newAdmin.role = "admin";
        const changeStatus = await changeUserData(present, adminData, newAdmin);
        if (!changeStatus) {
            return res
            .status(500)
            .json({ message : "Request cannot be handled at this moment, please try again later on!"});
        }
    }
    const newAdmin = {
        username,
        fullName,
        email,
        password,
        role: "admin"
    };
    const uploadStatus = await addUser(username, email, password, "admin");
    if (!uploadStatus) {
        return res
        .status(500)
        .json({ message : "Request cannot be handled at this moment, please try again later on! create "});
    }

    return res
    .status(200)
    .json({ message : "Admin created successfully!" });
};

exports.getAdmins = async (req, res) => {
    const adminid = req.params.id;
    if (!adminid) {
        return res.status(400).json({message : "ID not provided!"});
    }
    
    const validID = await userLookupWithID(adminid, "admin");
    if (!validID) {
        return res.status(401).json({message : "Permission Denied"});
    }

    const existingData = await getUsersData();
    const adminsNames = (existingData.admins || []).map(admin => admin.name);
    if (adminsNames.length === 0) {
        return res.status(404).json({ message: "No admins found" });
    }
    return res.status(200).json({data : adminsNames});
}

exports.getMovieCount = async (req, res) => {
    const movieCount = await getMoviesCount();
    if(!movieCount) {
        res.status(400).json({message : "Error fetching movie count!"});
    }
    else {
        return res.status(200).json({count : movieCount});
    }
}

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    
    // 1. check if fields are missing
    if (!email || !password) {
        return res.status(400).json({ message: "Fields Missing!" });
    }

    // 2. find admin by email
    const admin = await userModel.findOne({ email });

    // 3. check if user exists and is an admin
    if (!admin || admin.role !== "admin") {
        return res.status(401).json({ message: "Admin account not found!" });
    }

    // 4. compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials!" });
    }

    // 5. create token
    const token = jwt.sign(
        { userId: admin._id, username: admin.username, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}
