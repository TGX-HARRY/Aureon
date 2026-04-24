const { findUserByEmail, getUser, addUser, getUserById, changeUserData, deleteUserAccount} = require("../services/user.service");
const { getUsersData, writeUserData, rewriteUserData } = require("../utils/file.utils");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model");

const addSubscriber = async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        console.log("user.controller.js -> data not found!");
        return res
        .status(400)
        .json({
            message: "Fields Missing!"
        });
    }

    const present = await findUserByEmail(email);
    if (present) {
        return res
        .status(400)
        .json({
            message: "Account already exists!"
        });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const uploadStatus = await addUser(username, email, hashedPassword);
    if (!uploadStatus) {
        return res
        .status(500)
        .json({ message : "Unable to add user, please try again later on!"});
    }

    return res
    .status(201)
    .json({
        message: "User created successfully"
    });
};

const fetchSubscriber = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res
        .status(400)
        .json({ message: "Fields Missing!" });
    }

    const user = await getUser(email, password);
    if (user != null) {
            const {userId, username} = user;
            // create token
            const token = jwt.sign(
                { userId, username },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            // set cookie
            return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,       // prevents JS access (XSS protection)
                secure: false,        // true in production (HTTPS)
                sameSite: "lax",      
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            .json({message : "Logged in!"});
    }
    else {
        return res.status(400).json({ message: "No account found with the provided email!" });
    }
};

const changeSubscriberInfo = async (req, res) => {
    const id = req.userId;
    if (!id) {
         return res
        .status(401)
        .json({ message: "Invalid user ID" });
    }

    const user = await getUserById(id);
    if (!user) {
        return res
        .status(404)
        .json({ message: "User not found" });
    }

    // Create a clean object for the update
    const newUser = {
        username: req.body.username || user.username,
        phone: req.body.phone || user.phone,
        fullName: req.body.fullName || user.fullName,
        gender: req.body.gender || user.gender,
        address: req.body.address || user.address,
        dob: req.body.dob || user.dob,
        avatar: req.body.avatar || user.avatar
    };

    const uploadStatus = await changeUserData(id, user, newUser);
    if (!uploadStatus) {
        return res
        .status(500)
        .json({message : "Unsuccessful update, internal server issue!"})
    }

    return res
    .status(200)
    .json({ message: "User data updated successfully" });
}

const removeSubscriberAccount = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Invalid ID!" })
    }

    const isPresent = await getUserById(id);
    if (!isPresent) {
        return res.status(400).json({ message: "User does not exist!" });
    }

    const isDeleted = await deleteUserAccount(id);
    if (!isDeleted) {
        return res
        .status(500)
        .json({message: "Server Error"});
    }

    
    return res
    .status(200)
    .json("Subscriber removed successfully!");
}


const getUsersDataByID = async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.status(400).json({ message: "Invalid ID!" })
    }
    const data = await getUserById(id);
    if (!data) {
        return res.status(400).json({ message: "Data couldn't be fetched!" });
    }
    return res.status(200).json(data);
}

const changeSubscriberPassword = async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res
        .status(400)
        .json({ message: "User email not found!" });
    }

    const userId = await findUserByEmail(email);
    if (!userId) {
        return res
        .status(400)
        .json({ message: "User not found!" })
    }
    const user = await getUserById(userId);
    if (!user) {
        return res
        .status(500)
        .json({message : "Unable to fetch user!"});
    }

    // copy existing user data and update password safely
    const newUser = { ...user._doc }; 
    newUser.password = await bcrypt.hash(req.body.password, 10);
    
    const uploadStatus = await changeUserData(userId, user, newUser);
    if (!uploadStatus) {
        return res
        .status(500)
        .json({message : "Unable to change password at this time, please try again after few minutes!"})
    }

    // if no error
    return res
    .status(200)
    .json({ message: "User password changed successfully!" });
}

module.exports = {
    addSubscriber, 
    fetchSubscriber, 
    changeSubscriberInfo, 
    removeSubscriberAccount, 
    getUsersDataByID, 
    changeSubscriberPassword
};