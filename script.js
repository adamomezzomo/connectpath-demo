// ConnectPath — shared scripts

// Mobile nav toggle
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

// Staggered scroll reveal — siblings inside a grid animate in sequence
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = parseFloat(el.dataset.delay || 0);
        el.style.transitionDelay = delay + "s";
        el.classList.add("in");
        io.unobserve(el);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => {
  // auto-stagger cards that share a grid parent
  const sibs = Array.from(el.parentElement.children).filter((c) =>
    c.classList.contains("reveal")
  );
  if (sibs.length > 1) {
    const i = sibs.indexOf(el);
    el.dataset.delay = Math.min(i * 0.08, 0.4);
  }
  io.observe(el);
});

// Count-up for stat numbers marked data-count
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const dur = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// Forms email to the ConnectPath inbox via FormSubmit, then route the visitor onward.
// FORM_ENDPOINT is the FormSubmit AJAX endpoint tied to alland@connectpath.ca.
// (The first submission triggers a one-time confirmation email that must be clicked to activate delivery.)
const FORM_ENDPOINT = "https://formsubmit.co/ajax/alland@connectpath.ca";
document.querySelectorAll("form[data-email]").forEach((form) => {
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
    if (FORM_ENDPOINT) {
      try {
        const data = Object.fromEntries(new FormData(form).entries());
        await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (err) { console.error("Form submit failed:", err); }
    }
    if (form.dataset.book) {
      window.location.href = form.dataset.book;
      return;
    }
    const box = document.createElement("div");
    box.className = "form-success";
    box.innerHTML = "<h3>Thanks, we\u2019ve got it.</h3><p>Your submission is on its way to the ConnectPath team. We\u2019ll be in touch by email shortly.</p>";
    form.replaceWith(box);
  });
});

// Roles savings calculator
(function(){var cr=document.getElementById("calc-roles"),cs=document.getElementById("calc-salary"),crate=document.getElementById("calc-rate");if(!cr||!cs||!crate)return;function fmt(n){return "$"+Math.round(n).toLocaleString("en-US");}function upd(){var roles=+cr.value,sal=+cs.value,rate=+crate.value;document.getElementById("calc-roles-v").textContent=roles;document.getElementById("calc-salary-v").textContent="$"+sal+"k";document.getElementById("calc-rate-v").textContent=rate+"%";var trad=roles*sal*1000*(rate/100);var us=roles*(sal>=400?40000:25000);document.getElementById("calc-trad").textContent=fmt(trad);document.getElementById("calc-us").textContent=fmt(us);document.getElementById("calc-save").textContent=fmt(Math.max(0,trad-us));}[cr,cs,crate].forEach(function(el){el.addEventListener("input",upd);});upd();})();
