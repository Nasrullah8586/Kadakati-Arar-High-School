// ======================================================
// TEACHER DASHBOARD
// Kadakati Arar High School
// ======================================================


// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL =
    "https://kadakati-arar-high-school-api.onrender.com/api";


// ======================================================
// GET TOKEN
// ======================================================

const token =
    localStorage.getItem("teacherToken");


// ======================================================
// ELEMENTS
// ======================================================

const loadingScreen =
    document.getElementById("loadingScreen");

const profileForm =
    document.getElementById("profileForm");

const editBtn =
    document.getElementById("editBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const formActions =
    document.getElementById("formActions");

const logoutBtn =
    document.getElementById("logoutBtn");

const statusMessage =
    document.getElementById("statusMessage");


// ======================================================
// FORM INPUTS
// ======================================================

const nameInput =
    document.getElementById("name");

const usernameInput =
    document.getElementById("username");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const divisionInput =
    document.getElementById("division");

const departmentInput =
    document.getElementById("department");

const subjectInput =
    document.getElementById("subject");

const aboutInput =
    document.getElementById("about");

const facebookInput =
    document.getElementById("facebook");

const linkedinInput =
    document.getElementById("linkedin");

const instagramInput =
    document.getElementById("instagram");


// ======================================================
// PHOTO ELEMENTS
// ======================================================

const photoInput =
    document.getElementById("photo");

const photoPreview =
    document.getElementById("photoPreview");

const photoDefaultPreview =
    document.getElementById(
        "photoDefaultPreview"
    );

const previewPhotoBtn =
    document.getElementById(
        "previewPhotoBtn"
    );

const removePhotoBtn =
    document.getElementById(
        "removePhotoBtn"
    );


// ======================================================
// PROFILE HEADER ELEMENTS
// ======================================================

const profileName =
    document.getElementById("profileName");

const profileDepartment =
    document.getElementById("profileDepartment");

const topbarName =
    document.getElementById("topbarName");

const topbarAvatar =
    document.getElementById("topbarAvatar");

const profilePhoto =
    document.getElementById("profilePhoto");

const defaultAvatar =
    document.getElementById("defaultAvatar");


// ======================================================
// ORIGINAL PROFILE DATA
// ======================================================

let originalProfile = null;


// ======================================================
// PAGE AUTH CHECK
// ======================================================

if (!token) {

    window.location.href =
        "../teacher-login/teacher-login.html";

}


// ======================================================
// SHOW STATUS
// ======================================================

function showStatus(message, type) {

    statusMessage.textContent =
        message;

    statusMessage.className =
        `status-message ${type}`;

    setTimeout(() => {

        statusMessage.className =
            "status-message";

    }, 4000);

}


// ======================================================
// SET PHOTO PREVIEW
// ======================================================

function setPhotoPreview(photoUrl, teacherName) {

    const firstLetter =
        (teacherName || "Teacher")
            .charAt(0)
            .toUpperCase();


    photoPreview.onerror = () => {

        photoPreview.style.display =
            "none";

        photoDefaultPreview.style.display =
            "flex";

        photoDefaultPreview.textContent =
            firstLetter;

    };


    if (photoUrl) {

        photoPreview.src =
            photoUrl;

        photoPreview.style.display =
            "block";

        photoDefaultPreview.style.display =
            "none";

    } else {

        photoPreview.removeAttribute("src");

        photoPreview.style.display =
            "none";

        photoDefaultPreview.style.display =
            "flex";

        photoDefaultPreview.textContent =
            firstLetter;

    }

}


// ======================================================
// LOAD TEACHER PROFILE
// ======================================================

async function loadProfile() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/teachers/me`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        // ----------------------------------------------
        // TOKEN INVALID / EXPIRED
        // ----------------------------------------------

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "teacherToken"
            );

            window.location.href =
                "../teacher-login/teacher-login.html";

            return;

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load profile"
            );

        }


        originalProfile =
            JSON.parse(
                JSON.stringify(data.teacher)
            );


        populateProfile(
            data.teacher
        );


    } catch (error) {

        console.error(
            "Load Profile Error:",
            error
        );

        showStatus(
            error.message ||
            "Could not load your profile.",
            "error"
        );

    } finally {

        loadingScreen.style.display =
            "none";

    }

}


// ======================================================
// POPULATE PROFILE
// ======================================================

function populateProfile(teacher) {

    // ----------------------------------------------
    // Form
    // ----------------------------------------------

    nameInput.value =
        teacher.name || "";

    usernameInput.value =
        teacher.username || "";

    emailInput.value =
        teacher.email || "";

    phoneInput.value =
        teacher.phone || "";

    divisionInput.value =
        teacher.division || "";

    departmentInput.value =
        teacher.department || "";

    subjectInput.value =
        teacher.subject || "";

    aboutInput.value =
        teacher.about || "";


    // ----------------------------------------------
    // Photo
    // ----------------------------------------------

    photoInput.value =
        teacher.photo || "";


    // ----------------------------------------------
    // Social Links
    // ----------------------------------------------

    facebookInput.value =
        teacher.socialLinks?.facebook || "";

    linkedinInput.value =
        teacher.socialLinks?.linkedin || "";

    instagramInput.value =
        teacher.socialLinks?.instagram || "";


    // ----------------------------------------------
    // Header
    // ----------------------------------------------

    const teacherName =
        teacher.name || "Teacher";

    profileName.textContent =
        teacherName;

    topbarName.textContent =
        teacherName;


    profileDepartment.textContent =
        `${teacher.division || ""} • ${teacher.department || ""}`;


    // ----------------------------------------------
    // Avatar
    // ----------------------------------------------

    const firstLetter =
        teacherName
            .charAt(0)
            .toUpperCase();


    topbarAvatar.textContent =
        firstLetter;

    defaultAvatar.textContent =
        firstLetter;


    if (teacher.photo) {

        profilePhoto.src =
            teacher.photo;

        profilePhoto.style.display =
            "block";

        defaultAvatar.style.display =
            "none";

        profilePhoto.onerror = () => {

            profilePhoto.style.display =
                "none";

            defaultAvatar.style.display =
                "flex";

        };

    } else {

        profilePhoto.removeAttribute("src");

        profilePhoto.style.display =
            "none";

        defaultAvatar.style.display =
            "flex";

    }


    // ----------------------------------------------
    // Photo Edit Preview
    // ----------------------------------------------

    setPhotoPreview(
        teacher.photo || "",
        teacherName
    );

}


// ======================================================
// SET EDIT MODE
// ======================================================

function setEditMode(enabled) {

    // ----------------------------------------------
    // Editable fields
    // ----------------------------------------------

    nameInput.disabled =
        !enabled;

    phoneInput.disabled =
        !enabled;

    divisionInput.disabled =
        !enabled;

    departmentInput.disabled =
        !enabled;

    subjectInput.disabled =
        !enabled;

    aboutInput.disabled =
        !enabled;

    facebookInput.disabled =
        !enabled;

    linkedinInput.disabled =
        !enabled;

    instagramInput.disabled =
        !enabled;

    // ----------------------------------------------
    // Photo
    // ----------------------------------------------

    photoInput.disabled =
        !enabled;

    previewPhotoBtn.disabled =
        !enabled;

    removePhotoBtn.disabled =
        !enabled;


    // ----------------------------------------------
    // Username & Email remain disabled
    // ----------------------------------------------

    usernameInput.disabled =
        true;

    emailInput.disabled =
        true;


    // ----------------------------------------------
    // Buttons
    // ----------------------------------------------

    if (enabled) {

        formActions.style.display =
            "flex";

        editBtn.style.display =
            "none";

    } else {

        formActions.style.display =
            "none";

        editBtn.style.display =
            "block";

    }

}


// ======================================================
// PHOTO PREVIEW BUTTON
// ======================================================

previewPhotoBtn.addEventListener(
    "click",
    () => {

        const photoUrl =
            photoInput.value.trim();


        if (!photoUrl) {

            showStatus(
                "Please enter a photo URL first.",
                "error"
            );

            return;

        }


        const teacherName =
            nameInput.value.trim() ||
            "Teacher";


        setPhotoPreview(
            photoUrl,
            teacherName
        );


        photoPreview.onload = () => {

            showStatus(
                "Photo preview loaded successfully.",
                "success"
            );

        };


        photoPreview.onerror = () => {

            showStatus(
                "Could not load this image URL.",
                "error"
            );

        };

    }
);


// ======================================================
// REMOVE PHOTO
// ======================================================

removePhotoBtn.addEventListener(
    "click",
    () => {

        photoInput.value =
            "";

        setPhotoPreview(
            "",
            nameInput.value.trim() ||
            "Teacher"
        );

    }
);


// ======================================================
// PHOTO URL LIVE PREVIEW
// ======================================================

photoInput.addEventListener(
    "change",
    () => {

        const photoUrl =
            photoInput.value.trim();


        if (!photoUrl) {

            setPhotoPreview(
                "",
                nameInput.value.trim() ||
                "Teacher"
            );

            return;

        }


        setPhotoPreview(
            photoUrl,
            nameInput.value.trim() ||
            "Teacher"
        );

    }
);


// ======================================================
// EDIT BUTTON
// ======================================================

editBtn.addEventListener(
    "click",
    () => {

        setEditMode(true);

    }
);


// ======================================================
// CANCEL EDIT
// ======================================================

cancelBtn.addEventListener(
    "click",
    () => {

        if (originalProfile) {

            populateProfile(
                originalProfile
            );

        }

        setEditMode(false);

    }
);


// ======================================================
// UPDATE PROFILE
// ======================================================

profileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const updatedData = {

            name:
                nameInput.value.trim(),

            photo:
                photoInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            division:
                divisionInput.value,

            department:
                departmentInput.value.trim(),

            subject:
                subjectInput.value.trim(),

            about:
                aboutInput.value.trim(),

            socialLinks: {

                facebook:
                    facebookInput.value.trim(),

                linkedin:
                    linkedinInput.value.trim(),

                instagram:
                    instagramInput.value.trim()

            }

        };


        // ----------------------------------------------
        // Disable Save Button
        // ----------------------------------------------

        const saveBtn =
            profileForm.querySelector(
                ".save-btn"
            );


        const originalButtonText =
            saveBtn.textContent;


        saveBtn.disabled =
            true;

        saveBtn.textContent =
            "Saving...";


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/teachers/me`,
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                updatedData
                            )

                    }
                );


            const data =
                await response.json();


            // ------------------------------------------
            // AUTH ERROR
            // ------------------------------------------

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem(
                    "teacherToken"
                );

                window.location.href =
                    "../teacher-login/teacher-login.html";

                return;

            }


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Profile update failed"
                );

            }


            // ------------------------------------------
            // Update Local Profile
            // ------------------------------------------

            originalProfile =
                JSON.parse(
                    JSON.stringify(
                        data.teacher
                    )
                );


            populateProfile(
                data.teacher
            );


            setEditMode(false);


            showStatus(
                "Profile updated successfully!",
                "success"
            );


        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            showStatus(
                error.message ||
                "Failed to update profile.",
                "error"
            );

        } finally {

            saveBtn.disabled =
                false;

            saveBtn.textContent =
                originalButtonText;

        }

    }
);


// ======================================================
// LOGOUT
// ======================================================

logoutBtn.addEventListener(
    "click",
    () => {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {
            return;
        }


        localStorage.removeItem(
            "teacherToken"
        );


        window.location.href =
            "../teacher-login/teacher-login.html";

    }
);


// ======================================================
// START
// ======================================================

loadProfile();