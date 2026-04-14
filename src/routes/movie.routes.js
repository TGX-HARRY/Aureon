const express = require("express");
const controllers = require("../controllers/user.controller");

const router = express.Router();

router.get("/movies/mylist/:id", controllers.fetchUserMovieList);
router.get("/movies", controllers.fetchMoviesData);

module.exports = router;