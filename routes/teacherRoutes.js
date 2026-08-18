const express = require("express");

const {
    loginTeacher,
    registerTeacher,
    verifyTeacherEmail,
    forgotTeacherPassword,
    resetTeacherPassword,
    getAllTeachers,
    getTeacherById,
    getMyProfile,
    updateMyProfile,
    adminUpdateTeacher
} = require("../controllers/teacherController");

const teacherAuth = require("../middleware/teacherAuth");
const auth = require("../middleware/auth");

const router = express.Router();


// ======================================================
// TEACHER LOGIN
// ======================================================

router.post("/login", loginTeacher);


// ======================================================
// ADMIN → REGISTER TEACHER
// ======================================================

router.post(
    "/register",
    auth,
    registerTeacher
);


// ======================================================
// VERIFY TEACHER EMAIL
// ======================================================

router.post(
    "/verify-email",
    verifyTeacherEmail
);


// ======================================================
// TEACHER FORGOT PASSWORD
// ======================================================

router.post(
    "/forgot-password",
    forgotTeacherPassword
);


// ======================================================
// TEACHER RESET PASSWORD
// ======================================================

router.post(
    "/reset-password",
    resetTeacherPassword
);


// ======================================================
// TEACHER OWN PROFILE
// ======================================================

router.get(
    "/me",
    teacherAuth,
    getMyProfile
);

router.put(
    "/me",
    teacherAuth,
    updateMyProfile
);


// ======================================================
// PUBLIC → GET ALL VERIFIED TEACHERS
// ======================================================

router.get(
    "/",
    getAllTeachers
);


// ======================================================
// ADMIN → UPDATE ANY TEACHER
// ======================================================

router.put(
    "/:id",
    auth,
    adminUpdateTeacher
);


// ======================================================
// PUBLIC → GET SINGLE VERIFIED TEACHER
// ======================================================

router.get(
    "/:id",
    getTeacherById
);


module.exports = router;