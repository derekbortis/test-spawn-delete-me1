/* ============================================================
   Church History · Controversies — interactions
   ============================================================ */
(function () {
  "use strict";
  const { POSITIONS, FATHERS } = window.FILIOQUE;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Position cards (the map) ---------- */
  function renderPositions() {
    const wrap = $("#positionCards");
    wrap.innerHTML = Object.values(POSITIONS)
      .map(
        (p) => `
        <article class="pcard reveal">
          <span class="pcard__bar" style="background:linear-gradient(90deg, ${p.color}, transparent)"></span>
          <span class="pcard__dot" style="background:${p.color}"></span>
          <h3 class="pcard__label">${p.label}</h3>
          <p class="pcard__blurb">${p.blurb}</p>
        </article>`
      )
      .join("");
  }

  /* ---------- Father cards ---------- */
  function renderFathers() {
    const grid = $("#fatherGrid");
    grid.innerHTML = FATHERS.map((f, i) => {
      const p = POSITIONS[f.position];
      const contested = f.contested
        ? `<p class="fcard__contested">◆ Claimed in good faith by both sides</p>`
        : "";
      return `
        <button class="fcard reveal" data-position="${f.position}" style="transition-delay:${(i % 3) * 60}ms" aria-expanded="false">
          <div class="fcard__top">
            <div>
              <div class="fcard__name">${f.name}</div>
              <div class="fcard__dates">${f.dates}</div>
            </div>
            <span class="fcard__region">${f.region}</span>
          </div>
          <span class="fcard__badge" style="background:${hexA(p.color, 0.14)};color:${p.color}">
            <span class="swatch" style="background:${p.color}"></span>${p.short}
          </span>
          ${contested}
          <p class="fcard__summary">${f.summary}</p>
          <div class="fcard__more">
            <div class="fcard__more-inner">
              <p class="fcard__quote">${f.quote}</p>
              <p class="fcard__source">— ${f.source}</p>
            </div>
          </div>
          <p class="fcard__hint"><span class="chev">⌄</span><span class="hint-text">Read the quote</span></p>
        </button>`;
    }).join("");

    // expand / collapse
    $$(".fcard", grid).forEach((card) => {
      card.addEventListener("click", () => {
        const open = card.classList.toggle("is-open");
        card.setAttribute("aria-expanded", String(open));
        $(".hint-text", card).textContent = open ? "Hide" : "Read the quote";
      });
    });
  }

  /* hex + alpha → rgba */
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }

  /* ---------- Segmented filter ---------- */
  function initFilter() {
    const seg = $("#filter");
    const pill = $("#segPill");
    const btns = $$(".segmented__btn", seg);

    function movePill(btn) {
      pill.style.opacity = "1";
      pill.style.width = btn.offsetWidth + "px";
      pill.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
    }

    function apply(filter) {
      $$(".fcard").forEach((c) => {
        const show = filter === "all" || c.dataset.position === filter;
        c.classList.toggle("is-hidden", !show);
      });
    }

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        movePill(btn);
        apply(btn.dataset.filter);
      });
    });

    // initial pill placement
    requestAnimationFrame(() => movePill($(".segmented__btn.is-active", seg)));
    window.addEventListener("resize", () =>
      movePill($(".segmented__btn.is-active", seg))
    );
  }

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem("ch-theme");
    if (saved) root.setAttribute("data-theme", saved);
    $("#themeToggle").addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("ch-theme", next);
      $('meta[name="theme-color"]').setAttribute(
        "content",
        next === "light" ? "#ffffff" : "#000000"
      );
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- init ---------- */
  renderPositions();
  renderFathers();
  initFilter();
  initTheme();
  initReveal();
})();
