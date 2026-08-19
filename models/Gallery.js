const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            default: ""
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        imageUrl: {
            type: String,
            required: true
        },

        isPublished: {
            type: Boolean,
            default: true
        },

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

module.exports = mongoose.model("Gallery", gallerySchema);