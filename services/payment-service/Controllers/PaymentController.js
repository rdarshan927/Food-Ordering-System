// controllers/PaymentController.js
const Payment = require('../Model/PaymentModel');
const bcrypt = require('bcryptjs');

// Encrypt card details before saving (using bcrypt)
const encryptCardDetails = async (cardNumber, cvv) => {
  const salt = await bcrypt.genSalt(10);
  const hashedCardNumber = await bcrypt.hash(cardNumber, salt);
  const hashedCVV = await bcrypt.hash(cvv, salt);
  return { hashedCardNumber, hashedCVV };
};

// @desc Add a new payment method
// @route POST /api/payments
exports.addPaymentMethod = async (req, res) => {
  try {
    const { nickname, cardNumber, expDate, cvv } = req.body;

    if (!nickname || !cardNumber || !expDate || !cvv) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { hashedCardNumber, hashedCVV } = await encryptCardDetails(cardNumber, cvv);

    const newPayment = new Payment({
      nickname,
      cardNumber: hashedCardNumber,
      expDate,
      cvv: hashedCVV,
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment method added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc Get all payment methods
// @route GET /api/payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().select('-cardNumber -cvv');  // Exclude encrypted fields from response
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc Update an existing payment method
// @route PUT /api/payments/:id
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, cardNumber, expDate, cvv } = req.body;

    if (!nickname || !cardNumber || !expDate || !cvv) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { hashedCardNumber, hashedCVV } = await encryptCardDetails(cardNumber, cvv);

    const updatedPayment = await Payment.findByIdAndUpdate(id, {
      nickname,
      cardNumber: hashedCardNumber,
      expDate,
      cvv: hashedCVV,
    }, { new: true });

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.status(200).json({ message: 'Payment method updated successfully', payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc Delete a payment method
// @route DELETE /api/payments/:id
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
