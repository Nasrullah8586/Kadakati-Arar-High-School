const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
    {
        // ==========================================
        // SCHOOL BASIC INFORMATION
        // ==========================================

        schoolName: {
            type: String,
            required: true,
            trim: true
        },

        shortDescription: {
            type: String,
            default: "",
            trim: true
        },

        // ==========================================
        // ABOUT & HISTORY
        // ==========================================

        about: {
            type: String,
            default: ""
        },

        history: {
            type: String,
            default: ""
        },

        // ==========================================
        // HERO SECTION
        // ==========================================

        heroImageUrl: {
            type: String,
            default: ""
        },

        // ==========================================
        // LOCATION
        // ==========================================

        address: {
            type: String,
            default: "",
            trim: true
        },

        googleMapsLink: {
            type: String,
            default: "",
            trim: true
        },

        // ==========================================
        // CONTACT INFORMATION
        // ==========================================

        phone: {
            type: String,
            default: "",
            trim: true
        },

        email: {
            type: String,
            default: "",
            lowercase: true,
            trim: true
        },

        // ==========================================
        // SOCIAL MEDIA
        // ==========================================

        socialLinks: {
            facebook: {
                type: String,
                default: "",
                trim: true
            },

            instagram: {
                type: String,
                default: "",
                trim: true
            },

            linkedin: {
                type: String,
                default: "",
                trim: true
            }
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