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

// Public - Get all published gallery images
router.get(
    "/",
    getAllGallery
);

// Public - Get single published gallery image
router.get(
    "/:id",
    getGalleryById
);

// Admin/Super Admin - Get all gallery images
router.get(
    "/admin/all",
    auth,
    getAllGalleryForAdmin
);

// Admin/Super Admin - Create gallery image
router.post(
    "/",
    auth,
    upload.single("image"),
    createGallery
);

// Admin/Super Admin - Update gallery image
router.put(
    "/:id",
    auth,
    upload.single("image"),
    updateGallery
);

// Admin/Super Admin - Delete gallery image
router.delete(
    "/:id",
    auth,
    deleteGallery
);

module.exports = router;