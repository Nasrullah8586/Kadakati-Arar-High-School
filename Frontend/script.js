/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    "https://kadakati-arar-high-school-api.onrender.com/api";


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

const noticePageList =
    document.getElementById("noticePageList");

const newsEventList =
    document.getElementById("newsEventList");

const newsEventsPageList =
    document.getElementById("newsEventsPageList");

const galleryList =
    document.getElementById("galleryList");

const teacherList =
    document.getElementById("teacherList");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================================================
   CONTACT PAGE ELEMENTS
========================================================= */

const contactAddress =
    document.getElementById("contactAddress");

const contactPhone =
    document.getElementById("contactPhone");

const contactEmail =
    document.getElementById("contactEmail");

const contactFacebook =
    document.getElementById("contactFacebook");

const contactInstagram =
    document.getElementById("contactInstagram");

const contactLinkedin =
    document.getElementById("contactLinkedin");

const contactGoogleMaps =
    document.getElementById("contactGoogleMaps");

const contactLocationBtn =
    document.getElementById("contactLocationBtn");


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


function getArrayFromResponse(
    data,
    keys = []
) {

    if (Array.isArray(data)) {
        return data;
    }

    for (const key of keys) {

        if (Array.isArray(data?.[key])) {
            return data[key];
        }

        if (Array.isArray(data?.data?.[key])) {
            return data.data[key];
        }

        if (Array.isArray(data?.content?.[key])) {
            return data.content[key];
        }

    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    return [];
}


function getImageUrl(item) {

    return (
        item?.imageUrl ||
        item?.image ||
        item?.url ||
        item?.secure_url ||
        item?.photoUrl ||
        item?.photo ||
        item?.profileImage ||
        item?.profileImageUrl ||
        item?.teacherImage ||
        item?.teacherImageUrl ||
        item?.picture ||
        item?.pictureUrl ||
        ""
    );
}


function getNewsDate(item) {

    return (
        item?.eventDate ||
        item?.newsDate ||
        item?.noticeDate ||
        item?.date ||
        item?.createdAt ||
        ""
    );
}


function getNoticeDate(item) {

    return (
        item?.noticeDate ||
        item?.date ||
        item?.createdAt ||
        ""
    );
}


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
                String(isOpen)
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

    teacherLoginBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "teacher-login/teacher-login.html";

        }
    );

}


if (adminLoginBtn) {

    adminLoginBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "admin-login/admin-login.html";

        }
    );

}


/* =========================================================
   ABOUT PANEL
========================================================= */

if (aboutToggle && aboutPanel) {

    aboutToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                aboutPanel.classList.toggle("show");

            aboutToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            aboutPanel.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );

        }
    );

}


/* =========================================================
   ABOUT LINK
========================================================= */

const aboutLinks =
    document.querySelectorAll(
        'a[href="index.html#about"], a[href="#about"]'
    );


aboutLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function (event) {

                const currentPage =
                    window.location.pathname
                        .split("/")
                        .pop()
                        .toLowerCase();

                if (
                    currentPage === "" ||
                    currentPage === "index.html"
                ) {

                    event.preventDefault();

                    const homeSection =
                        document.getElementById("home");

                    if (homeSection) {

                        homeSection.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                    if (aboutPanel && aboutToggle) {

                        setTimeout(
                            function () {

                                aboutPanel.classList.add(
                                    "show"
                                );

                                aboutToggle.setAttribute(
                                    "aria-expanded",
                                    "true"
                                );

                                aboutPanel.setAttribute(
                                    "aria-hidden",
                                    "false"
                                );

                            },
                            400
                        );

                    }

                }

            }
        );

    }
);


/* =========================================================
   SITE CONTENT
========================================================= */

async function loadSiteContent() {

    if (
        !schoolAbout &&
        !schoolHistory &&
        !schoolAddress &&
        !schoolPhone &&
        !schoolEmail &&
        !googleMapsLink &&
        !schoolLocationBtn &&
        !facebookLink &&
        !instagramLink &&
        !linkedinLink &&
        !contactAddress &&
        !contactPhone &&
        !contactEmail &&
        !contactFacebook &&
        !contactInstagram &&
        !contactLinkedin &&
        !contactGoogleMaps &&
        !contactLocationBtn
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/site-content`,
                {
                    cache: "no-store"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load site content."
            );

        }


        const content =
            data?.content ||
            data?.data?.content ||
            data?.data ||
            data;


        /* =========================
           ABOUT
        ========================= */

        if (schoolAbout) {

            schoolAbout.textContent =
                content?.about ||
                content?.schoolAbout ||
                "School information is not available.";

        }


        /* =========================
           HISTORY
        ========================= */

        if (schoolHistory) {

            const historyText =
                content?.history ||
                content?.schoolHistory ||
                content?.historyText ||
                content?.school_history ||
                "";

            if (
                historyText &&
                String(historyText).trim() !== ""
            ) {

                schoolHistory.textContent =
                    historyText;

            } else {

                schoolHistory.textContent =
                    "School history is not available.";

            }

        }


        /* =========================
           CONTACT
        ========================= */

        if (schoolAddress) {

            schoolAddress.textContent =
                content?.address ||
                "Address is not available.";

        }


        if (schoolPhone) {

            schoolPhone.textContent =
                content?.phone ||
                "Phone number is not available.";

        }


        if (schoolEmail) {

            schoolEmail.textContent =
                content?.email ||
                "Email is not available.";

        }


        /* =========================
           GOOGLE MAPS
        ========================= */

        const mapsUrl =
            content?.googleMapsLink ||
            content?.googleMapLink ||
            content?.mapsLink ||
            "";


        if (googleMapsLink) {

            if (mapsUrl) {

                googleMapsLink.href =
                    mapsUrl;

                googleMapsLink.target =
                    "_blank";

                googleMapsLink.rel =
                    "noopener noreferrer";

                googleMapsLink.style.display =
                    "inline-flex";

            } else {

                googleMapsLink.style.display =
                    "none";

            }

        }


        if (schoolLocationBtn) {

            if (mapsUrl) {

                schoolLocationBtn.href =
                    mapsUrl;

                schoolLocationBtn.target =
                    "_blank";

                schoolLocationBtn.rel =
                    "noopener noreferrer";

                schoolLocationBtn.style.display =
                    "inline-block";

            } else {

                schoolLocationBtn.style.display =
                    "none";

            }

        }


        /* =========================
           SOCIAL LINKS
        ========================= */

        const socialLinks =
            content?.socialLinks ||
            content?.social ||
            {};


        setupSocialLink(
            facebookLink,
            socialLinks?.facebook
        );

        setupSocialLink(
            instagramLink,
            socialLinks?.instagram
        );

        setupSocialLink(
            linkedinLink,
            socialLinks?.linkedin
        );


        /* =========================
           CONTACT PAGE
        ========================= */

        if (contactAddress) {

            contactAddress.textContent =
                content?.address ||
                "Address is not available.";

        }


        if (contactPhone) {

            const phone =
                content?.phone || "";

            if (phone) {

                contactPhone.textContent =
                    phone;

                if (
                    contactPhone.tagName === "A"
                ) {

                    contactPhone.href =
                        `tel:${phone.replace(
                            /[^0-9+]/g,
                            ""
                        )}`;

                }

            } else {

                contactPhone.textContent =
                    "Phone number is not available.";

            }

        }


        if (contactEmail) {

            const email =
                content?.email || "";

            if (email) {

                contactEmail.textContent =
                    email;

                if (
                    contactEmail.tagName === "A"
                ) {

                    contactEmail.href =
                        `mailto:${email}`;

                }

            } else {

                contactEmail.textContent =
                    "Email is not available.";

            }

        }


        setupSocialLink(
            contactFacebook,
            socialLinks?.facebook
        );

        setupSocialLink(
            contactInstagram,
            socialLinks?.instagram
        );

        setupSocialLink(
            contactLinkedin,
            socialLinks?.linkedin
        );


        if (contactGoogleMaps) {

            if (mapsUrl) {

                contactGoogleMaps.href =
                    mapsUrl;

                contactGoogleMaps.target =
                    "_blank";

                contactGoogleMaps.rel =
                    "noopener noreferrer";

                contactGoogleMaps.style.display =
                    "inline-flex";

            } else {

                contactGoogleMaps.style.display =
                    "none";

            }

        }


        if (contactLocationBtn) {

            if (mapsUrl) {

                contactLocationBtn.href =
                    mapsUrl;

                contactLocationBtn.target =
                    "_blank";

                contactLocationBtn.rel =
                    "noopener noreferrer";

                contactLocationBtn.style.display =
                    "inline-flex";

            } else {

                contactLocationBtn.style.display =
                    "none";

            }

        }


    } catch (error) {

        console.error(
            "Site Content Error:",
            error
        );

    }

}


/* =========================================================
   SOCIAL LINKS
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

        element.href =
            url;

        element.target =
            "_blank";

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
   NOTICE API
========================================================= */

async function fetchNotices() {

    const response =
        await fetch(
            `${API_BASE_URL}/notices`,
            {
                cache: "no-store"
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to load notices."
        );

    }


    let notices =
        getArrayFromResponse(
            data,
            [
                "notices",
                "notice"
            ]
        );


    notices =
        notices.filter(
            notice =>
                notice.isPublished !== false &&
                notice.published !== false
        );


    return notices;

}


/* =========================================================
   HOMEPAGE NOTICE
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

        const notices =
            await fetchNotices();


        if (notices.length === 0) {

            noticeList.innerHTML =
                `<p>No notices available at the moment.</p>`;

            return;

        }


        noticeList.innerHTML =
            notices.map(
                notice => {

                    const date =
                        getNoticeDate(notice);

                    const attachment =
                        notice.attachment;


                    return `
                        <article class="notice-card">

                            ${
                                date
                                    ? `
                                        <span class="notice-date">
                                            ${formatDate(date)}
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

                            ${
                                attachment
                                    ? `
                                        <a
                                            href="${escapeHTML(
                                                attachment
                                            )}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="notice-attachment"
                                        >
                                            View Attachment
                                        </a>
                                    `
                                    : ""
                            }

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
   NOTICE FULL PAGE
========================================================= */

async function loadNoticePage() {

    if (!noticePageList) {
        return;
    }


    showLoading(
        noticePageList,
        "Loading notices..."
    );


    try {

        const notices =
            await fetchNotices();


        if (notices.length === 0) {

            noticePageList.innerHTML =
                `<p>No notices available at the moment.</p>`;

            return;

        }


        noticePageList.innerHTML =
            notices.map(
                (notice, index) => {

                    const date =
                        getNoticeDate(notice);

                    const category =
                        notice.category ||
                        "";


                    return `
                        <article
                            class="notice-page-card"
                            data-notice-index="${index}"
                        >

                            ${
                                date
                                    ? `
                                        <span class="notice-date">
                                            ${formatDate(date)}
                                        </span>
                                    `
                                    : ""
                            }

                            <h2>
                                ${escapeHTML(
                                    notice.title ||
                                    "School Notice"
                                )}
                            </h2>

                            <p>
                                ${escapeHTML(
                                    notice.description ||
                                    ""
                                )}
                            </p>

                            ${
                                category
                                    ? `
                                        <span class="notice-category">
                                            ${escapeHTML(
                                                category
                                            )}
                                        </span>
                                    `
                                    : ""
                            }

                            <div class="notice-view-text">
                                Click to view full notice →
                            </div>

                        </article>
                    `;

                }
            ).join("");


        setupNoticeModal(
            notices
        );


    } catch (error) {

        console.error(
            "Notice Page Error:",
            error
        );


        showError(
            noticePageList,
            "Unable to load notices."
        );

    }

}


/* =========================================================
   NOTICE MODAL
========================================================= */

function setupNoticeModal(
    notices
) {

    const modal =
        document.getElementById(
            "noticeModal"
        );

    const modalBody =
        document.getElementById(
            "noticeModalBody"
        );

    const closeButton =
        document.getElementById(
            "noticeModalClose"
        );


    if (
        !modal ||
        !modalBody
    ) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".notice-page-card"
        );


    cards.forEach(
        card => {

            card.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest("a")
                    ) {
                        return;
                    }


                    const index =
                        Number(
                            this.dataset.noticeIndex
                        );


                    const notice =
                        notices[index];


                    if (!notice) {
                        return;
                    }


                    const date =
                        getNoticeDate(notice);

                    const category =
                        notice.category ||
                        "";

                    const attachment =
                        notice.attachment;


                    modalBody.innerHTML = `

                        ${
                            date
                                ? `
                                    <span class="notice-modal-date">
                                        ${formatDate(date)}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            category
                                ? `
                                    <span class="notice-modal-category">
                                        ${escapeHTML(
                                            category
                                        )}
                                    </span>
                                `
                                : ""
                        }

                        <h2>
                            ${escapeHTML(
                                notice.title ||
                                "School Notice"
                            )}
                        </h2>

                        <div class="notice-modal-description">
                            ${escapeHTML(
                                notice.description ||
                                "No description available."
                            )}
                        </div>

                        ${
                            attachment
                                ? `
                                    <a
                                        href="${escapeHTML(
                                            attachment
                                        )}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="notice-attachment-button"
                                    >
                                        View Attachment
                                    </a>
                                `
                                : ""
                        }

                    `;


                    modal.classList.add(
                        "show"
                    );

                    modal.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );


    function closeNoticeModal() {

        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeNoticeModal
        );

    }


    const overlay =
        modal.querySelector(
            ".notice-modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeNoticeModal
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeNoticeModal();

            }

        }
    );

}


/* =========================================================
   NEWS & EVENTS API
========================================================= */

async function fetchNewsEvents() {

    const response =
        await fetch(
            `${API_BASE_URL}/news-events`,
            {
                cache: "no-store"
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to load news and events."
        );

    }


    let items =
        getArrayFromResponse(
            data,
            [
                "newsEvents",
                "news",
                "events"
            ]
        );


    items =
        items.filter(
            item =>
                item.isPublished !== false &&
                item.published !== false
        );


    return items;

}


/* =========================================================
   HOMEPAGE NEWS & EVENTS
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

        const items =
            await fetchNewsEvents();


        if (items.length === 0) {

            newsEventList.innerHTML =
                `<p>No news or events available at the moment.</p>`;

            return;

        }


        newsEventList.innerHTML =
            items.map(
                (item, index) => {

                    const image =
                        getImageUrl(item);

                    const date =
                        getNewsDate(item);


                    return `
                        <article
                            class="news-card homepage-news-card"
                            data-news-index="${index}"
                            role="button"
                            tabindex="0"
                        >

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
                                            loading="lazy"
                                        >
                                    `
                                    : ""
                            }

                            <div class="news-card-content">

                                ${
                                    date
                                        ? `
                                            <span class="notice-date">
                                                ${formatDate(date)}
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

                                <span class="news-card-view">
                                    View Full News & Events →
                                </span>

                            </div>

                        </article>
                    `;

                }
            ).join("");


        setupHomepageNewsNavigation();


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
   HOMEPAGE NEWS NAVIGATION
========================================================= */

function setupHomepageNewsNavigation() {

    const cards =
        document.querySelectorAll(
            ".homepage-news-card"
        );


    cards.forEach(
        card => {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "news-events.html";

                }
            );


            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        window.location.href =
                            "news-events.html";

                    }

                }
            );

        }
    );

}


/* =========================================================
   NEWS & EVENTS FULL PAGE
========================================================= */

async function loadNewsEventsPage() {

    if (!newsEventsPageList) {
        return;
    }


    showLoading(
        newsEventsPageList,
        "Loading news and events..."
    );


    try {

        const items =
            await fetchNewsEvents();


        if (items.length === 0) {

            newsEventsPageList.innerHTML =
                `<p>No news or events available at the moment.</p>`;

            return;

        }


        newsEventsPageList.innerHTML =
            items.map(
                (item, index) => {

                    const image =
                        getImageUrl(item);

                    const date =
                        getNewsDate(item);

                    const category =
                        item.category ||
                        item.type ||
                        "";


                    return `
                        <article
                            class="news-event-page-card"
                        >

                            ${
                                image
                                    ? `
                                        <div
                                            class="news-event-image-wrapper"
                                            data-image-index="${index}"
                                        >

                                            <img
                                                src="${escapeHTML(
                                                    image
                                                )}"
                                                alt="${escapeHTML(
                                                    item.title ||
                                                    "School News"
                                                )}"
                                                class="news-event-image"
                                                loading="lazy"
                                            >

                                            <span class="news-image-hint">
                                                View Full Image
                                            </span>

                                        </div>
                                    `
                                    : ""
                            }

                            <div class="news-event-page-content">

                                ${
                                    date
                                        ? `
                                            <span class="news-event-date">
                                                ${formatDate(date)}
                                            </span>
                                        `
                                        : ""
                                }

                                <h2>
                                    ${escapeHTML(
                                        item.title ||
                                        "School News"
                                    )}
                                </h2>

                                <p>
                                    ${escapeHTML(
                                        item.description ||
                                        ""
                                    )}
                                </p>

                                ${
                                    category
                                        ? `
                                            <span class="news-event-category">
                                                ${escapeHTML(
                                                    category
                                                )}
                                            </span>
                                        `
                                        : ""
                                }

                            </div>

                        </article>
                    `;

                }
            ).join("");


        setupNewsImageLightbox(
            items
        );


    } catch (error) {

        console.error(
            "News/Event Page Error:",
            error
        );


        showError(
            newsEventsPageList,
            "Unable to load news and events."
        );

    }

}


/* =========================================================
   NEWS IMAGE LIGHTBOX
========================================================= */

function setupNewsImageLightbox(
    items
) {

    const modal =
        document.getElementById(
            "newsImageModal"
        );

    const fullImage =
        document.getElementById(
            "newsFullImage"
        );

    const caption =
        document.getElementById(
            "newsImageCaption"
        );

    const closeButton =
        document.getElementById(
            "newsImageClose"
        );


    if (
        !modal ||
        !fullImage
    ) {
        return;
    }


    const imageWrappers =
        document.querySelectorAll(
            ".news-event-image-wrapper"
        );


    imageWrappers.forEach(
        wrapper => {

            wrapper.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const index =
                        Number(
                            this.dataset.imageIndex
                        );


                    const item =
                        items[index];


                    if (!item) {
                        return;
                    }


                    const imageUrl =
                        getImageUrl(item);


                    if (!imageUrl) {
                        return;
                    }


                    fullImage.src =
                        imageUrl;

                    fullImage.alt =
                        item.title ||
                        "News and Event Image";


                    if (caption) {

                        caption.textContent =
                            item.caption ||
                            item.title ||
                            "";

                    }


                    modal.classList.add(
                        "show"
                    );

                    modal.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );


    function closeImage() {

        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        fullImage.src =
            "";

        if (caption) {
            caption.textContent = "";
        }

        document.body.style.overflow =
            "";

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeImage
        );

    }


    const overlay =
        modal.querySelector(
            ".news-image-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeImage
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeImage();

            }

        }
    );

}


/* =========================================================
   GALLERY API
========================================================= */

async function fetchGallery() {

    const response =
        await fetch(
            `${API_BASE_URL}/gallery`,
            {
                cache: "no-store"
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to load gallery."
        );

    }


    return getArrayFromResponse(
        data,
        [
            "gallery",
            "images"
        ]
    );

}


/* =========================================================
   HOMEPAGE GALLERY
========================================================= */

async function loadHomepageGallery() {

    if (!galleryList) {
        return;
    }


    showLoading(
        galleryList,
        "Loading gallery..."
    );


    try {

        const images =
            await fetchGallery();


        if (images.length === 0) {

            galleryList.innerHTML =
                `<p>No gallery images available.</p>`;

            return;

        }


        galleryList.innerHTML =
            images.slice(0, 6).map(
                item => {

                    const imageUrl =
                        getImageUrl(item);

                    if (!imageUrl) {
                        return "";
                    }


                    const caption =
                        item.caption ||
                        item.title ||
                        "";


                    return `
                        <div
                            class="gallery-item"
                            data-gallery-image="${escapeHTML(
                                imageUrl
                            )}"
                            data-gallery-caption="${escapeHTML(
                                caption
                            )}"
                        >

                            <img
                                src="${escapeHTML(
                                    imageUrl
                                )}"
                                alt="${escapeHTML(
                                    caption ||
                                    "School Gallery"
                                )}"
                                loading="lazy"
                            >

                            ${
                                caption
                                    ? `
                                        <p class="gallery-caption">
                                            ${escapeHTML(
                                                caption
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>
                    `;

                }
            ).join("");


        setupGalleryLightbox();


    } catch (error) {

        console.error(
            "Homepage Gallery Error:",
            error
        );


        showError(
            galleryList,
            "Unable to load gallery."
        );

    }

}


/* =========================================================
   FULL GALLERY PAGE
========================================================= */

async function loadGalleryPage() {

    const pageGallery =
        document.getElementById(
            "galleryPageList"
        ) ||
        document.getElementById(
            "galleryGrid"
        ) ||
        document.querySelector(
            ".gallery-page-list"
        ) ||
        document.querySelector(
            ".gallery-grid"
        );


    if (!pageGallery) {
        return;
    }


    showLoading(
        pageGallery,
        "Loading gallery..."
    );


    try {

        const images =
            await fetchGallery();


        if (images.length === 0) {

            pageGallery.innerHTML =
                `<p>No gallery images available.</p>`;

            return;

        }


        pageGallery.innerHTML =
            images.map(
                (item, index) => {

                    const imageUrl =
                        getImageUrl(item);

                    if (!imageUrl) {
                        return "";
                    }


                    const caption =
                        item.caption ||
                        item.title ||
                        "";


                    return `
                        <article
                            class="gallery-page-item"
                            data-gallery-index="${index}"
                        >

                            <div class="gallery-image-wrapper">

                                <img
                                    src="${escapeHTML(
                                        imageUrl
                                    )}"
                                    alt="${escapeHTML(
                                        caption ||
                                        "School Gallery"
                                    )}"
                                    loading="lazy"
                                >

                                <span class="gallery-view-hint">
                                    View Full Image
                                </span>

                            </div>

                            ${
                                caption
                                    ? `
                                        <div class="gallery-page-caption">
                                            ${escapeHTML(
                                                caption
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                        </article>
                    `;

                }
            ).join("");


        setupFullGalleryLightbox(
            images
        );


    } catch (error) {

        console.error(
            "Gallery Page Error:",
            error
        );


        showError(
            pageGallery,
            "Unable to load gallery."
        );

    }

}


/* =========================================================
   HOMEPAGE GALLERY LIGHTBOX
========================================================= */

function setupGalleryLightbox() {

    const items =
        document.querySelectorAll(
            ".gallery-item"
        );


    if (!items.length) {
        return;
    }


    let modal =
        document.getElementById(
            "galleryLightbox"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "galleryLightbox";

        modal.className =
            "gallery-lightbox";

        modal.innerHTML = `

            <div class="gallery-lightbox-overlay"></div>

            <div class="gallery-lightbox-content">

                <button
                    type="button"
                    class="gallery-lightbox-close"
                >
                    ×
                </button>

                <img
                    src=""
                    alt="Gallery image"
                >

                <div class="gallery-lightbox-caption"></div>

            </div>

        `;

        document.body.appendChild(
            modal
        );

    }


    const image =
        modal.querySelector("img");

    const caption =
        modal.querySelector(
            ".gallery-lightbox-caption"
        );

    const close =
        modal.querySelector(
            ".gallery-lightbox-close"
        );

    const overlay =
        modal.querySelector(
            ".gallery-lightbox-overlay"
        );


    items.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    const imageUrl =
                        this.dataset.galleryImage;

                    const imageCaption =
                        this.dataset.galleryCaption;


                    if (!imageUrl) {
                        return;
                    }


                    image.src =
                        imageUrl;

                    image.alt =
                        imageCaption ||
                        "School Gallery";

                    caption.textContent =
                        imageCaption ||
                        "";

                    modal.classList.add(
                        "show"
                    );

                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );


    function closeGallery() {

        modal.classList.remove(
            "show"
        );

        image.src =
            "";

        document.body.style.overflow =
            "";

    }


    close.addEventListener(
        "click",
        closeGallery
    );

    overlay.addEventListener(
        "click",
        closeGallery
    );

}


/* =========================================================
   FULL GALLERY LIGHTBOX
========================================================= */

function setupFullGalleryLightbox(
    images
) {

    const items =
        document.querySelectorAll(
            ".gallery-page-item"
        );


    let modal =
        document.getElementById(
            "galleryLightbox"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "galleryLightbox";

        modal.className =
            "gallery-lightbox";

        modal.innerHTML = `

            <div class="gallery-lightbox-overlay"></div>

            <div class="gallery-lightbox-content">

                <button
                    type="button"
                    class="gallery-lightbox-close"
                >
                    ×
                </button>

                <img
                    src=""
                    alt="Gallery image"
                >

                <div class="gallery-lightbox-caption"></div>

            </div>

        `;

        document.body.appendChild(
            modal
        );

    }


    const image =
        modal.querySelector("img");

    const caption =
        modal.querySelector(
            ".gallery-lightbox-caption"
        );

    const close =
        modal.querySelector(
            ".gallery-lightbox-close"
        );

    const overlay =
        modal.querySelector(
            ".gallery-lightbox-overlay"
        );


    items.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.galleryIndex
                        );


                    const galleryItem =
                        images[index];


                    if (!galleryItem) {
                        return;
                    }


                    const imageUrl =
                        getImageUrl(
                            galleryItem
                        );


                    if (!imageUrl) {
                        return;
                    }


                    const imageCaption =
                        galleryItem.caption ||
                        galleryItem.title ||
                        "";


                    image.src =
                        imageUrl;

                    image.alt =
                        imageCaption ||
                        "School Gallery";

                    caption.textContent =
                        imageCaption;


                    modal.classList.add(
                        "show"
                    );

                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );


    function closeGallery() {

        modal.classList.remove(
            "show"
        );

        image.src =
            "";

        document.body.style.overflow =
            "";

    }


    close.addEventListener(
        "click",
        closeGallery
    );

    overlay.addEventListener(
        "click",
        closeGallery
    );

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
                `${API_BASE_URL}/teachers`,
                {
                    cache: "no-store"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load teachers."
            );

        }


        allTeachers =
            getArrayFromResponse(
                data,
                [
                    "teachers",
                    "teacher"
                ]
            );


        renderTeachers(
            "All"
        );


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
   TEACHER PROFILE MODAL
========================================================= */

function createTeacherProfileModal() {

    if (
        document.getElementById(
            "teacherProfileModal"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");

    style.id =
        "teacher-profile-modal-style";

    style.textContent = `

        .teacher-profile-modal {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 25px;
        }

        .teacher-profile-modal.show {
            display: flex;
        }

        .teacher-profile-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(5px);
        }

        .teacher-profile-content {
            position: relative;
            z-index: 2;
            width: min(850px, 100%);
            max-height: 90vh;
            overflow-y: auto;
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 25px 70px rgba(0,0,0,0.25);
        }

        .teacher-profile-close {
            position: absolute;
            top: 15px;
            right: 18px;
            z-index: 5;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,0.95);
            color: #176B45;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.12);
        }

        .teacher-profile-top {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 30px;
            padding: 35px;
        }

        .teacher-profile-image {
            width: 100%;
            height: 330px;
            overflow: hidden;
            border-radius: 14px;
            background: #e9f0ec;
        }

        .teacher-profile-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .teacher-profile-info {
            padding: 15px 0;
        }

        .teacher-profile-info h2 {
            margin-bottom: 8px;
            color: #1b3025;
            font-size: 30px;
        }

        .teacher-profile-designation {
            margin-bottom: 18px;
            color: #176B45;
            font-weight: 700;
        }

        .teacher-profile-meta {
            display: grid;
            gap: 8px;
            margin-bottom: 20px;
            color: #405048;
        }

        .teacher-profile-about {
            padding: 25px 35px 35px;
            border-top: 1px solid #e1eae5;
        }

        .teacher-profile-about h3 {
            margin-bottom: 10px;
            color: #176B45;
            font-size: 20px;
        }

        .teacher-profile-about p {
            color: #68756e;
            line-height: 1.8;
            white-space: pre-line;
        }

        .teacher-profile-social {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 18px;
        }

        .teacher-profile-social a {
            display: inline-flex;
            padding: 8px 15px;
            border-radius: 20px;
            background: #edf5f0;
            color: #176B45;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
        }

        @media (max-width: 650px) {

            .teacher-profile-top {
                grid-template-columns: 1fr;
                padding: 25px;
            }

            .teacher-profile-image {
                height: 300px;
            }

            .teacher-profile-about {
                padding: 25px;
            }

            .teacher-profile-info h2 {
                font-size: 25px;
            }

        }

    `;

    document.head.appendChild(style);


    const modal =
        document.createElement("div");

    modal.id =
        "teacherProfileModal";

    modal.className =
        "teacher-profile-modal";

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    modal.innerHTML = `

        <div class="teacher-profile-overlay"></div>

        <div class="teacher-profile-content">

            <button
                type="button"
                class="teacher-profile-close"
                aria-label="Close teacher profile"
            >
                ×
            </button>

            <div
                id="teacherProfileBody"
            ></div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const closeButton =
        modal.querySelector(
            ".teacher-profile-close"
        );

    const overlay =
        modal.querySelector(
            ".teacher-profile-overlay"
        );


    function closeModal() {

        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    closeButton.addEventListener(
        "click",
        closeModal
    );


    overlay.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );

}


/* =========================================================
   SHOW TEACHER PROFILE
========================================================= */

function showTeacherProfile(
    teacher
) {

    createTeacherProfileModal();


    const modal =
        document.getElementById(
            "teacherProfileModal"
        );

    const body =
        document.getElementById(
            "teacherProfileBody"
        );


    if (
        !modal ||
        !body
    ) {
        return;
    }


    const photo =
        getImageUrl(teacher) ||
        "images/teacher-placeholder.jpg";


    const about =
        teacher.about ||
        teacher.bio ||
        teacher.description ||
        teacher.details ||
        teacher.profile ||
        teacher.aboutTeacher ||
        "No information available about this teacher.";


    const phone =
        teacher.phone ||
        teacher.phoneNumber ||
        "";


    const socialLinks =
        teacher.socialLinks ||
        teacher.social ||
        {};


    body.innerHTML = `

        <div class="teacher-profile-top">

            <div class="teacher-profile-image">

                <img
                    src="${escapeHTML(
                        photo
                    )}"
                    alt="${escapeHTML(
                        teacher.name ||
                        "Teacher"
                    )}"
                >

            </div>


            <div class="teacher-profile-info">

                <h2>
                    ${escapeHTML(
                        teacher.name ||
                        "Teacher"
                    )}
                </h2>

                ${
                    teacher.designation
                        ? `
                            <p class="teacher-profile-designation">
                                ${escapeHTML(
                                    teacher.designation
                                )}
                            </p>
                        `
                        : ""
                }


                <div class="teacher-profile-meta">

                    <div>
                        <strong>Division:</strong>
                        ${escapeHTML(
                            teacher.division ||
                            "N/A"
                        )}
                    </div>

                    <div>
                        <strong>Department:</strong>
                        ${escapeHTML(
                            teacher.department ||
                            "N/A"
                        )}
                    </div>

                    <div>
                        <strong>Subject:</strong>
                        ${escapeHTML(
                            teacher.subject ||
                            "N/A"
                        )}
                    </div>

                    ${
                        phone
                            ? `
                                <div>
                                    <strong>Phone:</strong>
                                    ${escapeHTML(
                                        phone
                                    )}
                                </div>
                            `
                            : ""
                    }

                </div>


                <div class="teacher-profile-social">

                    ${
                        socialLinks.facebook
                            ? `
                                <a
                                    href="${escapeHTML(
                                        socialLinks.facebook
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook
                                </a>
                            `
                            : ""
                    }

                    ${
                        socialLinks.instagram
                            ? `
                                <a
                                    href="${escapeHTML(
                                        socialLinks.instagram
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Instagram
                                </a>
                            `
                            : ""
                    }

                    ${
                        socialLinks.linkedin
                            ? `
                                <a
                                    href="${escapeHTML(
                                        socialLinks.linkedin
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </a>
                            `
                            : ""
                    }

                </div>

            </div>

        </div>


        <div class="teacher-profile-about">

            <h3>
                About Teacher
            </h3>

            <p>
                ${escapeHTML(
                    about
                )}
            </p>

        </div>

    `;


    modal.classList.add(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   RENDER TEACHERS
========================================================= */

function renderTeachers(
    division
) {

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
                        teacher.division ||
                        ""
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
            (teacher, index) => {

                const photo =
                    getImageUrl(
                        teacher
                    ) ||
                    "images/teacher-placeholder.jpg";


                return `
                    <article
                        class="teacher-card"
                        data-teacher-index="${index}"
                    >

                        <div class="teacher-image">

                            <img
                                src="${escapeHTML(
                                    photo
                                )}"
                                alt="${escapeHTML(
                                    teacher.name ||
                                    "Teacher"
                                )}"
                                loading="lazy"
                                onerror="this.onerror=null;this.src='images/teacher-placeholder.jpg';"
                            >

                        </div>

                        <div class="teacher-info">

                            <h3>
                                ${escapeHTML(
                                    teacher.name ||
                                    "Teacher"
                                )}
                            </h3>

                            ${
                                teacher.designation
                                    ? `
                                        <p class="teacher-designation">
                                            ${escapeHTML(
                                                teacher.designation
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

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


    /* =====================================================
       TEACHER CARD CLICK
    ===================================================== */

    const cards =
        teacherList.querySelectorAll(
            ".teacher-card"
        );


    cards.forEach(
        (card, index) => {

            card.addEventListener(
                "click",
                function () {

                    const teacher =
                        teachers[index];

                    if (teacher) {

                        showTeacherProfile(
                            teacher
                        );

                    }

                }
            );

        }
    );

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


                this.classList.add(
                    "active"
                );


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
   NAVIGATION
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
   CONTACT NAVIGATION
========================================================= */

const contactLinks =
    document.querySelectorAll(
        'a[href="contact.html"], a[href="./contact.html"]'
    );


contactLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function () {

                window.location.href =
                    "contact.html";

            }
        );

    }
);


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSiteContent();

        loadNotices();

        loadNoticePage();

        loadNewsEvents();

        loadNewsEventsPage();

        loadHomepageGallery();

        loadGalleryPage();

        loadTeachers();

    }
);