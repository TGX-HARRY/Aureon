const express = require("express");
const controllers = require("../controllers/movie.controller");

const router = express.Router();

router.get("/movies/mylist/:id", controllers.fetchUserMovieList);
router.get("/", controllers.fetchMoviesData);

module.exports = router;