(function () {

  /* ======================
     CUSTOM CURSOR
     ====================== */

  class CustomCursor {
    constructor() {
      this.cursor = document.createElement("div");
      this.cursor.className = "cursor";
      document.body.appendChild(this.cursor);

      document.addEventListener("mousemove", e => {
        this.cursor.style.transform =
          `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      });

      document.addEventListener("mousedown", () =>
        this.cursor.classList.add("clicking")
      );

      document.addEventListener("mouseup", () =>
        this.cursor.classList.remove("clicking")
      );
    }
  }

  new CustomCursor();

  /* ======================
     SMOOTH SCROLL
     ====================== */

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ======================
     ACTIVE NAV HIGHLIGHT
     ====================== */

  const navLinks = [...document.querySelectorAll(".nav__link")];
  const sections = navLinks.map(l =>
    document.querySelector(l.getAttribute("href"))
  );

  function updateNav() {
    const y = window.pageYOffset + 120;
    let current = -1;

    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= y) current = i;
    });

    navLinks.forEach(l => l.classList.remove("is-active"));
    if (current >= 0) navLinks[current].classList.add("is-active");
  }

  window.addEventListener("scroll", updateNav);
  updateNav();

  /* ======================
     SUBTLE 3D TILT
     ====================== */

  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".card--hover").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        const rx = (y - r.height / 2) / 18;
        const ry = (r.width / 2 - x) / 18;

        card.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ======================
     FOOTER YEAR
     ====================== */

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

})();
