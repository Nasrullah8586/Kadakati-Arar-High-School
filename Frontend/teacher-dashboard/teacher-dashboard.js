// ======================================================
// TEACHER DASHBOARD
// Kadakati Arar High School
// ======================================================

const API_BASE_URL =
    "https://kadakati-arar-high-school-api.onrender.com/api";

// ======================================================
// TOKEN
// ======================================================

const token = localStorage.getItem("teacherToken");

if (!token) {
    window.location.href =
        "../teacher-login/teacher-login.html";
}

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
// DATA
// ======================================================

let originalProfile = null;

let selectedPhoto = null;

let removePhoto = false;

// ======================================================
// STATUS
// ======================================================

function showStatus(message, type) {

    statusMessage.textContent = message;

    statusMessage.className =
        `status-message ${type}`;

    setTimeout(() => {

        statusMessage.className =
            "status-message";

    }, 4000);
}

// ======================================================
// PHOTO PREVIEW
// ======================================================

function showPhotoPreview(photoSource, teacherName = "Teacher") {

    const firstLetter =
        teacherName
            .charAt(0)
            .toUpperCase();

    if (photoSource) {

        photoPreview.src = photoSource;

        photoPreview.style.display = "block";

        photoDefault.style.display = "none";

    } else {

        photoPreview.src = "";

        photoPreview.style.display = "none";

        photoDefault.textContent = firstLetter;

        photoDefault.style.display = "flex";
    }
}

// ======================================================
// UPDATE HEADER PHOTO
// ======================================================

function updateProfilePhoto(photoSource, teacherName) {

    const firstLetter =
        (teacherName || "Teacher")
            .charAt(0)
            .toUpperCase();

    topbarAvatar.innerHTML = "";

    if (photoSource) {

        const avatarImage =
            document.createElement("img");

        avatarImage.src = photoSource;

        avatarImage.alt = "Teacher Photo";

        avatarImage.onerror = () => {

            topbarAvatar.innerHTML = "";

            topbarAvatar.textContent =
                firstLetter;
        };

        topbarAvatar.appendChild(
            avatarImage
        );

        profilePhoto.src =
            photoSource;

        profilePhoto.style.display =
            "block";

        defaultAvatar.style.display =
            "none";

        profilePhoto.onerror = () => {

            profilePhoto.style.display =
                "none";

            defaultAvatar.style.display =
                "flex";

            defaultAvatar.textContent =
                firstLetter;
        };

    } else {

        topbarAvatar.textContent =
            firstLetter;

        profilePhoto.src = "";

        profilePhoto.style.display =
            "none";

        defaultAvatar.style.display =
            "flex";

        defaultAvatar.textContent =
            firstLetter;
    }
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

        setEditMode(false);

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

    updateProfilePhoto(
        teacher.photo || "",
        teacherName
    );

    showPhotoPreview(
        teacher.photo || "",
        teacherName
    );

    selectedPhoto = null;

    removePhoto = false;

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

    usernameInput.disabled = true;

    emailInput.disabled = true;

    if (enabled) {

        formActions.style.display =
            "flex";

        editBtn.style.display =
            "none";

        photoInput.disabled = false;

        browsePhotoBtn.disabled = false;

        previewPhotoBtn.disabled = false;

        removePhotoBtn.disabled = false;

        browsePhotoBtn.style.opacity = "1";

        previewPhotoBtn.style.opacity = "1";

        removePhotoBtn.style.opacity = "1";

    } else {

        formActions.style.display =
            "none";

        editBtn.style.display =
            "block";

        photoInput.disabled = true;

        browsePhotoBtn.disabled = true;

        previewPhotoBtn.disabled = true;

        removePhotoBtn.disabled = true;

        browsePhotoBtn.style.opacity = "0.55";

        previewPhotoBtn.style.opacity = "0.55";

        removePhotoBtn.style.opacity = "0.55";
    }
}

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
// BROWSE PHOTO
// ======================================================

browsePhotoBtn.addEventListener(
    "click",
    () => {

        if (photoInput.disabled) {
            return;
        }

        photoInput.click();

    }
);

// ======================================================
// PHOTO SELECT
// ======================================================

photoInput.addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

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

            showStatus(
                "Please select JPG, PNG or WebP image.",
                "error"
            );

            photoInput.value = "";

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showStatus(
                "Image size must be less than 5 MB.",
                "error"
            );

            photoInput.value = "";

            return;
        }

        selectedPhoto = file;

        removePhoto = false;

        const reader =
            new FileReader();

        reader.onload = () => {

            showPhotoPreview(
                reader.result,
                nameInput.value || "Teacher"
            );

        };

        reader.readAsDataURL(file);
    }
);

// ======================================================
// PREVIEW PHOTO
// ======================================================

previewPhotoBtn.addEventListener(
    "click",
    () => {

        if (
            !selectedPhoto &&
            !photoPreview.src
        ) {

            showStatus(
                "Please select a photo first.",
                "error"
            );

            return;
        }

        if (photoPreview.src) {

            window.open(
                photoPreview.src,
                "_blank"
            );
        }
    }
);

// ======================================================
// REMOVE PHOTO
// ======================================================

removePhotoBtn.addEventListener(
    "click",
    () => {

        if (removePhotoBtn.disabled) {
            return;
        }

        selectedPhoto = null;

        removePhoto = true;

        photoInput.value = "";

        showPhotoPreview(
            "",
            nameInput.value || "Teacher"
        );
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
// CONVERT IMAGE TO BASE64
// ======================================================

function convertImageToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload = () => {

                resolve(
                    reader.result
                );
            };

            reader.onerror = () => {

                reject(
                    new Error(
                        "Could not read selected image."
                    )
                );
            };

            reader.readAsDataURL(file);
        }
    );
}

// ======================================================
// SAVE PROFILE
// ======================================================

profileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const saveBtn =
            profileForm.querySelector(
                ".save-btn"
            );

        const originalText =
            saveBtn.textContent;

        saveBtn.disabled = true;

        saveBtn.textContent =
            "Saving...";

        try {

            let photoValue =
                originalProfile?.photo || "";

            if (removePhoto) {

                photoValue = "";
            }

            if (selectedPhoto) {

                photoValue =
                    await convertImageToBase64(
                        selectedPhoto
                    );
            }

            const updatedData = {

                name:
                    nameInput.value.trim(),

                photo:
                    photoValue,

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

            saveBtn.disabled = false;

            saveBtn.textContent =
                originalText;
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