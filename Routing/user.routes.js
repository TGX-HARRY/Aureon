const express = require("express");
const controllers = require("../controllers/user.controller");

const router = express.Router();

router.get("/customers", controllers.getCustomers);
router.get("/admins", controllers.getAdmins);
router.post("/customers/login", controllers.fetchCustomer);
// router.get("/customers/:email", controllers.checkCustomerByEmail);
router.post("/customers/register", controllers.addCustomer);
router.post("/admins/register", controllers.addAdmin);
// router.patch("/admins/changeinfo/:email", controllers.changeAdminInfo);
// router.patch("/customers/changeinfo/:email", controllers.changeCustomerInfo);
// router.patch("/admins/changepassword/:email", controllers.changeAdminPassword);
// router.patch("/customers/changepassword/:email", controllers.changeCustomerPassword);
router.delete("/customers/remove/:id", controllers.removeCustomerAccount);
// router.delete("/admins/remove/:email", controllers.removeAdminAccount);

module.exports = router;