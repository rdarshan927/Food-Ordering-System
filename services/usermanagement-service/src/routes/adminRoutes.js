const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllUsers, createUser, updateUser, deleteUser, getAllTransactions, getReport, addCategory, updateCategory, deleteCategory } = require("../controllers/adminController");

const router = express.Router();

router.get("/getall", protect, adminOnly, getAllUsers);
router.post("/createuser", protect, adminOnly, createUser);
router.put("/update/:id", protect, adminOnly, updateUser);
router.delete("/delete/:id", protect, adminOnly, deleteUser);

module.exports = router;