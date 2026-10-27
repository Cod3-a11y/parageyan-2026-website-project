/* PARAGEYAN 2026 — JavaScript interactions
   The registration form is a front-end demo; it does not send data to a server. */

"use strict";

const EVENT_DATE = "2026-10-03T06:30:00+08:00"; // Official scheduled parade start; the 2026 event dates have passed.

const pageLoader = document.getElementById("pageLoader");
const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link, .nav-cta");
const scheduleTabs = document.querySelectorAll(".schedule-tab");
const schedulePanels = document.querySelectorAll(".schedule-panel");
const interestForm = document.getElementById("interestForm");
const formStatus = document.getElementById("formStatus");
const toast = document.getElementById("toast");

/* Hide the opening screen. The fallback prevents it getting stuck if load is delayed. */
function hideLoader() {
  if (pageLoader) pageLoader.classList.add("hide");
}
window.addEventListener("load", () => window.setTimeout(hideLoader, 350));
window.setTimeout(hideLoader, 2500);

/* Sticky header */
function updateHeader() {
  if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* Mobile navigation */
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      document.body.classList.remove("menu-open");
    });
  });
}

/* Highlight the navigation item for the current section. */
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.classList.contains("nav-link")) {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        }
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => navObserver.observe(section));
}

/* Reveal content as it enters the viewport. */
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

/* Schedule tabs */
scheduleTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.day;
    scheduleTabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    schedulePanels.forEach(panel => {
      const selected = panel.id === targetId;
      panel.classList.toggle("active", selected);
      panel.hidden = !selected;
    });
  });
});

/* Countdown clock. Date is set to Philippine time (UTC+8). */
function updateCountdown() {
  const target = new Date(EVENT_DATE).getTime();
  const distance = target - Date.now();
  const values = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };
  if (Object.values(values).some(value => !value)) return;

  if (!Number.isFinite(target) || distance <= 0) {
    values.days.textContent = "000";
    values.hours.textContent = "00";
    values.minutes.textContent = "00";
    values.seconds.textContent = "00";
    return;
  }
  values.days.textContent = String(Math.floor(distance / 86400000)).padStart(3, "0");
  values.hours.textContent = String(Math.floor((distance / 3600000) % 24)).padStart(2, "0");
  values.minutes.textContent = String(Math.floor((distance / 60000) % 60)).padStart(2, "0");
  values.seconds.textContent = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

/* Demo form: validates fields and gives visible feedback, but does not send or store personal data. */
let toastTimeout;
interestForm?.addEventListener("submit", event => {
  event.preventDefault();
  if (!interestForm.reportValidity()) return;

  const name = document.getElementById("fullName").value.trim();
  const department = document.getElementById("department").value.trim();
  const interest = document.getElementById("eventInterest").value;

  if (!name || !department || !interest) {
    formStatus.textContent = "Please complete all required fields.";
    return;
  }

  formStatus.textContent = `Thank you, ${name}! Your interest in ${interest} has been recorded for this demo only.`;
  if (toast) {
    toast.classList.add("show");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 4000);
  }
  interestForm.reset();
});

/* Smooth scrolling for in-page links, including older browsers. */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", event => {
    const selector = anchor.getAttribute("href");
    if (!selector || selector === "#") return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
