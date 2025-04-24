const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const paymentRoutes = require("./Routes/PaymentRoute");
const voucherRoutes = require('./Routes/VoucherRoutes');
const paypalRoutes = require("./Routes/paypalRoutes");
const stripeRotes = require("./Routes/stripeRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection with Error Handling
connectDB()
  .then(() => console.log("✅ Database connection successful"))
  .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  });

// Default Route
app.get("/", (req, res) => res.send("🚀 Payment API is running..."));

// Payment Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/vouchers",voucherRoutes);
app.use("/api/paypal", paypalRoutes);
app.use("/api/stripe", stripeRotes);

// Server Setup
const PORT = process.env.PORT || 5056;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;