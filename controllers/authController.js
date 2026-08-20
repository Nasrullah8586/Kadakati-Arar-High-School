const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Admin = require("../models/Admin");
const sendEmail = require("../utils/sendEmail");


// ======================================================
// HELPER → GENERATE 6 DIGIT OTP
// ======================================================

const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};


// ======================================================
// HELPER → HASH OTP
// ======================================================

const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};


// ======================================================
// ADMIN LOGIN
// LOGIN WITH USERNAME OR EMAIL
// ======================================================

const loginAdmin = async (req, res) => {
    try {

        const {
            login,
            username,
            email,
            password
        } = req.body;


        const loginValue =
            login ||
            username ||
            email;


        if (!loginValue || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Username/email and password are required"
            });
        }


        const loginInput =
            loginValue.trim().toLowerCase();


        // ==================================================
        // JWT SECRET CHECK
        // ==================================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing in .env"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Server configuration error"
            });
        }


        // ==================================================
        // SUPER ADMIN LOGIN
        // ==================================================

        const superAdminEmail =
            process.env.SUPER_ADMIN_EMAIL
                ? process.env.SUPER_ADMIN_EMAIL
                    .toLowerCase()
                    .trim()
                : "";


        const superAdminPassword =
            process.env.SUPER_ADMIN_PASSWORD || "";


        if (
            superAdminEmail &&
            superAdminPassword &&
            loginInput === superAdminEmail &&
            password === superAdminPassword
        ) {

            const token = jwt.sign(
                {
                    id: "super-admin",
                    username: "superadmin",
                    email: superAdminEmail,
                    role: "admin",
                    isSuperAdmin: true
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }
            );


            return res.status(200).json({

                success: true,

                message:
                    "Super Admin login successful",

                token,

                admin: {
                    id: "super-admin",
                    name: "Super Admin",
                    username: "superadmin",
                    email: superAdminEmail,
                    role: "admin",
                    isSuperAdmin: true
                }

            });
        }


        // ==================================================
        // NORMAL ADMIN LOGIN
        // ==================================================

        const admin = await Admin.findOne({
            $or: [
                {
                    email: loginInput
                },
                {
                    username: loginInput
                }
            ]
        });


        if (!admin) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username/email or password"
            });
        }


        // ==================================================
        // PASSWORD CHECK
        // ==================================================

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username/email or password"
            });
        }


        // ==================================================
        // EMAIL VERIFICATION
        // ==================================================

        if (admin.isVerified !== true) {

            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email before logging in"
            });
        }


        // ==================================================
        // CREATE JWT
        // ==================================================

        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: "admin",
                isSuperAdmin:
                    admin.isSuperAdmin === true
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }
        );


        return res.status(200).json({

            success: true,

            message:
                "Admin login successful",

            token,

            admin: {
                id: admin._id,
                name: admin.name,
                username: admin.username,
                email: admin.email,
                role: "admin",
                isSuperAdmin:
                    admin.isSuperAdmin === true
            }

        });


    } catch (error) {

        console.error(
            "Admin Login Error:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
};


// ======================================================
// SUPER ADMIN → REGISTER NORMAL ADMIN
// ======================================================

const registerAdmin = async (req, res) => {

    try {

        console.log("🔥 REGISTER ADMIN HIT");
        console.log("🔥 ADMIN BODY:", req.body);
        console.log("🔥 ADMIN USER:", req.admin);


        // ==================================================
        // ONLY SUPER ADMIN
        // ==================================================

        if (
            !req.admin ||
            req.admin.isSuperAdmin !== true
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only Super Admin can register a new Admin"
            });
        }


        // ==================================================
        // GET DATA FROM FRONTEND
        // ==================================================

        const {
            name,
            email,
            password
        } = req.body;


        // ==================================================
        // REQUIRED FIELDS
        // ==================================================

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }


        // ==================================================
        // CLEAN DATA
        // ==================================================

        const adminName =
            name.trim();

        const adminEmail =
            email.trim().toLowerCase();


        // ==================================================
        // NAME CHECK
        // ==================================================

        if (!adminName) {

            return res.status(400).json({
                success: false,
                message:
                    "Name cannot be empty"
            });
        }


        // ==================================================
        // EMAIL CHECK
        // ==================================================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(adminEmail)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid email address"
            });
        }


        // ==================================================
        // PASSWORD CHECK
        // ==================================================

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }


        // ==================================================
        // SUPER ADMIN EMAIL CHECK
        // ==================================================

        const superAdminEmail =
            process.env.SUPER_ADMIN_EMAIL
                ? process.env.SUPER_ADMIN_EMAIL
                    .toLowerCase()
                    .trim()
                : "";


        if (
            adminEmail ===
            superAdminEmail
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Super Admin email cannot be registered as a normal Admin"
            });
        }


        // ==================================================
        // CHECK EXISTING EMAIL
        // ==================================================

        const existingEmail =
            await Admin.findOne({
                email: adminEmail
            });


        if (existingEmail) {

            return res.status(409).json({
                success: false,
                message:
                    "An Admin with this email already exists"
            });
        }


        // ==================================================
        // GENERATE USERNAME FROM EMAIL
        // ==================================================

        let adminUsername =
            adminEmail
                .split("@")[0]
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase();


        if (adminUsername.length < 3) {

            adminUsername =
                "admin" +
                crypto
                    .randomInt(1000, 9999)
                    .toString();
        }


        // ==================================================
        // CHECK USERNAME
        // ==================================================

        let existingUsername =
            await Admin.findOne({
                username: adminUsername
            });


        if (existingUsername) {

            adminUsername =
                adminUsername +
                crypto
                    .randomInt(1000, 9999)
                    .toString();


            existingUsername =
                await Admin.findOne({
                    username: adminUsername
                });


            if (existingUsername) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Could not generate a unique username"
                });
            }
        }


        // ==================================================
        // GENERATE OTP
        // ==================================================

        const otp =
            generateOTP();


        const otpHash =
            hashOTP(otp);


        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        // ==================================================
        // HASH PASSWORD
        // ==================================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        // ==================================================
        // CREATE ADMIN
        // ==================================================

        const admin =
            await Admin.create({

                name:
                    adminName,

                username:
                    adminUsername,

                email:
                    adminEmail,

                password:
                    hashedPassword,

                isSuperAdmin:
                    false,

                isVerified:
                    false,

                verificationCodeHash:
                    otpHash,

                verificationCodeExpires:
                    otpExpires

            });


        // ==================================================
        // SEND VERIFICATION EMAIL
        // ==================================================

        const emailResult =
            await sendEmail(

                adminEmail,

                "Admin Email Verification - Kadakati Arar High School",

                `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                ">

                    <h2 style="color: #176B45;">
                        Kadakati Arar High School
                    </h2>

                    <p>
                        Hello
                        <strong>${admin.name}</strong>,
                    </p>

                    <p>
                        Your Admin account has been
                        created by the Super Admin.
                    </p>

                    <p>
                        Your Admin username is:
                    </p>

                    <div style="
                        font-size: 20px;
                        font-weight: bold;
                        color: #176B45;
                        padding: 15px;
                        background: #f4f8f6;
                        text-align: center;
                        margin: 20px 0;
                    ">
                        ${admin.username}
                    </div>

                    <p>
                        Your verification code is:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #176B45;
                        padding: 20px;
                        background: #f4f8f6;
                        text-align: center;
                        margin: 20px 0;
                    ">
                        ${otp}
                    </div>

                    <p>
                        This code will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not expect this account,
                        please contact the school administrator.
                    </p>

                    <hr>

                    <p style="color: #777;">
                        Kadakati Arar High School
                    </p>

                </div>
                `
            );


        // ==================================================
        // EMAIL FAILED
        // ==================================================

        if (!emailResult.success) {

            await Admin.findByIdAndDelete(
                admin._id
            );

            return res.status(500).json({
                success: false,
                message:
                    "Admin account could not be created because verification email failed"
            });
        }


        // ==================================================
        // SUCCESS
        // ==================================================

        return res.status(201).json({

            success: true,

            message:
                "Admin registered successfully. Verification code has been sent to the email.",

            admin: {

                id:
                    admin._id,

                name:
                    admin.name,

                username:
                    admin.username,

                email:
                    admin.email,

                isSuperAdmin:
                    false,

                isVerified:
                    false

            }

        });


    } catch (error) {

        console.error(
            "Admin Registration Error:",
            error
        );


        // ==================================================
        // DUPLICATE KEY
        // ==================================================

        if (
            error.code === 11000
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Username or email already exists"
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
};


// ======================================================
// VERIFY ADMIN EMAIL
// ======================================================

const verifyAdminEmail = async (req, res) => {

    try {

        const {
            email,
            verificationCode
        } = req.body;


        if (
            !email ||
            !verificationCode
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and verification code are required"
            });
        }


        const adminEmail =
            email.toLowerCase().trim();


        const admin =
            await Admin.findOne({
                email: adminEmail
            });


        if (!admin) {

            return res.status(404).json({
                success: false,
                message:
                    "Admin account not found"
            });
        }


        if (
            admin.isVerified === true
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Admin email is already verified"
            });
        }


        if (
            !admin.verificationCodeHash ||
            !admin.verificationCodeExpires
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "No verification code is available"
            });
        }


        if (
            new Date() >
            new Date(
                admin.verificationCodeExpires
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Verification code has expired"
            });
        }


        const submittedOTPHash =
            hashOTP(
                verificationCode
                    .toString()
                    .trim()
            );


        if (
            submittedOTPHash !==
            admin.verificationCodeHash
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid verification code"
            });
        }


        admin.isVerified = true;

        admin.verificationCodeHash = null;

        admin.verificationCodeExpires = null;


        await admin.save();


        return res.status(200).json({

            success: true,

            message:
                "Admin email verified successfully. You can now login.",

            admin: {
                id: admin._id,
                name: admin.name,
                username: admin.username,
                email: admin.email,
                isSuperAdmin: false,
                isVerified: true
            }

        });


    } catch (error) {

        console.error(
            "Admin Email Verification Error:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
};


// ======================================================
// ADMIN → FORGOT PASSWORD
// ======================================================

const forgotAdminPassword = async (req, res) => {

    try {

        const {
            email
        } = req.body;


        if (!email) {

            return res.status(400).json({
                success: false,
                message:
                    "Email is required"
            });
        }


        const adminEmail =
            email.toLowerCase().trim();


        const admin =
            await Admin.findOne({
                email: adminEmail
            });


        // ==================================================
        // SECURITY
        // ==================================================

        if (!admin) {

            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, a password reset code has been sent."
            });
        }


        // ==================================================
        // SUPER ADMIN
        // ==================================================

        if (
            admin.isSuperAdmin === true
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Super Admin password is managed through server configuration"
            });
        }


        // ==================================================
        // GENERATE RESET OTP
        // ==================================================

        const otp =
            generateOTP();


        const otpHash =
            hashOTP(otp);


        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        admin.resetCodeHash =
            otpHash;

        admin.resetCodeExpires =
            otpExpires;


        await admin.save();


        // ==================================================
        // SEND RESET EMAIL
        // ==================================================

        const emailResult =
            await sendEmail(

                adminEmail,

                "Admin Password Reset - Kadakati Arar High School",

                `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                ">

                    <h2 style="color: #176B45;">
                        Kadakati Arar High School
                    </h2>

                    <p>
                        Hello
                        <strong>${admin.name}</strong>,
                    </p>

                    <p>
                        We received a request to reset
                        your Admin account password.
                    </p>

                    <p>
                        Your password reset code is:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #176B45;
                        padding: 20px;
                        background: #f4f8f6;
                        text-align: center;
                        margin: 20px 0;
                    ">
                        ${otp}
                    </div>

                    <p>
                        This code will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <hr>

                    <p style="color: #777;">
                        Kadakati Arar High School
                    </p>

                </div>
                `
            );


        if (!emailResult.success) {

            admin.resetCodeHash = null;

            admin.resetCodeExpires = null;

            await admin.save();


            return res.status(500).json({
                success: false,
                message:
                    "Password reset email could not be sent"
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "If an account exists with this email, a password reset code has been sent."

        });


    } catch (error) {

        console.error(
            "Admin Forgot Password Error:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
};


// ======================================================
// ADMIN → RESET PASSWORD
// ======================================================

const resetAdminPassword = async (req, res) => {

    try {

        const {
            email,
            resetCode,
            newPassword
        } = req.body;


        if (
            !email ||
            !resetCode ||
            !newPassword
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Email, reset code and new password are required"
            });
        }


        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters"
            });
        }


        const adminEmail =
            email.toLowerCase().trim();


        const admin =
            await Admin.findOne({
                email: adminEmail
            });


        if (!admin) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid reset request"
            });
        }


        if (
            admin.isSuperAdmin === true
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Super Admin password is managed through server configuration"
            });
        }


        if (
            !admin.resetCodeHash ||
            !admin.resetCodeExpires
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "No password reset request is available"
            });
        }


        if (
            new Date() >
            new Date(
                admin.resetCodeExpires
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Password reset code has expired"
            });
        }


        const submittedOTPHash =
            hashOTP(
                resetCode
                    .toString()
                    .trim()
            );


        if (
            submittedOTPHash !==
            admin.resetCodeHash
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid password reset code"
            });
        }


        admin.password =
            await bcrypt.hash(
                newPassword,
                12
            );


        admin.resetCodeHash = null;

        admin.resetCodeExpires = null;


        await admin.save();


        return res.status(200).json({

            success: true,

            message:
                "Password reset successful. You can now login."

        });


    } catch (error) {

        console.error(
            "Admin Reset Password Error:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
};


// ======================================================
// SUPER ADMIN → GET ALL NORMAL ADMINS
// ======================================================

const getAllAdmins = async (req, res) => {

    try {

        if (
            !req.admin ||
            req.admin.isSuperAdmin !== true
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only Super Admin can view Admin list"
            });
        }


        const admins =
            await Admin.find({
                isSuperAdmin: false
            })
                .select(
                    "-password -verificationCodeHash -verificationCodeExpires -resetCodeHash -resetCodeExpires"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count:
                admins.length,

            admins

        });


    } catch (error) {

        console.error(
            "Get All Admins Error:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                "Failed to get Admin list"
        });
    }
};


// ======================================================
// SUPER ADMIN → GET SINGLE NORMAL ADMIN
// ======================================================

const getAdminById = async (req, res) => {

    try {

        if (
            !req.admin ||
            req.admin.isSuperAdmin !== true
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only Super Admin can view Admin details"
            });
        }


        const admin =
            await Admin.findOne({
                _id: req.params.id,
                isSuperAdmin: false
            })
                .select(
                    "-password -verificationCodeHash -verificationCodeExpires -resetCodeHash -resetCodeExpires"
                );


        if (!admin) {

            return res.status(404).json({
                success: false,
                message:
                    "Normal Admin not found"
            });
        }


        return res.status(200).json({

            success: true,

            admin

        });


    } catch (error) {

        console.error(
            "Get Admin By ID Error:",
            error.message
        );


        if (
            error.name === "CastError"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid Admin ID"
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Failed to get Admin details"
        });
    }
};


// ======================================================
// SUPER ADMIN → DELETE NORMAL ADMIN
// ======================================================

const deleteAdmin = async (req, res) => {

    try {

        if (
            !req.admin ||
            req.admin.isSuperAdmin !== true
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only Super Admin can delete an Admin"
            });
        }


        const admin =
            await Admin.findOne({
                _id: req.params.id,
                isSuperAdmin: false
            });


        if (!admin) {

            return res.status(404).json({
                success: false,
                message:
                    "Normal Admin not found"
            });
        }


        await Admin.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Normal Admin deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete Admin Error:",
            error.message
        );


        if (
            error.name === "CastError"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid Admin ID"
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Failed to delete Admin"
        });
    }
};


// ======================================================
// ADMIN → GET CURRENT ADMIN PROFILE
// ======================================================

const getMyAdminProfile = async (req, res) => {

    try {

        if (
            !req.admin
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required"
            });
        }


        // ==================================================
        // SUPER ADMIN PROFILE
        // ==================================================

        if (
            req.admin.isSuperAdmin === true
        ) {

            return res.status(200).json({

                success: true,

                admin: {
                    id:
                        "super-admin",

                    name:
                        "Super Admin",

                    username:
                        "superadmin",

                    email:
                        process.env.SUPER_ADMIN_EMAIL,

                    role:
                        "admin",

                    isSuperAdmin:
                        true
                }

            });
        }


        // ==================================================
        // NORMAL ADMIN PROFILE
        // ==================================================

        const admin =
            await Admin.findById(
                req.admin.id
            )
                .select(
                    "-password -verificationCodeHash -verificationCodeExpires -resetCodeHash -resetCodeExpires"
                );


        if (!admin) {

            return res.status(404).json({
                success: false,
                message:
                    "Admin not found"
            });
        }


        return res.status(200).json({

            success: true,

            admin

        });


    } catch (error) {

        console.error(
            "Get Admin Profile Error:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    loginAdmin,

    registerAdmin,

    verifyAdminEmail,

    forgotAdminPassword,

    resetAdminPassword,

    getAllAdmins,

    getAdminById,

    deleteAdmin,

    getMyAdminProfile

};
