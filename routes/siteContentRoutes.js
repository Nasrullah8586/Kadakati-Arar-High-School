const express = require("express");

const {
    getSiteContent,
    updateSiteContent
} = require("../controllers/siteContentController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();


// ======================================================
// PUBLIC → GET WEBSITE CONTENT
// ======================================================

router.get(
    "/",
    getSiteContent
);


// ======================================================
// ADMIN / SUPER ADMIN → UPDATE WEBSITE CONTENT
// ======================================================

router.put(
    "/",
    auth,
    upload.single("heroImage"),
    updateSiteContent
);


module.exports = router;