const Notice = require("../models/Notice");


// ======================================================
// HELPER → CHECK ADMIN ACCESS
// Both Normal Admin and Super Admin are allowed
// ======================================================

const checkAdminAccess = (req, res) => {
    if (!req.admin || req.admin.role !== "admin") {
        res.status(403).json({
            success: false,
            message: "Admin access required"
        });

        return false;
    }

    return true;
};


// ======================================================
// ADMIN / SUPER ADMIN → CREATE NOTICE
// ======================================================

const createNotice = async (req, res) => {
    try {

        // ----------------------------------------------
        // Admin access check
        // ----------------------------------------------

        if (!checkAdminAccess(req, res)) {
            return;
        }

        const {
            title,
            description,
            category,
            noticeDate,
            attachment,
            isPublished
        } = req.body;

        // ----------------------------------------------
        // Required fields
        // ----------------------------------------------

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        // ----------------------------------------------
        // Determine creator
        // ----------------------------------------------

        const isSuperAdmin = req.admin.isSuperAdmin === true;

        const noticeData = {
            title: title.trim(),
            description: description.trim(),
            category: category || "General",
            noticeDate: noticeDate || Date.now(),
            attachment: attachment || "",
            isPublished:
                isPublished !== undefined
                    ? isPublished
                    : true,

            createdByType: isSuperAdmin
                ? "SuperAdmin"
                : "Admin"
        };

        // Normal Admin has MongoDB ObjectId
        if (!isSuperAdmin) {
            noticeData.createdBy = req.admin.id;
        }

        // ----------------------------------------------
        // Create Notice
        // ----------------------------------------------

        const notice = await Notice.create(noticeData);

        return res.status(201).json({
            success: true,
            message: "Notice created successfully",
            notice
        });

    } catch (error) {

        console.error(
            "Create Notice Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// PUBLIC → GET ALL PUBLISHED NOTICES
// ======================================================

const getAllNotices = async (req, res) => {
    try {

        const notices = await Notice.find({
            isPublished: true
        })
            .populate(
                "createdBy",
                "name email"
            )
            .sort({
                noticeDate: -1
            });

        return res.status(200).json({
            success: true,
            count: notices.length,
            notices
        });

    } catch (error) {

        console.error(
            "Get All Notices Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// PUBLIC → GET SINGLE NOTICE
// ======================================================

const getNoticeById = async (req, res) => {
    try {

        const { id } = req.params;

        const notice = await Notice.findOne({
            _id: id,
            isPublished: true
        })
            .populate(
                "createdBy",
                "name email"
            );

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        return res.status(200).json({
            success: true,
            notice
        });

    } catch (error) {

        console.error(
            "Get Notice By ID Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// ADMIN / SUPER ADMIN → GET ALL NOTICES
// ======================================================

const getAllNoticesForAdmin = async (req, res) => {
    try {

        // ----------------------------------------------
        // Admin access check
        // ----------------------------------------------

        if (!checkAdminAccess(req, res)) {
            return;
        }

        const notices = await Notice.find()
            .populate(
                "createdBy",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: notices.length,
            notices
        });

    } catch (error) {

        console.error(
            "Get Admin Notices Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE NOTICE
// ======================================================

const updateNotice = async (req, res) => {
    try {

        // ----------------------------------------------
        // Admin access check
        // ----------------------------------------------

        if (!checkAdminAccess(req, res)) {
            return;
        }

        const { id } = req.params;

        const {
            title,
            description,
            category,
            noticeDate,
            attachment,
            isPublished
        } = req.body;

        // ----------------------------------------------
        // Find notice
        // ----------------------------------------------

        const notice = await Notice.findById(id);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        // ----------------------------------------------
        // Update fields
        // ----------------------------------------------

        if (title !== undefined) {
            notice.title = title.trim();
        }

        if (description !== undefined) {
            notice.description = description.trim();
        }

        if (category !== undefined) {
            notice.category = category;
        }

        if (noticeDate !== undefined) {
            notice.noticeDate = noticeDate;
        }

        if (attachment !== undefined) {
            notice.attachment = attachment;
        }

        if (isPublished !== undefined) {
            notice.isPublished = isPublished;
        }

        // ----------------------------------------------
        // Save
        // ----------------------------------------------

        await notice.save();

        return res.status(200).json({
            success: true,
            message: "Notice updated successfully",
            notice
        });

    } catch (error) {

        console.error(
            "Update Notice Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// ADMIN / SUPER ADMIN → DELETE NOTICE
// ======================================================

const deleteNotice = async (req, res) => {
    try {

        // ----------------------------------------------
        // Admin access check
        // ----------------------------------------------

        if (!checkAdminAccess(req, res)) {
            return;
        }

        const { id } = req.params;

        // ----------------------------------------------
        // Find notice
        // ----------------------------------------------

        const notice = await Notice.findById(id);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        // ----------------------------------------------
        // Delete notice
        // ----------------------------------------------

        await Notice.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Notice deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Notice Error:",
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
    createNotice,
    getAllNotices,
    getNoticeById,
    getAllNoticesForAdmin,
    updateNotice,
    deleteNotice
};