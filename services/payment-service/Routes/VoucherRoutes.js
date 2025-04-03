// routes/voucherRoutes.js
const express = require('express');
const router = express.Router();
const voucherController = require('../Controllers/VoucherController');

// Routes
router.post('/', voucherController.addVoucher); // Add new voucher
router.get('/', voucherController.getAllVouchers); // Get all vouchers
router.get('/:code', voucherController.getVoucherByCode); // Get voucher by code
router.put('/:id', voucherController.updateVoucher); // Update voucher
router.delete('/:id', voucherController.deleteVoucher); // Delete voucher

module.exports = router;
