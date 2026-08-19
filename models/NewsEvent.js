const mongoose = require("mongoose");

const newsEventSchema = new mongoose.Schema(
    {
        // ==========================================
        // TITLE
        // ==========================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // DESCRIPTION
        // ==========================================

        description: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // TYPE
        // ==========================================

        type: {
            type: String,
            enum: ["News", "Event"],
            required: true
        },

        // ==========================================
        // DATE
        // ==========================================

        date: {
            type: Date,
            required: true
        },

        // ==========================================
        // CLOUDINARY IMAGE URL
        // ==========================================

        imageUrl: {
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
        // ==========================================

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null
        },

        createdByType: {
            type: String,
            enum: ["Admin", "SuperAdmin"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const NewsEvent = mongoose.model(
    "NewsEvent",
    newsEventSchema
);

module.exports = NewsEvent;