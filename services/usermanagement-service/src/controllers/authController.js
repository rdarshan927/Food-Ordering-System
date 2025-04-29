const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { publishDriverRegistered } = require('../utils/publisher');

const registerUser = async (req, res) => {
    try {
        const { username, name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("came here", req.body, hashedPassword);

        try {
            user = await User.create({ 
                username, 
                name,
                email, 
                password: hashedPassword, 
                role: role || "USER" 
            });
            res.status(201).json({ message: "User registered successfully" });

            if (role === "DRIVER") {
               await publishDriverRegistered({ driverId: user._id.toString(), name, email });
            }
        } catch (err) {
            console.error("Error creating user:", err.errors || err);
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { registerUser, loginUser };
