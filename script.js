/* VVS Models — site interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ---- Form delivery -------------------------------------------------------
  // Submissions are delivered by FormSubmit (no backend needed on Vercel).
  // The FIRST submission sends an activation email to this address — click
  // "Activate" in that email once and every submission after arrives normally.
  const FORM_EMAIL = "info@vvsmodels.com";
  const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;

  // ---- Gallery data --------------------------------------------------------
  const IMG = "assets/img/";
  const gallery = [
    { src: "team-black-event.jpg",     cap: "The VVS Team",            cat: "events",    size: "big" },
    { src: "reno-arch-portrait.jpg",   cap: "Under the Reno Arch",     cat: "editorial", size: "tall" },
    { src: "mount-gay-activation.jpg", cap: "Mount Gay × Street Heat", cat: "events",    size: "tall" },
    { src: "lex-gogo-holiday.jpg",     cap: "LEX Holiday Night",       cat: "nightlife", size: "tall" },
    { src: "golden-hour-portrait.jpg", cap: "Golden Hour",             cat: "editorial", size: "" },
    { src: "poolside-swim-team.jpg",   cap: "Poolside Showcase",       cat: "events",    size: "wide" },
    { src: "pageant-nevada.jpg",       cap: "Miss Nevada",             cat: "editorial", size: "tall" },
    { src: "mount-gay-duo.jpg",        cap: "Brand Ambassadors",       cat: "events",    size: "tall" },
    { src: "lex-gogo-neon.jpg",        cap: "Neon Nights at LEX",      cat: "nightlife", size: "tall" },
    { src: "studio-editorial.jpg",     cap: "Studio Editorial",        cat: "editorial", size: "tall" },
    { src: "street-heat-guests.jpg",   cap: "Guest Moments",           cat: "events",    size: "" },
    { src: "reno-arch-editorial.jpg",  cap: "Neon Editorial",          cat: "editorial", size: "" },
    { src: "street-heat-guest.jpg",    cap: "Street Heat Activation",  cat: "events",    size: "tall" },
    { src: "street-heat-guest-2.jpg",  cap: "Giveaways & Photo Ops",   cat: "events",    size: "" },
  ];
  const label = { events: "Events", editorial: "Editorial", nightlife: "Nightlife" };

  // ---- Year ----
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  // ---- Nav ----
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const toggle = $(".nav__toggle"), drawer = $(".drawer");
  const setDrawer = (open) => {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", !open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setDrawer(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", drawer).forEach(a => a.addEventListener("click", () => setDrawer(false)));

  // ---- Reveal on scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  const observeReveals = () => $$(".reveal:not(.is-in)").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
  // let hero reveal after the curtain lifts
  setTimeout(observeReveals, 900);

  // ---- Showcase reel ----
  const reel = $("#reel"), reelBtn = $("#reelToggle"), bar = $("#reelBar");
  const heroBg = $(".hero__bg");
  if (reel) {
    reelBtn.addEventListener("click", () => {
      if (reel.paused) { reel.play(); heroBg?.play(); } else { reel.pause(); heroBg?.pause(); }
    });
    reel.addEventListener("play", () => { reelBtn.classList.remove("is-paused"); reelBtn.setAttribute("aria-label", "Pause showcase reel"); });
    reel.addEventListener("pause", () => { reelBtn.classList.add("is-paused"); reelBtn.setAttribute("aria-label", "Play showcase reel"); });
    reel.addEventListener("timeupdate", () => {
      if (reel.duration) bar.style.width = `${(reel.currentTime / reel.duration) * 100}%`;
      // keep blurred background in step with the framed reel
      if (heroBg && Math.abs(heroBg.currentTime - reel.currentTime) > 0.4) heroBg.currentTime = reel.currentTime;
    });
  }
  // pause offscreen videos to save battery / bandwidth
  const vio = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { if (!target.dataset.userPaused) target.play().catch(() => {}); }
      else target.pause();
    });
  }, { threshold: 0.15 });
  $$("video").forEach(v => vio.observe(v));
  reelBtn?.addEventListener("click", () => { reel.dataset.userPaused = reel.paused ? "1" : ""; });

  // ---- Service card glow follows cursor ----
  $$(".card").forEach(card => card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  // ---- Gallery grid ----
  const grid = $("#grid");
  let visible = gallery.slice();
  const renderGrid = (filter = "all") => {
    visible = filter === "all" ? gallery.slice() : gallery.filter(g => g.cat === filter);
    grid.innerHTML = "";
    visible.forEach((g, i) => {
      const fig = document.createElement("figure");
      fig.className = `tile ${filter === "all" ? g.size : (i === 0 ? "big" : "tall")}`;
      fig.style.animationDelay = `${i * 60}ms`;
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", `Open image: ${g.cap}`);
      fig.innerHTML = `<img src="${IMG + g.src}" alt="${g.cap} — VVS Models" loading="lazy" decoding="async" />
        <figcaption><span>${g.cap}</span><small>${label[g.cat]}</small></figcaption>`;
      fig.addEventListener("click", () => openLB(i));
      fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(i); } });
      grid.appendChild(fig);
    });
  };
  $$(".filters button").forEach(btn => btn.addEventListener("click", () => {
    $$(".filters button").forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
    btn.classList.add("is-active"); btn.setAttribute("aria-selected", "true");
    renderGrid(btn.dataset.filter);
  }));
  renderGrid();

  // ---- Lightbox with < > navigation ----
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbCount = $("#lbCount");
  let idx = 0, lastFocus = null;
  const show = (i) => {
    idx = (i + visible.length) % visible.length;
    const g = visible[idx];
    lbImg.classList.add("is-swapping");
    const pre = new Image();
    pre.onload = () => {
      lbImg.src = pre.src; lbImg.alt = `${g.cap} — VVS Models`;
      lbCap.textContent = g.cap;
      lbCount.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
      requestAnimationFrame(() => lbImg.classList.remove("is-swapping"));
    };
    pre.src = IMG + g.src;
    // warm neighbours
    [1, -1].forEach(d => { const n = visible[(idx + d + visible.length) % visible.length]; new Image().src = IMG + n.src; });
  };
  const openLB = (i) => {
    lastFocus = document.activeElement;
    lb.hidden = false; document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lb.classList.add("is-open"));
    show(i); $(".lb__next", lb).focus();
  };
  const closeLB = () => {
    lb.classList.remove("is-open"); document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; }, 300);
    lastFocus?.focus();
  };
  $(".lb__prev", lb).addEventListener("click", () => show(idx - 1));
  $(".lb__next", lb).addEventListener("click", () => show(idx + 1));
  $(".lb__close", lb).addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb__stage")) closeLB(); });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "ArrowRight") show(idx + 1);
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "Escape") closeLB();
  });
  let sx = 0, sy = 0;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
  });

  // ---- Contact tabs ----
  const tabs = $(".tabs");
  const setTab = (name) => {
    $$("button", tabs).forEach(b => {
      const on = b.dataset.panel === name;
      b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on);
    });
    $$(".form").forEach(f => f.classList.toggle("is-active", f.id === name));
    tabs.classList.toggle("is-apply", name === "apply");
  };
  $$("button", tabs).forEach(b => b.addEventListener("click", () => setTab(b.dataset.panel)));
  $$("[data-tab]").forEach(a => a.addEventListener("click", () => setTab(a.dataset.tab)));
  if (location.hash === "#apply") setTab("apply");

  // ---- Form submit ----
  $$(".form").forEach(form => form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $(".form__status", form);
    status.className = "form__status"; status.textContent = "";

    // validation
    let firstBad = null;
    $$("input, select, textarea", form).forEach(el => {
      if (el.classList.contains("hp")) return;
      const wrap = el.closest(".field, .check");
      const bad = !el.checkValidity();
      wrap?.classList.toggle("is-invalid", bad);
      if (bad && !firstBad) firstBad = el;
    });
    if (firstBad) {
      status.classList.add("err");
      status.textContent = "Please complete the highlighted fields.";
      firstBad.focus();
      return;
    }
    if ($(".hp", form).value) return; // bot

    const data = Object.fromEntries(new FormData(form).entries());
    delete data._honey;
    data._subject = form.dataset.subject;
    data._template = "table";
    data._captcha = "false";
    data["Form"] = form.id === "apply" ? "Model Application" : "Talent Booking";

    const btn = $("button[type=submit]", form), label = btn.textContent;
    btn.disabled = true; btn.textContent = "Sending…";
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) === "false") throw new Error(out.message || "Request failed");
      form.reset();
      status.classList.add("ok");
      status.textContent = form.id === "apply"
        ? "Thank you! Your application is in — our team will reach out if you're a fit."
        : "Thank you! Your inquiry has been received — we'll be in touch shortly.";
    } catch (err) {
      status.classList.add("err");
      const body = encodeURIComponent(Object.entries(data).filter(([k]) => !k.startsWith("_")).map(([k, v]) => `${k}: ${v}`).join("\n"));
      status.innerHTML = `Something went wrong sending your message. Please <a href="mailto:${FORM_EMAIL}?subject=${encodeURIComponent(data._subject)}&body=${body}">email us directly</a>.`;
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  }));
  $$(".form input, .form select, .form textarea").forEach(el =>
    el.addEventListener("input", () => el.closest(".field, .check")?.classList.remove("is-invalid")));
})();
