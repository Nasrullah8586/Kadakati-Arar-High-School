const nodemailer = require("nodemailer");

// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ======================================================
// SEND EMAIL
// ======================================================

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Kadakati Arar High School" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email sent successfully:", info.messageId);

        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        console.error("❌ Email sending error:", error.message);

        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = sendEmail;