/* =========================================================
   Ahmad ullah — Portfolio
   Vanilla JS only. No frameworks/libraries.
   ========================================================= */

// ---------- Header: solid background + shadow after scrolling ----------
const header = document.getElementById("siteHeader");

function updateHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}
updateHeaderState();
window.addEventListener("scroll", updateHeaderState);

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu whenever a nav link is tapped
navLinks.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Active nav link highlighting while scrolling ----------
// Uses IntersectionObserver to watch which section is currently in view
const sections = document.querySelectorAll("main section[id]");
const navLinkMap = new Map();

navLinks.querySelectorAll(".nav__link").forEach((link) => {
  const id = link.getAttribute("href").replace("#", "");
  navLinkMap.set(id, link);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navLinkMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinkMap.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" } // "active" once a section is near the middle of the viewport
);

sections.forEach((section) => sectionObserver.observe(section));

// ---------- Scroll-reveal animations ----------
// Elements with class "reveal" fade/slide in the first time they enter view
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Small stagger so grouped items (skills, project cards) don't all
        // pop in at exactly the same instant
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 60);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Hero typewriter effect ----------
const roles = [
  "Full-Stack Developer",
  "UI Engineer",
  "Open-Source Contributor",
  "Problem Solver",
];

const typewriterEl = document.getElementById("typewriter");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriterTick() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typewriterEl.textContent = currentRole.slice(0, charIndex);

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1400; // pause at the full word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typewriterTick, delay);
}

typewriterTick();

// ---------- Contact form validation (front-end only, no backend) ----------
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  const wrapper = field.closest(".field");

  if (message) {
    wrapper.classList.add("has-error");
    errorEl.textContent = message;
  } else {
    wrapper.classList.remove("has-error");
    errorEl.textContent = "";
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  let isValid = true;

  if (!name) {
    setFieldError("name", "Please enter your name.");
    isValid = false;
  } else {
    setFieldError("name", "");
  }

  if (!email) {
    setFieldError("email", "Please enter your email.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setFieldError("email", "That doesn't look like a valid email.");
    isValid = false;
  } else {
    setFieldError("email", "");
  }

  if (!message) {
    setFieldError("message", "Please add a short message.");
    isValid = false;
  } else {
    setFieldError("message", "");
  }

  if (!isValid) {
    formStatus.textContent = "";
    return;
  }

  // No backend is wired up here — this just confirms the form works.
  // Replace this block with a fetch() call to your API or a service
  // like Formspree if you want messages to actually arrive somewhere.
  formStatus.textContent = `Thanks, ${name}! Your message has been noted — I'll get back to you soon.`;
  form.reset();
});

// ---------- Back-to-top button ----------
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.style.opacity = window.scrollY > 600 ? "1" : "0.4";
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
