const express = require("express");
const {
  verifyRestaurant,
  getAllRestaurants,
  viewTransactions,
  deleteRestaurantById, // Add this import
} = require("../controllers/adminController");

const router = express.Router();

router.put("/verify/:restaurantId", verifyRestaurant);
router.get("/restaurants", getAllRestaurants);
router.get("/transactions", viewTransactions);
router.delete("/restaurants/:restaurantId", deleteRestaurantById); // Add this line after your existing routes

module.exports = router;