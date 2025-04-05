const express = require("express");
const Stripe = require("stripe");
const router = express.Router();


const stripe = Stripe("sk_test_51RA7PB2XiQfMIAieuLVKklPmE7ljN2FW1w2gWcvKTYC6sum75uYmwul16M3819w3VOAbyRkI3KKJW09843pnHLqU00cyh6kAh3");

router.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert dollars to cents
            currency: currency || "usd",
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
