const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
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
      select: false, 
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "subscriber",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
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
      type: Date,
      default: null, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("User", UserSchema);