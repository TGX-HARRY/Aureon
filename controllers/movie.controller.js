const { getAllMovies, getSectionsAndMovies, getUserMovies, appendMovieDb, addToMyList, removeFromMyList, deleteMovieDb, updateMovieDb } = require("../services/movie.service");

const fetchSectionsAndMoviesData = async (req, res) => {
    const data = await getSectionsAndMovies();
    return (!data) ? res.status(400).json({ message: "Movies not found" }) : res.status(200).json(data);
}

const fetchAllMoviesData = async (req, res) => {
    const data = await getAllMovies();
    return (!data) ? res.status(400).json({ message: "Movies not found" }) : res.status(200).json(data);
}

const fetchUserMovieList = async (req, res) => {
    const movies = await getUserMovies(req.params.id);
    return res.status(200).json(movies);
}

const addMovie = async (req, res) => {
    const status = await appendMovieDb(req.body);
    if (status === "success") {
        return res.status(201).json({ message: "Movie added successfully!" });
    } else {
        return res.status(400).json({ message: status });
    }
}

const addToList = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.userId; // Provided by protect middleware
    
    if (!movieId) return res.status(400).json({ message: "Movie ID missing!" });
    
    const status = await addToMyList(userId, movieId);
    if (status === "success") {
        return res.status(200).json({ message: "Added to list!" });
    } else {
        return res.status(400).json({ message: status });
    }
}

const removeFromList = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.userId;
    
    if (!movieId) return res.status(400).json({ message: "Movie ID missing!" });
    
    const status = await removeFromMyList(userId, movieId);
    if (status === "success") {
        return res.status(200).json({ message: "Removed from list!" });
    } else {
        return res.status(400).json({ message: status });
    }
}

const deleteMovie = async (req, res) => {
    const { id } = req.params;
    const status = await deleteMovieDb(id);
    if (status === "success") {
        return res.status(200).json({ message: "Movie deleted successfully!" });
    } else {
        return res.status(400).json({ message: status });
    }
}

const updateMovie = async (req, res) => {
    const { id } = req.params;
    const status = await updateMovieDb(id, req.body);
    if (status === "success") {
        return res.status(200).json({ message: "Movie updated successfully!" });
    } else {
        return res.status(400).json({ message: status });
    }
}

module.exports = { 
    fetchSectionsAndMoviesData, 
    fetchUserMovieList, 
    fetchAllMoviesData, 
    addMovie,
    addToList,
    removeFromList,
    deleteMovie,
    updateMovie
};