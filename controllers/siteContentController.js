const SiteContent = require("../models/SiteContent");
const uploadToCloudinary = require("../utils/uploadToCloudinary");


// ======================================================
// PUBLIC → GET WEBSITE CONTENT
// ======================================================

const getSiteContent = async (req, res) => {
    try {
        let content = await SiteContent.findOne();

        // ------------------------------------------------
        // Create default document if none exists
        // ------------------------------------------------

        if (!content) {
            content = await SiteContent.create({});
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
            message: "Failed to get website content"
        });
    }
};


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE WEBSITE CONTENT
// ======================================================

const updateSiteContent = async (req, res) => {
    try {
        // ------------------------------------------------
        // Admin authentication check
        // ------------------------------------------------

        if (!req.admin || req.admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        // ------------------------------------------------
        // Get existing content
        // ------------------------------------------------

        let content = await SiteContent.findOne();

        // ------------------------------------------------
        // Create document if it doesn't exist
        // ------------------------------------------------

        if (!content) {
            content = new SiteContent();
        }

        const {
            schoolName,
            schoolNameBangla,

            heroTitle,
            heroSubtitle,

            aboutTitle,
            aboutDescription,

            historyTitle,
            historyDescription,

            mission,
            vision,

            phone,
            email,
            address,

            googleMapUrl,

            socialLinks
        } = req.body;


        // ==================================================
        // BASIC SCHOOL INFORMATION
        // ==================================================

        if (schoolName !== undefined) {
            content.schoolName = schoolName.trim();
        }

        if (schoolNameBangla !== undefined) {
            content.schoolNameBangla =
                schoolNameBangla.trim();
        }


        // ==================================================
        // HERO SECTION
        // ==================================================

        if (heroTitle !== undefined) {
            content.heroTitle = heroTitle.trim();
        }

        if (heroSubtitle !== undefined) {
            content.heroSubtitle =
                heroSubtitle.trim();
        }


        // ==================================================
        // ABOUT SECTION
        // ==================================================

        if (aboutTitle !== undefined) {
            content.aboutTitle =
                aboutTitle.trim();
        }

        if (aboutDescription !== undefined) {
            content.aboutDescription =
                aboutDescription.trim();
        }


        // ==================================================
        // HISTORY
        // ==================================================

        if (historyTitle !== undefined) {
            content.historyTitle =
                historyTitle.trim();
        }

        if (historyDescription !== undefined) {
            content.historyDescription =
                historyDescription.trim();
        }


        // ==================================================
        // MISSION & VISION
        // ==================================================

        if (mission !== undefined) {
            content.mission = mission.trim();
        }

        if (vision !== undefined) {
            content.vision = vision.trim();
        }


        // ==================================================
        // CONTACT INFORMATION
        // ==================================================

        if (phone !== undefined) {
            content.phone = phone.trim();
        }

        if (email !== undefined) {
            content.email =
                email.toLowerCase().trim();
        }

        if (address !== undefined) {
            content.address = address.trim();
        }


        // ==================================================
        // LOCATION
        // ==================================================

        if (googleMapUrl !== undefined) {
            content.googleMapUrl =
                googleMapUrl.trim();
        }


        // ==================================================
        // SOCIAL LINKS
        // ==================================================

        if (socialLinks !== undefined) {

            let parsedSocialLinks =
                socialLinks;

            // ------------------------------------------------
            // Handle JSON string from multipart/form-data
            // ------------------------------------------------

            if (typeof socialLinks === "string") {
                try {
                    parsedSocialLinks =
                        JSON.parse(socialLinks);
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Invalid socialLinks format"
                    });
                }
            }

            if (
                typeof parsedSocialLinks !== "object" ||
                parsedSocialLinks === null ||
                Array.isArray(parsedSocialLinks)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "socialLinks must be an object"
                });
            }

            content.socialLinks = {
                ...content.socialLinks,
                ...parsedSocialLinks
            };
        }


        // ==================================================
        // HERO IMAGE UPLOAD
        // ==================================================

        if (req.file) {

            const uploadResult =
                await uploadToCloudinary(
                    req.file.buffer,
                    "kadakati-school/site-content"
                );

            content.heroImage =
                uploadResult.secure_url;
        }


        // ==================================================
        // UPDATED BY
        // ==================================================

        content.updatedBy =
            req.admin.isSuperAdmin === true
                ? null
                : req.admin.id;

        content.updatedByType =
            req.admin.isSuperAdmin === true
                ? "SuperAdmin"
                : "Admin";


        // ==================================================
        // SAVE
        // ==================================================

        await content.save();


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({
            success: true,
            message:
                "Website content updated successfully",
            content
        });

    } catch (error) {

        console.error(
            "Update Site Content Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update website content"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getSiteContent,
    updateSiteContent
};