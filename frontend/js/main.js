function goTo(page) {
    window.location.href = page;
}

function goTo(page) {
    window.location.href = page;
}

function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("show");
}

window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");

    if (window.scrollY > 50) {
        nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.4)";
    } else {
        nav.style.boxShadow = "none";
    }
});

function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);

const links = document.querySelectorAll("nav ul li a");

links.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }
});

function startCounters() {
    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const speed = 30;

        const update = () => {
            if (count < target) {
                count += Math.ceil(target / 50);
                counter.innerText = count;
                setTimeout(update, speed);
            } else {
                counter.innerText = target;
            }
        };

        update();
    });
}

let counterStarted = false;

function startCounters() {
    if (counterStarted) return;

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const speed = 30;

        const update = () => {
            if (count < target) {
                count += Math.ceil(target / 50);
                counter.innerText = count;
                setTimeout(update, speed);
            } else {
                counter.innerText = target;
            }
        };

        update();
    });

    counterStarted = true; // 🔥 important line
}

window.addEventListener("scroll", function () {
    const statsSection = document.querySelector(".stats");
    if (!statsSection) return;

    const position = statsSection.getBoundingClientRect().top;

    if (position < window.innerHeight - 100) {
        startCounters();
    }
});


function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
