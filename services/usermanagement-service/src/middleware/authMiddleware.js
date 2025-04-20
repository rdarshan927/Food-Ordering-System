const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    console.log("🔍 protect middleware triggered"); // Debug line

    const token = req.header("Authorization");
    console.log("🛑 Token received:", token); // Debug line

    if (!token) {
        console.log("🚫 No token provided");
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        console.log("✅ Decoded User:", decoded); // Debug line

        req.user = decoded;
        next();
    } catch (error) {
        console.log("❌ Invalid token:", error.message);
        res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware to check if user is an admin
const adminOnly = (req, res, next) => {
    console.log("🔍 adminOnly middleware triggered"); // Debug line
    if (!req.user) {
        console.log("🚫 No user in request");
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("👤 User Role:", req.user.role);
    if (req.user.role !== "ADMIN") {
        console.log("🚫 Access denied for non-admin");
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

module.exports = { protect, adminOnly };
