const express = require("express");

const {
    loginAdmin,
    registerAdmin,
    verifyAdminEmail,
    getAllAdmins,
    getAdminById,
    deleteAdmin
} = require("../controllers/authController");

const protect = require("../middleware/auth");

const router = express.Router();


// ======================================================
// ADMIN LOGIN
// ======================================================

router.post("/login", loginAdmin);


// ======================================================
// SUPER ADMIN → REGISTER NORMAL ADMIN
// ======================================================
// Only Super Admin can access this route.

router.post(
    "/register",
    protect,
    registerAdmin
);


// ======================================================
// VERIFY ADMIN EMAIL
// ======================================================
// This route is public because the new Admin
// does not have a login token yet.

router.post(
    "/verify-email",
    verifyAdminEmail
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
// PROTECTED ADMIN TEST ROUTE
// ======================================================

router.get("/me", protect, (req, res) => {

    res.status(200).json({

        success: true,

        message: "Admin authentication successful",

        admin: req.admin

    });

});


module.exports = router;