require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const newsEventRoutes = require("./routes/newsEventRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const siteContentRoutes = require("./routes/siteContentRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Public Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Kadakati Arar High School EduConnect API",
        status: "Server is running"
    });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Teacher Routes
app.use("/api/teachers", teacherRoutes);

// Notice Routes
app.use("/api/notice", noticeRoutes);

// News & Event Routes
app.use("/api/news-events", newsEventRoutes);

// Gallery Routes
app.use("/api/gallery", galleryRoutes);

// Site Content Routes
app.use("/api/site-content", siteContentRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});