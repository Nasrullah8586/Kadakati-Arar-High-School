const Gallery = require("../models/Gallery");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Create Gallery Image
const createGallery = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const {
            title,
            description,
            isPublished
        } = req.body;

        const uploadResult = await uploadToCloudinary(
            req.file.buffer,
            "kadakati-school/gallery"
        );

        const gallery = await Gallery.create({
            title: title || "",
            description: description || "",
            imageUrl: uploadResult.secure_url,
            isPublished:
                isPublished === undefined
                    ? true
                    : isPublished === "true" || isPublished === true,
            createdBy:
                req.admin.isSuperAdmin === true
                    ? null
                    : req.admin.id,
            createdByType:
                req.admin.isSuperAdmin === true
                    ? "SuperAdmin"
                    : "Admin"
        });

        res.status(201).json({
            success: true,
            message: "Gallery image created successfully",
            gallery
        });
    } catch (error) {
        console.error("Create Gallery Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create gallery image",
            error: error.message
        });
    }
};


// Get All Published Gallery Images
const getAllGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find({
            isPublished: true
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gallery.length,
            gallery
        });
    } catch (error) {
        console.error("Get Gallery Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get gallery images",
            error: error.message
        });
    }
};


// Get Single Published Gallery Image
const getGalleryById = async (req, res) => {
    try {
        const gallery = await Gallery.findOne({
            _id: req.params.id,
            isPublished: true
        });

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found"
            });
        }

        res.status(200).json({
            success: true,
            gallery
        });
    } catch (error) {
        console.error("Get Gallery By ID Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gallery image ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to get gallery image",
            error: error.message
        });
    }
};

// Get All Gallery Images For Admin
const getAllGalleryForAdmin = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const gallery = await Gallery.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: gallery.length,
            gallery
        });
    } catch (error) {
        console.error("Get Admin Gallery Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get gallery images",
            error: error.message
        });
    }
};


// Update Gallery Image
const updateGallery = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found"
            });
        }

        const {
            title,
            description,
            isPublished
        } = req.body;

        if (title !== undefined) {
            gallery.title = title;
        }

        if (description !== undefined) {
            gallery.description = description;
        }

        if (isPublished !== undefined) {
            gallery.isPublished =
                isPublished === "true" || isPublished === true;
        }

        // If a new image is uploaded
        if (req.file) {
            const uploadResult = await uploadToCloudinary(
                req.file.buffer,
                "kadakati-school/gallery"
            );

            gallery.imageUrl = uploadResult.secure_url;
        }

        await gallery.save();

        res.status(200).json({
            success: true,
            message: "Gallery image updated successfully",
            gallery
        });
    } catch (error) {
        console.error("Update Gallery Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update gallery image",
            error: error.message
        });
    }
};


// Delete Gallery Image
const deleteGallery = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found"
            });
        }

        await Gallery.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Gallery image deleted successfully"
        });
    } catch (error) {
        console.error("Delete Gallery Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete gallery image",
            error: error.message
        });
    }
};


module.exports = {
    createGallery,
    getAllGallery,
    getGalleryById,
    getAllGalleryForAdmin,
    updateGallery,
    deleteGallery
};