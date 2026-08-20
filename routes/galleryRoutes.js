const express = require("express");

const {
    createGallery,
    getAllGallery,
    getGalleryById,
    getAllGalleryForAdmin,
    updateGallery,
    deleteGallery
} = require("../controllers/galleryController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();


// ======================================================
// PUBLIC → GET ALL PUBLISHED GALLERY IMAGES
// ======================================================

router.get(
    "/",
    getAllGallery
);


// ======================================================
// ADMIN / SUPER ADMIN → GET ALL GALLERY IMAGES
// IMPORTANT: MUST COME BEFORE /:id
// ======================================================

router.get(
    "/admin/all",
    auth,
    getAllGalleryForAdmin
);


// ======================================================
// ADMIN / SUPER ADMIN → CREATE GALLERY IMAGE
// ======================================================

router.post(
    "/",
    auth,
    upload.single("image"),
    createGallery
);


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE GALLERY IMAGE
// ======================================================

router.put(
    "/:id",
    auth,
    upload.single("image"),
    updateGallery
);


// ======================================================
// ADMIN / SUPER ADMIN → DELETE GALLERY IMAGE
// ======================================================

router.delete(
    "/:id",
    auth,
    deleteGallery
);


// ======================================================
// PUBLIC → GET SINGLE GALLERY IMAGE
// IMPORTANT: KEEP /:id AFTER /admin/all
// ======================================================

router.get(
    "/:id",
    getGalleryById
);


module.exports = router;