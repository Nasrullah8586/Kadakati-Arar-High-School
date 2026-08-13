require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected");

        const adminExists = await Admin.findOne({
            email: "admin@kadakatiararschool.com"
        });

        if (adminExists) {
            console.log("⚠️ Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@12345", 10);

        const admin = await Admin.create({
            name: "School Admin",
            email: "admin@kadakatiararschool.com",
            password: hashedPassword
        });

        console.log("✅ Admin created successfully!");
        console.log("Email:", admin.email);
        console.log("Password: Admin@12345");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createAdmin();