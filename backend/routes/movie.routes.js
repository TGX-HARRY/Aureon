const express = require("express");
const controllers = require("../controllers/movie.controller");

const router = express.Router();

router.get("/movies/mylist/:id", controllers.fetchUserMovieList);
router.get("/sections", controllers.fetchSectionsAndMoviesData);
router.get("/", controllers.fetchAllMoviesData);

module.exports = router;