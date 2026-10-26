document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

document.querySelectorAll("form[data-form]").forEach(form => {
  const status = form.querySelector(".form__status");
  const button = form.querySelector("button[type=submit]");
  const label = button ? button.textContent : "";

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "This form is not connected yet. Please call +91 80086 86352.";
      status.className = "form__status is-err";
      return;
    }
    button.disabled = true;
    button.textContent = "Sending...";
    status.textContent = "";
    status.className = "form__status";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error(String(res.status));
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
