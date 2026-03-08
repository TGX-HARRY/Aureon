const express = require("express");
const controllers = require("../controllers/user.controller");

const router = express.Router();

router.get("/users/subscribers/:id", controllers.getUsersDataByID);
router.get("/movies/mylist/:id", controllers.fetchUserMovieList);
router.get("/movies", controllers.fetchMoviesData);
router.post("/users/subscribers/register", controllers.addSubscriber);
router.post("/users/subscribers/login", controllers.fetchSubscriber);
router.patch("/users/subscribers/changeinfo", controllers.changeSubscriberInfo);
router.patch("/users/subscribers/changepassword", controllers.changeSubscriberPassword);
router.delete("/users/subscribers/remove/:id", controllers.removeSubscriberAccount);

module.exports = router;