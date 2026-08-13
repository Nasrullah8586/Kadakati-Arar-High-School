const express = require("express");

const { loginAdmin } = require("../controllers/authController");
const protect = require("../middleware/auth");

const router = express.Router();

// Admin Login
router.post("/login", loginAdmin);

// Protected Admin Test Route
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin authentication successful",
        admin: req.admin
    });
});

module.exports = router;