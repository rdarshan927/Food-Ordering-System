const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/PaymentController');

// Routes
router.post('/', paymentController.addPaymentMethod); // Add new payment method
router.get('/', paymentController.getAllPayments); // Get all payments
router.put('/:id', paymentController.updatePaymentMethod); // Update payment method
router.delete('/:id', paymentController.deletePaymentMethod); // Delete payment method

module.exports = router;
