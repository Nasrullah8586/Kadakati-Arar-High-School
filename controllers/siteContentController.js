const SiteContent = require("../models/SiteContent");

// ======================================================
// GET SITE CONTENT - PUBLIC
// ======================================================

const getSiteContent = async (req, res) => {
    try {
        const content = await SiteContent.findOne();

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Site content not found"
            });
        }

        return res.status(200).json({
            success: true,
            content
        });

    } catch (error) {
        console.error(
            "Get Site Content Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get site content"
        });
    }
};


// ======================================================
// CREATE SITE CONTENT
// ADMIN / SUPER ADMIN
// ======================================================

const createSiteContent = async (req, res) => {
    try {
        if (!req.admin || req.admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const existingContent = await SiteContent.findOne();

        if (existingContent) {
            return res.status(409).json({
                success: false,
                message: "Site content already exists"
            });
        }

        const {
            schoolName,
            shortDescription,
            about,
            history,
            heroImageUrl,
            address,
            googleMapsLink,
            phone,
            email,
            socialLinks
        } = req.body;

        if (!schoolName) {
            return res.status(400).json({
                success: false,
                message: "School name is required"
            });
        }

        const content = await SiteContent.create({
            schoolName: schoolName.trim(),
            shortDescription: shortDescription || "",
            about: about || "",
            history: history || "",
            heroImageUrl: heroImageUrl || "",
            address: address || "",
            googleMapsLink: googleMapsLink || "",
            phone: phone || "",
            email: email || "",
            socialLinks: {
                facebook: socialLinks?.facebook || "",
                instagram: socialLinks?.instagram || "",
                linkedin: socialLinks?.linkedin || ""
            }
        });

        return res.status(201).json({
            success: true,
            message: "Site content created successfully",
            content
        });

    } catch (error) {
        console.error(
            "Create Site Content Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create site content"
        });
    }
};


// ======================================================
// UPDATE SITE CONTENT
// ADMIN / SUPER ADMIN
// ======================================================

const updateSiteContent = async (req, res) => {
    try {
        if (!req.admin || req.admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const content = await SiteContent.findOne();

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Site content not found"
            });
        }

        const {
            schoolName,
            shortDescription,
            about,
            history,
            heroImageUrl,
            address,
            googleMapsLink,
            phone,
            email,
            socialLinks
        } = req.body;

        if (schoolName !== undefined) {
            content.schoolName = schoolName.trim();
        }

        if (shortDescription !== undefined) {
            content.shortDescription = shortDescription;
        }

        if (about !== undefined) {
            content.about = about;
        }

        if (history !== undefined) {
            content.history = history;
        }

        if (heroImageUrl !== undefined) {
            content.heroImageUrl = heroImageUrl;
        }

        if (address !== undefined) {
            content.address = address;
        }

        if (googleMapsLink !== undefined) {
            content.googleMapsLink = googleMapsLink;
        }

        if (phone !== undefined) {
            content.phone = phone;
        }

        if (email !== undefined) {
            content.email = email;
        }

        if (socialLinks !== undefined) {
            content.socialLinks = {
                ...content.socialLinks,
                ...socialLinks
            };
        }

        await content.save();

        return res.status(200).json({
            success: true,
            message: "Site content updated successfully",
            content
        });

    } catch (error) {
        console.error(
            "Update Site Content Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update site content"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getSiteContent,
    createSiteContent,
    updateSiteContent
};