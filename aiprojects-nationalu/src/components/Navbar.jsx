// src/components/Navbar.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export default function Navbar({
  brandTop = "NATIONAL UNIVERSITY",
  brandMain,
  siteTitle = "AI Projects",
  logoUrl,
}) {
  const links = useMemo(
    () => [
      { id: "research",    label: "Research" },
      { id: "projects",    label: "Projects" },
      { id: "sdgs",        label: "SDGs" },
      { id: "papers",      label: "Papers" },
      { id: "people",      label: "People" },
      { id: "collaborate", label: "Collaborate with Us" },
    ],
    []
  );

  const mainText = brandMain || siteTitle;

  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [topPx, setTopPx] = useState(80);

  // NEW: mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  const HEADER_H = 80; // equals h-20
  const PAD = 24;
  const MOBILE_CUTOFF = 969; // ← hamburger shows at ≤ 969px

  const headerBottom = () => HEADER_H + PAD;

  const topPxRef = useRef(topPx);
  useEffect(() => { topPxRef.current = topPx; }, [topPx]);

  // Smooth scroll with explicit offset
  const scrollToId = (id, smooth = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    const target = window.scrollY + el.getBoundingClientRect().top - headerBottom();
    window.scrollTo({ top: Math.max(0, target), behavior: smooth ? "smooth" : "auto" });
  };

  const goTo = (id) => (e) => {
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    setActive(id);
    scrollToId(id, true);
  };

  // helper for mobile: navigate then close
  const goToMobile = (id) => (e) => {
    goTo(id)(e);
    setMenuOpen(false);
  };

  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  // ---------- UNDERLINE SCROLL-SPY ----------
  useEffect(() => {
    const HOME_ID = "home";
    const sectionIds = links.map(l => l.id);
    const lastId = sectionIds[sectionIds.length - 1];
    const headerBottomLocal = () => HEADER_H + PAD;

    const spy = () => {
      const anchorY = headerBottomLocal();
      let current = HOME_ID;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= anchorY + 0.5) current = id;
        else break;
      }

      const nearBottom =
        window.scrollY > 0 &&
        Math.ceil(window.scrollY + window.innerHeight) >=
          Math.floor(document.documentElement.scrollHeight - 2);
      if (nearBottom) current = lastId;

      if (current !== activeRef.current) setActive(current);
    };

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { spy(); ticking = false; });
    };

    const initFromHash = () => {
      const id = (window.location.hash || "").slice(1);
      const el = id && document.getElementById(id);
      setActive(HOME_ID);
      if (el) {
        const y = window.scrollY + el.getBoundingClientRect().top - headerBottomLocal();
        window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
      }
      requestAnimationFrame(() => setTimeout(spy, 50));
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("hashchange", initFromHash);
    window.addEventListener("load", spy);

    requestAnimationFrame(initFromHash);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("hashchange", initFromHash);
      window.removeEventListener("load", spy);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links.map(l => l.id).join("|")]);

  // ---------- Sticky bar slide/blur ----------
  useEffect(() => {
    const START_OFFSET = 80;
    const BLUR_TRIGGER = 64;

    const onScroll = () => {
      setTopPx(Math.max(0, START_OFFSET - window.scrollY));
      setScrolled(window.scrollY > BLUR_TRIGGER);
    };

    onScroll(); // initial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------- Mobile menu housekeeping ----------
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => { if (window.innerWidth > MOBILE_CUTOFF) setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.documentElement.classList.toggle("overflow-hidden", menuOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  // precompute panel top/max-height so it sits just under the sliding header
  const panelTop = Math.max(0, topPx + HEADER_H);
  const panelMaxH = `calc(100dvh - ${panelTop}px)`;

  const brandTopCls = [
    "text-[10px] md:text-xs font-semibold tracking-[0.18em] uppercase",
    scrolled ? "text-nu-blue/80" : "text-white/80",
  ].join(" ");

  const brandMainCls = [
    "font-semibold","text-base md:text-2xl",
    scrolled ? "text-nu-blue" : "text-white",
  ].join(" ");

  const linkBase = [
    "uppercase text-sm font-semibold tracking-wide",
    "pt-1 pb-3 transition-colors",
  ].join(" ");

  // SHOW at ≤ 969px only
  const iconBtnClasses = [
    "hidden max-[969px]:inline-flex items-center justify-center rounded-md",
    "p-2 ring-1 focus:outline-none focus-visible:ring-2",
    scrolled ? "text-nu-blue ring-nu-blue/20" : "text-white ring-white/30",
  ].join(" ");

  return (
    <header
      style={{ top: `${topPx}px` }}
      className={[
        "fixed inset-x-0 z-50",
        "transition-[top,background-color,backdrop-filter,border-color,box-shadow] duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="container h-20 flex items-center justify-between px-6 md:px-8">
        {/* Logo + brand */}
        <a href="#home" onClick={goTo("home")} className="flex items-center gap-4 md:gap-5">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-9 w-auto md:h-12 object-contain" />
          ) : (
            <div className="h-9 w-9 md:h-12 md:w-12 rounded bg-white/20" />
          )}
          <div className="leading-tight">
            <div className={brandTopCls}>{brandTop}</div>
            <div className={brandMainCls}>{mainText}</div>
          </div>
        </a>

        {/* Desktop links: HIDE at ≤ 969px */}
        <ul className="flex items-center gap-12 max-[969px]:hidden">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={goTo(l.id)}
                  className={[
                    "relative inline-block", linkBase,
                    scrolled ? "text-nu-blue hover:text-nu-blue" : "text-white/90 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                  <span
                    className={[
                      "pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full transition-all duration-200",
                      isActive ? "w-10" : "w-0",
                      scrolled ? "bg-nu-blue" : "bg-white",
                    ].join(" ")}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Hamburger (≤ 969px) */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className={iconBtnClasses}
        >
          {menuOpen ? (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
            </svg>
          ) : (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile overlay + panel: only at ≤ 969px */}
      <div
        className={[
          "fixed inset-0 z-40 transition-opacity duration-200",
          "hidden max-[969px]:block",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMenuOpen(false)}
      >
        {/* dim background (click to close) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* panel (clicks inside shouldn't close) */}
        <div
          className={[
            "absolute inset-x-4 rounded-2xl shadow-xl",
            "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95",
            "ring-1 ring-slate-200",
            "transition-transform duration-200",
            menuOpen ? "translate-y-0" : "-translate-y-2",
          ].join(" ")}
          style={{ top: panelTop, maxHeight: panelMaxH, overflow: "auto" }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <ul className="divide-y divide-slate-100 p-2">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={goToMobile(l.id)}
                    className={[
                      "block px-4 py-3 text-base font-semibold",
                      isActive ? "text-nu-blue" : "text-slate-800",
                      "active:bg-slate-100 rounded-lg",
                    ].join(" ")}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
