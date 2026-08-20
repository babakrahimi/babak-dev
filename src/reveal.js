/* ══════════════════════════════════════════════════════════════
   Reveals and the section indicator.
   IntersectionObserver only — no scroll listeners anywhere.
   ══════════════════════════════════════════════════════════════ */

export function initReveals() {
  const targets = document.querySelectorAll(".reveal, .section");
  if (!targets.length) return;

  /* No observer means no reveal — show everything rather than hide it. */
  if (!("IntersectionObserver" in window)) {
    for (const target of targets) target.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
  );

  for (const target of targets) observer.observe(target);
}

export function initIndicator() {
  if (!("IntersectionObserver" in window)) return;

  const indicator = document.getElementById("indicator");
  const num = document.getElementById("indicatorNum");
  const name = document.getElementById("indicatorName");
  const sections = document.querySelectorAll(".section");
  if (!indicator || !num || !name || !sections.length) return;

  const links = [...document.querySelectorAll(".nav__link")];
  const markCurrent = (id) => {
    for (const link of links) {
      const on = id && link.getAttribute("href") === `#${id}`;
      if (on) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const label = entry.target.querySelector(".section__num");
        const title = entry.target.querySelector(".section__title");
        if (label) num.textContent = label.textContent.trim();
        if (title) name.textContent = title.textContent.trim();
        indicator.classList.add("is-on");
        markCurrent(entry.target.id);
      }
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );

  for (const section of sections) observer.observe(section);

  /* Hidden over the hero — the indicator is orientation, and there is
     nothing to orient yet — and hidden over the colophon, which it would
     otherwise sit on top of. */
  const edges = [
    [document.querySelector(".hero"), 0.45],
    [document.querySelector(".colophon"), 0],
  ];

  for (const [el, threshold] of edges) {
    if (!el) continue;
    new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        indicator.classList.remove("is-on");
        markCurrent(null);
      },
      { threshold },
    ).observe(el);
  }
}
