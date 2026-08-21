/* =========================================================
   KADAKATI ARAR HIGH SCHOOL
   ADMIN DASHBOARD
========================================================= */

const API_BASE_URL = "https://kadakati-arar-high-school-api.onrender.com/api";


/* =========================================================
   AUTH TOKEN
========================================================= */

const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");


/* =========================================================
   PAGE PROTECTION
========================================================= */

if (!token) {
    window.location.href =
        "../admin-login/admin-login.html";
}


/* =========================================================
   API HELPER
========================================================= */

async function apiRequest(endpoint, options = {}) {

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (
        response.status === 401 ||
        response.status === 403
    ) {
        const message =
            data.message?.toLowerCase() || "";

        if (
            message.includes("token") ||
            message.includes("expired") ||
            message.includes("unauthorized")
        ) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("token");

            window.location.href =
                "../admin-login/admin-login.html";

            return;
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Something went wrong"
        );
    }

    return data;
}


/* =========================================================
   DOM ELEMENTS
========================================================= */

const navItems =
    document.querySelectorAll(".nav-item");

const sections = {
    dashboard:
        document.getElementById("dashboardSection"),

    notices:
        document.getElementById("noticesSection"),

    "news-events":
        document.getElementById("newsEventsSection"),

    gallery:
        document.getElementById("gallerySection"),

    teachers:
        document.getElementById("teachersSection"),

    admins:
        document.getElementById("adminsSection"),

    "site-content":
        document.getElementById("siteContentSection")
};


const pageTitles = {

    dashboard: [
        "Dashboard",
        "Welcome to the school administration panel."
    ],

    notices: [
        "Notices",
        "Manage school notices."
    ],

    "news-events": [
        "News & Events",
        "Manage school news and events."
    ],

    gallery: [
        "Gallery",
        "Manage school gallery images."
    ],

    teachers: [
        "Teachers",
        "Manage teacher profiles."
    ],

    admins: [
        "Admins",
        "Manage administrator accounts."
    ],

    "site-content": [
        "Site Content",
        "Update public website information."
    ]

};


/* =========================================================
   NAVIGATION
========================================================= */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const section =
            item.dataset.section;

        switchSection(section);

        closeMobileSidebar();

    });

});


function switchSection(sectionName) {

    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === sectionName
        );

    });


    Object.values(sections).forEach(section => {

        if (section) {
            section.classList.remove("active");
        }

    });


    if (sections[sectionName]) {

        sections[sectionName]
            .classList.add("active");

    }


    if (pageTitles[sectionName]) {

        const title =
            document.getElementById("pageTitle");

        const subtitle =
            document.getElementById("pageSubtitle");

        if (title) {
            title.textContent =
                pageTitles[sectionName][0];
        }

        if (subtitle) {
            subtitle.textContent =
                pageTitles[sectionName][1];
        }

    }


    if (sectionName === "notices") {
        loadNotices();
    }

    if (sectionName === "news-events") {
        loadNewsEvents();
    }

    if (sectionName === "gallery") {
        loadGallery();
    }

    if (sectionName === "teachers") {
        loadTeachers();
    }

    if (sectionName === "admins") {
        loadAdmins();
    }

    if (sectionName === "site-content") {
        loadSiteContent();
    }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const sidebar =
    document.querySelector(".sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            sidebar?.classList.toggle(
                "mobile-open"
            );

            sidebarOverlay?.classList.toggle(
                "active"
            );

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );

}


function closeMobileSidebar() {

    sidebar?.classList.remove(
        "mobile-open"
    );

    sidebarOverlay?.classList.remove(
        "active"
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    toast.className =
        `toast show ${type}`;

    setTimeout(() => {

        toast.className =
            "toast";

    }, 3000);

}


/* =========================================================
   MODAL
========================================================= */

const modalOverlay =
    document.getElementById("modalOverlay");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");

const closeModalBtn =
    document.getElementById("closeModalBtn");


function openModal(title, html) {

    if (!modalOverlay) {
        return;
    }

    modalTitle.textContent =
        title;

    modalBody.innerHTML =
        html;

    modalOverlay.classList.add(
        "active"
    );

}


function closeModal() {

    if (!modalOverlay) {
        return;
    }

    modalOverlay.classList.remove(
        "active"
    );

    modalBody.innerHTML = "";

}


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalOverlay
            ) {
                closeModal();
            }

        }
    );

}


/* =========================================================
   ADMIN PROFILE
========================================================= */

async function loadAdminProfile() {

    try {

        const data =
            await apiRequest(
                "/auth/me"
            );

        if (!data?.admin) {
            return;
        }

        const admin =
            data.admin;

        const adminName =
            document.getElementById("adminName");

        const adminRole =
            document.getElementById("adminRole");

        const adminAvatar =
            document.getElementById("adminAvatar");


        if (adminName) {

            adminName.textContent =
                admin.name || "Admin";

        }


        if (adminRole) {

            adminRole.textContent =
                admin.isSuperAdmin
                    ? "Super Administrator"
                    : "Administrator";

        }


        if (adminAvatar) {

            adminAvatar.textContent =
                (
                    admin.name ||
                    "A"
                )
                .charAt(0)
                .toUpperCase();

        }

    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );

    }

}


/* =========================================================
   DASHBOARD STATS
========================================================= */

async function loadDashboardStats() {

    try {

        const [
            notices,
            newsEvents,
            gallery,
            teachers
        ] = await Promise.all([

            apiRequest(
                "/notices/admin/all"
            ),

            apiRequest(
                "/news-events/admin/all"
            ),

            apiRequest(
                "/gallery/admin/all"
            ),

            apiRequest(
                "/teachers/admin/all"
            )

        ]);


        const noticeCount =
            document.getElementById("noticeCount");

        const newsEventCount =
            document.getElementById("newsEventCount");

        const galleryCount =
            document.getElementById("galleryCount");

        const teacherCount =
            document.getElementById("teacherCount");

        const apiStatus =
            document.getElementById("apiStatus");


        if (noticeCount) {
            noticeCount.textContent =
                notices?.count || 0;
        }

        if (newsEventCount) {
            newsEventCount.textContent =
                newsEvents?.count || 0;
        }

        if (galleryCount) {
            galleryCount.textContent =
                gallery?.count || 0;
        }

        if (teacherCount) {
            teacherCount.textContent =
                teachers?.count || 0;
        }

        if (apiStatus) {

            apiStatus.textContent =
                "Connected";

            apiStatus.className =
                "status success";

        }

    } catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );

        const apiStatus =
            document.getElementById("apiStatus");

        if (apiStatus) {

            apiStatus.textContent =
                "Offline";

            apiStatus.className =
                "status error";

        }

    }

}


/* =========================================================
   NOTICES
========================================================= */

async function loadNotices() {

    const container =
        document.getElementById("noticeList");

    if (!container) {
        return;
    }

    container.innerHTML =
        `<div class="loading">
            Loading notices...
        </div>`;

    try {

        const data =
            await apiRequest(
                "/notices/admin/all"
            );

        const notices =
            data?.notices || [];


        if (!notices.length) {

            container.innerHTML =
                `<div class="empty">
                    No notices found.
                </div>`;

            return;
        }


        container.innerHTML =
            notices.map(notice => {

                return `
                    <div class="data-row">

                        <div class="data-main">

                            <h3>
                                ${escapeHtml(
                                    notice.title
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    notice.description
                                )}
                            </p>

                            <div class="data-meta">

                                <span class="badge">
                                    ${escapeHtml(
                                        notice.category ||
                                        "General"
                                    )}
                                </span>

                                <span class="badge">
                                    ${
                                        notice.isPublished
                                            ? "Published"
                                            : "Draft"
                                    }
                                </span>

                                <span class="badge">
                                    ${formatDate(
                                        notice.noticeDate
                                    )}
                                </span>

                            </div>

                        </div>

                        <div class="data-actions">

                            <button
                                class="small-btn"
                                onclick="editNotice('${notice._id}')"
                            >
                                Edit
                            </button>

                            <button
                                class="small-btn delete"
                                onclick="deleteNotice('${notice._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;

            }).join("");

    } catch (error) {

        container.innerHTML =
            `<div class="empty">
                Failed to load notices.
            </div>`;

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   ADD NOTICE
========================================================= */

const addNoticeBtn =
    document.getElementById("addNoticeBtn");

if (addNoticeBtn) {

    addNoticeBtn.addEventListener(
        "click",
        showNoticeForm
    );

}


function showNoticeForm() {

    openModal(
        "Create Notice",
        `
        <form id="noticeForm" class="modal-form">

            <div class="form-group">
                <label>Title *</label>

                <input
                    type="text"
                    id="noticeTitle"
                    required
                >
            </div>

            <div class="form-group">
                <label>Description *</label>

                <textarea
                    id="noticeDescription"
                    rows="5"
                    required
                ></textarea>
            </div>

            <div class="form-group">
                <label>Category</label>

                <select id="noticeCategory">

                    <option value="General">
                        General
                    </option>

                    <option value="Academic">
                        Academic
                    </option>

                    <option value="Exam">
                        Exam
                    </option>

                    <option value="Admission">
                        Admission
                    </option>

                    <option value="Event">
                        Event
                    </option>

                    <option value="Holiday">
                        Holiday
                    </option>

                </select>
            </div>

            <div class="form-group">
                <label>Notice Date</label>

                <input
                    type="date"
                    id="noticeDate"
                >
            </div>

            <div class="form-group">
                <label>Attachment URL</label>

                <input
                    type="url"
                    id="noticeAttachment"
                    placeholder="https://..."
                >
            </div>

            <div class="form-group">
                <label>Published</label>

                <select id="noticePublished">

                    <option value="true">
                        Yes
                    </option>

                    <option value="false">
                        No
                    </option>

                </select>

            </div>

            <button
                type="submit"
                class="modal-submit"
            >
                Create Notice
            </button>

        </form>
        `
    );


    document.getElementById(
        "noticeForm"
    ).addEventListener(
        "submit",
        createNotice
    );

}


async function createNotice(event) {

    event.preventDefault();

    const body = {

        title:
            document.getElementById(
                "noticeTitle"
            ).value,

        description:
            document.getElementById(
                "noticeDescription"
            ).value,

        category:
            document.getElementById(
                "noticeCategory"
            ).value,

        noticeDate:
            document.getElementById(
                "noticeDate"
            ).value ||
            new Date().toISOString(),

        attachment:
            document.getElementById(
                "noticeAttachment"
            ).value,

        isPublished:
            document.getElementById(
                "noticePublished"
            ).value === "true"

    };


    try {

        await apiRequest(
            "/notices",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(body)
            }
        );

        closeModal();

        showToast(
            "Notice created successfully."
        );

        loadNotices();
        loadDashboardStats();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   EDIT NOTICE
========================================================= */

async function editNotice(id) {

    try {

        const data =
            await apiRequest(
                `/notices/${id}`
            );

        const notice =
            data.notice;


        openModal(
            "Edit Notice",
            `
            <form
                id="editNoticeForm"
                class="modal-form"
            >

                <div class="form-group">

                    <label>Title</label>

                    <input
                        type="text"
                        id="editNoticeTitle"
                        value="${escapeAttribute(
                            notice.title
                        )}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label>Description</label>

                    <textarea
                        id="editNoticeDescription"
                        rows="5"
                        required
                    >${escapeHtml(
                        notice.description
                    )}</textarea>

                </div>

                <div class="form-group">

                    <label>Category</label>

                    <select id="editNoticeCategory">

                        ${[
                            "General",
                            "Academic",
                            "Exam",
                            "Admission",
                            "Event",
                            "Holiday"
                        ].map(category => `

                            <option
                                value="${category}"
                                ${
                                    notice.category ===
                                    category
                                        ? "selected"
                                        : ""
                                }
                            >
                                ${category}
                            </option>

                        `).join("")}

                    </select>

                </div>

                <div class="form-group">

                    <label>Notice Date</label>

                    <input
                        type="date"
                        id="editNoticeDate"
                        value="${toInputDate(
                            notice.noticeDate
                        )}"
                    >

                </div>

                <div class="form-group">

                    <label>
                        Attachment URL
                    </label>

                    <input
                        type="url"
                        id="editNoticeAttachment"
                        value="${escapeAttribute(
                            notice.attachment || ""
                        )}"
                    >

                </div>

                <div class="form-group">

                    <label>Published</label>

                    <select id="editNoticePublished">

                        <option
                            value="true"
                            ${
                                notice.isPublished
                                    ? "selected"
                                    : ""
                            }
                        >
                            Yes
                        </option>

                        <option
                            value="false"
                            ${
                                !notice.isPublished
                                    ? "selected"
                                    : ""
                            }
                        >
                            No
                        </option>

                    </select>

                </div>

                <button
                    type="submit"
                    class="modal-submit"
                >
                    Save Changes
                </button>

            </form>
            `
        );


        document.getElementById(
            "editNoticeForm"
        ).addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const body = {

                    title:
                        document.getElementById(
                            "editNoticeTitle"
                        ).value,

                    description:
                        document.getElementById(
                            "editNoticeDescription"
                        ).value,

                    category:
                        document.getElementById(
                            "editNoticeCategory"
                        ).value,

                    noticeDate:
                        document.getElementById(
                            "editNoticeDate"
                        ).value,

                    attachment:
                        document.getElementById(
                            "editNoticeAttachment"
                        ).value,

                    isPublished:
                        document.getElementById(
                            "editNoticePublished"
                        ).value === "true"

                };


                try {

                    await apiRequest(
                        `/notices/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(body)
                        }
                    );

                    closeModal();

                    showToast(
                        "Notice updated successfully."
                    );

                    loadNotices();
                    loadDashboardStats();

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   DELETE NOTICE
========================================================= */

async function deleteNotice(id) {

    if (
        !confirm(
            "Are you sure you want to delete this notice?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            `/notices/${id}`,
            {
                method: "DELETE"
            }
        );

        showToast(
            "Notice deleted successfully."
        );

        loadNotices();
        loadDashboardStats();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   NEWS & EVENTS
========================================================= */

async function loadNewsEvents() {

    const container =
        document.getElementById(
            "newsEventList"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        `<div class="loading">
            Loading news & events...
        </div>`;


    try {

        const data =
            await apiRequest(
                "/news-events/admin/all"
            );

        const items =
            data?.newsEvents || [];


        if (!items.length) {

            container.innerHTML =
                `<div class="empty">
                    No news or events found.
                </div>`;

            return;
        }


        container.innerHTML =
            items.map(item => {

                return `
                    <div class="data-row">

                        <div class="data-main">

                            <h3>
                                ${escapeHtml(
                                    item.title
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    item.description
                                )}
                            </p>

                            <div class="data-meta">

                                <span class="badge">
                                    ${escapeHtml(
                                        item.type
                                    )}
                                </span>

                                <span class="badge">
                                    ${
                                        item.isPublished
                                            ? "Published"
                                            : "Draft"
                                    }
                                </span>

                                <span class="badge">
                                    ${formatDate(
                                        item.date
                                    )}
                                </span>

                            </div>

                        </div>

                        <div class="data-actions">

                            <button
                                class="small-btn"
                                onclick="editNewsEvent('${item._id}')"
                            >
                                Edit
                            </button>

                            <button
                                class="small-btn delete"
                                onclick="deleteNewsEvent('${item._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;

            }).join("");

    } catch (error) {

        container.innerHTML =
            `<div class="empty">
                Failed to load news/events.
            </div>`;

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   ADD NEWS / EVENT
========================================================= */

const addNewsEventBtn =
    document.getElementById(
        "addNewsEventBtn"
    );

if (addNewsEventBtn) {

    addNewsEventBtn.addEventListener(
        "click",
        showNewsEventForm
    );

}


function showNewsEventForm() {

    openModal(
        "Create News / Event",
        `
        <form
            id="newsEventForm"
            class="modal-form"
        >

            <div class="form-group">
                <label>Title *</label>

                <input
                    type="text"
                    id="newsTitle"
                    required
                >
            </div>

            <div class="form-group">
                <label>Description *</label>

                <textarea
                    id="newsDescription"
                    rows="5"
                    required
                ></textarea>
            </div>

            <div class="form-group">
                <label>Type *</label>

                <select id="newsType">

                    <option value="News">
                        News
                    </option>

                    <option value="Event">
                        Event
                    </option>

                </select>
            </div>

            <div class="form-group">
                <label>Date *</label>

                <input
                    type="date"
                    id="newsDate"
                    required
                >
            </div>

            <div class="form-group">
                <label>Image</label>

                <input
                    type="file"
                    id="newsImage"
                    accept="image/*"
                >
            </div>

            <div class="form-group">
                <label>Published</label>

                <select id="newsPublished">

                    <option value="true">
                        Yes
                    </option>

                    <option value="false">
                        No
                    </option>

                </select>
            </div>

            <button
                type="submit"
                class="modal-submit"
            >
                Create
            </button>

        </form>
        `
    );


    document.getElementById(
        "newsEventForm"
    ).addEventListener(
        "submit",
        createNewsEvent
    );

}


async function createNewsEvent(event) {

    event.preventDefault();

    const formData =
        new FormData();

    formData.append(
        "title",
        document.getElementById(
            "newsTitle"
        ).value
    );

    formData.append(
        "description",
        document.getElementById(
            "newsDescription"
        ).value
    );

    formData.append(
        "type",
        document.getElementById(
            "newsType"
        ).value
    );

    formData.append(
        "date",
        document.getElementById(
            "newsDate"
        ).value
    );

    formData.append(
        "isPublished",
        document.getElementById(
            "newsPublished"
        ).value === "true"
    );


    const image =
        document.getElementById(
            "newsImage"
        ).files[0];

    if (image) {

        formData.append(
            "image",
            image
        );

    }


    try {

        await apiRequest(
            "/news-events",
            {
                method: "POST",
                body: formData
            }
        );

        closeModal();

        showToast(
            "News/Event created successfully."
        );

        loadNewsEvents();
        loadDashboardStats();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   EDIT NEWS / EVENT
========================================================= */

async function editNewsEvent(id) {

    try {

        const data =
            await apiRequest(
                `/news-events/${id}`
            );

        const item =
            data.newsEvent;


        openModal(
            "Edit News / Event",
            `
            <form
                id="editNewsForm"
                class="modal-form"
            >

                <div class="form-group">

                    <label>Title</label>

                    <input
                        type="text"
                        id="editNewsTitle"
                        value="${escapeAttribute(
                            item.title
                        )}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label>Description</label>

                    <textarea
                        id="editNewsDescription"
                        rows="5"
                        required
                    >${escapeHtml(
                        item.description
                    )}</textarea>

                </div>

                <div class="form-group">

                    <label>Type</label>

                    <select id="editNewsType">

                        <option
                            value="News"
                            ${
                                item.type === "News"
                                    ? "selected"
                                    : ""
                            }
                        >
                            News
                        </option>

                        <option
                            value="Event"
                            ${
                                item.type === "Event"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Event
                        </option>

                    </select>

                </div>

                <div class="form-group">

                    <label>Date</label>

                    <input
                        type="date"
                        id="editNewsDate"
                        value="${toInputDate(
                            item.date
                        )}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label>
                        Replace Image
                    </label>

                    <input
                        type="file"
                        id="editNewsImage"
                        accept="image/*"
                    >

                </div>

                <div class="form-group">

                    <label>Published</label>

                    <select id="editNewsPublished">

                        <option
                            value="true"
                            ${
                                item.isPublished
                                    ? "selected"
                                    : ""
                            }
                        >
                            Yes
                        </option>

                        <option
                            value="false"
                            ${
                                !item.isPublished
                                    ? "selected"
                                    : ""
                            }
                        >
                            No
                        </option>

                    </select>

                </div>

                <button
                    type="submit"
                    class="modal-submit"
                >
                    Save Changes
                </button>

            </form>
            `
        );


        document.getElementById(
            "editNewsForm"
        ).addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const formData =
                    new FormData();


                formData.append(
                    "title",
                    document.getElementById(
                        "editNewsTitle"
                    ).value
                );

                formData.append(
                    "description",
                    document.getElementById(
                        "editNewsDescription"
                    ).value
                );

                formData.append(
                    "type",
                    document.getElementById(
                        "editNewsType"
                    ).value
                );

                formData.append(
                    "date",
                    document.getElementById(
                        "editNewsDate"
                    ).value
                );

                formData.append(
                    "isPublished",
                    document.getElementById(
                        "editNewsPublished"
                    ).value === "true"
                );


                const image =
                    document.getElementById(
                        "editNewsImage"
                    ).files[0];

                if (image) {

                    formData.append(
                        "image",
                        image
                    );

                }


                try {

                    await apiRequest(
                        `/news-events/${id}`,
                        {
                            method: "PUT",
                            body: formData
                        }
                    );

                    closeModal();

                    showToast(
                        "News/Event updated successfully."
                    );

                    loadNewsEvents();
                    loadDashboardStats();

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   DELETE NEWS / EVENT
========================================================= */

async function deleteNewsEvent(id) {

    if (
        !confirm(
            "Are you sure you want to delete this item?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            `/news-events/${id}`,
            {
                method: "DELETE"
            }
        );

        showToast(
            "News/Event deleted successfully."
        );

        loadNewsEvents();
        loadDashboardStats();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   GALLERY
========================================================= */

async function loadGallery() {

    const container =
        document.getElementById(
            "galleryGrid"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        `<div class="loading">
            Loading gallery...
        </div>`;


    try {

        const data =
            await apiRequest(
                "/gallery/admin/all"
            );

        const images =
            data?.gallery ||
            data?.galleries ||
            [];


        if (!images.length) {

            container.innerHTML =
                `<div class="empty">
                    No gallery images found.
                </div>`;

            return;

        }


        container.innerHTML =
            images.map(image => {

                return `
                    <div class="gallery-card">

                        <img
                            src="${escapeAttribute(
                                image.imageUrl
                            )}"
                            alt="${escapeAttribute(
                                image.title ||
                                "Gallery image"
                            )}"
                        >

                        <div class="gallery-info">

                            <h3>
                                ${escapeHtml(
                                    image.title ||
                                    "Untitled"
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    image.description ||
                                    ""
                                )}
                            </p>

                            <div class="gallery-actions">

                                <button
                                    class="small-btn"
                                    onclick="editGallery('${image._id}')"
                                >
                                    Edit
                                </button>

                                <button
                                    class="small-btn delete"
                                    onclick="deleteGallery('${image._id}')"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        container.innerHTML =
            `<div class="empty">
                Failed to load gallery.
            </div>`;

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   ADD GALLERY
========================================================= */

const addGalleryBtn =
    document.getElementById(
        "addGalleryBtn"
    );

if (addGalleryBtn) {

    addGalleryBtn.addEventListener(
        "click",
        showGalleryForm
    );

}


function showGalleryForm() {

    openModal(
        "Upload Gallery Image",
        `
        <form
            id="galleryForm"
            class="modal-form"
        >

            <div class="form-group">

                <label>Title</label>

                <input
                    type="text"
                    id="galleryTitle"
                >

            </div>

            <div class="form-group">

                <label>Description</label>

                <textarea
                    id="galleryDescription"
                    rows="4"
                ></textarea>

            </div>

            <div class="form-group">

                <label>Image *</label>

                <input
                    type="file"
                    id="galleryImage"
                    accept="image/*"
                    required
                >

            </div>

            <div class="form-group">

                <label>Published</label>

                <select id="galleryPublished">

                    <option value="true">
                        Yes
                    </option>

                    <option value="false">
                        No
                    </option>

                </select>

            </div>

            <button
                type="submit"
                class="modal-submit"
            >
                Upload Image
            </button>

        </form>
        `
    );


    document.getElementById(
        "galleryForm"
    ).addEventListener(
        "submit",
        createGallery
    );

}


async function createGallery(event) {

    event.preventDefault();


    const image =
        document.getElementById(
            "galleryImage"
        ).files[0];


    if (!image) {

        showToast(
            "Please select an image.",
            "error"
        );

        return;

    }


    const formData =
        new FormData();


    formData.append(
        "title",
        document.getElementById(
            "galleryTitle"
        ).value
    );

    formData.append(
        "description",
        document.getElementById(
            "galleryDescription"
        ).value
    );

    formData.append(
        "image",
        image
    );

    formData.append(
        "isPublished",
        document.getElementById(
            "galleryPublished"
        ).value === "true"
    );


    try {

        await apiRequest(
            "/gallery",
            {
                method: "POST",
                body: formData
            }
        );

        closeModal();

        showToast(
            "Gallery image uploaded successfully."
        );

        loadGallery();
        loadDashboardStats();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   EDIT GALLERY
========================================================= */

async function editGallery(id) {

    try {

        const data =
            await apiRequest(
                `/gallery/${id}`
            );

        const image =
            data.gallery;


        openModal(
            "Edit Gallery Image",
            `
            <form
                id="editGalleryForm"
                class="modal-form"
            >

                <div class="form-group">

                    <label>Title</label>

                    <input
                        type="text"
                        id="editGalleryTitle"
                        value="${escapeAttribute(
                            image.title || ""
                        )}"
                    >

                </div>

                <div class="form-group">

                    <label>Description</label>

                    <textarea
                        id="editGalleryDescription"
                        rows="4"
                    >${escapeHtml(
                        image.description || ""
                    )}</textarea>

                </div>

                <div class="form-group">

                    <label>
                        Replace Image
                    </label>

                    <input
                        type="file"
                        id="editGalleryImage"
                        accept="image/*"
                    >

                </div>

                <div class="form-group">

                    <label>Published</label>

                    <select id="editGalleryPublished">

                        <option
                            value="true"
                            ${
                                image.isPublished
                                    ? "selected"
                                    : ""
                            }
                        >
                            Yes
                        </option>

                        <option
                            value="false"
                            ${
                                !image.isPublished
                                    ? "selected"
                                    : ""
                            }
                        >
                            No
                        </option>

                    </select>

                </div>

                <button
                    type="submit"
                    class="modal-submit"
                >
                    Save Changes
                </button>

            </form>
            `
        );


        document.getElementById(
            "editGalleryForm"
        ).addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const formData =
                    new FormData();


                formData.append(
                    "title",
                    document.getElementById(
                        "editGalleryTitle"
                    ).value
                );

                formData.append(
                    "description",
                    document.getElementById(
                        "editGalleryDescription"
                    ).value
                );

                formData.append(
                    "isPublished",
                    document.getElementById(
                        "editGalleryPublished"
                    ).value === "true"
                );


                const newImage =
                    document.getElementById(
                        "editGalleryImage"
                    ).files[0];

                if (newImage) {

                    formData.append(
                        "image",
                        newImage
                    );

                }


                try {

                    await apiRequest(
                        `/gallery/${id}`,
                        {
                            method: "PUT",
                            body: formData
                        }
                    );

                    closeModal();

                    showToast(
                        "Gallery updated successfully."
                    );

                    loadGallery();
                    loadDashboardStats();

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   DELETE GALLERY
========================================================= */

async function deleteGallery(id) {

    if (
        !confirm(
            "Are you sure you want to delete this image?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            `/gallery/${id}`,
            {
                method: "DELETE"
            }
        );

        showToast(
            "Gallery image deleted successfully."
        );

        loadGallery();
        loadDashboardStats();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   TEACHERS
========================================================= */

async function loadTeachers() {

    const container =
        document.getElementById(
            "teacherList"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        `<div class="loading">
            Loading teachers...
        </div>`;


    try {

        const data =
            await apiRequest(
                "/teachers/admin/all"
            );

        const teachers =
            data?.teachers || [];


        if (!teachers.length) {

            container.innerHTML =
                `<div class="empty">
                    No teachers found.
                </div>`;

            return;

        }


        container.innerHTML =
            teachers.map(teacher => {

                return `
                    <div class="data-row">

                        <div class="data-main">

                            <h3>
                                ${escapeHtml(
                                    teacher.name
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    teacher.email
                                )}
                            </p>

                            <div class="data-meta">

                                <span class="badge">
                                    ${escapeHtml(
                                        teacher.division ||
                                        ""
                                    )}
                                </span>

                                <span class="badge">
                                    ${escapeHtml(
                                        teacher.department ||
                                        ""
                                    )}
                                </span>

                                <span class="badge">
                                    ${
                                        teacher.isVerified
                                            ? "Verified"
                                            : "Unverified"
                                    }
                                </span>

                            </div>

                        </div>

                        <div class="data-actions">

                            <button
                                class="small-btn"
                                onclick="editTeacher('${teacher._id}')"
                            >
                                Edit
                            </button>

                            <button
                                class="small-btn delete"
                                onclick="deleteTeacher('${teacher._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        container.innerHTML =
            `<div class="empty">
                Failed to load teachers.
            </div>`;

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   REGISTER TEACHER
========================================================= */

const addTeacherBtn =
    document.getElementById(
        "addTeacherBtn"
    );

if (addTeacherBtn) {

    addTeacherBtn.addEventListener(
        "click",
        showTeacherForm
    );

}


function showTeacherForm() {

    openModal(
        "Register Teacher",
        `
        <form
            id="teacherForm"
            class="modal-form"
        >

            <div class="form-group">
                <label>Name *</label>

                <input
                    type="text"
                    id="teacherName"
                    required
                >
            </div>

            <div class="form-group">
                <label>Username *</label>

                <input
                    type="text"
                    id="teacherUsername"
                    required
                >
            </div>

            <div class="form-group">
                <label>Email *</label>

                <input
                    type="email"
                    id="teacherEmail"
                    required
                >
            </div>

            <div class="form-group">
                <label>Password *</label>

                <input
                    type="password"
                    id="teacherPassword"
                    minlength="6"
                    required
                >

                <label style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-top:8px;
                    cursor:pointer;
                ">

                    <input
                        type="checkbox"
                        id="teacherPasswordToggle"
                        style="width:auto;"
                    >

                    Show Password

                </label>

            </div>

            <div class="form-grid">

                <div class="form-group">

                    <label>Division *</label>

                    <select id="teacherDivision">

                        <option value="Science">
                            Science
                        </option>

                        <option value="Arts">
                            Arts
                        </option>

                        <option value="Commerce">
                            Commerce
                        </option>

                    </select>

                </div>

                <div class="form-group">

                    <label>Department *</label>

                    <input
                        type="text"
                        id="teacherDepartment"
                        required
                    >

                </div>

            </div>

            <div class="form-group">

                <label>Subject</label>

                <input
                    type="text"
                    id="teacherSubject"
                >

            </div>

            <div class="form-group">

                <label>Phone</label>

                <input
                    type="text"
                    id="teacherPhone"
                >

            </div>

            <div class="form-group">

                <label>About</label>

                <textarea
                    id="teacherAbout"
                    rows="4"
                ></textarea>

            </div>

            <div class="form-group">

                <label>Photo URL</label>

                <input
                    type="url"
                    id="teacherPhoto"
                >

            </div>

            <button
                type="submit"
                class="modal-submit"
            >
                Register Teacher
            </button>

        </form>
        `
    );


    document.getElementById(
        "teacherPasswordToggle"
    ).addEventListener(
        "change",
        event => {

            document.getElementById(
                "teacherPassword"
            ).type =
                event.target.checked
                    ? "text"
                    : "password";

        }
    );


    document.getElementById(
        "teacherForm"
    ).addEventListener(
        "submit",
        registerTeacher
    );

}


async function registerTeacher(event) {

    event.preventDefault();

    const body = {

        name:
            document.getElementById(
                "teacherName"
            ).value,

        username:
            document.getElementById(
                "teacherUsername"
            ).value,

        email:
            document.getElementById(
                "teacherEmail"
            ).value,

        password:
            document.getElementById(
                "teacherPassword"
            ).value,

        division:
            document.getElementById(
                "teacherDivision"
            ).value,

        department:
            document.getElementById(
                "teacherDepartment"
            ).value,

        subject:
            document.getElementById(
                "teacherSubject"
            ).value,

        phone:
            document.getElementById(
                "teacherPhone"
            ).value,

        about:
            document.getElementById(
                "teacherAbout"
            ).value,

        photo:
            document.getElementById(
                "teacherPhoto"
            ).value

    };


    try {

        await apiRequest(
            "/teachers/register",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(body)
            }
        );


        closeModal();


        showToast(
            "Teacher registered. Verification email sent."
        );


        loadTeachers();
        loadDashboardStats();


        setTimeout(() => {

            openTeacherVerificationModal(
                body.email
            );

        }, 300);


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   TEACHER VERIFICATION
========================================================= */

function openTeacherVerificationModal(email) {

    openModal(
        "Verify Teacher Email",
        `
        <form
            id="teacherVerificationForm"
            class="modal-form"
        >

            <div class="form-group">

                <label>
                    Teacher Email
                </label>

                <input
                    type="email"
                    id="verificationEmail"
                    value="${escapeAttribute(email)}"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>
                    Verification Code
                </label>

                <input
                    type="text"
                    id="teacherVerificationCode"
                    placeholder="Enter 6-digit code"
                    maxlength="6"
                    inputmode="numeric"
                    pattern="[0-9]{6}"
                    required
                >

            </div>

            <button
                type="submit"
                class="modal-submit"
            >
                Verify Teacher
            </button>

        </form>
        `
    );


    document
        .getElementById(
            "teacherVerificationForm"
        )
        .addEventListener(
            "submit",
            verifyTeacherEmail
        );

}


async function verifyTeacherEmail(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "verificationEmail"
        ).value;


    const verificationCode =
        document.getElementById(
            "teacherVerificationCode"
        ).value.trim();


    if (
        !/^\d{6}$/.test(
            verificationCode
        )
    ) {

        showToast(
            "Please enter a valid 6-digit verification code.",
            "error"
        );

        return;
    }


    try {

        await apiRequest(
            "/teachers/verify-email",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        email,
                        verificationCode
                    })
            }
        );


        closeModal();


        showToast(
            "Teacher verified successfully."
        );


        loadTeachers();
        loadDashboardStats();


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   EDIT TEACHER
========================================================= */

async function editTeacher(id) {

    try {

        const data =
            await apiRequest(
                `/teachers/${id}`
            );

        const teacher =
            data.teacher;


        openModal(
            "Edit Teacher",
            `
            <form
                id="editTeacherForm"
                class="modal-form"
            >

                <div class="form-group">

                    <label>Name</label>

                    <input
                        type="text"
                        id="editTeacherName"
                        value="${escapeAttribute(
                            teacher.name
                        )}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label>Photo URL</label>

                    <input
                        type="url"
                        id="editTeacherPhoto"
                        value="${escapeAttribute(
                            teacher.photo || ""
                        )}"
                    >

                </div>

                <div class="form-group">

                    <label>Phone</label>

                    <input
                        type="text"
                        id="editTeacherPhone"
                        value="${escapeAttribute(
                            teacher.phone || ""
                        )}"
                    >

                </div>

                <div class="form-group">

                    <label>Division</label>

                    <select id="editTeacherDivision">

                        <option
                            value="Science"
                            ${
                                teacher.division ===
                                "Science"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Science
                        </option>

                        <option
                            value="Arts"
                            ${
                                teacher.division ===
                                "Arts"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Arts
                        </option>

                        <option
                            value="Commerce"
                            ${
                                teacher.division ===
                                "Commerce"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Commerce
                        </option>

                    </select>

                </div>

                <div class="form-group">

                    <label>Department</label>

                    <input
                        type="text"
                        id="editTeacherDepartment"
                        value="${escapeAttribute(
                            teacher.department || ""
                        )}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label>Subject</label>

                    <input
                        type="text"
                        id="editTeacherSubject"
                        value="${escapeAttribute(
                            teacher.subject || ""
                        )}"
                    >

                </div>

                <div class="form-group">

                    <label>About</label>

                    <textarea
                        id="editTeacherAbout"
                        rows="4"
                    >${escapeHtml(
                        teacher.about || ""
                    )}</textarea>

                </div>

                <button
                    type="submit"
                    class="modal-submit"
                >
                    Save Changes
                </button>

            </form>
            `
        );


        document.getElementById(
            "editTeacherForm"
        ).addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const body = {

                    name:
                        document.getElementById(
                            "editTeacherName"
                        ).value,

                    photo:
                        document.getElementById(
                            "editTeacherPhoto"
                        ).value,

                    phone:
                        document.getElementById(
                            "editTeacherPhone"
                        ).value,

                    division:
                        document.getElementById(
                            "editTeacherDivision"
                        ).value,

                    department:
                        document.getElementById(
                            "editTeacherDepartment"
                        ).value,

                    subject:
                        document.getElementById(
                            "editTeacherSubject"
                        ).value,

                    about:
                        document.getElementById(
                            "editTeacherAbout"
                        ).value

                };


                try {

                    await apiRequest(
                        `/teachers/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(body)
                        }
                    );

                    closeModal();

                    showToast(
                        "Teacher updated successfully."
                    );

                    loadTeachers();
                    loadDashboardStats();

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   DELETE TEACHER
========================================================= */

async function deleteTeacher(id) {

    if (
        !confirm(
            "Are you sure you want to delete this teacher?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            `/teachers/${id}`,
            {
                method: "DELETE"
            }
        );

        showToast(
            "Teacher deleted successfully."
        );

        loadTeachers();
        loadDashboardStats();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   ADMINS
========================================================= */

async function loadAdmins() {

    const container =
        document.getElementById(
            "adminList"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        `<div class="loading">
            Loading admins...
        </div>`;


    try {

        const data =
            await apiRequest(
                "/auth/admins"
            );

        const admins =
            data?.admins || [];


        if (!admins.length) {

            container.innerHTML =
                `<div class="empty">
                    No normal admins found.
                </div>`;

            return;
        }


        container.innerHTML =
            admins.map(admin => {

                return `
                    <div class="data-row">

                        <div class="data-main">

                            <h3>
                                ${escapeHtml(
                                    admin.name
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    admin.email
                                )}
                            </p>

                            <p>
                                Username:
                                <strong>
                                    ${escapeHtml(
                                        admin.username
                                    )}
                                </strong>
                            </p>

                            <div class="data-meta">

                                <span class="badge">
                                    ${
                                        admin.isVerified
                                            ? "Verified"
                                            : "Unverified"
                                    }
                                </span>

                                <span class="badge">
                                    Normal Admin
                                </span>

                            </div>

                        </div>

                        <div class="data-actions">

                            ${
                                !admin.isVerified
                                    ? `
                                    <button
                                        class="small-btn"
                                        onclick="openAdminVerificationModal('${escapeAttribute(
                                            admin.email
                                        )}')"
                                    >
                                        Verify
                                    </button>
                                    `
                                    : ""
                            }

                            <button
                                class="small-btn delete"
                                onclick="deleteAdmin('${admin._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        container.innerHTML =
            `<div class="empty">
                Failed to load admins.
            </div>`;

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   REGISTER ADMIN
========================================================= */

const addAdminBtn =
    document.getElementById(
        "addAdminBtn"
    );

if (addAdminBtn) {

    addAdminBtn.addEventListener(
        "click",
        showAdminForm
    );

}


function showAdminForm() {

    openModal(
        "Register Normal Admin",
        `
        <form
            id="adminForm"
            class="modal-form"
        >

            <div class="form-group">

                <label>Name *</label>

                <input
                    type="text"
                    id="newAdminName"
                    required
                >

            </div>

            <div class="form-group">

                <label>Email *</label>

                <input
                    type="email"
                    id="newAdminEmail"
                    required
                >

            </div>

            <div class="form-group">

                <label>Password *</label>

                <input
                    type="password"
                    id="newAdminPassword"
                    minlength="6"
                    required
                >

                <label style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-top:8px;
                    cursor:pointer;
                ">

                    <input
                        type="checkbox"
                        id="newAdminPasswordToggle"
                        style="width:auto;"
                    >

                    Show Password

                </label>

            </div>

            <button
                type="submit"
                class="modal-submit"
            >
                Register Admin
            </button>

        </form>
        `
    );


    document.getElementById(
        "newAdminPasswordToggle"
    ).addEventListener(
        "change",
        event => {

            document.getElementById(
                "newAdminPassword"
            ).type =
                event.target.checked
                    ? "text"
                    : "password";

        }
    );


    document.getElementById(
        "adminForm"
    ).addEventListener(
        "submit",
        registerAdmin
    );

}


/* =========================================================
   REGISTER ADMIN
   CREATE → EMAIL OTP → VERIFICATION MODAL
========================================================= */

async function registerAdmin(event) {

    event.preventDefault();


    const body = {

        name:
            document.getElementById(
                "newAdminName"
            ).value.trim(),

        email:
            document.getElementById(
                "newAdminEmail"
            ).value.trim(),

        password:
            document.getElementById(
                "newAdminPassword"
            ).value

    };


    try {

        const data =
            await apiRequest(
                "/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );


        /*
         * IMPORTANT:
         * Password is NOT logged to console.
         */


        closeModal();


        showToast(
            "Admin registered. Verification code sent to email."
        );


        loadAdmins();


        /*
         * OPEN ADMIN VERIFICATION MODAL
         */

        setTimeout(() => {

            openAdminVerificationModal(
                body.email
            );

        }, 350);


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   ADMIN VERIFICATION MODAL
========================================================= */

function openAdminVerificationModal(email) {

    openModal(
        "Verify Admin Email",
        `
        <form
            id="adminVerificationForm"
            class="modal-form"
        >

            <div style="
                text-align:center;
                margin-bottom:20px;
            ">

                <div style="
                    font-size:42px;
                    margin-bottom:10px;
                ">
                    ✉️
                </div>

                <h3 style="
                    margin-bottom:8px;
                ">
                    Check Your Email
                </h3>

                <p style="
                    margin:0;
                    color:#666;
                ">
                    We sent a 6-digit verification
                    code to your email.
                </p>

            </div>


            <div class="form-group">

                <label>
                    Admin Email
                </label>

                <input
                    type="email"
                    id="adminVerificationEmail"
                    value="${escapeAttribute(email)}"
                    readonly
                >

            </div>


            <div class="form-group">

                <label>
                    Verification Code *
                </label>

                <input
                    type="text"
                    id="adminVerificationCode"
                    placeholder="Enter 6-digit code"
                    maxlength="6"
                    minlength="6"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    pattern="[0-9]{6}"
                    required
                    style="
                        text-align:center;
                        font-size:24px;
                        letter-spacing:8px;
                        font-weight:bold;
                    "
                >

            </div>


            <button
                type="submit"
                class="modal-submit"
                id="verifyAdminBtn"
            >
                Verify Admin
            </button>


            <p style="
                text-align:center;
                margin-top:15px;
                font-size:13px;
                color:#777;
            ">
                The verification code expires in
                <strong>10 minutes</strong>.
            </p>

        </form>
        `
    );


    const codeInput =
        document.getElementById(
            "adminVerificationCode"
        );


    codeInput.addEventListener(
        "input",
        () => {

            codeInput.value =
                codeInput.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

        }
    );


    document
        .getElementById(
            "adminVerificationForm"
        )
        .addEventListener(
            "submit",
            verifyAdminEmail
        );


    setTimeout(() => {

        codeInput.focus();

    }, 100);

}


/* =========================================================
   VERIFY ADMIN EMAIL
========================================================= */

async function verifyAdminEmail(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "adminVerificationEmail"
        ).value.trim();


    const verificationCode =
        document.getElementById(
            "adminVerificationCode"
        ).value.trim();


    if (
        !/^\d{6}$/.test(
            verificationCode
        )
    ) {

        showToast(
            "Please enter the 6-digit verification code.",
            "error"
        );

        return;
    }


    const verifyButton =
        document.getElementById(
            "verifyAdminBtn"
        );


    if (verifyButton) {

        verifyButton.disabled = true;

        verifyButton.textContent =
            "Verifying...";

    }


    try {

        await apiRequest(
            "/auth/verify-email",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        email,
                        verificationCode
                    })
            }
        );


        closeModal();


        showToast(
            "Admin email verified successfully."
        );


        loadAdmins();


    } catch (error) {

        showToast(
            error.message,
            "error"
        );


        if (verifyButton) {

            verifyButton.disabled = false;

            verifyButton.textContent =
                "Verify Admin";

        }

    }

}


/* =========================================================
   EDIT / VERIFY ADMIN FROM LIST
========================================================= */

window.openAdminVerificationModal =
    openAdminVerificationModal;


/* =========================================================
   DELETE ADMIN
========================================================= */

async function deleteAdmin(id) {

    if (
        !confirm(
            "Are you sure you want to delete this admin?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            `/auth/admins/${id}`,
            {
                method: "DELETE"
            }
        );

        showToast(
            "Admin deleted successfully."
        );

        loadAdmins();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   SITE CONTENT
========================================================= */

async function loadSiteContent() {

    try {

        const data =
            await apiRequest(
                "/site-content"
            );

        const content =
            data.content || {};


        const fields = {

            schoolName:
                content.schoolName,

            schoolNameBangla:
                content.schoolNameBangla,

            heroTitle:
                content.heroTitle,

            heroSubtitle:
                content.heroSubtitle,

            aboutTitle:
                content.aboutTitle,

            aboutDescription:
                content.aboutDescription,

            historyTitle:
                content.historyTitle,

            historyDescription:
                content.historyDescription,

            mission:
                content.mission,

            vision:
                content.vision,

            phone:
                content.phone,

            email:
                content.email,

            address:
                content.address,

            googleMapUrl:
                content.googleMapUrl,

            facebook:
                content.socialLinks?.facebook,

            youtube:
                content.socialLinks?.youtube,

            instagram:
                content.socialLinks?.instagram

        };


        Object.entries(fields).forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(id);

                if (element) {

                    element.value =
                        value || "";

                }

            }
        );


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   SAVE SITE CONTENT
========================================================= */

const saveSiteContentBtn =
    document.getElementById(
        "saveSiteContentBtn"
    );

if (saveSiteContentBtn) {

    saveSiteContentBtn.addEventListener(
        "click",
        saveSiteContent
    );

}


async function saveSiteContent() {

    const formData =
        new FormData();


    const fields = [

        "schoolName",
        "schoolNameBangla",
        "heroTitle",
        "heroSubtitle",
        "aboutTitle",
        "aboutDescription",
        "historyTitle",
        "historyDescription",
        "mission",
        "vision",
        "phone",
        "email",
        "address",
        "googleMapUrl"

    ];


    fields.forEach(field => {

        const element =
            document.getElementById(field);

        if (element) {

            formData.append(
                field,
                element.value
            );

        }

    });


    const socialLinks = {

        facebook:
            document.getElementById(
                "facebook"
            )?.value || "",

        youtube:
            document.getElementById(
                "youtube"
            )?.value || "",

        instagram:
            document.getElementById(
                "instagram"
            )?.value || ""

    };


    formData.append(
        "socialLinks",
        JSON.stringify(socialLinks)
    );


    const heroImage =
        document.getElementById(
            "heroImage"
        )?.files?.[0];


    if (heroImage) {

        formData.append(
            "heroImage",
            heroImage
        );

    }


    try {

        await apiRequest(
            "/site-content",
            {
                method: "PUT",
                body: formData
            }
        );

        showToast(
            "Website content updated successfully."
        );

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

document.querySelectorAll(
    ".quick-btn"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const action =
                button.dataset.action;


            if (action === "notice") {

                switchSection(
                    "notices"
                );

                showNoticeForm();

            }


            if (action === "news") {

                switchSection(
                    "news-events"
                );

                showNewsEventForm();

            }


            if (action === "gallery") {

                switchSection(
                    "gallery"
                );

                showGalleryForm();

            }


            if (action === "teacher") {

                switchSection(
                    "teachers"
                );

                showTeacherForm();

            }

        }
    );

});


/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "token"
            );


            window.location.href =
                "../admin-login/admin-login.html";

        }
    );

}


/* =========================================================
   HELPERS
========================================================= */

function formatDate(date) {

    if (!date) {
        return "No date";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "Invalid date";
    }


    return parsed.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function toInputDate(date) {

    if (!date) {
        return "";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "";
    }


    return parsed
        .toISOString()
        .split("T")[0];

}


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHtml(value);

}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAdminProfile();

        loadDashboardStats();

    }
);