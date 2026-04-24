const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

async function addUser(username, email, password, role) {
    if (!username || !email || !password) return false;
    try {
        if (role == "admin") {
            const upload = await userModel.create({
                username,
                email,
                password,
                role: "admin"
            });
            return true;
        }
        const upload = await userModel.create({
            username,
            email,
            password,
        });

        return true;
    } catch (error) {
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

    const user = await userModel.findById(getId).select("password");
    if (!user) return null;

    if (user != null) {
        const matchPasswords = await bcrypt.compare(password, user.password);
        if (!matchPasswords) {
            return null;
        }
        const fetchedUser = {
            userId: user._id,
            username: user.username
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

function getChangedFields(oldUser, newUser) {
    const result = {};

    Object.keys(newUser).forEach(key => {
        if (newUser[key] !== oldUser[key]) {
            result[key] = newUser[key];
        }
    });

    return result;
}

async function changeUserData(id, oldData, newData) {
    if (!id || !mongoose.isValidObjectId(id)) return false;
    const updatedData = getChangedFields(oldData, newData);

    try {
        await userModel.findByIdAndUpdate(id, updatedData, { returnDocument: "after", runValidators: true });
        return true;
    } catch (error) {
        console.log("Error in user.service.js, changeUserData method ->" + error);
        return false;
    }
}

async function deleteUserAccount(id) {
    if (!id || !mongoose.isValidObjectId(id)) {
        return false;
    }

    try {
        await userModel.findByIdAndDelete(id);
        return true;
    } catch (error) {
        console.log("Error in user.service.js, deleteAccountById method ->" + error);
        return false;
    }
}

module.exports = { addUser, findUserByEmail, getUser, getUserById, changeUserData, deleteUserAccount, countSubscribers }
// --- Statistics ---

/**
 * Counts the total number of users who are not admins.
 * Useful for displaying subscriber stats on the admin dashboard.
 */
async function countSubscribers() {
    try {
        const count = await userModel.countDocuments({ role: "user" });
        return count;
    } catch (error) {
        console.log("Error in user.service.js, countSubscribers method ->" + error);
        return 0;
    }
}
