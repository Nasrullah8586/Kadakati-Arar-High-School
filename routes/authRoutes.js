const express = require("express");

const {
    loginAdmin,
    registerAdmin,
    verifyAdminEmail,
    forgotAdminPassword,
    resetAdminPassword,
    getAllAdmins,
    getAdminById,
    deleteAdmin,
    getMyAdminProfile
} = require("../controllers/authController");

const protect =
    require("../middleware/auth");

const router =
    express.Router();


// ======================================================
// ADMIN LOGIN
// ======================================================

router.post(
    "/login",
    loginAdmin
);


// ======================================================
// FORGOT PASSWORD
// ======================================================

router.post(
    "/forgot-password",
    forgotAdminPassword
);


// ======================================================
// RESET PASSWORD
// ======================================================

router.post(
    "/reset-password",
    resetAdminPassword
);


// ======================================================
// VERIFY ADMIN EMAIL
// ======================================================

router.post(
    "/verify-email",
    verifyAdminEmail
);


// ======================================================
// SUPER ADMIN → REGISTER NORMAL ADMIN
// ======================================================

router.post(
    "/register",
    protect,
    registerAdmin
);


// ======================================================
// SUPER ADMIN → GET ALL NORMAL ADMINS
// ======================================================

router.get(
    "/admins",
    protect,
    getAllAdmins
);


// ======================================================
// SUPER ADMIN → GET SINGLE NORMAL ADMIN
// ======================================================

router.get(
    "/admins/:id",
    protect,
    getAdminById
);


// ======================================================
// SUPER ADMIN → DELETE NORMAL ADMIN
// ======================================================

router.delete(
    "/admins/:id",
    protect,
    deleteAdmin
);


// ======================================================
// GET CURRENT ADMIN PROFILE
// ======================================================

router.get(
    "/me",
    protect,
    getMyAdminProfile
);


module.exports = router;