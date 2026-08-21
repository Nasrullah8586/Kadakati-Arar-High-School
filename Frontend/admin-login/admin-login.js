/* =====================================================
   API CONFIGURATION
===================================================== */
const API_BASE_URL = "https://kadakati-arar-high-school-api.onrender.com/api";


/* =====================================================
   LOGIN ELEMENTS
===================================================== */

const adminLoginForm =
    document.getElementById("adminLoginForm");

const loginInput =
    document.getElementById("login");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");

const eyeIcon =
    document.getElementById("eyeIcon");

const eyeOffIcon =
    document.getElementById("eyeOffIcon");


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";

            eyeIcon.classList.toggle(
                "hidden",
                !isPassword
            );

            eyeOffIcon.classList.toggle(
                "hidden",
                isPassword
            );

            togglePassword.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );
        }
    );
}


/* =====================================================
   ADMIN LOGIN
===================================================== */

adminLoginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const login =
            loginInput.value.trim();

        const password =
            passwordInput.value;


        if (!login || !password) {

            showLoginMessage(
                "Please enter email/username and password.",
                "error"
            );

            return;
        }


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";

        loginMessage.textContent = "";


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            login,
                            email: login,
                            password
                        })
                    }
                );


            const responseText =
                await response.text();


            let data = {};

            try {

                data =
                    JSON.parse(responseText);

            } catch (error) {

                throw new Error(
                    "Server returned an invalid response."
                );
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Invalid login credentials."
                );
            }


            if (!data.token) {

                throw new Error(
                    "Authentication token was not received."
                );
            }


            /* SAVE ADMIN TOKEN */

            localStorage.setItem(
                "adminToken",
                data.token
            );


            /* SAVE ADMIN DATA */

            if (data.admin) {

                localStorage.setItem(
                    "adminData",
                    JSON.stringify(data.admin)
                );
            }


            showLoginMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(function () {

                window.location.href =
                    "../admin-dashboard/admin-dashboard.html";

            }, 700);


        } catch (error) {

            console.error(
                "Admin Login Error:",
                error
            );


            if (
                error.message ===
                "Failed to fetch"
            ) {

                showLoginMessage(
                    "Unable to connect to the server. Please make sure the backend is running.",
                    "error"
                );

            } else {

                showLoginMessage(
                    error.message ||
                    "Invalid login credentials.",
                    "error"
                );
            }

        } finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Login";
        }
    }
);


/* =====================================================
   SHOW LOGIN MESSAGE
===================================================== */

function showLoginMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message " + type;
}


/* =====================================================
   RESET PASSWORD MODAL
===================================================== */

const resetModal =
    document.getElementById("resetModal");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

const closeResetModal =
    document.getElementById("closeResetModal");

const sendResetCodeBtn =
    document.getElementById("sendResetCodeBtn");

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");

const resetEmail =
    document.getElementById("resetEmail");

const resetCode =
    document.getElementById("resetCode");

const newPassword =
    document.getElementById("newPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const resetMessage =
    document.getElementById("resetMessage");


/* =====================================================
   OPEN RESET MODAL
===================================================== */

forgotPasswordBtn.addEventListener(
    "click",
    function () {

        resetModal.classList.remove(
            "hidden"
        );

        resetEmail.focus();
    }
);


/* =====================================================
   CLOSE RESET MODAL
===================================================== */

closeResetModal.addEventListener(
    "click",
    function () {

        resetModal.classList.add(
            "hidden"
        );
    }
);


/* =====================================================
   CLOSE WHEN CLICK OUTSIDE
===================================================== */

resetModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === resetModal
        ) {

            resetModal.classList.add(
                "hidden"
            );
        }
    }
);


/* =====================================================
   SEND RESET CODE
===================================================== */

sendResetCodeBtn.addEventListener(
    "click",
    async function () {

        const email =
            resetEmail.value.trim();


        if (!email) {

            showResetMessage(
                "Please enter your email.",
                "error"
            );

            return;
        }


        sendResetCodeBtn.disabled = true;

        sendResetCodeBtn.textContent =
            "Sending...";


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/auth/forgot-password`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to send reset code."
                );
            }


            showResetMessage(
                data.message ||
                "Reset code has been sent to your email.",
                "success"
            );


        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );

            showResetMessage(
                error.message ||
                "Unable to send reset code.",
                "error"
            );

        } finally {

            sendResetCodeBtn.disabled =
                false;

            sendResetCodeBtn.textContent =
                "Send Reset Code";
        }
    }
);


/* =====================================================
   RESET PASSWORD
===================================================== */

resetPasswordBtn.addEventListener(
    "click",
    async function () {

        const email =
            resetEmail.value.trim();

        const code =
            resetCode.value.trim();

        const password =
            newPassword.value;

        const confirm =
            confirmPassword.value;


        if (
            !email ||
            !code ||
            !password ||
            !confirm
        ) {

            showResetMessage(
                "Email, reset code and passwords are required.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showResetMessage(
                "New password must be at least 6 characters.",
                "error"
            );

            return;
        }


        if (password !== confirm) {

            showResetMessage(
                "New password and confirm password do not match.",
                "error"
            );

            return;
        }


        resetPasswordBtn.disabled = true;

        resetPasswordBtn.textContent =
            "Resetting...";


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/auth/reset-password`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            resetCode: code,
                            newPassword: password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to reset password."
                );
            }


            showResetMessage(
                "Password reset successful. You can now login.",
                "success"
            );


            setTimeout(function () {

                resetModal.classList.add(
                    "hidden"
                );

                resetCode.value = "";
                newPassword.value = "";
                confirmPassword.value = "";

            }, 1500);


        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            showResetMessage(
                error.message ||
                "Unable to reset password.",
                "error"
            );

        } finally {

            resetPasswordBtn.disabled =
                false;

            resetPasswordBtn.textContent =
                "Reset Password";
        }
    }
);


/* =====================================================
   RESET MESSAGE
===================================================== */

function showResetMessage(
    message,
    type
) {

    resetMessage.textContent =
        message;

    resetMessage.className =
        "login-message " + type;
}


/* =====================================================
   SIMPLE PASSWORD TOGGLE FOR RESET FIELDS
===================================================== */

document
    .querySelectorAll(".reset-toggle")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );

                if (!input) return;

                if (
                    input.type === "password"
                ) {

                    input.type = "text";

                } else {

                    input.type = "password";
                }
            }
        );
    });