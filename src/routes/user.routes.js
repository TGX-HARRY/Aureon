const express = require("express");
const controllers = require("../controllers/user.controller");

const router = express.Router();

router.get("/users/subscribers/:id", controllers.getSubscribers);
router.get("/users/admins/:id", controllers.getAdmins);
router.get("/movies/mylist/:id", controllers.fetchUserMovieList);
router.get("/movies", controllers.fetchMoviesData);
router.get("/users/subscribers/:id", controllers.getUsersDataByID);
router.post("/users/subscribers/register", controllers.addSubscriber);
router.post("/users/admins/register", controllers.addAdmin);
router.post("/users/subscribers/login", controllers.fetchSubscriber);
// router.patch("/admins/changeinfo/:email", controllers.changeAdminInfo);
router.patch("/users/subscribers/changeinfo", controllers.changeSubscriberInfo);
// router.patch("/admins/changepassword/:email", controllers.changeAdminPassword);
router.patch("/users/subscribers/changepassword", controllers.changeSubscriberPassword);
router.delete("/users/subscribers/remove/:id", controllers.removeSubscriberAccount);
// router.delete("/admins/remove/:email", controllers.removeAdminAccount);

module.exports = router;