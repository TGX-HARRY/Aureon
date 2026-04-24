const express = require("express");
const controllers = require("../controllers/user.controller");
const { protect } = require("../middleware/middleware");

const router = express.Router();

router.get("/subscribers/me", protect, controllers.getUsersDataByID)
router.post("/subscribers/register", controllers.addSubscriber);
router.post("/subscribers/login", controllers.fetchSubscriber);
router.patch("/subscribers/changeinfo", protect, controllers.changeSubscriberInfo);
router.patch("/subscribers/changepassword", controllers.changeSubscriberPassword);
router.delete("/subscribers/remove/:id", protect , controllers.removeSubscriberAccount);

module.exports = router;