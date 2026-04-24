const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

async function addUser(username, email, password, role) {
    if (!username || !email || !password) return false;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (role == "admin") {
            const upload = await userModel.create({
                username,
                email,
                password: hashedPassword, 
                role: "admin"
            });
            return true;
        }
        const upload = await userModel.create({
            username,
            email,
            password: hashedPassword,
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
    try {
        if (!email || !password) return null;

        // 1. Find user by email (include password for comparison)
        const user = await userModel.findOne({ email });
        if (!user) return null;

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // 3. Return user data (without password)
        return {
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
    } catch (error) {
        console.error("Error in getUser service:", error);
        return null;
    }
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
    } catch(error) {
        console.log("Error in user.service.js, deleteAccountById method ->" + error);
        return false;
    }
}

module.exports = {addUser, findUserByEmail, getUser, getUserById, changeUserData, deleteUserAccount}