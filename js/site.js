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
        grid.append(card);
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
    });
  });
});
