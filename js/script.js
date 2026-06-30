/*=========================================
    NS Furnishing
=========================================*/

/*============================
BACK TO TOP
=============================*/

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topBtn.style.display = "flex";

    } else {

        topBtn.style.display = "none";

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/*============================
STICKY HEADER SHADOW
=============================*/

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.12)";

        header.style.background = "#ffffff";

    } else {

        header.style.boxShadow = "none";

        header.style.background = "#ffffff";

    }

});

/*============================
WHATSAPP ENQUIRY
=============================*/

function sendWhatsApp() {

    let name = document.getElementById("name").value.trim();

    let phone = document.getElementById("phone").value.trim();

    let service = document.getElementById("service").value;

    let message = document.getElementById("message").value.trim();

    if (name === "") {

        alert("Please enter your name.");

        return;

    }

    if (phone === "") {

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
`https://wa.me/919876543210?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");

}

/*============================
SMOOTH SCROLL
=============================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

/*============================
SCROLL ANIMATION
=============================*/

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0)";

        }

    });

}, {

    threshold: .15

});

document.querySelectorAll(

".service-card,.why-card,.testimonial-card,.about-image,.about-content,.gallery-grid img"

).forEach(item => {

    item.style.opacity = "0";

    item.style.transform = "translateY(40px)";

    item.style.transition = ".8s";

    observer.observe(item);

});

/*============================
ACTIVE NAV LINK
=============================*/

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (pageYOffset >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

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