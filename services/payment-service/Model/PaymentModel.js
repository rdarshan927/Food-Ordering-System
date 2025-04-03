// models/PaymentModel.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expDate: {
    type: String, 
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
