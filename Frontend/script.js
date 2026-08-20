/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = "http://localhost:5000";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const loginMenu =
    document.getElementById("loginMenu");

const teacherLoginBtn =
    document.getElementById("teacherLoginBtn");

const adminLoginBtn =
    document.getElementById("adminLoginBtn");

const schoolLocationBtn =
    document.getElementById("schoolLocationBtn");

const aboutToggle =
    document.getElementById("aboutToggle");

const aboutPanel =
    document.getElementById("aboutPanel");

const navAboutLink =
    document.getElementById("navAboutLink");

const schoolAbout =
    document.getElementById("schoolAbout");

const schoolHistory =
    document.getElementById("schoolHistory");

const schoolAddress =
    document.getElementById("schoolAddress");

const schoolPhone =
    document.getElementById("schoolPhone");

const schoolEmail =
    document.getElementById("schoolEmail");

const googleMapsLink =
    document.getElementById("googleMapsLink");

const facebookLink =
    document.getElementById("facebookLink");

const instagramLink =
    document.getElementById("instagramLink");

const linkedinLink =
    document.getElementById("linkedinLink");

const noticeList =
    document.getElementById("noticeList");

const newsEventList =
    document.getElementById("newsEventList");

const galleryList =
    document.getElementById("galleryList");

const teacherList =
    document.getElementById("teacherList");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================================================
   LOGIN MENU
========================================================= */

if (menuToggle && loginMenu) {

    menuToggle.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const isOpen =
                loginMenu.classList.toggle("show");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !loginMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                loginMenu.classList.remove("show");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   LOGIN NAVIGATION
========================================================= */

if (teacherLoginBtn) {

    teacherLoginBtn.addEventListener("click", function () {

        window.location.href = "teacher-login/teacher-login.html";

    });

}


if (adminLoginBtn) {

    adminLoginBtn.addEventListener("click", function () {

        window.location.href = "admin-login/admin-login.html";

    });

}

/* =========================================================
   ABOUT PANEL
========================================================= */

function openAboutPanel() {

    if (!aboutPanel || !aboutToggle) {
        return;
    }

    aboutPanel.classList.add("show");

    aboutToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    aboutPanel.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeAboutPanel() {

    if (!aboutPanel || !aboutToggle) {
        return;
    }

    aboutPanel.classList.remove("show");

    aboutToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    aboutPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (aboutToggle) {

    aboutToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                aboutPanel.classList.toggle("show");

            aboutToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

            aboutPanel.setAttribute(
                "aria-hidden",
                !isOpen
            );

        }
    );

}


/* =========================================================
   ABOUT NAVIGATION
========================================================= */

if (navAboutLink) {

    navAboutLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const homeSection =
                document.getElementById("home");

            if (homeSection) {

                homeSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

            setTimeout(
                function () {
                    openAboutPanel();
                },
                400
            );

        }
    );

}


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {

        return escapeHTML(dateValue);

    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


function showLoading(
    element,
    text = "Loading..."
) {

    if (element) {

        element.innerHTML =
            `<p>${escapeHTML(text)}</p>`;

    }

}


function showError(
    element,
    text = "Unable to load information."
) {

    if (element) {

        element.innerHTML =
            `<p>${escapeHTML(text)}</p>`;

    }

}


/* =========================================================
   SITE CONTENT
========================================================= */

async function loadSiteContent() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/site-content`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load site content."
            );

        }


        const content =
            data.content;


        /* ABOUT */

        if (schoolAbout) {

            schoolAbout.textContent =
                content.about ||
                "School information is not available.";

        }


        /* HISTORY */

        if (schoolHistory) {

            schoolHistory.textContent =
                content.history ||
                "School history is not available.";

        }


        /* ADDRESS */

        if (schoolAddress) {

            schoolAddress.textContent =
                content.address ||
                "Address is not available.";

        }


        /* PHONE */

        if (schoolPhone) {

            schoolPhone.textContent =
                content.phone ||
                "Phone number is not available.";

        }


        /* EMAIL */

        if (schoolEmail) {

            schoolEmail.textContent =
                content.email ||
                "Email is not available.";

        }


        /* GOOGLE MAPS */

        if (googleMapsLink) {

            if (content.googleMapsLink) {

                googleMapsLink.href =
                    content.googleMapsLink;

                googleMapsLink.style.display =
                    "inline-block";

            } else {

                googleMapsLink.style.display =
                    "none";

            }

        }


        /* SCHOOL LOCATION */

        if (schoolLocationBtn) {

            if (content.googleMapsLink) {

                schoolLocationBtn.href =
                    content.googleMapsLink;

                schoolLocationBtn.style.display =
                    "inline-block";

            } else {

                schoolLocationBtn.style.display =
                    "none";

            }

        }


        /* SOCIAL LINKS */

        setupSocialLink(
            facebookLink,
            content.socialLinks?.facebook
        );

        setupSocialLink(
            instagramLink,
            content.socialLinks?.instagram
        );

        setupSocialLink(
            linkedinLink,
            content.socialLinks?.linkedin
        );


    } catch (error) {

        console.error(
            "Site Content Error:",
            error
        );


        if (schoolAbout) {

            schoolAbout.textContent =
                "School information could not be loaded.";

        }


        if (schoolHistory) {

            schoolHistory.textContent =
                "School history could not be loaded.";

        }

    }

}


/* =========================================================
   SOCIAL LINK HELPER
========================================================= */

function setupSocialLink(
    element,
    url
) {

    if (!element) {
        return;
    }


    if (
        url &&
        String(url).trim() !== ""
    ) {

        element.href = url;

        element.target = "_blank";

        element.rel =
            "noopener noreferrer";

        element.style.display =
            "inline-flex";

    } else {

        element.style.display =
            "none";

    }

}


/* =========================================================
   NOTICE
========================================================= */

async function loadNotices() {

    if (!noticeList) {
        return;
    }


    showLoading(
        noticeList,
        "Loading notices..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/notice`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load notices."
            );

        }


        let notices = [];


        if (Array.isArray(data)) {

            notices = data;

        } else if (
            Array.isArray(data.notices)
        ) {

            notices = data.notices;

        } else if (
            data.data &&
            Array.isArray(data.data)
        ) {

            notices = data.data;

        } else if (
            data.success &&
            Array.isArray(data.notice)
        ) {

            notices = data.notice;

        }


        notices =
            notices.filter(
                notice =>
                    notice.published !== false
            );


        if (notices.length === 0) {

            noticeList.innerHTML =
                `<p>No notices available at the moment.</p>`;

            return;

        }


        noticeList.innerHTML =
            notices.map(
                notice => {

                    return `
                        <article class="notice-card">

                            ${
                                notice.date
                                    ? `
                                        <span class="notice-date">
                                            ${formatDate(
                                                notice.date
                                            )}
                                        </span>
                                    `
                                    : ""
                            }

                            <h3>
                                ${escapeHTML(
                                    notice.title ||
                                    "School Notice"
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    notice.description ||
                                    ""
                                )}
                            </p>

                        </article>
                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "Notice Error:",
            error
        );


        showError(
            noticeList,
            "Unable to load notices."
        );

    }

}


/* =========================================================
   NEWS & EVENTS
========================================================= */

async function loadNewsEvents() {

    if (!newsEventList) {
        return;
    }


    showLoading(
        newsEventList,
        "Loading news and events..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/news-events`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load news and events."
            );

        }


        let items = [];


        if (Array.isArray(data)) {

            items = data;

        } else if (
            Array.isArray(data.newsEvents)
        ) {

            items = data.newsEvents;

        } else if (
            data.data &&
            Array.isArray(data.data)
        ) {

            items = data.data;

        }


        items =
            items.filter(
                item =>
                    item.published !== false
            );


        if (items.length === 0) {

            newsEventList.innerHTML =
                `<p>No news or events available at the moment.</p>`;

            return;

        }


        newsEventList.innerHTML =
            items.map(
                item => {

                    const image =
                        item.image ||
                        item.imageUrl ||
                        "";


                    return `
                        <article class="news-card">

                            ${
                                image
                                    ? `
                                        <img
                                            src="${escapeHTML(
                                                image
                                            )}"
                                            alt="${escapeHTML(
                                                item.title ||
                                                "School News"
                                            )}"
                                            class="news-card-image"
                                        >
                                    `
                                    : ""
                            }

                            <div class="news-card-content">

                                ${
                                    item.date
                                        ? `
                                            <span class="notice-date">
                                                ${formatDate(
                                                    item.date
                                                )}
                                            </span>
                                        `
                                        : ""
                                }

                                <h3>
                                    ${escapeHTML(
                                        item.title ||
                                        "School News"
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        item.description ||
                                        ""
                                    )}
                                </p>

                            </div>

                        </article>
                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "News/Event Error:",
            error
        );


        showError(
            newsEventList,
            "Unable to load news and events."
        );

    }

}


/* =========================================================
   GALLERY
========================================================= */

async function loadGallery() {

    if (!galleryList) {
        return;
    }


    showLoading(
        galleryList,
        "Loading gallery..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/gallery`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load gallery."
            );

        }


        let images = [];


        if (Array.isArray(data)) {

            images = data;

        } else if (
            Array.isArray(data.gallery)
        ) {

            images = data.gallery;

        } else if (
            Array.isArray(data.images)
        ) {

            images = data.images;

        } else if (
            data.data &&
            Array.isArray(data.data)
        ) {

            images = data.data;

        }


        if (images.length === 0) {

            galleryList.innerHTML =
                `<p>No gallery images available.</p>`;

            return;

        }


        galleryList.innerHTML =
            images.map(
                item => {

                    const imageUrl =
                        item.imageUrl ||
                        item.image ||
                        item.url ||
                        item.secure_url ||
                        "";


                    if (!imageUrl) {
                        return "";
                    }


                    return `
                        <div class="gallery-item">

                            <img
                                src="${escapeHTML(
                                    imageUrl
                                )}"
                                alt="${escapeHTML(
                                    item.title ||
                                    "School Gallery"
                                )}"
                                loading="lazy"
                            >

                        </div>
                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "Gallery Error:",
            error
        );


        showError(
            galleryList,
            "Unable to load gallery."
        );

    }

}


/* =========================================================
   TEACHERS
========================================================= */

let allTeachers = [];


async function loadTeachers() {

    if (!teacherList) {
        return;
    }


    showLoading(
        teacherList,
        "Loading teachers..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/teachers`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load teachers."
            );

        }


        if (Array.isArray(data)) {

            allTeachers = data;

        } else if (
            Array.isArray(data.teachers)
        ) {

            allTeachers = data.teachers;

        } else if (
            data.data &&
            Array.isArray(data.data)
        ) {

            allTeachers = data.data;

        } else {

            allTeachers = [];

        }


        renderTeachers("All");


    } catch (error) {

        console.error(
            "Teacher Error:",
            error
        );


        showError(
            teacherList,
            "Unable to load teachers."
        );

    }

}


/* =========================================================
   RENDER TEACHERS
========================================================= */

function renderTeachers(division) {

    if (!teacherList) {
        return;
    }


    let teachers =
        allTeachers;


    if (division !== "All") {

        teachers =
            allTeachers.filter(
                teacher =>
                    String(
                        teacher.division || ""
                    ).toLowerCase() ===
                    division.toLowerCase()
            );

    }


    if (teachers.length === 0) {

        teacherList.innerHTML =
            `<p>No teachers found in this division.</p>`;

        return;

    }


    teacherList.innerHTML =
        teachers.map(
            teacher => {

                const photo =
                    teacher.photo ||
                    teacher.photoUrl ||
                    "images/teacher-placeholder.jpg";


                return `
                    <article class="teacher-card">

                        <img
                            src="${escapeHTML(
                                photo
                            )}"
                            alt="${escapeHTML(
                                teacher.name ||
                                "Teacher"
                            )}"
                            class="teacher-photo"
                            loading="lazy"
                        >

                        <div class="teacher-info">

                            <h3>
                                ${escapeHTML(
                                    teacher.name ||
                                    "Teacher"
                                )}
                            </h3>

                            <p>
                                <strong>Division:</strong>
                                ${escapeHTML(
                                    teacher.division ||
                                    "N/A"
                                )}
                            </p>

                            <p>
                                <strong>Department:</strong>
                                ${escapeHTML(
                                    teacher.department ||
                                    "N/A"
                                )}
                            </p>

                            <p>
                                <strong>Subject:</strong>
                                ${escapeHTML(
                                    teacher.subject ||
                                    "N/A"
                                )}
                            </p>

                        </div>

                    </article>
                `;

            }
        ).join("");

}


/* =========================================================
   TEACHER FILTER
========================================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                this.classList.add("active");


                const division =
                    this.dataset.division ||
                    "All";


                renderTeachers(
                    division
                );

            }
        );

    }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function () {

                navLinks.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =========================================================
   LOAD ALL PUBLIC DATA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSiteContent();

        loadNotices();

        loadNewsEvents();

        loadGallery();

        loadTeachers();

    }
);