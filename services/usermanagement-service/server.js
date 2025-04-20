require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");

const { protect, adminOnly } = require("./src/middleware/authMiddleware");
const { initializeSocket } = require("./src/utils/socket");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

connectDB();

app.use((req, res, next) => {
    console.log(`📥 Received ${req.method} request to ${req.url}`);
    next();
});

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
