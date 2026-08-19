const express = require("express");

const {
    getSiteContent,
    createSiteContent,
    updateSiteContent
} = require("../controllers/siteContentController");

const auth = require("../middleware/auth");

const router = express.Router();


// ======================================================
// PUBLIC → GET SITE CONTENT
// ======================================================

router.get(
    "/",
    getSiteContent
);


// ======================================================
// ADMIN / SUPER ADMIN → CREATE SITE CONTENT
// ======================================================

router.post(
    "/",
    auth,
    createSiteContent
);


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE SITE CONTENT
// ======================================================

router.put(
    "/",
    auth,
    updateSiteContent
);


module.exports = router;