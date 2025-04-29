// Routes: voucherRoutes.js
const express = require('express');
const router = express.Router();
const VoucherController = require('../Controllers/VoucherController');

// Routes
// POST route to create a voucher
router.post('/', VoucherController.createVoucher);

// GET all vouchers
router.get('/vouchers', VoucherController.getAllVouchers);

// GET voucher by code
router.get('/vouchers/:code', VoucherController.getVoucherByCode);

// PUT route to update a voucher
router.put('/vouchers/:id', VoucherController.updateVoucher);

// DELETE route to delete a voucher
router.delete('/vouchers/:id', VoucherController.deleteVoucher);

module.exports = router;
