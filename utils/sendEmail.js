const { Resend } = require("resend");

// ======================================================
// RESEND EMAIL CLIENT
// ======================================================

const resend = new Resend(
    process.env.RESEND_API_KEY
);


// ======================================================
// SEND EMAIL
// ======================================================

const sendEmail = async (to, subject, html) => {
    try {

        const { data, error } = await resend.emails.send({

            from:
                "Kadakati Arar High School <onboarding@resend.dev>",

            to: [to],

            subject: subject,

            html: html

        });


        // ==================================================
        // RESEND ERROR
        // ==================================================

        if (error) {

            console.error(
                "❌ Resend email error:",
                error
            );

            return {
                success: false,
                error:
                    error.message ||
                    "Email sending failed"
            };
        }


        // ==================================================
        // SUCCESS
        // ==================================================

        console.log(
            "✅ Email sent successfully:",
            data.id
        );


        return {

            success: true,

            messageId:
                data.id

        };


    } catch (error) {

        console.error(
            "❌ Email sending error:",
            error.message
        );


        return {

            success: false,

            error:
                error.message

        };

    }
};


module.exports = sendEmail;