const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true, 
    },

    avatar: {
      type: String,
      default: "./images/avatar1",
    },

    role: {
      type: String,
      default: "subscriber",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "null",
    },

    phone: {
      type: String,
      default: "",
    },

    fullName: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    dob: {
      type: String,
      default: null, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("User", UserSchema);