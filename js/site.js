const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SHEETS_URL = (window.SYF_CONFIG && window.SYF_CONFIG.sheetsUrl) || "";

document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

document.querySelectorAll("form[data-form]").forEach(form => {
  const status = form.querySelector(".form__status");
  const button = form.querySelector("button[type=submit]");
  const label = button ? button.textContent : "";

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!SHEETS_URL) {
      status.textContent = "This form is not connected yet. Please call +91 80086 86352.";
      status.className = "form__status is-err";
      return;
    }
    button.disabled = true;
    button.textContent = "Sending...";
    status.textContent = "";
    status.className = "form__status";
    try {
      const res = await fetch(SHEETS_URL, { method: "POST", body: new URLSearchParams(new FormData(form)) });
      const result = await res.json();
      if (!res.ok || !result || result.ok !== true) throw new Error("not saved");
      form.reset();
      status.textContent = form.dataset.success || "Thank you. We have received your message.";
      status.className = "form__status is-ok";
    } catch (err) {
      status.textContent = "Sorry, your message could not be sent. Please call +91 80086 86352.";
      status.className = "form__status is-err";
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
});

const impact = document.querySelector("[data-impact]");
if (impact && SHEETS_URL) {
  fetch(SHEETS_URL + "?action=stats")
    .then(r => r.json())
    .then(d => {
      const stats = (d && Array.isArray(d.stats)) ? d.stats.filter(s => s.label && s.value) : [];
      if (!stats.length) return;
      const grid = impact.querySelector("[data-impact-grid]");
      stats.forEach(s => {
        const card = document.createElement("div");
        card.className = "stat";
        const v = document.createElement("span");
        v.className = "stat__value";
        v.textContent = s.value;
        const l = document.createElement("span");
        l.className = "stat__label";
        l.textContent = s.label;
        card.append(v, l);
        card.setAttribute("data-reveal", "zoom");
        grid.append(card);
        observeReveal(card);
        countUp(v);
      });
      const asOf = impact.querySelector("[data-impact-asof]");
      if (asOf && d.asOf) asOf.textContent = "Figures as of " + d.asOf + ".";
      impact.hidden = false;
    })
    .catch(() => {});
}

const chips = document.querySelectorAll(".chip[data-filter]");
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    const f = chip.dataset.filter;
    chips.forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    document.querySelectorAll(".grid [data-tags]").forEach(item => {
      item.hidden = f !== "all" && !item.dataset.tags.split(" ").includes(f);
      if (!item.hidden && item.hasAttribute("data-reveal")) item.classList.add("is-visible", "is-done");
    });
  });
});

// Gallery menu links (gallery.html#training etc.) pick the matching filter.
function applyGalleryHash() {
  const f = decodeURIComponent(location.hash.slice(1));
  const chip = f && document.querySelector('.chip[data-filter="' + CSS.escape(f) + '"]');
  if (!chip) return;
  chip.click();
  chip.closest(".chips").scrollIntoView({ behavior: "smooth", block: "start" });
}
if (chips.length) {
  applyGalleryHash();
  window.addEventListener("hashchange", applyGalleryHash);
}

// Play one training clip at a time.
document.querySelectorAll(".video video").forEach(v => {
  v.addEventListener("play", () => {
    document.querySelectorAll(".video video").forEach(o => { if (o !== v) o.pause(); });
  });
});

// ---- Dropdown menus ----------------------------------------------------
const navItems = document.querySelectorAll(".nav__item");
function closeMenus(except) {
  navItems.forEach(item => {
    if (item === except) return;
    item.classList.remove("is-open");
    const t = item.querySelector(".nav__toggle");
    if (t) t.setAttribute("aria-expanded", "false");
  });
}
navItems.forEach(item => {
  const toggle = item.querySelector(".nav__toggle");
  if (!toggle) return;
  toggle.addEventListener("click", e => {
    e.stopPropagation();
    const open = !item.classList.contains("is-open");
    closeMenus(item);
    item.classList.remove("is-closed");
    item.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  item.addEventListener("mouseleave", () => item.classList.remove("is-closed"));
  item.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    item.classList.remove("is-open");
    item.classList.add("is-closed");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });
  item.addEventListener("focusin", () => item.classList.remove("is-closed"));
  // A tap on a menu link closes the menu (same-page anchors don't reload).
  item.querySelectorAll(".nav__menu a").forEach(a => a.addEventListener("click", () => {
    item.classList.remove("is-open");
    item.classList.add("is-closed");
    toggle.setAttribute("aria-expanded", "false");
    if (document.activeElement) document.activeElement.blur();
  }));
});
document.addEventListener("click", e => { if (!e.target.closest(".nav")) closeMenus(); });

// ---- Scroll reveal -----------------------------------------------------
const REVEAL = [
  [".layout__main .h2, .layout__main .eyebrow, .layout__main .split__body, .layout__main .muted:not(span)", "up"],
  [".pcard, .card, .panel, .prog, .rows li, .steps li, .layout__main .grid figure, .form--boxed, .contact-list > div, .kv tr", "up"],
  [".layout__main .person__photo", "left"],
  [".layout__main .person__text", "right"],
  [".band .wrap", "zoom"],
  [".pane--right .pane__head", "right"]
];
const io = ("IntersectionObserver" in window && !REDUCED) ? new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add("is-visible");
    io.unobserve(el);
    setTimeout(() => el.classList.add("is-done"), 1400);
  });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }) : null;

function observeReveal(el) {
  if (io) io.observe(el); else el.classList.add("is-visible", "is-done");
}

REVEAL.forEach(([sel, dir]) => {
  document.querySelectorAll(sel).forEach(el => {
    if (el.closest(".hero") || el.hasAttribute("data-reveal") || el.closest("[data-reveal]")) return;
    el.setAttribute("data-reveal", dir === "up" ? "" : dir);
  });
});
// Stagger siblings so rows of cards cascade in.
document.querySelectorAll("[data-reveal]").forEach(el => {
  const sibs = Array.from(el.parentElement.children).filter(c => c.hasAttribute("data-reveal"));
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty("--d", Math.min(i, 6) * 0.1 + "s");
  observeReveal(el);
});

// ---- Number count-up for impact figures --------------------------------
function countUp(el) {
  const m = /^([^0-9]*)([0-9][0-9,]*)(.*)$/.exec(el.textContent.trim());
  if (!m || REDUCED) return;
  const target = parseInt(m[2].replace(/,/g, ""), 10);
  if (!target) return;
  const start = performance.now(), dur = 1600;
  const fmt = n => m[1] + n.toLocaleString("en-IN") + m[3];
  const step = now => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(step);
  };
  el.textContent = fmt(0);
  requestAnimationFrame(step);
}

// ---- Back to top -------------------------------------------------------
const toTop = document.createElement("button");
toTop.className = "to-top";
toTop.type = "button";
toTop.setAttribute("aria-label", "Back to top");
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));
document.body.append(toTop);
window.addEventListener("scroll", () => toTop.classList.toggle("is-shown", window.scrollY > 700), { passive: true });
// ---- Home hero slideshow -----------------------------------------------
document.querySelectorAll("[data-slides]").forEach(box => {
  const slides = Array.from(box.querySelectorAll(".slide"));
  if (slides.length < 2) return;
  const dotsBox = box.querySelector(".slides__dots");
  let current = 0, timer = null;
  const dots = slides.map((s, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.setAttribute("aria-label", "Photo " + (i + 1) + ": " + s.querySelector("figcaption").textContent);
    d.addEventListener("click", () => { show(i); restart(); });
    dotsBox.append(d);
    return d;
  });
  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => {
      s.classList.toggle("is-active", j === current);
      s.setAttribute("aria-hidden", String(j !== current));
      const img = s.querySelector("img");
      if (Math.abs(j - current) <= 1 || (current === slides.length - 1 && j === 0)) img.loading = "eager";
    });
    dots.forEach((d, j) => d.setAttribute("aria-current", String(j === current)));
  }
  function restart() {
    clearInterval(timer);
    if (!REDUCED) timer = setInterval(() => show(current + 1), 4000);
  }
  box.querySelector(".slides__btn--prev").addEventListener("click", () => { show(current - 1); restart(); });
  box.querySelector(".slides__btn--next").addEventListener("click", () => { show(current + 1); restart(); });
  box.addEventListener("mouseenter", () => clearInterval(timer));
  box.addEventListener("mouseleave", restart);
  box.addEventListener("focusin", () => clearInterval(timer));
  box.addEventListener("focusout", restart);
  document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(timer) : restart());
  show(0);
  restart();
});
