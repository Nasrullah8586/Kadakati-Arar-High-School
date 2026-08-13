const express = require("express");

const {
    loginTeacher,
    getMyProfile,
    updateMyProfile,
    adminUpdateTeacher
} = require("../controllers/teacherController");

const teacherAuth = require("../middleware/teacherAuth");
const auth = require("../middleware/auth");

const router = express.Router();

// ==========================================
// Teacher Login
// ==========================================
router.post("/login", loginTeacher);

// ==========================================
// Teacher Own Profile
// ==========================================
router.get("/me", teacherAuth, getMyProfile);

router.put("/me", teacherAuth, updateMyProfile);

// ==========================================
// Admin Update Any Teacher
// ==========================================
router.put("/:id", auth, adminUpdateTeacher);

module.exports = router;