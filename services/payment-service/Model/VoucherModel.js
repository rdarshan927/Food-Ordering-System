// models/VoucherModel.js
const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Voucher', VoucherSchema);
