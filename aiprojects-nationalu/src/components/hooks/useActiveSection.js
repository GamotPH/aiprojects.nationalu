import { useEffect, useState } from "react";

export default function useActiveSection(
  sectionIds,
  { headerPx = 80, minRatio = 0.25 } = {}
) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x) => x.el);
    if (!sections.length) return;

    const ratios = new Map(); // id -> latest intersection ratio

    const pickByVisibility = () => {
      let bestId = activeId;
      let best = minRatio;
      for (const { id } of sections) {
        const r = ratios.get(id) ?? 0;
        if (r > best) {
          best = r;
          bestId = id;
        }
      }
      return bestId;
    };

    const pickByHeaderProximity = () => {
      // choose the section whose top is nearest below the header line
      let bestId = activeId;
      let bestDelta = Number.POSITIVE_INFINITY;
      for (const { id, el } of sections) {
        const top = el.getBoundingClientRect().top - headerPx;
        const delta = top >= 0 ? top : Math.abs(top) + 1e6; // prefer below header
        if (delta < bestDelta) {
          bestDelta = delta;
          bestId = id;
        }
      }
      return bestId;
    };

    const update = () => {
      const byVis = pickByVisibility();
      const next = byVis !== activeId ? byVis : pickByHeaderProximity();
      if (next !== activeId) setActiveId(next);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
        update();
      },
      {
        root: null,
        rootMargin: `-${headerPx}px 0px -40% 0px`,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // 0..1
      }
    );

    sections.forEach(({ el }) => observer.observe(el));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (id && sectionIds.includes(id)) setActiveId(id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    window.addEventListener("resize", onScroll);

    update(); // initial

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sectionIds), headerPx, minRatio]);

  return activeId;
}
