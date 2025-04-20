const express = require("express");
const paypal = require("paypal-rest-sdk");
require("dotenv").config();

const router = express.Router();

paypal.configure({
  mode: process.env.PAYPAL_MODE, 
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Create a payment
router.post("/create-payment", (req, res) => {
  const { amount, currency } = req.body;

  const paymentData = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel"
    },
    transactions: [{
      amount: { total: amount, currency: currency },
      description: "Food Order Payment"
    }]
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Payment creation failed" });
    } else {
      const forwardLink = payment.links.find(link => link.rel === 'approval_url').href;
      res.json({ forwardLink });
    }
  });
});

// Execute a payment after user approval
router.post("/execute-payment", (req, res) => {
  const { orderID, PayerID } = req.body;

  const executeData = { payer_id: PayerID };

  paypal.payment.execute(orderID, executeData, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Payment execution failed" });
    } else {
      res.json({ message: "Payment successful", payment });
    }
  });
});

module.exports = router;
