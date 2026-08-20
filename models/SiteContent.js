const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
    {
        // ==========================================
        // SCHOOL BASIC INFORMATION
        // ==========================================

        schoolName: {
            type: String,
            trim: true,
            default: "Kadakati Arar High School"
        },

        schoolNameBangla: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // HERO SECTION
        // ==========================================

        heroTitle: {
            type: String,
            trim: true,
            default: ""
        },

        heroSubtitle: {
            type: String,
            trim: true,
            default: ""
        },

        heroImage: {
            type: String,
            default: ""
        },

        // ==========================================
        // ABOUT SECTION
        // ==========================================

        aboutTitle: {
            type: String,
            trim: true,
            default: "About Our School"
        },

        aboutDescription: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // HISTORY
        // ==========================================

        historyTitle: {
            type: String,
            trim: true,
            default: "Our History"
        },

        historyDescription: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // MISSION & VISION
        // ==========================================

        mission: {
            type: String,
            trim: true,
            default: ""
        },

        vision: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // CONTACT INFORMATION
        // ==========================================

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },

        address: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // LOCATION
        // ==========================================

        googleMapUrl: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // SOCIAL MEDIA
        // ==========================================

        socialLinks: {
            facebook: {
                type: String,
                trim: true,
                default: ""
            },

            youtube: {
                type: String,
                trim: true,
                default: ""
            },

            instagram: {
                type: String,
                trim: true,
                default: ""
            }
        },

        // ==========================================
        // LAST UPDATED BY
        // ==========================================

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null
        },

        updatedByType: {
            type: String,
            enum: ["Admin", "SuperAdmin"],
            default: null
        }
    },
    {
        timestamps: true
    }
);

const SiteContent = mongoose.model(
    "SiteContent",
    siteContentSchema
);

module.exports = SiteContent;