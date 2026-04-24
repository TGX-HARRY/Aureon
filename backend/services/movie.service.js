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
    const { slug, title, img, genre, trailer } = movie;
    if (!slug || !title || !img || !genre || !trailer) {
        return "movie.service.js -> Details missing!"
    }

    try {
        const upload = movieModel.insertOne({
            slug,
            title,
            genre,
            img,
            trailer
        });
        return "success";
    } catch (error) {
        return error;
    }
}

async function getMoviesCount() {
    try {
        const count = await movieModel.countDocuments();
        return count;
    } catch (err) {
        return 0;
    }
}

module.exports = { getAllMovies, getSectionsAndMovies, getUserMovies, appendMovieDb, getMoviesCount };