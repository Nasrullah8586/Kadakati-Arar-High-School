require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Teacher = require("./models/Teacher");

const createTeacher = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected");

        const teacherExists = await Teacher.findOne({
            username: "rahim_teacher"
        });

        if (teacherExists) {
            console.log("⚠️ Teacher already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Teacher@12345", 10);

        const teacher = await Teacher.create({
            name: "Md. Rahim Uddin",
            username: "rahim_teacher",
            email: "rahim@kadakatiararschool.com",
            password: hashedPassword,
            phone: "01700000000",
            about: "Teacher of Kadakati Arar High School.",
            division: "Science",
            department: "Mathematics",
            subject: "Mathematics",

            socialLinks: {
                facebook: "",
                linkedin: "",
                instagram: ""
            }
        });

        console.log("✅ Teacher created successfully!");
        console.log("Username:", teacher.username);
        console.log("Password: Teacher@12345");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createTeacher();