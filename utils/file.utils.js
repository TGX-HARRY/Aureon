const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const { json } = require("express");
const path = require("path");

const filePath = path.join(__dirname, "../data/users.json");
const moviesFilePath = path.join(__dirname, "../data/movies.json");

async function getUsersData() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        if (!data) {
            return { admins: [], subscribers: [] };
        }
        return JSON.parse(data); 
    } 
    catch (err) {
        console.error("Error reading file:", err);
        return { admins: [], subscribers: [] };
    }
}

async function writeUserData(data) {
    if (data == null || data == undefined) {
        return false;
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        password: hashedPassword, 
        role: data.role
    };

    const existingUsers = await getUsersData();
    if (data.role.toLowerCase() === "admin") {
        existingUsers.admins.push(newUser);
    } 
    else if (data.role.toLowerCase() === "subscriber") {
        existingUsers.subscribers.push(newUser);
    } 
    else {
        throw new Error("Invalid role");
    }

    try {
        await fs.writeFile(
            filePath,
            JSON.stringify(existingUsers, null, 2)
        );
        console.log("File written successfully");
    } 
    catch (err) {
        console.error("Error writing file:", err);
    }
}

async function rewriteUserData(data) {
    try {
        fs.writeFile(
            filePath,
            JSON.stringify(data, null, 2)
        );
        console.log("File written successfully");
    }
    catch (err) {
        console.error("Error writing file:", err);
    }
}

async function getMoviesData() {
    try {
        const data = await fs.readFile(moviesFilePath, 'utf-8');
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }
    catch (err) {
        console.error("Error reading file:", err);
        return null;
    }
}

module.exports = { getUsersData, writeUserData, rewriteUserData , getMoviesData};