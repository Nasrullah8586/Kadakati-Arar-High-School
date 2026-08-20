const express = require("express");

const {
    createNewsEvent,
    getAllNewsEvents,
    getNewsEventById,
    getAllNewsEventsForAdmin,
    updateNewsEvent,
    deleteNewsEvent
} = require("../controllers/newsEventController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();


// ======================================================
// PUBLIC → GET ALL PUBLISHED NEWS / EVENTS
// ======================================================

router.get(
    "/",
    getAllNewsEvents
);


// ======================================================
// ADMIN / SUPER ADMIN → GET ALL NEWS / EVENTS
// IMPORTANT: MUST COME BEFORE /:id
// ======================================================

router.get(
    "/admin/all",
    auth,
    getAllNewsEventsForAdmin
);


// ======================================================
// ADMIN / SUPER ADMIN → CREATE NEWS / EVENT
// ======================================================

router.post(
    "/",
    auth,
    upload.single("image"),
    createNewsEvent
);


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE NEWS / EVENT
// ======================================================

router.put(
    "/:id",
    auth,
    upload.single("image"),
    updateNewsEvent
);


// ======================================================
// ADMIN / SUPER ADMIN → DELETE NEWS / EVENT
// ======================================================

router.delete(
    "/:id",
    auth,
    deleteNewsEvent
);


// ======================================================
// PUBLIC → GET SINGLE NEWS / EVENT
// IMPORTANT: KEEP /:id AFTER /admin/all
// ======================================================

router.get(
    "/:id",
    getNewsEventById
);


module.exports = router;