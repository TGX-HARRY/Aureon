const express = require("express");
const controllers = require("../controllers/user.controller");
const { protect } = require("../middleware/middleware");

const router = express.Router();

// Account management routes
router.get("/subscribers/me", protect, controllers.getUsersDataByID)
router.patch("/subscribers/changeinfo", protect, controllers.changeSubscriberInfo);
router.delete("/subscribers/remove/:id", protect, controllers.removeSubscriberAccount);

// Authentication routes
router.post("/subscribers/register", controllers.addSubscriber);
router.post("/subscribers/login", controllers.fetchSubscriber);
router.patch("/subscribers/changepassword", controllers.changeSubscriberPassword);
router.post("/subscribers/google", controllers.googleLogin);

module.exports = router;