const mongoose = require("mongoose");

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connection establised successfully!");
    }
    catch (e) {
        console.error("Database Connection Error: ", e);
        process.exit(1);
    }
}

module.exports = {connectDB};
