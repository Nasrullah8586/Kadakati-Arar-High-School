const express = require("express");

const {
    createNotice,
    getAllNotices,
    getNoticeById,
    getAllNoticesForAdmin,
    updateNotice,
    deleteNotice
} = require("../controllers/noticeController");

const auth = require("../middleware/auth");

const router = express.Router();


// ======================================================
// PUBLIC → GET ALL PUBLISHED NOTICES
// ======================================================

router.get(
    "/",
    getAllNotices
);


// ======================================================
// ADMIN → GET ALL NOTICES
// IMPORTANT: Must come before /:id
// ======================================================

router.get(
    "/admin/all",
    auth,
    getAllNoticesForAdmin
);


// ======================================================
// ADMIN → CREATE NOTICE
// ======================================================

router.post(
    "/",
    auth,
    createNotice
);


// ======================================================
// ADMIN → UPDATE NOTICE
// ======================================================

router.put(
    "/:id",
    auth,
    updateNotice
);


// ======================================================
// ADMIN → DELETE NOTICE
// ======================================================

router.delete(
    "/:id",
    auth,
    deleteNotice
);


// ======================================================
// PUBLIC → GET SINGLE NOTICE
// IMPORTANT: Keep /:id after /admin/all
// ======================================================

router.get(
    "/:id",
    getNoticeById
);


module.exports = router;