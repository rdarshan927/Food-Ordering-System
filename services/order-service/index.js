    const express = require("express");
    const dotenv = require("dotenv");
    const cors = require("cors");
    const connectDB = require("./config/db.js");
    const orderRoutes = require("./routes/ordersRoutes.js");
    const mongoose = require("mongoose");
   
    dotenv.config();
    const app = express();
    app.use(cors());
    app.use(express.json());

    connectDB();

    // Routes
    app.use("/api/orders", orderRoutes);
    app.use("/api/cart", orderRoutes);
   
    

    app.get("/", (req, res) => res.send("API is running..."));


    const PORT = process.env.PORT || 5051;
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    module.exports = server;
