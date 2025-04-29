const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Get all restaurants
router.get('/restaurants', customerController.getAllRestaurants);

// Get a single restaurant + menu
router.get('/restaurants/:restaurantId', customerController.getRestaurantDetails);

// Search restaurants by query (name/cuisine)
router.get('/search', customerController.searchRestaurants);

module.exports = router;
