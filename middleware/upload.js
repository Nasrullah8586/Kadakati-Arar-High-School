const multer = require("multer");

// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();

// Allow image files only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

// Maximum file size: 2 MB
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter
});

module.exports = upload;