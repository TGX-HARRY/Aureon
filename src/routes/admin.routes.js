const express = require("express");
const controllers = require("../controllers/admin.controller");

const router = express.Router();

router.get("/admins/getadmins/:id", controllers.getAdmins);
router.get("/movies/count", controllers.getMovieCount);
router.get("/admins/verify/:id", controllers.checkAdminID);
router.post("/admins/register", controllers.addAdmin);
// router.delete("/admins/remove/:email", controllers.removeAdminAccount);
// router.patch("/admins/changepassword/:email", controllers.changeAdminPassword);
// router.patch("/admins/changeinfo/:email", controllers.changeAdminInfo);

module.exports = router;