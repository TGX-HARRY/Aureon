const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");

async function addUser(email, password) {
    if (!email || !password) return false;
    try {
        const upload = await userModel.insertOne({
            email, 
            password,
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