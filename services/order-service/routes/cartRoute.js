const express = require('express');
const {
    createCart,
    getCart,
    getSingleCart,
    updateCart,
    deleteCart,
    getDelivery,
    updateDelivery
} = require('../controllers/cartController');

const router = express.Router();

// 🛒 CART MANAGEMENT ROUTES
router.post('/cart/:userEmail/add', createCart);                // Add product to user's cart
router.get('/cart/:userEmail', getCart);                        // Get all cart items for a user
router.get('/cart/item/:id', getSingleCart);                    // Get a single cart item by its ID
router.patch('/cart/item/:id', updateCart);                     // Update quantity of a cart item
router.delete('/cart/item/:id', deleteCart);                    // Delete a cart item

// 🚚 DELIVERY DETAILS ROUTES
router.get('/delivery/:userEmail', getDelivery);                // Get delivery details for a user
router.patch('/delivery/:userEmail', updateDelivery);           // Update delivery info

module.exports = router;
