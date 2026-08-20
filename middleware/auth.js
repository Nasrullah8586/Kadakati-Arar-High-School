const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        // ==================================================
        // CHECK JWT SECRET
        // ==================================================

        if (!process.env.JWT_SECRET) {
            console.error(
                "JWT_SECRET is missing in .env"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Server configuration error"
            });
        }

        // ==================================================
        // GET AUTHORIZATION HEADER
        // ==================================================

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Access denied. No token provided."
            });
        }

        // ==================================================
        // GET TOKEN
        // ==================================================

        const token =
            authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message:
                    "Access denied. Invalid token."
            });
        }

        // ==================================================
        // VERIFY TOKEN
        // ==================================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ==================================================
        // BASIC ADMIN TOKEN VALIDATION
        // ==================================================

        if (
            !decoded ||
            decoded.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Admin access required."
            });
        }

        // ==================================================
        // SAVE ADMIN INFORMATION
        // ==================================================

        req.admin = decoded;

        next();

    } catch (error) {
        console.error(
            "Admin Auth Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token."
        });
    }
};

module.exports = protect;