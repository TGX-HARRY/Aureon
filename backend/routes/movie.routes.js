const express = require("express");
const controllers = require("../controllers/movie.controller");
const { isAdmin, protect } = require("../middleware/middleware");

const router = express.Router();

router.get("/movies/mylist/:id", controllers.fetchUserMovieList);
router.get("/sections", controllers.fetchSectionsAndMoviesData);
router.get("/", controllers.fetchAllMoviesData);
router.post("/add", isAdmin, controllers.addMovie);
router.delete("/delete/:id", isAdmin, controllers.deleteMovie);

// My List Routes
router.post("/mylist/add", protect, controllers.addToList);
router.post("/mylist/remove", protect, controllers.removeFromList);

module.exports = router;