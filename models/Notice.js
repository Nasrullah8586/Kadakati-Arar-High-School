const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        // ==========================================
        // NOTICE BASIC INFORMATION
        // ==========================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // NOTICE CATEGORY
        // ==========================================

        category: {
            type: String,
            enum: [
                "Academic",
                "Exam",
                "Admission",
                "Event",
                "Holiday",
                "General"
            ],
            default: "General"
        },

        // ==========================================
        // NOTICE DATE
        // ==========================================

        noticeDate: {
            type: Date,
            default: Date.now
        },

        // ==========================================
        // OPTIONAL IMAGE / PDF
        // ==========================================

        attachment: {
            type: String,
            default: ""
        },

        // ==========================================
        // PUBLISH STATUS
        // ==========================================

        isPublished: {
            type: Boolean,
            default: true
        },

        // ==========================================
        // CREATED BY
        // Normal Admin → MongoDB ObjectId
        // Super Admin → null
        // ==========================================

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null
        },

        // ==========================================
        // CREATOR TYPE
        // ==========================================

        createdByType: {
            type: String,
            enum: ["Admin", "SuperAdmin"],
            default: "Admin"
        }
    },
    {
        timestamps: true
    }
);

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;