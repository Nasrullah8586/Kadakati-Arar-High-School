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

// ======================================================
// CONNECT MONGODB
// ======================================================

connectDB();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

// Increased JSON limit for Base64 teacher profile photos
app.use(express.json({ limit: "10mb" }));

// Also support URL-encoded requests
app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

// ======================================================
// PUBLIC TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Kadakati Arar High School EduConnect API",
        status: "Server is running"
    });
});

// ======================================================
// AUTHENTICATION ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

// ======================================================
// TEACHER ROUTES
// ======================================================

app.use("/api/teachers", teacherRoutes);

// ======================================================
// NOTICE ROUTES
// ======================================================

app.use("/api/notices", noticeRoutes);

// ======================================================
// NEWS & EVENT ROUTES
// ======================================================

app.use("/api/news-events", newsEventRoutes);

// ======================================================
// GALLERY ROUTES
// ======================================================

app.use("/api/gallery", galleryRoutes);

// ======================================================
// SITE CONTENT ROUTES
// ======================================================

app.use("/api/site-content", siteContentRoutes);

// ======================================================
// JSON ERROR HANDLER
// Prevent HTML error response for oversized JSON requests
// ======================================================

app.use((err, req, res, next) => {

    if (
        err &&
        err.type === "entity.too.large"
    ) {

        return res.status(413).json({
            success: false,
            message: "Uploaded image is too large. Please select an image under 7 MB."
        });

    }

    console.error("Server Error:", err);

    return res.status(500).json({
        success: false,
        message: "Server error"
    });
});

// ======================================================
// SERVER
// ======================================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `✅ Server running on port ${PORT}`
    );

});