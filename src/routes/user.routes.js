const express = require("express");
const controllers = require("../controllers/user.controller");

const router = express.Router();

// router.get("/subscribers", controllers.getSubscribers);
router.get("/users/admins", controllers.getAdmins);
router.get("/movies/mylist/:id", controllers.fetchUserMovieList);
router.get("/movies", controllers.fetchMoviesData);
router.get("/subscribers/:id", controllers.getUsersDataByID);
router.post("/users/subscribers/register", controllers.addSubscriber);
router.post("/users/admins/register", controllers.addAdmin);
router.post("/users/subscribers/login", controllers.fetchSubscriber);
// router.patch("/admins/changeinfo/:email", controllers.changeAdminInfo);
// router.patch("/customers/changeinfo/:email", controllers.changeSubscriberInfo);
// router.patch("/admins/changepassword/:email", controllers.changeAdminPassword);
// router.patch("/customers/changepassword/:email", controllers.changeSubscriberPassword);
router.delete("/users/subscribers/remove/:id", controllers.removeSubscriberAccount);
// router.delete("/admins/remove/:email", controllers.removeAdminAccount);

module.exports = router;