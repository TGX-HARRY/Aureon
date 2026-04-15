const { getMoviesData, getUserMovies } = require("../services/movie.service");

const fetchMoviesData = async (req, res) => {
    const data = await getMoviesData();
    return (!data) ? res.status(400).json({ message: "Movies not found" }) : res.status(200).json(data);
}

const fetchUserMovieList = async (req, res) => {
    const movies = await getUserMovies(req.params.id);
    return res.status(200).json(movies);
}

module.exports = { fetchMoviesData, fetchUserMovieList };