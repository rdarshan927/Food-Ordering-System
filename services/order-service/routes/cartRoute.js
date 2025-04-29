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

// Cart Management Routes
router.post('/:userEmail/add', createCart);
router.get('/:userEmail', getCart);
router.get('/item/:id', getSingleCart);
router.patch('/item/:id', updateCart);
router.delete('/item/:id', deleteCart);

// Delivery Routes - Make sure these are defined before the general cart routes
router.get('/delivery/:userEmail', getDelivery);
router.patch('/delivery/:userEmail', updateDelivery);

module.exports = router;
