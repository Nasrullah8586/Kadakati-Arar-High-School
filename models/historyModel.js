const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
    {
        // ==========================================
        // HISTORY TITLE
        // ==========================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // HISTORY DESCRIPTION
        // ==========================================

        description: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // HISTORY DATE / YEAR
        // ==========================================

        date: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // HISTORY IMAGE
        // ==========================================

        imageUrl: {
            type: String,
            default: ""
        },

        // ==========================================
        // PUBLISHED STATUS
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
            default: null
        }
    },
    {
        timestamps: true
    }
);

const History = mongoose.model(
    "History",
    historySchema
);

module.exports = History;