const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Admin = require("../models/Admin");
const sendEmail = require("../utils/sendEmail");

// ======================================================
// HELPER: GENERATE 6 DIGIT OTP
// ======================================================

const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// ======================================================
// HELPER: HASH OTP
// ======================================================

const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};

// ======================================================
// ADMIN LOGIN
// ======================================================

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ----------------------------------------------
        // Required fields
        // ----------------------------------------------

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const loginEmail = email.toLowerCase().trim();

        // ----------------------------------------------
        // Check JWT secret
        // ----------------------------------------------

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in .env");

            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        // ==================================================
        // SUPER ADMIN LOGIN
        // ==================================================

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
            ? process.env.SUPER_ADMIN_EMAIL.toLowerCase().trim()
            : "";

        const superAdminPassword =
            process.env.SUPER_ADMIN_PASSWORD || "";

        if (
            superAdminEmail &&
            superAdminPassword &&
            loginEmail === superAdminEmail &&
            password === superAdminPassword
        ) {
            const token = jwt.sign(
                {
                    id: "super-admin",
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
                message: "Super Admin login successful",
                token,
                admin: {
                    id: "super-admin",
                    name: "Super Admin",
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
            email: loginEmail
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ----------------------------------------------
        // Password check
        // ----------------------------------------------

        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ----------------------------------------------
        // Email verification
        // ----------------------------------------------

        if (admin.isVerified === false) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        // ----------------------------------------------
        // Create JWT
        // ----------------------------------------------

        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: "admin",
                isSuperAdmin: admin.isSuperAdmin === true
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin",
                isSuperAdmin: admin.isSuperAdmin === true
            }
        });

    } catch (error) {
        console.error("Admin Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================================================
// SUPER ADMIN → REGISTER NORMAL ADMIN
// ======================================================

const registerAdmin = async (req, res) => {
    try {
        // ----------------------------------------------
        // Only Super Admin can register a new Admin
        // ----------------------------------------------

        if (!req.admin || req.admin.isSuperAdmin !== true) {
            return res.status(403).json({
                success: false,
                message: "Only Super Admin can register a new Admin"
            });
        }

        const {
            name,
            email,
            password
        } = req.body;

        // ----------------------------------------------
        // Required fields
        // ----------------------------------------------

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const adminEmail = email.toLowerCase().trim();

        // ----------------------------------------------
        // Prevent using Super Admin email
        // ----------------------------------------------

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
            ? process.env.SUPER_ADMIN_EMAIL.toLowerCase().trim()
            : "";

        if (adminEmail === superAdminEmail) {
            return res.status(400).json({
                success: false,
                message: "Super Admin email cannot be registered as a normal Admin"
            });
        }

        // ----------------------------------------------
        // Check existing Admin
        // ----------------------------------------------

        const existingAdmin = await Admin.findOne({
            email: adminEmail
        });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "An Admin with this email already exists"
            });
        }

        // ----------------------------------------------
        // Generate OTP
        // ----------------------------------------------

        const otp = generateOTP();

        const otpHash = hashOTP(otp);

        // OTP valid for 10 minutes
        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // ----------------------------------------------
        // Hash password
        // ----------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        // ----------------------------------------------
        // Create Admin
        // ----------------------------------------------

        const admin = await Admin.create({
            name: name.trim(),
            email: adminEmail,
            password: hashedPassword,

            // This is a normal Admin
            isSuperAdmin: false,

            // Must verify email
            isVerified: false,

            verificationCodeHash: otpHash,
            verificationCodeExpires: otpExpires
        });

        // ----------------------------------------------
        // Send OTP email
        // ----------------------------------------------

        const emailResult = await sendEmail(
            adminEmail,
            "Admin Email Verification - Kadakati Arar High School",
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">

                <h2 style="color: #176B45;">
                    Kadakati Arar High School
                </h2>

                <p>Hello <strong>${admin.name}</strong>,</p>

                <p>
                    Your Admin account has been created by the
                    Super Admin.
                </p>

                <p>
                    Please use the following verification code:
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
                    This verification code will expire in
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

        // ----------------------------------------------
        // If email failed
        // ----------------------------------------------

        if (!emailResult.success) {
            // Remove account if email could not be sent
            await Admin.findByIdAndDelete(admin._id);

            return res.status(500).json({
                success: false,
                message: "Admin account could not be created because verification email failed"
            });
        }

        // ----------------------------------------------
        // Success
        // ----------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully. Verification code has been sent to the email.",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                isSuperAdmin: false,
                isVerified: false
            }
        });

    } catch (error) {
        console.error("Admin Registration Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
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

        // ----------------------------------------------
        // Required fields
        // ----------------------------------------------

        if (!email || !verificationCode) {
            return res.status(400).json({
                success: false,
                message: "Email and verification code are required"
            });
        }

        const adminEmail = email.toLowerCase().trim();

        // ----------------------------------------------
        // Find Admin
        // ----------------------------------------------

        const admin = await Admin.findOne({
            email: adminEmail
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin account not found"
            });
        }

        // ----------------------------------------------
        // Already verified
        // ----------------------------------------------

        if (admin.isVerified === true) {
            return res.status(400).json({
                success: false,
                message: "Admin email is already verified"
            });
        }

        // ----------------------------------------------
        // Check OTP exists
        // ----------------------------------------------

        if (
            !admin.verificationCodeHash ||
            !admin.verificationCodeExpires
        ) {
            return res.status(400).json({
                success: false,
                message: "No verification code is available"
            });
        }

        // ----------------------------------------------
        // Check OTP expiry
        // ----------------------------------------------

        if (
            new Date() >
            new Date(admin.verificationCodeExpires)
        ) {
            return res.status(400).json({
                success: false,
                message: "Verification code has expired"
            });
        }

        // ----------------------------------------------
        // Compare OTP
        // ----------------------------------------------

        const submittedOTPHash = hashOTP(
            verificationCode.toString().trim()
        );

        if (
            submittedOTPHash !==
            admin.verificationCodeHash
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });
        }

        // ----------------------------------------------
        // Verify Admin
        // ----------------------------------------------

        admin.isVerified = true;

        admin.verificationCodeHash = null;
        admin.verificationCodeExpires = null;

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin email verified successfully. You can now login.",
            admin: {
                id: admin._id,
                name: admin.name,
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
            message: "Server error"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    loginAdmin,
    registerAdmin,
    verifyAdminEmail
};