const express = require("express");

const upload = require("../middleware/upload");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const router = express.Router();

// TEST IMAGE UPLOAD
router.post("/image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "kadakati-school/test"
        );

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            image: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes
            }
        });

    } catch (error) {
        console.error(
            "Cloudinary Upload Test Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Image upload failed"
        });
    }
});

module.exports = router;