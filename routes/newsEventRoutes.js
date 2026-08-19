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
// PUBLIC → GET SINGLE NEWS / EVENT
// ======================================================

router.get(
    "/:id",
    getNewsEventById
);


// ======================================================
// ADMIN / SUPER ADMIN → GET ALL NEWS / EVENTS
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


module.exports = router;