// Eligibility checker for eligibility.html.
// Reads entries from js/eligibility-data.js. When a candidate checks, their details
// and results are saved to the Google Sheet (tab "Eligibility"), the same way the
// site's other forms are saved.

(function () {
  const root = document.querySelector("[data-elig]");
  if (!root || !window.SYF_ENTRIES) return;

  const SHEETS_URL = (window.SYF_CONFIG && window.SYF_CONFIG.sheetsUrl) || "";
  const form = root.querySelector("#elig-form");
  const steps = Array.from(form.querySelectorAll(".wiz__step"));
  const bar = root.querySelector(".wiz__bar span");
  const stepLabels = Array.from(root.querySelectorAll(".wiz__steps li"));
  const results = document.getElementById("elig-results");
  const booking = document.getElementById("counselling");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let step = 0;

  // ---------- wizard ----------
  function showStep(i) {
    step = i;
    steps.forEach((s, j) => { s.hidden = j !== i; });
    stepLabels.forEach((l, j) => {
      l.classList.toggle("is-current", j === i);
      l.classList.toggle("is-done", j < i);
      if (j === i) l.setAttribute("aria-current", "step"); else l.removeAttribute("aria-current");
    });
    bar.style.width = ((i + 1) / steps.length * 100) + "%";
    const first = steps[i].querySelector("input, select");
    if (first && i > 0) first.focus({ preventScroll: true });
  }
  function stepValid(i) {
    for (const f of steps[i].querySelectorAll("input, select")) {
      if (!f.checkValidity()) { f.reportValidity(); return false; }
    }
    if (i === 0) {
      const p = age(val("dob"));
      if (!(p > 10 && p < 60)) {
        const d = form.elements.dob;
        d.setCustomValidity("Please check your date of birth.");
        d.reportValidity();
        d.addEventListener("input", () => d.setCustomValidity(""), { once: true });
        return false;
      }
    }
    return true;
  }
  form.addEventListener("click", e => {
    if (e.target.closest("[data-next]") && stepValid(step)) showStep(step + 1);
    if (e.target.closest("[data-back]")) showStep(step - 1);
  });

  function val(name) {
    const el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }
  function age(dobStr) {
    const dob = new Date(dobStr + "T00:00:00");
    return (Date.now() - dob) / (365.2425 * 24 * 3600 * 1000);
  }

  // ---------- qualification → profile ----------
  // lvl: 1 Class 8, 2 Class 10, 3 studying 12, 4 Class 12 / diploma, 5 final-year degree, 6 graduate, 7 postgraduate
  const QUAL = {
    "8":       { lvl: 1, label: "Class 8 pass" },
    "10":      { lvl: 2, label: "Class 10 pass" },
    "12s-mpc": { lvl: 3, stream: "mpc", label: "Studying Class 12 (MPC)" },
    "12s-bipc":{ lvl: 3, stream: "bipc", label: "Studying Class 12 (BiPC)" },
    "12s-oth": { lvl: 3, stream: "oth", label: "Studying Class 12 (Commerce or Arts)" },
    "12-mpc":  { lvl: 4, stream: "mpc", label: "Class 12 pass (MPC)" },
    "12-bipc": { lvl: 4, stream: "bipc", label: "Class 12 pass (BiPC)" },
    "12-oth":  { lvl: 4, stream: "oth", label: "Class 12 pass (Commerce or Arts)" },
    "dip":     { lvl: 4, diploma: true, label: "Engineering diploma" },
    "btech-f": { lvl: 5, btech: true, label: "Final year B.E./B.Tech" },
    "deg-f":   { lvl: 5, label: "Final year of a degree" },
    "btech":   { lvl: 6, btech: true, label: "B.E./B.Tech graduate" },
    "deg":     { lvl: 6, label: "Graduate" },
    "llb":     { lvl: 6, llb: true, label: "LLB graduate" },
    "pg":      { lvl: 7, label: "Postgraduate" }
  };
  function profile() {
    const q = QUAL[val("qual")] || { lvl: 0, label: "" };
    return {
      dob: val("dob"), age: age(val("dob")), gender: val("gender"), marital: val("marital"),
      qual: val("qual"), label: q.label, lvl: q.lvl,
      stream: q.stream || (q.btech ? "mpc" : null),   // B.Tech graduates studied MPC
      studying12: q.lvl === 3,
      pass12: (q.lvl === 4 && !q.diploma) || q.lvl >= 5,
      diploma: !!q.diploma,
      degree: q.lvl >= 5, final: q.lvl === 5, graduate: q.lvl >= 6,
      btech: !!q.btech, llb: !!q.llb, pg: q.lvl === 7,
      ncc: val("ncc"), employed: val("employed") === "yes"
    };
  }

  // ---------- education rules ----------
  // Each returns { ok: true | false | "later", why, notes: [] }.
  // Marks and extra conditions are shown as tips, not asked.
  const pmNote = "Needs Physics and Maths in Class 12 (check your Intermediate subjects).";
  const EDU = {
    "nda-army": p => {
      if (p.pass12) return { ok: true };
      if (p.studying12) return { ok: true, notes: ["You can apply while in Class 12."] };
      return { ok: "later", why: "Needs Class 12 (you can apply while studying)." };
    },
    "nda-pm": p => {
      if (p.lvl < 3 || p.diploma) return { ok: "later", why: "Needs Class 12 with MPC." };
      if (p.stream === "mpc") return { ok: true, notes: p.studying12 ? ["You can apply while in Class 12."] : [] };
      if (p.stream) return { ok: false, why: "Needs Maths and Physics in Class 12 (MPC)." };
      return { ok: true, notes: [pmNote] };
    },
    "tes": p => {
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Class 12 with MPC." };
      if (p.studying12 && p.stream === "mpc") return { ok: "later", why: "Apply after your Class 12 results, with your JEE (Main) score." };
      if (p.lvl < 4 || p.diploma) return { ok: "later", why: "Needs Class 12 with MPC and JEE (Main)." };
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Class 12 with MPC." };
      return { ok: true, notes: ["Needs at least 60% in Physics, Chemistry and Maths, and JEE (Main) taken in the same year."] };
    },
    "navy-btech": p => {
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Class 12 with MPC." };
      if (p.studying12 && p.stream === "mpc") return { ok: "later", why: "Apply after your Class 12 results, with your JEE (Main) rank." };
      if (p.lvl < 4 || p.diploma) return { ok: "later", why: "Needs Class 12 with MPC and JEE (Main)." };
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Class 12 with MPC." };
      return { ok: true, notes: ["Needs at least 70% in Physics, Chemistry and Maths, 50% in English, and JEE (Main) taken in the same year."] };
    },
    "grad": p => {
      if (p.degree) return { ok: true, notes: p.final ? ["Final-year students can apply."] : [] };
      return { ok: "later", why: "Needs a bachelor's degree (you can apply in your final year)." };
    },
    "btech": p => {
      if (p.btech) return { ok: true, notes: p.final ? ["Final-year students can apply."] : [] };
      if (p.degree) return { ok: false, why: "Needs a B.E./B.Tech degree." };
      return { ok: "later", why: "Needs a B.E./B.Tech degree." };
    },
    "grad-pm": p => {
      if (!p.degree) return { ok: "later", why: "Needs a degree, with Physics and Maths in Class 12." };
      return { ok: true, notes: p.btech ? [] : [pmNote] };
    },
    "afcat-flying": p => {
      if (!p.degree) return { ok: "later", why: "Needs a degree, with Maths and Physics in Class 12." };
      return { ok: true, notes: ["Needs 60% in your degree and 50% in Maths and Physics in Class 12."] };
    },
    "afcat-tech": p => {
      if (p.btech) return { ok: true, notes: ["Needs 60% in your engineering degree and 50% in Physics and Maths in Class 12."] };
      if (p.degree) return { ok: false, why: "Needs a 4-year engineering degree." };
      return { ok: "later", why: "Needs an engineering degree." };
    },
    "grad60": p => {
      if (p.degree) return { ok: true, notes: ["Needs 60% in your degree."] };
      return { ok: "later", why: "Needs a degree with 60%." };
    },
    "ncc": p => {
      if (p.ncc !== "c-ab" && !p.degree) return { ok: "later", why: "Needs a degree and an NCC 'C' certificate with grade A or B (you can earn it in college NCC)." };
      if (p.ncc !== "c-ab") return { ok: false, why: "Needs an NCC 'C' certificate with grade A or B." };
      if (p.degree) return { ok: true, notes: ["Needs 50% in your degree."].concat(p.final ? ["Final-year students can apply."] : []) };
      return { ok: "later", why: "You have the NCC 'C' certificate. You also need a degree with 50%." };
    },
    "ncc-af": p => {
      if (p.ncc !== "c-ab" && !p.degree) return { ok: "later", why: "Needs a degree and an NCC Air Wing 'C' certificate (you can earn it in college NCC)." };
      if (p.ncc !== "c-ab") return { ok: false, why: "Needs an NCC Air Wing 'C' certificate." };
      if (p.degree) return { ok: true, notes: ["Your 'C' certificate must be from the NCC Air Wing (Senior Division).", "Needs 60% in your degree and 50% in Maths and Physics in Class 12."] };
      return { ok: "later", why: "You also need a degree with 60%, with Maths and Physics in Class 12." };
    },
    "jag": p => {
      if (p.llb) return { ok: true, notes: ["Needs 55% in your LLB."] };
      if (p.degree) return { ok: false, why: "Needs an LLB degree." };
      return { ok: "later", why: "Needs an LLB degree." };
    },
    "navy-ssc": p => {
      if (p.btech) return { ok: true, notes: ["Most branches need 60% in your B.E./B.Tech."] };
      if (p.pg) return { ok: true, notes: ["With a postgraduate degree, look at the Logistics and Education branches."] };
      if (p.degree) return { ok: false, why: "Most branches need a B.E./B.Tech; Logistics and Education need a postgraduate degree." };
      return { ok: "later", why: "Needs a B.E./B.Tech or a postgraduate degree." };
    },
    "ta": p => {
      if (!p.employed && !p.graduate) return { ok: "later", why: "Needs a degree and a job or your own business." };
      if (!p.employed) return { ok: false, why: "You must be working, in a job or your own business." };
      if (p.graduate) return { ok: true };
      return { ok: "later", why: "You also need a degree." };
    },
    "agni-gd": p => {
      if (p.lvl >= 2) return { ok: true, notes: ["Needs 45% in Class 10 and 33% in each subject."] };
      return { ok: "later", why: "Needs Class 10." };
    },
    "agni-trade": p => {
      if (p.lvl >= 2) return { ok: true };
      if (p.lvl === 1) return { ok: true, notes: ["With Class 8, only some trades are open to you."] };
      return { ok: "later", why: "Needs Class 8 or 10." };
    },
    "agni-tech": p => {
      if (p.diploma) return { ok: true, notes: ["A diploma is accepted for some technical posts. Check the notification."] };
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Physics, Chemistry and Maths in Class 12." };
      if (p.studying12 && p.stream === "mpc") return { ok: "later", why: "Apply after your Class 12 (MPC) results." };
      if (p.lvl < 4) return { ok: "later", why: "Needs Class 12 with MPC and English." };
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Physics, Chemistry and Maths in Class 12." };
      return { ok: true, notes: (p.stream ? [] : [pmNote]).concat(["Needs 50% overall in Class 12 and 40% in each subject."]) };
    },
    "agni-clerk": p => {
      if (p.studying12) return { ok: "later", why: "Apply after your Class 12 results." };
      if (p.pass12) return { ok: true, notes: ["Needs 60% overall in Class 12 and 50% in each subject, including English."] };
      return { ok: "later", why: "Needs Class 12 with 60%." };
    },
    "vayu-sci": p => {
      if (p.diploma) return { ok: true, notes: ["Needs 50% in your diploma and 50% in English."] };
      if (p.lvl < 3) return { ok: "later", why: "Needs Class 12 with MPC, or an engineering diploma." };
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Maths and Physics in Class 12. Look at Agniveervayu (Other than Science)." };
      return { ok: true, notes: (p.studying12 ? ["You can apply while in Class 12."] : []).concat(p.stream ? [] : [pmNote], ["Needs 50% overall and 50% in English."]) };
    },
    "vayu-other": p => {
      if (p.diploma) return { ok: false, why: "Needs Class 12 in any stream." };
      if (p.lvl < 3) return { ok: "later", why: "Needs Class 12 in any stream." };
      return { ok: true, notes: (p.studying12 ? ["You can apply while in Class 12."] : []).concat(["Needs 50% overall and 50% in English."]) };
    },
    "navy-ssr": p => {
      if (p.diploma) return { ok: true, notes: ["A 3-year engineering diploma is accepted."] };
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Maths and Physics in Class 12." };
      if (p.studying12 && p.stream === "mpc") return { ok: "later", why: "Apply after your Class 12 (MPC) results." };
      if (p.lvl < 4) return { ok: "later", why: "Needs Class 12 with Maths and Physics." };
      if (p.stream && p.stream !== "mpc") return { ok: false, why: "Needs Maths and Physics in Class 12." };
      return { ok: true, notes: (p.stream ? [] : [pmNote]).concat(["Needs 50% overall in Class 12."]) };
    },
    "ten": p => {
      if (p.lvl >= 2) return { ok: true };
      return { ok: "later", why: "Needs Class 10." };
    }
  };

  // ---------- evaluate one entry ----------
  function fmtYears(y) {
    const whole = Math.floor(y);
    return whole + ((y - whole) >= 0.5 ? "½" : "");
  }
  function whenAge(dobStr, years) {
    const d = new Date(dobStr + "T00:00:00");
    d.setDate(d.getDate() + Math.round(years * 365.2425));
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }
  function evaluate(entry, p) {
    const reasons = [], notes = [];
    let later = null;

    if (entry.gender.indexOf(p.gender) === -1) reasons.push(entry.gender[0] === "m" ? "Open to men only at present." : "Open to women only.");
    if (entry.marital === "unmarried" && p.marital !== "unmarried") reasons.push("Only unmarried candidates can apply.");
    if (entry.marital === "ota") {
      if (p.gender === "m" && p.marital !== "unmarried") reasons.push("Men must be unmarried.");
      if (p.gender === "f" && p.marital === "married") reasons.push("Women must be unmarried, widowed or divorced.");
    }
    if (entry.marital === "afcat" && p.marital !== "unmarried" && p.age < 25) reasons.push("Candidates under 25 must be unmarried.");

    const min = entry.age[0], max = entry.age[1];
    if (p.age > max + 0.25) reasons.push("Over the upper age limit of " + fmtYears(max) + " years.");
    else if (p.age < min - 0.5) later = "You reach " + fmtYears(min) + " around " + whenAge(p.dob, min) + ".";
    else if (p.age < min) notes.push("You are just under " + fmtYears(min) + ". Age is counted on the course start date, so you may fit the next notification.");
    else if (p.age > max - 0.5) notes.push("You are close to the upper age limit. Check the date-of-birth window in the next notification.");

    const r = EDU[entry.edu] ? EDU[entry.edu](p) : { ok: true };
    if (!reasons.length) {
      if (r.ok === false) reasons.push(r.why);
      if (r.ok === "later") later = later ? later + " " + r.why : r.why;
    }
    if (r.notes) notes.push.apply(notes, r.notes);
    if (entry.note) notes.push(entry.note);

    if (reasons.length) return { status: "no", reasons: reasons, notes: [] };
    if (later) return { status: "later", reasons: [later], notes: notes };
    return { status: "yes", reasons: [], notes: notes };
  }

  // ---------- render ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  const FORCE_CLASS = { "Army": "army", "Navy": "navy", "Air Force": "air", "Navy / Air Force": "navy" };
  function card(entry, res) {
    const ageText = fmtYears(entry.age[0]) + " to " + fmtYears(entry.age[1]) + " years";
    const who = (entry.gender.length === 2 ? "Men and women" : entry.gender[0] === "m" ? "Men" : "Women") +
      (entry.marital === "any" ? "" : entry.marital === "afcat" ? ", unmarried if under 25" : entry.marital === "ota" ? " (men unmarried; women unmarried, widowed or divorced)" : ", unmarried");
    const list = arr => arr.length ? "<ul class=\"ecard__list\">" + arr.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>" : "";
    return "<article class=\"ecard ecard--" + res.status + "\" data-reveal>" +
      "<header class=\"ecard__head\"><span class=\"ecard__force ecard__force--" + (FORCE_CLASS[entry.force] || "army") + "\">" + esc(entry.force) + "</span>" +
      "<span class=\"ecard__kind\">" + esc(entry.kind) + " · " + esc(entry.stage) + "</span></header>" +
      "<h4 class=\"ecard__title\">" + esc(entry.name) + "</h4>" +
      "<p class=\"ecard__via\">" + esc(entry.via) + "</p>" +
      (res.status !== "yes" ? "<div class=\"ecard__why\">" + list(res.reasons) + "</div>" : "") +
      "<dl class=\"ecard__facts\">" +
        "<div><dt>Age</dt><dd>" + ageText + "</dd></div>" +
        "<div><dt>Education</dt><dd>" + esc(entry.eduText) + "</dd></div>" +
        "<div><dt>Who can apply</dt><dd>" + esc(who) + "</dd></div>" +
        "<div><dt>Service</dt><dd>" + esc(entry.commission) + "</dd></div>" +
        "<div><dt>Selection</dt><dd>" + esc(entry.selection) + "</dd></div>" +
      "</dl>" +
      (res.notes.length ? "<div class=\"ecard__notes\"><strong>Keep in mind</strong>" + list(res.notes) + "</div>" : "") +
      (entry.link ? "<a class=\"ecard__link\" href=\"" + esc(entry.link) + "\" target=\"_blank\" rel=\"noopener\">Official website</a>" : "") +
      "</article>";
  }
  function group(title, intro, items, cls, open) {
    if (!items.length) return "";
    const body = "<div class=\"ecards\">" + items.map(x => card(x.entry, x.res)).join("") + "</div>";
    if (cls !== "yes") {
      return "<details class=\"egroup egroup--fold egroup--" + cls + "\"" + (open ? " open" : "") + "><summary><span class=\"egroup__title\">" + esc(title) +
        "</span><span class=\"egroup__count\">" + items.length + "</span></summary><p class=\"egroup__intro\">" + esc(intro) + "</p>" + body + "</details>";
    }
    return "<section class=\"egroup egroup--yes\"><h3 class=\"egroup__title\">" + esc(title) +
      " <span class=\"egroup__count\">" + items.length + "</span></h3><p class=\"egroup__intro\">" + esc(intro) + "</p>" + body + "</section>";
  }

  const NCC_LABEL = { "none": "None", "a-b": "'A' or 'B' certificate", "c-ab": "'C' certificate, grade A or B", "c-c": "'C' certificate, grade C" };

  // ---------- save the candidate to the Google Sheet ----------
  function save(fields) {
    if (!SHEETS_URL) return;
    const body = new URLSearchParams(fields);
    fetch(SHEETS_URL, { method: "POST", body: body, keepalive: true }).catch(() => {});
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!stepValid(0)) { showStep(0); return; }
    if (!stepValid(1)) return;
    const p = profile();

    const yes = [], later = [], no = [];
    window.SYF_ENTRIES.forEach(entry => {
      const res = evaluate(entry, p);
      (res.status === "yes" ? yes : res.status === "later" ? later : no).push({ entry: entry, res: res });
    });

    const name = val("cname");
    const first = name.split(/\s+/)[0];
    const headline = yes.length
      ? first + ", you can apply for " + yes.length + (yes.length === 1 ? " entry" : " entries") + " now."
      : first + ", no entry is open to you right now" + (later.length ? ", but " + later.length + " will open up later." : ".");

    results.innerHTML =
      "<div class=\"eres__summary\" data-reveal>" +
        "<p class=\"eyebrow\">Your results</p>" +
        "<h3 class=\"eres__headline\">" + esc(headline) + "</h3>" +
        "<ul class=\"eres__stats\">" +
          "<li class=\"is-yes\"><strong>" + yes.length + "</strong><span>Eligible now</span></li>" +
          "<li class=\"is-later\"><strong>" + later.length + "</strong><span>Eligible later</span></li>" +
          "<li class=\"is-no\"><strong>" + no.length + "</strong><span>Not eligible</span></li>" +
        "</ul>" +
        "<p class=\"eres__profile\">Age " + Math.floor(p.age) + " · " + (p.gender === "m" ? "Male" : "Female") + " · " + esc(p.label) +
          (p.ncc === "c-ab" || p.ncc === "c-c" ? " · NCC 'C'" : "") + (p.employed ? " · Working" : "") +
          " · <button type=\"button\" class=\"linkbtn\" data-edit>Change my answers</button></p>" +
        "<a class=\"btn btn--accent eres__cta\" href=\"#counselling\">Book a free counselling call</a>" +
      "</div>" +
      group("Eligible now", "You meet the age, education and basic conditions for these entries. Check the points under \"Keep in mind\".", yes, "yes") +
      group("Eligible later", "You could apply once you are older or finish the education shown. Open to see when.", later, "later", !yes.length) +
      group("Not eligible", "These entries don't match your details. Open to see why.", no, "no", !yes.length && !later.length) +
      "<p class=\"eres__fine\">Rules checked: " + esc(window.SYF_ENTRIES_CHECKED) + ". Marks, height, eyesight, medical standards and exact date-of-birth windows are set in each notification. Always confirm on the official website before you apply.</p>";

    results.hidden = false;
    results.querySelectorAll("[data-reveal]").forEach((el, i) => {
      el.style.setProperty("--d", Math.min(i, 8) * 0.07 + "s");
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-visible")));
    });

    const record = {
      name: name, phone: val("cphone"), email: val("cemail"), town: val("ctown"),
      dob: p.dob, age: String(Math.floor(p.age)),
      gender: p.gender === "m" ? "Male" : "Female",
      marital: val("marital"), qualification: p.label,
      ncc: NCC_LABEL[p.ncc] || "", employed: p.employed ? "Yes" : "No",
      eligible_now: yes.map(x => x.entry.name).join("; ") || "None",
      eligible_later: later.map(x => x.entry.name).join("; ") || "None"
    };

    // Save every check to the sheet
    save(Object.assign({ form: "Eligibility check", consent: "yes", eligible_count: String(yes.length) }, record));

    // Prepare the counselling form with the same details
    booking.hidden = false;
    const bf = booking.querySelector("form");
    Object.keys(record).forEach(k => { if (bf.elements[k]) bf.elements[k].value = record[k]; });
    booking.querySelector("[data-booking-lead]").textContent = yes.length
      ? "Our veteran mentors can help you choose between these " + yes.length + " entries and plan your preparation, free of charge."
      : "Our veteran mentors can help you plan the route that fits you best, free of charge.";

    results.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  });

  results.addEventListener("click", e => {
    if (e.target.closest("[data-edit]")) {
      showStep(0);
      form.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  });

  // ---------- date limits ----------
  const iso = d => d.toISOString().slice(0, 10);
  const callDate = booking && booking.querySelector("input[name='call_date']");
  if (callDate) {
    const t = new Date(); t.setDate(t.getDate() + 1);
    const m = new Date(); m.setDate(m.getDate() + 30);
    callDate.min = iso(t); callDate.max = iso(m);
  }
  const dob = form.elements.dob;
  if (dob) {
    const now = new Date();
    dob.max = iso(new Date(now.getFullYear() - 12, now.getMonth(), now.getDate()));
    dob.min = iso(new Date(now.getFullYear() - 50, 0, 1));
  }

  showStep(0);
})();
