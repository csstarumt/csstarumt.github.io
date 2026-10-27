const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const button = document.querySelector<HTMLButtonElement>(
  "[data-motion-toggle]",
);
let manual = false;
try {
  manual = sessionStorage.getItem("css-motion") === "paused";
} catch {}
function update() {
  const stopped = manual || reduced.matches;
  root.dataset.motion = stopped ? "paused" : "active";
  if (button) {
    button.textContent = stopped ? "Motion off" : "Pause motion";
    button.setAttribute("aria-pressed", String(stopped));
    button.disabled = reduced.matches;
    button.title = reduced.matches
      ? "Reduced motion follows your device preference"
      : "Pause or resume decorative animation";
  }
  if (stopped)
    document.getAnimations().forEach((a) => {
      if (
        a.effect instanceof KeyframeEffect &&
        a.effect.target?.closest("[data-reveal]")
      )
        a.finish();
    });
  document.dispatchEvent(new Event("css:motion"));
}
if (button) {
  button.hidden = false;
  button.addEventListener("click", () => {
    manual = !manual;
    try {
      sessionStorage.setItem("css-motion", manual ? "paused" : "active");
    } catch {}
    update();
  });
}
reduced.addEventListener("change", update);
update();
// Content is visible by default. One-shot reveals never gate access to information.
const revealTargets = document.querySelectorAll<HTMLElement>(
  ".section-heading,.event-card,.award-gallery figure,.gallery-item,.values-list>div,.join-banner,.pathway-tabs,.membership-panel,.contact-grid>div",
);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (root.dataset.motion === "paused") return;
      const el = entry.target as HTMLElement;
      el.dataset.reveal = "true";
      el.animate(
        [
          { opacity: 0.15, transform: "translateY(22px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 650,
          easing: "cubic-bezier(.22,1,.36,1)",
          delay: Number(el.dataset.revealDelay || 0),
        },
      );
    });
  },
  { threshold: 0.12 },
);
revealTargets.forEach((el, i) => {
  el.dataset.revealDelay = String(
    el.classList.contains("event-card") ? (i % 3) * 65 : 0,
  );
  observer.observe(el);
});
const hero = document.querySelector<HTMLElement>(".hero");
const title = document.querySelector<HTMLElement>(".hero h1");
const progress = document.querySelector<HTMLElement>(".reading-progress");
let pending = false;
function scrollFrame() {
  pending = false;
  const total = document.documentElement.scrollHeight - innerHeight;
  if (progress)
    progress.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
  if (hero && title) {
    const amount = Math.min(
      1,
      Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight),
    );
    title.style.setProperty(
      "--scroll-shift",
      root.dataset.motion === "paused" ? "0px" : `${amount * 34}px`,
    );
  }
}
addEventListener(
  "scroll",
  () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(scrollFrame);
    }
  },
  { passive: true },
);
scrollFrame();
document.addEventListener("css:motion", scrollFrame);
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  document.querySelectorAll<HTMLElement>(".button").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (root.dataset.motion === "paused") return;
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--mx",
        `${(e.clientX - r.left - r.width / 2) * 0.07}px`,
      );
      el.style.setProperty(
        "--my",
        `${(e.clientY - r.top - r.height / 2) * 0.09}px`,
      );
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    });
  });
}

const ambientObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) =>
      e.target.classList.toggle("is-offscreen", !e.isIntersecting),
    ),
  { rootMargin: "50px" },
);
document
  .querySelectorAll(".signal-track,.pathway-symbol")
  .forEach((e) => ambientObserver.observe(e));
export {};
