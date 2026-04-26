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
        return data;
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
    try {
        const user = await userModel.findById(id).populate("mylist");
        if (!user) return [];
        return user.mylist || [];
    } catch (error) {
        console.error("Error in getUserMovies service:", error);
        return [];
    }
}

async function appendMovieDb(movie) {
    const { title, img, genre, trailer, rating, sectionTitle } = movie;
    
    if (!title || !img || !genre || !trailer) {
        return "Details missing!";
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
        const newMovie = await movieModel.create({
            slug, 
            title, 
            genre, 
            img, 
            trailer,
            rating: rating || "0"
        });

        // Add to a section so it shows on homepage
        const targetSectionTitle = sectionTitle || "Recently Added";
        const sectionSlug = targetSectionTitle.toLowerCase().replace(/ /g, '-');

        let section = await sectionModel.findOne({ slug: sectionSlug });
        if (!section) {
            section = await sectionModel.create({
                slug: sectionSlug,
                title: targetSectionTitle,
                movies: []
            });
        }

        section.movies.push(newMovie._id);
        await section.save();

        return "success";
    } catch (error) {
        console.error("Error in movie.service.js ->", error);
        return error.message;
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

// --- My List Features ---
async function addToMyList(userId, movieId) {
    try {
        const user = await userModel.findById(userId);
        if (!user) return "User not found";
        
        if (user.mylist.includes(movieId)) {
            return "Movie already in list!";
        }
        
        user.mylist.push(movieId);
        await user.save();
        return "success";
    } catch (error) {
        return error.message;
    }
}

async function removeFromMyList(userId, movieId) {
    try {
        await userModel.findByIdAndUpdate(userId, {
            $pull: { mylist: movieId }
        });
        return "success";
    } catch (error) {
        return error.message;
    }
}

async function deleteMovieDb(movieId) {
    try {
        await movieModel.findByIdAndDelete(movieId);
        // Also remove from all sections
        await sectionModel.updateMany({}, { $pull: { movies: movieId } });
        return "success";
    } catch (error) {
        return error.message;
    }
}

async function updateMovieDb(movieId, movieData) {
    try {
        const { title, img, genre, trailer, rating } = movieData;
        const updateData = { title, img, genre, trailer, rating };
        
        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        
        await movieModel.findByIdAndUpdate(movieId, updateData, { runValidators: true });
        return "success";
    } catch (error) {
        return error.message;
    }
}

module.exports = { 
    getAllMovies, 
    getSectionsAndMovies, 
    getUserMovies, 
    appendMovieDb, 
    getMoviesCount,
    addToMyList,
    removeFromMyList,
    deleteMovieDb,
    updateMovieDb
};
