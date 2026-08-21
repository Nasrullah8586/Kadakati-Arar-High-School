// ======================================================
// TEACHER DASHBOARD
// Kadakati Arar High School
// ======================================================

const API_BASE_URL =
    "https://kadakati-arar-high-school-api.onrender.com/api";

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
    document.getElementById("photoInput");

const browsePhotoBtn =
    document.getElementById("browsePhotoBtn");

const previewPhotoBtn =
    document.getElementById("previewPhotoBtn");

const removePhotoBtn =
    document.getElementById("removePhotoBtn");

const photoPreview =
    document.getElementById("photoPreview");

const photoDefault =
    document.getElementById("photoDefault");


// ======================================================
// PROFILE HEADER
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
// VARIABLES
// ======================================================

let originalProfile = null;

let selectedPhotoFile = null;

let selectedPhotoPreviewURL = null;

let photoRemoved = false;


// ======================================================
// AUTH CHECK
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
// LOAD PROFILE
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
                JSON.stringify(
                    data.teacher
                )
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


    facebookInput.value =
        teacher.socialLinks?.facebook || "";

    linkedinInput.value =
        teacher.socialLinks?.linkedin || "";

    instagramInput.value =
        teacher.socialLinks?.instagram || "";


    const teacherName =
        teacher.name || "Teacher";


    profileName.textContent =
        teacherName;

    topbarName.textContent =
        teacherName;


    profileDepartment.textContent =
        `${teacher.division || ""} • ${teacher.department || ""}`;


    const firstLetter =
        teacherName
            .charAt(0)
            .toUpperCase();


    topbarAvatar.textContent =
        firstLetter;

    defaultAvatar.textContent =
        firstLetter;

    photoDefault.textContent =
        firstLetter;


    if (teacher.photo) {

        profilePhoto.src =
            teacher.photo;

        profilePhoto.style.display =
            "block";

        defaultAvatar.style.display =
            "none";


        photoPreview.src =
            teacher.photo;

        photoPreview.style.display =
            "block";

        photoDefault.style.display =
            "none";


        profilePhoto.onerror = () => {

            profilePhoto.style.display =
                "none";

            defaultAvatar.style.display =
                "flex";

        };


        photoPreview.onerror = () => {

            photoPreview.style.display =
                "none";

            photoDefault.style.display =
                "flex";

        };

    } else {

        profilePhoto.style.display =
            "none";

        defaultAvatar.style.display =
            "flex";

        photoPreview.style.display =
            "none";

        photoDefault.style.display =
            "flex";

    }


    selectedPhotoFile =
        null;

    photoRemoved =
        false;

    if (photoInput) {
        photoInput.value = "";
    }

}


// ======================================================
// EDIT MODE
// ======================================================

function setEditMode(enabled) {

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


    usernameInput.disabled =
        true;

    emailInput.disabled =
        true;


    if (photoInput) {

        photoInput.disabled =
            !enabled;

    }


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
// BROWSE PHOTO
// ======================================================

browsePhotoBtn.addEventListener(
    "click",
    () => {

        if (photoInput.disabled) {

            showStatus(
                "Please click Edit Profile first.",
                "error"
            );

            return;

        }

        photoInput.click();

    }
);


// ======================================================
// SELECT PHOTO
// ======================================================

photoInput.addEventListener(
    "change",
    () => {

        const file =
            photoInput.files[0];


        if (!file) {
            return;
        }


        // ----------------------------------------------
        // FILE TYPE
        // ----------------------------------------------

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            photoInput.value = "";

            showStatus(
                "Please select a JPG, PNG or WebP image.",
                "error"
            );

            return;

        }


        // ----------------------------------------------
        // FILE SIZE - 5MB
        // ----------------------------------------------

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            photoInput.value = "";

            showStatus(
                "Photo size must be less than 5MB.",
                "error"
            );

            return;

        }


        selectedPhotoFile =
            file;

        photoRemoved =
            false;


        // ----------------------------------------------
        // LOCAL PREVIEW
        // ----------------------------------------------

        if (selectedPhotoPreviewURL) {

            URL.revokeObjectURL(
                selectedPhotoPreviewURL
            );

        }


        selectedPhotoPreviewURL =
            URL.createObjectURL(file);


        photoPreview.src =
            selectedPhotoPreviewURL;

        photoPreview.style.display =
            "block";

        photoDefault.style.display =
            "none";


        // Header preview

        profilePhoto.src =
            selectedPhotoPreviewURL;

        profilePhoto.style.display =
            "block";

        defaultAvatar.style.display =
            "none";


        showStatus(
            "Photo selected. Click Save Changes to save it.",
            "success"
        );

    }
);


// ======================================================
// PREVIEW PHOTO
// ======================================================

previewPhotoBtn.addEventListener(
    "click",
    () => {

        if (
            !photoPreview.src ||
            photoPreview.style.display === "none"
        ) {

            showStatus(
                "Please select a photo first.",
                "error"
            );

            return;

        }


        window.open(
            photoPreview.src,
            "_blank"
        );

    }
);


// ======================================================
// REMOVE PHOTO
// ======================================================

removePhotoBtn.addEventListener(
    "click",
    () => {

        if (photoInput.disabled) {

            showStatus(
                "Please click Edit Profile first.",
                "error"
            );

            return;

        }


        selectedPhotoFile =
            null;

        photoRemoved =
            true;


        photoInput.value =
            "";


        if (selectedPhotoPreviewURL) {

            URL.revokeObjectURL(
                selectedPhotoPreviewURL
            );

            selectedPhotoPreviewURL =
                null;

        }


        const teacherName =
            nameInput.value ||
            "Teacher";


        const firstLetter =
            teacherName
                .charAt(0)
                .toUpperCase();


        photoDefault.textContent =
            firstLetter;


        photoPreview.removeAttribute(
            "src"
        );

        photoPreview.style.display =
            "none";

        photoDefault.style.display =
            "flex";


        profilePhoto.removeAttribute(
            "src"
        );

        profilePhoto.style.display =
            "none";

        defaultAvatar.textContent =
            firstLetter;

        defaultAvatar.style.display =
            "flex";


        showStatus(
            "Photo removed. Click Save Changes to confirm.",
            "success"
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
// CANCEL
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

            /*
             * IMPORTANT
             *
             * If a new photo is selected,
             * send multipart/form-data.
             *
             * If no new photo is selected,
             * send normal JSON.
             */


            let response;


            if (selectedPhotoFile) {

                const formData =
                    new FormData();


                formData.append(
                    "name",
                    nameInput.value.trim()
                );

                formData.append(
                    "phone",
                    phoneInput.value.trim()
                );

                formData.append(
                    "division",
                    divisionInput.value
                );

                formData.append(
                    "department",
                    departmentInput.value.trim()
                );

                formData.append(
                    "subject",
                    subjectInput.value.trim()
                );

                formData.append(
                    "about",
                    aboutInput.value.trim()
                );


                formData.append(
                    "facebook",
                    facebookInput.value.trim()
                );

                formData.append(
                    "linkedin",
                    linkedinInput.value.trim()
                );

                formData.append(
                    "instagram",
                    instagramInput.value.trim()
                );


                formData.append(
                    "photo",
                    selectedPhotoFile
                );


                response =
                    await fetch(
                        `${API_BASE_URL}/teachers/me`,
                        {
                            method: "PUT",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: formData
                        }
                    );

            } else {

                const updatedData = {

                    name:
                        nameInput.value.trim(),

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


                /*
                 * Empty photo means remove photo.
                 */

                if (photoRemoved) {

                    updatedData.photo = "";

                }


                response =
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

            }


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
            // UPDATE LOCAL PROFILE
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