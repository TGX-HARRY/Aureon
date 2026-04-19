const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

async function addUser(email, password) {
    if (!email || !password) return false;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const upload = await userModel.insertOne({
            email,
            password : hashedPassword,
        });

        return true;
    } catch(error) {
        console.error("user.service.js -> " + error);
        return false;
    }
}

async function findUserByEmail(email) {
    if (!email) return null;
    try {
        const user = await userModel.findOne({ email }).select("_id");
        if (!user) return null;
        return user;
    }
    catch (err) {
        return null;
    }
}

async function getUser(email, password) {
    if (!email || !password) return null;

    const getId = await findUserByEmail(email);
    if (!getId) return null;

    const user = await userModel.findById(getId);
    
    
    if (user != null) {
        const matchPasswords = await bcrypt.compare(password, user.password);
        if (!matchPasswords) {
            return res
            .status(401)
            .json({message: "Incorrect Password!"});
        }
        const fetchedUser = {
            userId: user._id,
            username: user.name
        }
        return fetchedUser;
    }
    else return null;
}

async function getUserById(id) {
    if (!id) return null;
    const userdata = await userModel.findById(id).select();
    if (userdata == null) {
        return null;
    }
    return userdata;
}

module.exports = {addUser, findUserByEmail, getUser, getUserById}