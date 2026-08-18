const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        // ==============================
        // TEACHER BASIC INFORMATION
        // ==============================
        name: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
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

        // ==============================
        // PROFILE INFORMATION
        // ==============================
        photo: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        about: {
            type: String,
            default: ""
        },

        division: {
            type: String,
            enum: ["Science", "Arts", "Commerce"],
            required: true
        },

        department: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            default: ""
        },

        socialLinks: {
            facebook: {
                type: String,
                default: ""
            },

            linkedin: {
                type: String,
                default: ""
            },

            instagram: {
                type: String,
                default: ""
            }
        },

        // ==============================
        // EMAIL VERIFICATION
        // ==============================
        // Teacher must verify email
        // before being allowed to login.
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

        // ==============================
        // PASSWORD RESET
        // ==============================
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

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;