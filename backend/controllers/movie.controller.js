const { getAllMovies, getSectionsAndMovies, getUserMovies } = require("../services/movie.service");

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

module.exports = { fetchSectionsAndMoviesData, fetchUserMovieList, fetchAllMoviesData };