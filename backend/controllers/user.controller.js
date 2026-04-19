const { findUserByEmail, getUser, addUser, getUserById, changeUserData} = require("../services/user.service");
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
    
    const uploadStatus = await addUser(username, email, password);
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

const getSubscribers = async (req, res) => {
    const adminid = req.params.id;
    if (!adminid) {
        return res.status(400).json({ message: "ID not provided!" });
    }

    const validID = await userLookupWithID(adminid, "admin");
    if (!validID) {
        return res.status(401).json({ message: "Permission Denied" });
    }

    const existingData = getUsersData();
    const customersDataWithoutPassword = existingData.subscribers.map(subscriber => {
        return {
            name: subscriber.name,
            email: subscriber.email
        }
    });
    if (customersDataWithoutPassword.length === 0) {
        return res.status(404).json({ message: "No subscribers found" });
    }
    return res.status(200).json({ data: customersDataWithoutPassword });
}

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

    const newUser = {};
    if (user) {
        newUser.username = req.body.name || user.name;
        newUser.phone = req.body.phone || user.phone;
        newUser.fullName = req.body.fullName || user.fullName;
        newUser.gender = req.body.gender || user.gender;
        newUser.address = req.body.address || user.address;
        newUser.dob = req.body.dob || user.dob;
        newUser.avatar = req.body.avatar || user.avatar;
    }

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

    const isPresent = await userLookupWithID(id);
    if (!isPresent) {
        return res.status(400).json({ message: "User does not exist!" });
    }

    const data = await getUsersData();

    const filteredData = data.subscribers.filter(u => u.id !== id);

    try {
        await rewriteUserData({
            ...data,
            subscribers: filteredData
        });
    }
    catch (err) {
        return res.status(400).json({ message: "Data write failed!" });
    }
    return res.json("Subscriber removed successfully!");
}


const getUsersDataByID = async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.status(400).json({ message: "Invalid ID!" })
    }
    const data = await getUserById(id, "subscriber");
    if (!data) {
        console.log("user.controller.js -> data not found!");
        return res.status(400).json({ message: "Data couldn't be fetched!" });
    }
    return res.status(200).json(data);
}

const changeSubscriberPassword = async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: "User email not found!" });
    }

    const existingUserData = await getUsersData();
    const user = existingUserData.subscribers.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: "User not found!" })
    }

    if (user) {
        user.password = await bcrypt.hash(req.body.password, 10);
    }

    try {
        await rewriteUserData(existingUserData);
    }
    catch (err) {
        return res.status(400).json({ message: "Could not rewrite data, due to error : " + err });
    }

    // if no error
    return res.status(200).json({ message: "User password changed successfully!" });
}

module.exports = {
    addSubscriber, 
    fetchSubscriber, 
    getSubscribers, 
    changeSubscriberInfo, 
    removeSubscriberAccount, 
    getUsersDataByID, 
    changeSubscriberPassword
};