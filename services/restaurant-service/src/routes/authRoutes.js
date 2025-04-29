const express = require("express");
const { registerRestaurant, loginRestaurant, loginAdmin } = require("../controllers/authController");

const router = express.Router();

// Apply the middleware array as separate arguments
router.post("/register", registerRestaurant[0], registerRestaurant[1]);

router.post("/login", loginRestaurant);

// Fix this line - use the correct controller function
router.post("/admin/login", loginAdmin);

module.exports = router;