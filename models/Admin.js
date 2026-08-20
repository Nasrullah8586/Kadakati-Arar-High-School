const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        // ======================================================
        // ADMIN BASIC INFORMATION
        // ======================================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: function () {
                return this.isSuperAdmin !== true;
            },
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },


        // ======================================================
        // ROLE / PERMISSION
        // ======================================================

        isSuperAdmin: {
            type: Boolean,
            default: false
        },


        // ======================================================
        // EMAIL VERIFICATION
        // ======================================================

        isVerified: {
            type: Boolean,
            default: false
        },

        verificationCodeHash: {
            type: String,
            default: null
        },

        verificationCodeExpires: {
            type: Date,
            default: null
        },


        // ======================================================
        // PASSWORD RESET
        // ======================================================

        resetCodeHash: {
            type: String,
            default: null
        },

        resetCodeExpires: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
);


const Admin = mongoose.model(
    "Admin",
    adminSchema
);


module.exports = Admin;