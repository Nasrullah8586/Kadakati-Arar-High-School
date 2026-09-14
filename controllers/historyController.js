const History = require("../models/historyModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// ======================================================
// CREATE HISTORY
// ======================================================

const createHistory = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const {
            title,
            description,
            year,
            isPublished
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }

        let imageUrl = "";

        if (req.file) {
            const uploadResult =
                await uploadToCloudinary(
                    req.file.buffer,
                    "kadakati-school/history"
                );

            imageUrl = uploadResult.secure_url;
        }

        const history = await History.create({
            title: title.trim(),

            description:
                description.trim(),

            year:
                year
                    ? year.trim()
                    : "",

            imageUrl,

            isPublished:
                isPublished === undefined
                    ? true
                    : isPublished === "true" ||
                      isPublished === true,

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
            message: "History created successfully",
            history
        });

    } catch (error) {

        console.error(
            "Create History Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create history",
            error: error.message
        });
    }
};


// ======================================================
// GET ALL PUBLISHED HISTORY
// ======================================================

const getAllHistory = async (req, res) => {
    try {

        const history =
            await History.find({
                isPublished: true
            }).sort({
                year: 1,
                createdAt: 1
            });

        res.status(200).json({
            success: true,
            count: history.length,
            history
        });

    } catch (error) {

        console.error(
            "Get History Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get history",
            error: error.message
        });
    }
};


// ======================================================
// GET SINGLE PUBLISHED HISTORY
// ======================================================

const getHistoryById = async (req, res) => {
    try {

        const history =
            await History.findOne({
                _id: req.params.id,
                isPublished: true
            });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: "History not found"
            });
        }

        res.status(200).json({
            success: true,
            history
        });

    } catch (error) {

        console.error(
            "Get History By ID Error:",
            error
        );

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid history ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to get history",
            error: error.message
        });
    }
};


// ======================================================
// GET ALL HISTORY FOR ADMIN
// ======================================================

const getAllHistoryForAdmin = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const history =
            await History.find().sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: history.length,
            history
        });

    } catch (error) {

        console.error(
            "Get Admin History Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get history",
            error: error.message
        });
    }
};


// ======================================================
// UPDATE HISTORY
// ======================================================

const updateHistory = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const history =
            await History.findById(
                req.params.id
            );

        if (!history) {
            return res.status(404).json({
                success: false,
                message: "History not found"
            });
        }

        const {
            title,
            description,
            year,
            isPublished
        } = req.body;


        if (title !== undefined) {

            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty"
                });
            }

            history.title =
                title.trim();
        }


        if (description !== undefined) {

            if (!description.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Description cannot be empty"
                });
            }

            history.description =
                description.trim();
        }


        if (year !== undefined) {

            history.year =
                year.trim();
        }


        if (isPublished !== undefined) {

            history.isPublished =
                isPublished === "true" ||
                isPublished === true;
        }


        if (req.file) {

            const uploadResult =
                await uploadToCloudinary(
                    req.file.buffer,
                    "kadakati-school/history"
                );

            history.imageUrl =
                uploadResult.secure_url;
        }


        await history.save();


        res.status(200).json({
            success: true,
            message: "History updated successfully",
            history
        });

    } catch (error) {

        console.error(
            "Update History Error:",
            error
        );

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid history ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update history",
            error: error.message
        });
    }
};


// ======================================================
// DELETE HISTORY
// ======================================================

const deleteHistory = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const history =
            await History.findById(
                req.params.id
            );

        if (!history) {
            return res.status(404).json({
                success: false,
                message: "History not found"
            });
        }

        await History.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "History deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete History Error:",
            error
        );

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid history ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to delete history",
            error: error.message
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createHistory,
    getAllHistory,
    getHistoryById,
    getAllHistoryForAdmin,
    updateHistory,
    deleteHistory
};