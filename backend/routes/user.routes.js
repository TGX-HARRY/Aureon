const express = require("express");
const controllers = require("../controllers/user.controller");
const protect = require("../middleware/middleware");

const router = express.Router();

router.get("/users/subscribers/:id", controllers.getUsersDataByID);

router.post("/users/subscribers/register", controllers.addSubscriber);
router.post("/users/subscribers/login", controllers.fetchSubscriber);
router.patch("/users/subscribers/changeinfo", protect, controllers.changeSubscriberInfo);
router.patch("/users/subscribers/changepassword", controllers.changeSubscriberPassword);
router.delete("/users/subscribers/remove/:id", protect , controllers.removeSubscriberAccount);

module.exports = router;