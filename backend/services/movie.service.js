const fs = require("fs").promises;
const path = require("path");
const movieModel = require("../models/movie.model");
const userModel = require("../models/user.model");
const sectionModel = require("../models/section.model");

const moviesFilePath = path.join(__dirname, "../../data/movies.json");

async function getAllMovies() {
    try {
        const data = await movieModel.find();
        if (!data) {
            return "Data not found";
        }
        return JSON.parse(data);
    } catch (err) {
        return err;
    }
}

async function getSectionsAndMovies() {
    try {
        const data = await sectionModel.find().populate('movies');
        if (!data) {
            return "Data not found";
        }
        return data;
    } catch (err) {
        return err;
    }
}

async function getUserMovies(id) {
    const data = await userModel.findById(id).select();
    const userdata = data.find(u => u.id === id);
    return userdata.movies;
}

async function appendMovieDb(movie) {
    const { slug, title, img, genre, trailer, rating } = movie;
    
    if (!slug || !title || !img || !genre || !trailer) {
        return "Details missing!";
    }

    try {
        await movieModel.create({
            slug, 
            title, 
            genre, 
            img, 
            trailer,
            rating: rating || "0"
        });
        return "success";
    } catch (error) {
        console.error("Error in movie.service.js ->", error);
        return error.message;
    }
}

module.exports = { getAllMovies, getSectionsAndMovies, getUserMovies, appendMovieDb };
// --- My List Features ---
async function addToMyList(userId, movieId) {
    try {
        const user = await userModel.findById(userId);
        if (user.mylist.includes(movieId)) {
            return "Movie already in list!";
        }
    } catch (error) {
    }
}
