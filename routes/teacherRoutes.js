const express = require("express");

const {
    loginTeacher,
    registerTeacher,
    verifyTeacherEmail,
    forgotTeacherPassword,
    resetTeacherPassword,
    getAllTeachers,
    getAllTeachersForAdmin,
    getTeacherById,
    getMyProfile,
    updateMyProfile,
    adminUpdateTeacher,
    deleteTeacher
} = require("../controllers/teacherController");

const teacherAuth = require("../middleware/teacherAuth");
const auth = require("../middleware/auth");

const router = express.Router();


// ======================================================
// TEACHER LOGIN
// ======================================================

router.post(
    "/login",
    loginTeacher
);


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
// TEACHER → OWN PROFILE
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
// ADMIN / SUPER ADMIN → GET ALL TEACHERS
// IMPORTANT: MUST COME BEFORE /:id
// ======================================================

router.get(
    "/admin/all",
    auth,
    getAllTeachersForAdmin
);


// ======================================================
// ADMIN / SUPER ADMIN → DELETE TEACHER
// ======================================================

router.delete(
    "/:id",
    auth,
    deleteTeacher
);


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE ANY TEACHER
// ======================================================

router.put(
    "/:id",
    auth,
    adminUpdateTeacher
);


// ======================================================
// PUBLIC → GET ALL VERIFIED TEACHERS
// ======================================================

router.get(
    "/",
    getAllTeachers
);


// ======================================================
// PUBLIC → GET SINGLE VERIFIED TEACHER
// IMPORTANT: KEEP /:id AFTER /admin/all
// ======================================================

router.get(
    "/:id",
    getTeacherById
);


module.exports = router;