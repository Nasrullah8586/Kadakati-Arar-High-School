const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/Teacher");

// ==========================================
// Teacher Login
// ==========================================
const loginTeacher = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const teacher = await Teacher.findOne({ username });

        if (!teacher) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            teacher.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

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

        res.status(200).json({
            success: true,
            message: "Teacher login successful",
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
        console.error("Teacher Login Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// Get My Profile
// ==========================================
const getMyProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.teacher.id)
            .select("-password");

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.status(200).json({
            success: true,
            teacher
        });

    } catch (error) {
        console.error("Get Teacher Profile Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// Update My Profile
// ==========================================
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

        const teacher = await Teacher.findById(req.teacher.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        if (name !== undefined) teacher.name = name;
        if (photo !== undefined) teacher.photo = photo;
        if (phone !== undefined) teacher.phone = phone;
        if (about !== undefined) teacher.about = about;
        if (division !== undefined) teacher.division = division;
        if (department !== undefined) teacher.department = department;
        if (subject !== undefined) teacher.subject = subject;

        if (socialLinks !== undefined) {
            teacher.socialLinks = {
                ...teacher.socialLinks,
                ...socialLinks
            };
        }

        await teacher.save();

        const updatedTeacher = await Teacher.findById(
            req.teacher.id
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            teacher: updatedTeacher
        });

    } catch (error) {
        console.error("Update Teacher Profile Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// Admin Update Any Teacher
// ==========================================
const adminUpdateTeacher = async (req, res) => {
    try {
        const { id } = req.params;

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

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        // Update teacher information
        if (name !== undefined) teacher.name = name;
        if (photo !== undefined) teacher.photo = photo;
        if (phone !== undefined) teacher.phone = phone;
        if (about !== undefined) teacher.about = about;
        if (division !== undefined) teacher.division = division;
        if (department !== undefined) teacher.department = department;
        if (subject !== undefined) teacher.subject = subject;

        if (socialLinks !== undefined) {
            teacher.socialLinks = {
                ...teacher.socialLinks,
                ...socialLinks
            };
        }

        await teacher.save();

        const updatedTeacher = await Teacher.findById(id)
            .select("-password");

        res.status(200).json({
            success: true,
            message: "Teacher updated successfully by Admin",
            teacher: updatedTeacher
        });

    } catch (error) {
        console.error("Admin Update Teacher Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// Export Controllers
// ==========================================
module.exports = {
    loginTeacher,
    getMyProfile,
    updateMyProfile,
    adminUpdateTeacher
};