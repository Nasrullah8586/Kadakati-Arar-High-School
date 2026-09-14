const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
    {
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

        year: {
            type: String,
            trim: true,
            default: ""
        },

        imageUrl: {
            type: String,
            default: ""
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