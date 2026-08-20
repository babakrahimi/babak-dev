/* ══════════════════════════════════════════════════════════════
   Reveals, header state, and the current-section marker.
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

/* Header state. A sentinel at the top of the document rather than a scroll
   listener, so this flips exactly twice per traversal instead of once per
   frame. The header is fixed from first paint — it never switches
   positioning mode, only its padding and background change. */
export function initHeader() {
  const sentinel = document.querySelector(".sentinel");
  if (!sentinel || !("IntersectionObserver" in window)) return;

  new IntersectionObserver(
    ([entry]) => {
      document.documentElement.classList.toggle(
        "is-stuck",
        !entry.isIntersecting,
      );
    },
    { threshold: 0 },
  ).observe(sentinel);
}

/* Which section the header's amber square points at. The band is measured
   from just below the fixed header rather than the literal viewport centre:
   48%–58% instead of a symmetric 45%–55%, which puts its midpoint at 53% —
   the centre of the area the header is not covering. */
export function initCurrentSection() {
  if (!("IntersectionObserver" in window)) return;

  const links = [...document.querySelectorAll(".nav__link")];
  const sections = document.querySelectorAll(".section");
  if (!links.length || !sections.length) return;

  const markCurrent = (id) => {
    for (const link of links) {
      if (id && link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) markCurrent(entry.target.id);
      }
    },
    { rootMargin: "-48% 0px -42% 0px" },
  );

  for (const section of sections) observer.observe(section);

  /* The hero joins the same band with no id, so it clears the marker when it
     owns the band. One observer and one band means exactly one owner at any
     scroll position — and unlike a visibility threshold, this still works on
     a viewport shorter than the hero. */
  const hero = document.querySelector(".hero");
  if (hero) observer.observe(hero);
}
