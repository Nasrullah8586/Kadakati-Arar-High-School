const express = require("express");

const {
    createHistory,
    getAllHistory,
    getHistoryById,
    getAllHistoryForAdmin,
    updateHistory,
    deleteHistory
} = require("../controllers/historyController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();


// ======================================================
// PUBLIC → GET ALL PUBLISHED HISTORY
// ======================================================

router.get(
    "/",
    getAllHistory
);


// ======================================================
// ADMIN / SUPER ADMIN → GET ALL HISTORY
// IMPORTANT: MUST COME BEFORE /:id
// ======================================================

router.get(
    "/admin/all",
    auth,
    getAllHistoryForAdmin
);


// ======================================================
// ADMIN / SUPER ADMIN → CREATE HISTORY
// ======================================================

router.post(
    "/",
    auth,
    upload.single("image"),
    createHistory
);


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE HISTORY
// ======================================================

router.put(
    "/:id",
    auth,
    upload.single("image"),
    updateHistory
);


// ======================================================
// ADMIN / SUPER ADMIN → DELETE HISTORY
// ======================================================

router.delete(
    "/:id",
    auth,
    deleteHistory
);


// ======================================================
// PUBLIC → GET SINGLE HISTORY
// IMPORTANT: KEEP /:id AFTER /admin/all
// ======================================================

router.get(
    "/:id",
    getHistoryById
);


module.exports = router;