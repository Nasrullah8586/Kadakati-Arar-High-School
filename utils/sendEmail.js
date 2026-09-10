// ======================================================
// BREVO EMAIL API
// ======================================================

const sendEmail = async (to, subject, html) => {
    try {

        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",

                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },

                body: JSON.stringify({

                    sender: {
                        name: "Kadakati Arar High School",
                        email: "ferdausk571@gmail.com"
                    },

                    to: [
                        {
                            email: to
                        }
                    ],

                    subject: subject,

                    htmlContent: html
                })
            }
        );


        // ==================================================
        // BREVO RESPONSE
        // ==================================================

        const data = await response.json();


        // ==================================================
        // ERROR
        // ==================================================

        if (!response.ok) {

            console.error(
                "❌ Brevo email error:",
                data
            );

            return {
                success: false,
                error:
                    data.message ||
                    "Email sending failed"
            };
        }


        // ==================================================
        // SUCCESS
        // ==================================================

        console.log(
            "✅ Email sent successfully:",
            data.messageId
        );


        return {

            success: true,

            messageId:
                data.messageId

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