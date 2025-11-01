// --- Utilities ---
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// --- Theme Toggle with persistence ---
const themeToggle = $("#themeToggle");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
const storedTheme = localStorage.getItem("theme");
const applyTheme = (mode) => {
  document.body.classList.toggle("light", mode === "light");
  localStorage.setItem("theme", mode);
};
applyTheme(storedTheme || (prefersLight ? "light" : "dark"));
themeToggle.addEventListener("click", () => {
  const next = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(next);
});

// Mobile Menu Toggle
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");

  // aria attributes update
  const expanded = hamburger.getAttribute("aria-expanded") === "true" || false;
  hamburger.setAttribute("aria-expanded", !expanded);
});

// --- Typing effect ---
const typingEl = $("#typing");
const phrases = [
  "Web Developer",
  "Data Analysis Beginner",
  "React • Flask • SQL",
  "Building useful, elegant things",
];
let pi = 0,
  ci = 0,
  dir = 1,
  pause = 0;
function typeLoop() {
  if (pause > 0) {
    pause--;
    return;
  }
  const word = phrases[pi];
  ci += dir;
  typingEl.textContent = word.slice(0, ci);
  if (ci === word.length) {
    dir = -1;
    pause = 30;
  }
  if (ci === 0 && dir === -1) {
    dir = 1;
    pi = (pi + 1) % phrases.length;
    pause = 10;
  }
}
setInterval(typeLoop, 60);

// --- Reveal on scroll ---
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$(".reveal").forEach((el) => io.observe(el));

// --- Project filters ---
const filterBtns = $$(".filter-btn");
const cards = $$(".project");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    cards.forEach((card) => {
      const show = f === "all" || card.dataset.cat === f;
      card.style.display = show ? "" : "none";
    });
  })
);

// --- Scrollspy (activate nav link) ---
const sections = ["home", "about", "projects", "resume", "blog", "contact"].map(
  (id) => document.getElementById(id)
);
const navLinks = $$(".nav-link");
const spy = new IntersectionObserver(
  (ents) => {
    ents.forEach((ent) => {
      if (ent.isIntersecting) {
        const id = ent.target.id;
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + id)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);
sections.forEach((s) => spy.observe(s));

// --- Contact form (no backend) ---
const form = $("#contactForm");
const alertEl = $("#formAlert");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get("name")?.toString().trim();
  const email = data.get("email")?.toString().trim();
  const message = data.get("message")?.toString().trim();
  if (!name || !email || !message) {
    alertEl.style.display = "block";
    alertEl.style.color = "var(--danger)";
    alertEl.textContent = "Please fill out all fields.";
    return;
  }
  alertEl.style.display = "block";
  alertEl.style.color = "var(--success)";
  alertEl.textContent =
    "Thanks! Your message has been prepared in your email client.";
  // Open default mail client with prefilled body
  const subject = encodeURIComponent("Portfolio Contact");
  const body = encodeURIComponent(
    `Hi Rohit,%0D%0A%0D%0A${message}%0D%0A%0D%0A— ${name} (${email})`
  );
  window.location.href = `mailto:rohit@example.com?subject=${subject}&body=${body}`;
  form.reset();
});

// --- Footer year ---
$("#year").textContent = new Date().getFullYear();
