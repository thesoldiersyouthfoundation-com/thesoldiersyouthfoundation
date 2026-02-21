const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

menuBtn?.addEventListener("click", () => {
  navLinks.classList.toggle("is-open");
});

document.querySelectorAll('.nav__links a').forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("is-open"));
});

// Lead form (demo only)
document.getElementById("leadForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  alert(`Thanks, ${data.name}. We will call you on ${data.phone}.`);
  e.target.reset();
});

// Contact form (demo only)
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  status.textContent = "Message captured. Connect this form to your email/API to receive it.";
  e.target.reset();
});