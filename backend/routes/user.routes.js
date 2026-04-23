const express = require("express");
const controllers = require("../controllers/user.controller");
const middleware = require("../middleware/middleware");

const router = express.Router();

// router.get("/users/subscribers/:id", controllers.getUsersDataByID);
router.get("/subscribers/me", middleware.protect, controllers.getUsersDataByID);
router.post("/subscribers/register", controllers.addSubscriber);
router.post("/subscribers/login", controllers.fetchSubscriber);
router.patch("/subscribers/changeinfo", middleware.protect, controllers.changeSubscriberInfo);
router.patch("/subscribers/changepassword", controllers.changeSubscriberPassword);
router.delete("/subscribers/remove/:id", middleware.protect, controllers.removeSubscriberAccount);

module.exports = router;