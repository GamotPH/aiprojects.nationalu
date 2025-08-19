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
      { id: "projects",    label: "Projects" },
      { id: "research",    label: "Research" },
      { id: "application", label: "Application" },
      { id: "sdgs",        label: "SDGs" },
      { id: "collaborate", label: "Collaborate with Us" },
    ],
    []
  );

  const mainText = brandMain || siteTitle;

  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [topPx, setTopPx] = useState(80);

  // Visual header constants
  const HEADER_H = 80; // equals h-20
  const PAD = 24;      // breathing room below header

  // ---- helpers ----
  const headerBottom = () => HEADER_H + PAD; // <-- DON'T include topPx

  const topPxRef = useRef(topPx);
  useEffect(() => { topPxRef.current = topPx; }, [topPx]);

  // Smooth scroll with explicit offset (assumes header at top:0)
  const scrollToId = (id, smooth = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    const target = window.scrollY + el.getBoundingClientRect().top - headerBottom();
    window.scrollTo({ top: Math.max(0, target), behavior: smooth ? "smooth" : "auto" });
  };

  const goTo = (id) => (e) => {
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    setActive(id);            // underline immediately
    scrollToId(id, true);     // then smooth-scroll to corrected offset
  };
// add near your state
const activeRef = useRef(active);
useEffect(() => { activeRef.current = active; }, [active]);

// ---------- UNDERLINE SCROLL-SPY ----------
useEffect(() => {
  const HOME_ID = "home";
  const sectionIds = links.map(l => l.id);
  const lastId = sectionIds[sectionIds.length - 1];
  const headerBottom = () => HEADER_H + PAD;  // your constants

  const spy = () => {
    const anchorY = headerBottom(); // px from viewport top
    let current = HOME_ID;          // default to HOME while in hero

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= anchorY + 0.5) current = id;
      else break;
    }

    // don't trigger bottom fallback at page load (scrollY === 0)
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

  // Init: keep underline on HOME, but honor hash for scrolling only
  const initFromHash = () => {
    const id = (window.location.hash || "").slice(1);
    setActive(HOME_ID);  // underline none of the sections at start
    if (id && (id === HOME_ID || sectionIds.includes(id))) {
      // optional: jump to correct visual offset (no smooth) if hash is present
      const el = document.getElementById(id);
      if (el) {
        const y = window.scrollY + el.getBoundingClientRect().top - headerBottom();
        window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
      }
    }
    // reconcile after layout/images
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


  // ---------- Sticky bar slide/blur (unchanged) ----------
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
            <div className={["text-[10px] md:text-xs font-semibold tracking-[0.18em] uppercase",
              scrolled ? "text-nu-blue/80" : "text-white/80"].join(" ")}>
              {brandTop}
            </div>
            <div className={["font-semibold","text-base md:text-2xl",
              scrolled ? "text-nu-blue" : "text-white"].join(" ")}>
              {brandMain || siteTitle}
            </div>
          </div>
        </a>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-12">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={goTo(l.id)}
                  className={[
                    "relative inline-block uppercase text-sm font-semibold tracking-wide",
                    "pt-1 pb-3 transition-colors",
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
      </nav>
    </header>
  );
}
