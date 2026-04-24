const express = require("express");
const controllers = require("../controllers/admin.controller");
const { isAdmin } = require("../middleware/middleware");

const router = express.Router();

router.get("/getadmins/:id", controllers.getAdmins);
router.get("/movies/count", isAdmin, controllers.getMovieCount);
// router.get("/verify/:id", controllers.checkAdminID);
router.post("/register", isAdmin, controllers.addAdmin);
// router.delete("/remove/:email", controllers.removeAdminAccount);
// router.patch("/changepassword/:email", controllers.changeAdminPassword);
// router.patch("/changeinfo/:email", controllers.changeAdminInfo);

module.exports = router;