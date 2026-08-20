/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    "http://localhost:5000";


/* =========================================================
   LOGIN DOM ELEMENTS
========================================================= */

const loginSection =
    document.getElementById(
        "loginSection"
    );

const teacherLoginForm =
    document.getElementById(
        "teacherLoginForm"
    );

const loginInput =
    document.getElementById(
        "loginInput"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const passwordToggle =
    document.getElementById(
        "passwordToggle"
    );

const passwordEyeIcon =
    document.getElementById(
        "passwordEyeIcon"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const forgotPasswordLink =
    document.getElementById(
        "forgotPasswordLink"
    );


/* =========================================================
   RESET DOM ELEMENTS
========================================================= */

const resetSection =
    document.getElementById(
        "resetSection"
    );

const forgotPasswordForm =
    document.getElementById(
        "forgotPasswordForm"
    );

const resetEmailInput =
    document.getElementById(
        "resetEmail"
    );

const sendCodeButton =
    document.getElementById(
        "sendCodeButton"
    );

const forgotMessage =
    document.getElementById(
        "forgotMessage"
    );

const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );

const resetCodeInput =
    document.getElementById(
        "resetCode"
    );

const newPasswordInput =
    document.getElementById(
        "newPassword"
    );

const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );

const newPasswordToggle =
    document.getElementById(
        "newPasswordToggle"
    );

const newPasswordEyeIcon =
    document.getElementById(
        "newPasswordEyeIcon"
    );

const confirmPasswordToggle =
    document.getElementById(
        "confirmPasswordToggle"
    );

const confirmPasswordEyeIcon =
    document.getElementById(
        "confirmPasswordEyeIcon"
    );

const resetButton =
    document.getElementById(
        "resetButton"
    );

const resetMessage =
    document.getElementById(
        "resetMessage"
    );

const backToLogin =
    document.getElementById(
        "backToLogin"
    );

const resetDescription =
    document.getElementById(
        "resetDescription"
    );


/* =========================================================
   SVG EYE ICONS
========================================================= */

const EYE_ICON = `
    <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
    ></path>

    <circle
        cx="12"
        cy="12"
        r="3"
    ></circle>
`;


const EYE_SLASH_ICON = `
    <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
    ></path>

    <circle
        cx="12"
        cy="12"
        r="3"
    ></circle>

    <line
        x1="3"
        y1="3"
        x2="21"
        y2="21"
    ></line>
`;


/* =========================================================
   TOGGLE PASSWORD VISIBILITY
========================================================= */

function togglePasswordVisibility(
    input,
    button,
    icon
) {

    if (
        !input ||
        !button ||
        !icon
    ) {
        return;
    }


    if (
        input.type ===
        "password"
    ) {

        input.type =
            "text";

        icon.innerHTML =
            EYE_SLASH_ICON;

        button.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        input.type =
            "password";

        icon.innerHTML =
            EYE_ICON;

        button.setAttribute(
            "aria-label",
            "Show password"
        );

    }

}


/* =========================================================
   LOGIN PASSWORD TOGGLE
========================================================= */

if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        function () {

            togglePasswordVisibility(
                passwordInput,
                passwordToggle,
                passwordEyeIcon
            );

        }
    );

}


/* =========================================================
   NEW PASSWORD TOGGLE
========================================================= */

if (newPasswordToggle) {

    newPasswordToggle.addEventListener(
        "click",
        function () {

            togglePasswordVisibility(
                newPasswordInput,
                newPasswordToggle,
                newPasswordEyeIcon
            );

        }
    );

}


/* =========================================================
   CONFIRM PASSWORD TOGGLE
========================================================= */

if (confirmPasswordToggle) {

    confirmPasswordToggle.addEventListener(
        "click",
        function () {

            togglePasswordVisibility(
                confirmPasswordInput,
                confirmPasswordToggle,
                confirmPasswordEyeIcon
            );

        }
    );

}


/* =========================================================
   SHOW LOGIN SECTION
========================================================= */

function showLoginSection() {

    if (loginSection) {

        loginSection.style.display =
            "block";

    }


    if (resetSection) {

        resetSection.classList.remove(
            "active"
        );

    }


    if (forgotPasswordForm) {

        forgotPasswordForm.style.display =
            "block";

    }


    if (resetPasswordForm) {

        resetPasswordForm.style.display =
            "none";

    }


    if (forgotMessage) {

        forgotMessage.textContent =
            "";

    }


    if (resetMessage) {

        resetMessage.textContent =
            "";

    }


    if (resetEmailInput) {

        resetEmailInput.value =
            "";

    }


    if (resetCodeInput) {

        resetCodeInput.value =
            "";

    }


    if (newPasswordInput) {

        newPasswordInput.value =
            "";

    }


    if (confirmPasswordInput) {

        confirmPasswordInput.value =
            "";

    }

}


/* =========================================================
   SHOW RESET SECTION
========================================================= */

function showResetSection() {

    if (loginSection) {

        loginSection.style.display =
            "none";

    }


    if (resetSection) {

        resetSection.classList.add(
            "active"
        );

    }


    if (forgotPasswordForm) {

        forgotPasswordForm.style.display =
            "block";

    }


    if (resetPasswordForm) {

        resetPasswordForm.style.display =
            "none";

    }


    if (resetDescription) {

        resetDescription.textContent =
            "Enter your teacher account email to receive a verification code.";

    }


    if (forgotMessage) {

        forgotMessage.textContent =
            "";

    }


    if (resetMessage) {

        resetMessage.textContent =
            "";

    }

}


/* =========================================================
   FORGOT PASSWORD LINK
========================================================= */

if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showResetSection();

        }
    );

}


/* =========================================================
   BACK TO LOGIN
========================================================= */

if (backToLogin) {

    backToLogin.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showLoginSection();

        }
    );

}


/* =========================================================
   TEACHER LOGIN
   USERNAME OR EMAIL
========================================================= */

if (teacherLoginForm) {

    teacherLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const loginValue =
                loginInput.value.trim();

            const password =
                passwordInput.value;


            // --------------------------------------------------
            // VALIDATION
            // --------------------------------------------------

            if (
                !loginValue ||
                !password
            ) {

                loginMessage.textContent =
                    "Please enter username/email and password.";

                return;

            }


            // --------------------------------------------------
            // BUTTON STATE
            // --------------------------------------------------

            loginButton.disabled =
                true;

            loginButton.textContent =
                "Logging in...";

            loginMessage.textContent =
                "";


            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/api/teachers/login`,

                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    login:
                                        loginValue,

                                    password

                                })

                        }

                    );


                const responseText =
                    await response.text();


                let data =
                    {};


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (
                    parseError
                ) {

                    console.error(
                        "Server returned non-JSON response:",
                        responseText
                    );

                    throw new Error(
                        "Unable to connect to the login server."
                    );

                }


                if (!response.ok) {

                    throw new Error(

                        data.message ||
                        "Invalid username/email or password."

                    );

                }


                // --------------------------------------------------
                // SAVE TOKEN
                // --------------------------------------------------

                if (!data.token) {

                    throw new Error(
                        "Login successful, but no authentication token was received."
                    );

                }


                localStorage.setItem(
                    "teacherToken",
                    data.token
                );


                // --------------------------------------------------
                // SUCCESS
                // --------------------------------------------------

                loginMessage.textContent =
                    "Login successful!";


                setTimeout(
                    function () {

                        window.location.href =
                            "../teacher-dashboard/teacher-dashboard.html";

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Teacher Login Error:",
                    error
                );


                loginMessage.textContent =
                    error.message ||
                    "Invalid username/email or password.";

            } finally {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";

            }

        }
    );

}


/* =========================================================
   FORGOT PASSWORD — SEND RESET CODE
========================================================= */

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                resetEmailInput.value
                    .trim()
                    .toLowerCase();


            // --------------------------------------------------
            // VALIDATION
            // --------------------------------------------------

            if (!email) {

                forgotMessage.textContent =
                    "Please enter your email address.";

                return;

            }


            // --------------------------------------------------
            // BUTTON STATE
            // --------------------------------------------------

            sendCodeButton.disabled =
                true;

            sendCodeButton.textContent =
                "Sending...";

            forgotMessage.textContent =
                "";


            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/api/teachers/forgot-password`,

                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email

                                })

                        }

                    );


                const responseText =
                    await response.text();


                let data =
                    {};


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (
                    parseError
                ) {

                    console.error(
                        "Forgot password response:",
                        responseText
                    );

                    throw new Error(
                        "Server returned an invalid response."
                    );

                }


                if (!response.ok) {

                    throw new Error(

                        data.message ||
                        "Unable to send verification code."

                    );

                }


                // --------------------------------------------------
                // STORE EMAIL
                // --------------------------------------------------

                resetEmailInput.dataset.email =
                    email;


                // --------------------------------------------------
                // SUCCESS
                // --------------------------------------------------

                forgotMessage.textContent =
                    data.message ||
                    "Verification code sent. Please check your email.";


                forgotMessage.style.color =
                    "#176B45";


                forgotPasswordForm.style.display =
                    "none";


                resetPasswordForm.style.display =
                    "block";


                resetDescription.textContent =
                    "Enter the verification code sent to your email, then create a new password.";


            } catch (error) {

                console.error(
                    "Forgot Password Error:",
                    error
                );


                forgotMessage.textContent =
                    error.message ||
                    "Unable to send verification code.";


                forgotMessage.style.color =
                    "red";

            } finally {

                sendCodeButton.disabled =
                    false;

                sendCodeButton.textContent =
                    "Send Verification Code";

            }

        }
    );

}


/* =========================================================
   RESET PASSWORD
========================================================= */

if (resetPasswordForm) {

    resetPasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // --------------------------------------------------
            // GET DATA
            // --------------------------------------------------

            const email =
                resetEmailInput.dataset.email ||
                resetEmailInput.value
                    .trim()
                    .toLowerCase();


            const resetCode =
                resetCodeInput.value.trim();


            const newPassword =
                newPasswordInput.value;


            const confirmPassword =
                confirmPasswordInput.value;


            // --------------------------------------------------
            // VALIDATION
            // --------------------------------------------------

            if (!email) {

                resetMessage.textContent =
                    "Email address is missing. Please start again.";

                resetMessage.style.color =
                    "red";

                return;

            }


            if (!resetCode) {

                resetMessage.textContent =
                    "Please enter the verification code.";

                resetMessage.style.color =
                    "red";

                return;

            }


            if (!newPassword) {

                resetMessage.textContent =
                    "Please enter a new password.";

                resetMessage.style.color =
                    "red";

                return;

            }


            if (
                newPassword.length < 6
            ) {

                resetMessage.textContent =
                    "New password must be at least 6 characters.";

                resetMessage.style.color =
                    "red";

                return;

            }


            if (!confirmPassword) {

                resetMessage.textContent =
                    "Please confirm your new password.";

                resetMessage.style.color =
                    "red";

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                resetMessage.textContent =
                    "Passwords do not match.";

                resetMessage.style.color =
                    "red";

                return;

            }


            // --------------------------------------------------
            // BUTTON STATE
            // --------------------------------------------------

            resetButton.disabled =
                true;

            resetButton.textContent =
                "Resetting...";

            resetMessage.textContent =
                "";


            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/api/teachers/reset-password`,

                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            /*
                             * IMPORTANT:
                             *
                             * Backend expects:
                             * email
                             * resetCode
                             * newPassword
                             */

                            body:
                                JSON.stringify({

                                    email:
                                        email,

                                    resetCode:
                                        resetCode,

                                    newPassword:
                                        newPassword

                                })

                        }

                    );


                const responseText =
                    await response.text();


                let data =
                    {};


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (
                    parseError
                ) {

                    console.error(
                        "Reset password response:",
                        responseText
                    );

                    throw new Error(
                        "Server returned an invalid response."
                    );

                }


                if (!response.ok) {

                    throw new Error(

                        data.message ||
                        "Unable to reset password."

                    );

                }


                // --------------------------------------------------
                // SUCCESS
                // --------------------------------------------------

                resetMessage.textContent =
                    data.message ||
                    "Password reset successful. You can now login.";

                resetMessage.style.color =
                    "#176B45";


                // Clear sensitive data

                resetCodeInput.value =
                    "";

                newPasswordInput.value =
                    "";

                confirmPasswordInput.value =
                    "";


                // --------------------------------------------------
                // RETURN TO LOGIN
                // --------------------------------------------------

                setTimeout(
                    function () {

                        showLoginSection();


                        loginMessage.textContent =
                            "Password reset successful. Please login with your new password.";

                        loginMessage.style.color =
                            "#176B45";


                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Reset Password Error:",
                    error
                );


                resetMessage.textContent =
                    error.message ||
                    "Unable to reset password.";

                resetMessage.style.color =
                    "red";


            } finally {

                setTimeout(
                    function () {

                        resetButton.disabled =
                            false;

                        resetButton.textContent =
                            "Reset Password";

                    },
                    1500
                );

            }

        }
    );

}


/* =========================================================
   INITIAL STATE
========================================================= */

showLoginSection();