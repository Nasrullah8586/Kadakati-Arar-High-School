const NewsEvent = require("../models/NewsEvent");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// ======================================================
// ADMIN / SUPER ADMIN → CREATE NEWS OR EVENT
// ======================================================

const createNewsEvent = async (req, res) => {
    try {
        // ------------------------------------------------
        // Admin authentication check
        // ------------------------------------------------

        if (!req.admin || req.admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const {
            title,
            description,
            type,
            date,
            isPublished
        } = req.body;

        // ------------------------------------------------
        // Required fields
        // ------------------------------------------------

        if (!title || !description || !type || !date) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, description, type and date are required"
            });
        }

        // ------------------------------------------------
        // Validate type
        // ------------------------------------------------

        if (!["News", "Event"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be either News or Event"
            });
        }

        // ------------------------------------------------
        // Upload image if provided
        // ------------------------------------------------

        let imageUrl = "";

        if (req.file) {
            const uploadResult =
                await uploadToCloudinary(
                    req.file.buffer,
                    "kadakati-school/news-events"
                );

            imageUrl = uploadResult.secure_url;
        }

        // ------------------------------------------------
        // Determine creator type
        // ------------------------------------------------

        const createdByType =
            req.admin.isSuperAdmin === true
                ? "SuperAdmin"
                : "Admin";

        // ------------------------------------------------
        // Create News/Event
        // ------------------------------------------------

        const newsEvent = await NewsEvent.create({
            title: title.trim(),
            description: description.trim(),
            type,
            date,
            imageUrl,
            isPublished:
                isPublished !== undefined
                    ? isPublished
                    : true,
            createdBy:
                req.admin.isSuperAdmin === true
                    ? null
                    : req.admin.id,
            createdByType
        });

        return res.status(201).json({
            success: true,
            message:
                `${type} created successfully`,
            newsEvent
        });

    } catch (error) {
        console.error(
            "Create News/Event Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// PUBLIC → GET ALL PUBLISHED NEWS / EVENTS
// ======================================================

const getAllNewsEvents = async (req, res) => {
    try {
        const newsEvents = await NewsEvent.find({
            isPublished: true
        }).sort({
            date: -1
        });

        return res.status(200).json({
            success: true,
            count: newsEvents.length,
            newsEvents
        });

    } catch (error) {
        console.error(
            "Get All News/Event Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// PUBLIC → GET SINGLE NEWS / EVENT
// ======================================================

const getNewsEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const newsEvent = await NewsEvent.findOne({
            _id: id,
            isPublished: true
        });

        if (!newsEvent) {
            return res.status(404).json({
                success: false,
                message: "News/Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            newsEvent
        });

    } catch (error) {
        console.error(
            "Get News/Event By ID Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// ADMIN / SUPER ADMIN → GET ALL NEWS / EVENTS
// ======================================================

const getAllNewsEventsForAdmin = async (req, res) => {
    try {
        if (!req.admin || req.admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const newsEvents = await NewsEvent.find()
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: newsEvents.length,
            newsEvents
        });

    } catch (error) {
        console.error(
            "Get Admin News/Event Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE NEWS / EVENT
// ======================================================

const updateNewsEvent = async (req, res) => {
    try {
        if (!req.admin || req.admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { id } = req.params;

        const {
            title,
            description,
            type,
            date,
            isPublished
        } = req.body;

        const newsEvent =
            await NewsEvent.findById(id);

        if (!newsEvent) {
            return res.status(404).json({
                success: false,
                message: "News/Event not found"
            });
        }

        // ------------------------------------------------
        // Update text fields
        // ------------------------------------------------

        if (title !== undefined) {
            newsEvent.title = title.trim();
        }

        if (description !== undefined) {
            newsEvent.description =
                description.trim();
        }

        if (type !== undefined) {
            if (!["News", "Event"].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Type must be either News or Event"
                });
            }

            newsEvent.type = type;
        }

        if (date !== undefined) {
            newsEvent.date = date;
        }

        if (isPublished !== undefined) {
            newsEvent.isPublished =
                isPublished;
        }

        // ------------------------------------------------
        // Replace image if new image uploaded
        // ------------------------------------------------

        if (req.file) {
            const uploadResult =
                await uploadToCloudinary(
                    req.file.buffer,
                    "kadakati-school/news-events"
                );

            newsEvent.imageUrl =
                uploadResult.secure_url;
        }

        await newsEvent.save();

        return res.status(200).json({
            success: true,
            message:
                "News/Event updated successfully",
            newsEvent
        });

    } catch (error) {
        console.error(
            "Update News/Event Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// ADMIN / SUPER ADMIN → DELETE NEWS / EVENT
// ======================================================

const deleteNewsEvent = async (req, res) => {
    try {
        if (!req.admin || req.admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { id } = req.params;

        const newsEvent =
            await NewsEvent.findById(id);

        if (!newsEvent) {
            return res.status(404).json({
                success: false,
                message: "News/Event not found"
            });
        }

        await NewsEvent.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message:
                "News/Event deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete News/Event Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    createNewsEvent,
    getAllNewsEvents,
    getNewsEventById,
    getAllNewsEventsForAdmin,
    updateNewsEvent,
    deleteNewsEvent
};