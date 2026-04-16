const { default: mongoose } = require("mongoose");

const sectionSchema = mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    title: {
        type: String, 
        required: true,
        trim: true
    },
    movies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie", // 🔥 enables populate
        }]
});

module.exports = mongoose.model('Section', sectionSchema);