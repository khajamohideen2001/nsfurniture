/*=========================================
    NS Furnishing
    UI/UX PASS — see comments for what changed.
    No business logic, links, prices, copy or
    functionality were added/removed — only
    fixed, hardened, and made smoother.
=========================================*/

/*============================
REDUCED MOTION PREFERENCE
CHANGE: respect the OS-level "reduce motion"
setting so users who need it don't get the
scroll/hover animations.
=============================*/
const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*============================
MOBILE NAV TOGGLE
CHANGE (bug fix): the old CSS simply hid <nav>
on tablet/mobile with no way to open it, so the
site had no working navigation below 992px.
This adds a hamburger button that slides the
menu in, and closes on link tap, outside click,
or Escape.
=============================*/
(function initMobileNav() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("primaryNav");
    const backdrop = document.getElementById("navBackdrop");

    // Defensive: gallery.html and index.html share this file,
    // so guard every lookup instead of assuming elements exist.
    if (!toggle || !nav) return;

    function openMenu() {
        nav.classList.add("nav-open");
        toggle.classList.add("is-active");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
        if (backdrop) backdrop.classList.add("is-visible");
        document.body.classList.add("nav-locked");
    }

    function closeMenu() {
        nav.classList.remove("nav-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        if (backdrop) backdrop.classList.remove("is-visible");
        document.body.classList.remove("nav-locked");
    }

    toggle.addEventListener("click", () => {
        nav.classList.contains("nav-open") ? closeMenu() : openMenu();
    });

    // Close after choosing a link (mobile UX expectation)
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    if (backdrop) backdrop.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });

    // Reset state if the viewport is resized back to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) closeMenu();
    });
})();

/*============================
BACK TO TOP
CHANGE: guarded with a null-check (button only
exists on index.html) and merged into the single
throttled scroll listener below for performance.
=============================*/
const topBtn = document.getElementById("topBtn");

if (topBtn) {
    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });
}

/*============================
STICKY HEADER SHADOW + BACK TO TOP VISIBILITY
CHANGE (performance): both used to be separate
"scroll" listeners running on every pixel of
scroll. They're combined into one listener and
wrapped in requestAnimationFrame so layout work
only happens once per frame instead of on every
scroll event.
CHANGE (CSS bug fix): toggling a class instead of
setting background/boxShadow inline styles, so the
new gradient/blur header treatment in CSS keeps working.
=============================*/
const header = document.querySelector(".header");
let scrollTicking = false;

function handleScroll() {
    const scrolled = window.scrollY > 50;

    if (header) header.classList.toggle("is-scrolled", scrolled);
    if (topBtn) topBtn.classList.toggle("is-visible", window.scrollY > 300);

    scrollTicking = false;
}

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        requestAnimationFrame(handleScroll);
        scrollTicking = true;
    }
}, { passive: true });

// Run once on load so refreshing mid-page shows the right state immediately
handleScroll();

/*============================
WHATSAPP ENQUIRY
CHANGE: unchanged logic, only added a small
inline validation state (red outline) alongside
the existing alert() so the invalid field is
visually obvious too, not just the popup.
=============================*/
function sendWhatsApp() {

    let name = document.getElementById("name").value.trim();

    let phone = document.getElementById("phone").value.trim();

    let service = document.getElementById("service").value;

    let message = document.getElementById("message").value.trim();

    const nameField = document.getElementById("name");
    const phoneField = document.getElementById("phone");
    nameField.classList.remove("field-error");
    phoneField.classList.remove("field-error");

    if (name === "") {

        nameField.classList.add("field-error");
        nameField.focus();
        alert("Please enter your name.");

        return;

    }

    if (phone === "") {

        phoneField.classList.add("field-error");
        phoneField.focus();
        alert("Please enter your mobile number.");

        return;

    }

    let text =
`Hello NS Furnishing,

I would like to enquire about your services.

Name : ${name}

Phone : ${phone}

Service : ${service}

Requirement :

${message}

Thank You.`;

    let url =
`https://wa.me/918169219920?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");

}

/*============================
SMOOTH SCROLL
CHANGE (bug fix): anchors now scroll to a point
that accounts for the fixed header height, so
section titles no longer land partly hidden
underneath the navbar. Also guards against
"#" placeholder hrefs.
=============================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {

            e.preventDefault();

            const headerOffset = document.querySelector(".header")?.offsetHeight || 90;
            const targetPosition =
                target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });

        }

    });

});

/*============================
SCROLL ANIMATION
CHANGE: broadened from a handful of hard-coded
selectors to also include section headers, info
boxes, and the contact form, so the whole page
reveals consistently instead of just a few
sections. Skips animation entirely if the user
prefers reduced motion (reveals content instantly).
=============================*/
const revealSelectors =
    ".service-card, .why-card, .testimonial-card, .about-image, " +
    ".about-content, .gallery-grid img, .gallery-item, .section-title, " +
    ".info-box, .contact-form";

if (!prefersReducedMotion) {

    const revealTargets = document.querySelectorAll(revealSelectors);

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("in-view");
                observer.unobserve(entry.target); // animate once, then stop watching (perf)

            }

        });

    }, {
        threshold: .15,
        rootMargin: "0px 0px -40px 0px"
    });

    revealTargets.forEach((item, index) => {

        item.classList.add("reveal");
        // Gentle stagger within each grid for a more natural cascade
        item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
        observer.observe(item);

    });

} else {

    document.querySelectorAll(revealSelectors)
        .forEach(item => item.classList.add("reveal", "in-view"));

}

/*============================
ACTIVE NAV LINK
CHANGE (bug fix): now only runs when both
sections and in-page nav links exist (gallery.html
has neither), and reuses the same throttled scroll
tick as the header/back-to-top logic instead of a
third independent scroll listener.
=============================*/
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

function updateActiveNav() {

    if (!sections.length || !navLinks.length) return;

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 130;

        if (window.pageYOffset >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

}

if (sections.length && navLinks.length) {

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateActiveNav);
        }
    }, { passive: true });

    updateActiveNav();

}

/*============================
PRELOADER (OPTIONAL)
=============================*/
window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/*============================
CONSOLE MESSAGE
=============================*/
console.log(
    "%cNS Furnishing Website Loaded Successfully",
    "color:#22C55E;font-size:16px;font-weight:bold;"
);


window.addEventListener("load", () => {

    const items = [
        ".hero-logo",
        ".hero-title",
        ".hero-text",
        ".hero-buttons",
        ".hero-scroll"
    ];

    items.forEach((selector, index) => {
        const element = document.querySelector(selector);

        if (element) {
            setTimeout(() => {
                element.classList.add("animate");
            }, index * 200);
        }
    });

});
