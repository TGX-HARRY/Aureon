const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    slug : {
        type: String,
        unique: true,
        required: true, 
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        required: true,
    },
    genre: [
        {
        type: String,
        required: true,
    }],
    rating: {
        type: String,
    },
    trailer: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Movie', MovieSchema);