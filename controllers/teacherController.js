const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Teacher = require("../models/Teacher");
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
// TEACHER LOGIN
// USERNAME OR EMAIL
// ======================================================

const loginTeacher = async (req, res) => {
    try {

        /*
         * Frontend can send:
         * login
         *
         * For backward compatibility, username is also accepted.
         */

        const loginValue =
            req.body.login ||
            req.body.username;

        const { password } = req.body;


        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (!loginValue || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Username/email and password are required"
            });

        }


        const trimmedLogin =
            loginValue.trim();


        // --------------------------------------------------
        // FIND TEACHER BY USERNAME OR EMAIL
        // --------------------------------------------------

        const teacher = await Teacher.findOne({
            $or: [
                {
                    username: trimmedLogin
                },
                {
                    email: trimmedLogin.toLowerCase()
                }
            ]
        });


        // --------------------------------------------------
        // TEACHER NOT FOUND
        // --------------------------------------------------

        if (!teacher) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username/email or password"
            });

        }


        // --------------------------------------------------
        // PASSWORD CHECK
        // --------------------------------------------------

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                teacher.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username/email or password"
            });

        }


        // --------------------------------------------------
        // EMAIL VERIFICATION CHECK
        // --------------------------------------------------

        if (teacher.isVerified !== true) {

            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email before logging in"
            });

        }


        // --------------------------------------------------
        // JWT TOKEN
        // --------------------------------------------------

        const token = jwt.sign(
            {
                id: teacher._id,
                username: teacher.username,
                role: "teacher"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Teacher login successful",

            token,

            teacher: {
                id: teacher._id,
                name: teacher.name,
                username: teacher.username,
                email: teacher.email,
                division: teacher.division,
                department: teacher.department
            }

        });

    } catch (error) {

        console.error(
            "Teacher Login Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// ADMIN → REGISTER TEACHER
// ======================================================

const registerTeacher = async (req, res) => {

    try {

        if (
            !req.admin ||
            req.admin.role !== "admin"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only Admin can register a Teacher"
            });

        }


        const {
            name,
            username,
            email,
            password,
            division,
            department,
            subject,
            photo,
            phone,
            about,
            socialLinks
        } = req.body;


        if (
            !name ||
            !username ||
            !email ||
            !password ||
            !division ||
            !department
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, username, email, password, division and department are required"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });

        }


        const allowedDivisions = [
            "Science",
            "Arts",
            "Commerce"
        ];


        if (!allowedDivisions.includes(division)) {

            return res.status(400).json({
                success: false,
                message:
                    "Division must be Science, Arts or Commerce"
            });

        }


        const teacherEmail =
            email.toLowerCase().trim();

        const teacherUsername =
            username.trim();


        const existingEmail =
            await Teacher.findOne({
                email: teacherEmail
            });


        if (existingEmail) {

            return res.status(409).json({
                success: false,
                message:
                    "A Teacher with this email already exists"
            });

        }


        const existingUsername =
            await Teacher.findOne({
                username: teacherUsername
            });


        if (existingUsername) {

            return res.status(409).json({
                success: false,
                message:
                    "This username is already taken"
            });

        }


        const otp =
            generateOTP();

        const otpHash =
            hashOTP(otp);


        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        const teacher =
            await Teacher.create({

                name:
                    name.trim(),

                username:
                    teacherUsername,

                email:
                    teacherEmail,

                password:
                    hashedPassword,

                photo:
                    photo || "",

                phone:
                    phone || "",

                about:
                    about || "",

                division,

                department:
                    department.trim(),

                subject:
                    subject || "",

                socialLinks: {

                    facebook:
                        socialLinks?.facebook || "",

                    linkedin:
                        socialLinks?.linkedin || "",

                    instagram:
                        socialLinks?.instagram || ""

                },

                isVerified:
                    false,

                verificationCodeHash:
                    otpHash,

                verificationCodeExpires:
                    otpExpires

            });


        const emailResult =
            await sendEmail(

                teacherEmail,

                "Teacher Email Verification - Kadakati Arar High School",

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
                        Hello <strong>${teacher.name}</strong>,
                    </p>

                    <p>
                        Your Teacher account has been created
                        by the school administrator.
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


        if (!emailResult.success) {

            await Teacher.findByIdAndDelete(
                teacher._id
            );

            return res.status(500).json({
                success: false,
                message:
                    "Teacher account could not be created because verification email failed"
            });

        }


        return res.status(201).json({

            success: true,

            message:
                "Teacher registered successfully. Verification code has been sent to the email.",

            teacher: {

                id:
                    teacher._id,

                name:
                    teacher.name,

                username:
                    teacher.username,

                email:
                    teacher.email,

                division:
                    teacher.division,

                department:
                    teacher.department,

                isVerified:
                    false

            }

        });

    } catch (error) {

        console.error(
            "Teacher Registration Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// VERIFY TEACHER EMAIL
// ======================================================

const verifyTeacherEmail = async (req, res) => {

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


        const teacherEmail =
            email.toLowerCase().trim();


        const teacher =
            await Teacher.findOne({
                email: teacherEmail
            });


        if (!teacher) {

            return res.status(404).json({
                success: false,
                message:
                    "Teacher account not found"
            });

        }


        if (teacher.isVerified === true) {

            return res.status(400).json({
                success: false,
                message:
                    "Teacher email is already verified"
            });

        }


        if (
            !teacher.verificationCodeHash ||
            !teacher.verificationCodeExpires
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
                teacher.verificationCodeExpires
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
            teacher.verificationCodeHash
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid verification code"
            });

        }


        teacher.isVerified =
            true;

        teacher.verificationCodeHash =
            null;

        teacher.verificationCodeExpires =
            null;


        await teacher.save();


        return res.status(200).json({

            success: true,

            message:
                "Teacher email verified successfully. You can now login.",

            teacher: {

                id:
                    teacher._id,

                name:
                    teacher.name,

                username:
                    teacher.username,

                email:
                    teacher.email,

                isVerified:
                    true

            }

        });

    } catch (error) {

        console.error(
            "Teacher Email Verification Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// TEACHER FORGOT PASSWORD
// ======================================================

const forgotTeacherPassword = async (req, res) => {

    try {

        const { email } =
            req.body;


        if (!email) {

            return res.status(400).json({
                success: false,
                message:
                    "Email is required"
            });

        }


        const teacherEmail =
            email.toLowerCase().trim();


        const teacher =
            await Teacher.findOne({
                email: teacherEmail
            });


        /*
         * Do not reveal whether the account exists.
         */

        if (!teacher) {

            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, a password reset code has been sent."
            });

        }


        const otp =
            generateOTP();


        const otpHash =
            hashOTP(otp);


        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        teacher.resetCodeHash =
            otpHash;

        teacher.resetCodeExpires =
            otpExpires;


        await teacher.save();


        const emailResult =
            await sendEmail(

                teacherEmail,

                "Teacher Password Reset - Kadakati Arar High School",

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
                        Hello <strong>${teacher.name}</strong>,
                    </p>

                    <p>
                        We received a request to reset your
                        Teacher account password.
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

                </div>
                `
            );


        if (!emailResult.success) {

            teacher.resetCodeHash =
                null;

            teacher.resetCodeExpires =
                null;


            await teacher.save();


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
            "Teacher Forgot Password Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// TEACHER RESET PASSWORD
// ======================================================

const resetTeacherPassword = async (req, res) => {

    try {

        /*
         * IMPORTANT:
         * Backend expects resetCode,
         * NOT verificationCode.
         */

        const {
            email,
            resetCode,
            newPassword
        } = req.body;


        // --------------------------------------------------
        // REQUIRED FIELDS
        // --------------------------------------------------

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


        // --------------------------------------------------
        // PASSWORD LENGTH
        // --------------------------------------------------

        if (newPassword.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 6 characters"

            });

        }


        const teacherEmail =
            email.toLowerCase().trim();


        // --------------------------------------------------
        // FIND TEACHER
        // --------------------------------------------------

        const teacher =
            await Teacher.findOne({
                email: teacherEmail
            });


        if (!teacher) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid reset request"

            });

        }


        // --------------------------------------------------
        // CHECK RESET REQUEST
        // --------------------------------------------------

        if (
            !teacher.resetCodeHash ||
            !teacher.resetCodeExpires
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "No password reset request is available"

            });

        }


        // --------------------------------------------------
        // CHECK EXPIRATION
        // --------------------------------------------------

        if (
            new Date() >
            new Date(
                teacher.resetCodeExpires
            )
        ) {

            teacher.resetCodeHash =
                null;

            teacher.resetCodeExpires =
                null;

            await teacher.save();


            return res.status(400).json({

                success: false,

                message:
                    "Password reset code has expired"

            });

        }


        // --------------------------------------------------
        // HASH SUBMITTED RESET CODE
        // --------------------------------------------------

        const submittedOTPHash =
            hashOTP(
                resetCode
                    .toString()
                    .trim()
            );


        // --------------------------------------------------
        // COMPARE RESET CODE
        // --------------------------------------------------

        if (
            submittedOTPHash !==
            teacher.resetCodeHash
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid password reset code"

            });

        }


        // --------------------------------------------------
        // UPDATE PASSWORD
        // --------------------------------------------------

        teacher.password =
            await bcrypt.hash(
                newPassword,
                12
            );


        // --------------------------------------------------
        // REMOVE USED RESET CODE
        // --------------------------------------------------

        teacher.resetCodeHash =
            null;

        teacher.resetCodeExpires =
            null;


        await teacher.save();


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Password reset successful. You can now login."

        });

    } catch (error) {

        console.error(
            "Teacher Reset Password Error:",
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
// GET ALL VERIFIED TEACHERS - PUBLIC
// ======================================================

const getAllTeachers = async (req, res) => {

    try {

        const teachers =
            await Teacher.find({
                isVerified: true
            })
                .select(
                    "-password -verificationCodeHash -verificationCodeExpires -resetCodeHash -resetCodeExpires"
                )
                .sort({
                    name: 1
                });


        return res.status(200).json({

            success: true,

            count:
                teachers.length,

            teachers

        });

    } catch (error) {

        console.error(
            "Get All Teachers Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// GET SINGLE VERIFIED TEACHER - PUBLIC
// ======================================================

const getTeacherById = async (req, res) => {

    try {

        const { id } =
            req.params;


        const teacher =
            await Teacher.findOne({

                _id: id,

                isVerified: true

            })
                .select(
                    "-password -verificationCodeHash -verificationCodeExpires -resetCodeHash -resetCodeExpires"
                );


        if (!teacher) {

            return res.status(404).json({
                success: false,
                message:
                    "Teacher not found"
            });

        }


        return res.status(200).json({

            success: true,

            teacher

        });

    } catch (error) {

        console.error(
            "Get Teacher By ID Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// GET MY PROFILE
// ======================================================

const getMyProfile = async (req, res) => {

    try {

        const teacher =
            await Teacher.findById(
                req.teacher.id
            )
                .select("-password");


        if (!teacher) {

            return res.status(404).json({
                success: false,
                message:
                    "Teacher not found"
            });

        }


        return res.status(200).json({

            success: true,

            teacher

        });

    } catch (error) {

        console.error(
            "Get Teacher Profile Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// UPDATE MY PROFILE
// ======================================================

const updateMyProfile = async (req, res) => {

    try {

        const {
            name,
            photo,
            phone,
            about,
            division,
            department,
            subject,
            socialLinks
        } = req.body;


        const teacher =
            await Teacher.findById(
                req.teacher.id
            );


        if (!teacher) {

            return res.status(404).json({
                success: false,
                message:
                    "Teacher not found"
            });

        }


        if (name !== undefined)
            teacher.name = name;

        if (photo !== undefined)
            teacher.photo = photo;

        if (phone !== undefined)
            teacher.phone = phone;

        if (about !== undefined)
            teacher.about = about;

        if (division !== undefined)
            teacher.division = division;

        if (department !== undefined)
            teacher.department = department;

        if (subject !== undefined)
            teacher.subject = subject;


        if (socialLinks !== undefined) {

            teacher.socialLinks = {
                ...teacher.socialLinks,
                ...socialLinks
            };

        }


        await teacher.save();


        const updatedTeacher =
            await Teacher.findById(
                req.teacher.id
            )
                .select("-password");


        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            teacher:
                updatedTeacher

        });

    } catch (error) {

        console.error(
            "Update Teacher Profile Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// ADMIN UPDATE ANY TEACHER
// ======================================================

const adminUpdateTeacher = async (req, res) => {

    try {

        if (
            !req.admin ||
            req.admin.role !== "admin"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Admin access required"
            });

        }


        const { id } =
            req.params;


        const {
            name,
            photo,
            phone,
            about,
            division,
            department,
            subject,
            socialLinks
        } = req.body;


        const teacher =
            await Teacher.findById(id);


        if (!teacher) {

            return res.status(404).json({
                success: false,
                message:
                    "Teacher not found"
            });

        }


        if (name !== undefined)
            teacher.name = name;

        if (photo !== undefined)
            teacher.photo = photo;

        if (phone !== undefined)
            teacher.phone = phone;

        if (about !== undefined)
            teacher.about = about;

        if (division !== undefined)
            teacher.division = division;

        if (department !== undefined)
            teacher.department = department;

        if (subject !== undefined)
            teacher.subject = subject;


        if (socialLinks !== undefined) {

            teacher.socialLinks = {
                ...teacher.socialLinks,
                ...socialLinks
            };

        }


        await teacher.save();


        const updatedTeacher =
            await Teacher.findById(id)
                .select("-password");


        return res.status(200).json({

            success: true,

            message:
                "Teacher updated successfully by Admin",

            teacher:
                updatedTeacher

        });

    } catch (error) {

        console.error(
            "Admin Update Teacher Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


// ======================================================
// ADMIN → GET ALL TEACHERS
// ======================================================

const getAllTeachersForAdmin = async (req, res) => {

    try {

        if (
            !req.admin ||
            req.admin.role !== "admin"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Admin access required"
            });

        }


        const teachers =
            await Teacher.find({})
                .select(
                    "-password -verificationCodeHash -verificationCodeExpires -resetCodeHash -resetCodeExpires"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            count:
                teachers.length,

            teachers

        });

    } catch (error) {

        console.error(
            "Admin Get All Teachers Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to get Teacher list"
        });

    }
};


// ======================================================
// ADMIN → DELETE TEACHER
// ======================================================

const deleteTeacher = async (req, res) => {

    try {

        if (
            !req.admin ||
            req.admin.role !== "admin"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Admin access required"
            });

        }


        const { id } =
            req.params;


        const teacher =
            await Teacher.findById(id);


        if (!teacher) {

            return res.status(404).json({
                success: false,
                message:
                    "Teacher not found"
            });

        }


        await Teacher.findByIdAndDelete(id);


        return res.status(200).json({

            success: true,

            message:
                "Teacher deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Teacher Error:",
            error.message
        );


        if (
            error.name === "CastError"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid Teacher ID"
            });

        }


        return res.status(500).json({
            success: false,
            message:
                "Failed to delete Teacher"
        });

    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    loginTeacher,
    registerTeacher,
    verifyTeacherEmail,

    forgotTeacherPassword,
    resetTeacherPassword,

    getAllTeachers,
    getTeacherById,

    getMyProfile,
    updateMyProfile,

    adminUpdateTeacher,
    getAllTeachersForAdmin,
    deleteTeacher

};