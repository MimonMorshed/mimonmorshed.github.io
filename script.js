(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================
  // Custom cursor (kept)
  // ============================
  class CustomCursor {
    constructor() {
      // Don't show on touch devices
      if (window.matchMedia("(pointer: coarse)").matches) return;

      this.cursor = document.createElement("div");
      this.cursor.className = "cursor";
      document.body.appendChild(this.cursor);

      // Hide until first mousemove (prevents top-left flash)
      this.cursor.style.opacity = "0";
      document.addEventListener(
        "mousemove",
        () => (this.cursor.style.opacity = ""),
        { once: true }
      );

      document.addEventListener("mousemove", (e) => {
        // Use transform (smoother than left/top)
        this.cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      });

      document.addEventListener("mousedown", () => {
        this.cursor.classList.add("clicking");
      });

      document.addEventListener("mouseup", () => {
        this.cursor.classList.remove("clicking");
      });
    }
  }
  new CustomCursor();

  // ============================
  // Smooth scroll for anchor links
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = 72; // match --nav-h
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // ============================
  // Active nav highlight on scroll
  // ============================
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const setActive = () => {
    const y = window.pageYOffset + 120;
    let activeIndex = -1;

    sections.forEach((sec, i) => {
      if (sec.offsetTop <= y) activeIndex = i;
    });

    navLinks.forEach((l) => l.classList.remove("is-active"));
    if (activeIndex >= 0) navLinks[activeIndex].classList.add("is-active");
  };

  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();

  // ============================
  // Subtle 3D tilt for cards with class "tilt"
  // ============================
  const tiltCards = document.querySelectorAll(".tilt");
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (isFinePointer && tiltCards.length) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y2 = e.clientY - rect.top;

        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rx = (y2 - cy) / 18;
        const ry = (cx - x) / 18;

        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
})();
