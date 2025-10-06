// src/pages/People.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import { fetchLandingPage } from "../lib/sanity";
import { urlFor } from "../lib/sanityImg";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));

/** true when viewport >= 1024px (Tailwind lg) */
function useIsLg() {
  const get = () => window.matchMedia("(min-width: 1024px)").matches;
  const [isLg, setIsLg] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLg(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isLg;
}

export default function PeoplePage() {
  const [meta, setMeta] = useState({
    siteTitle: null,
    logoUrl: null,
    heroKicker: null,
    heroTitle: null,
    heroSub: null,
    heroCtaText: null,
    heroCtaHref: null,
  });
  const [people, setPeople] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLg = useIsLg();

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const data = await fetchLandingPage();
        if (!live) return;
        setMeta({
          siteTitle: data?.siteTitle,
          logoUrl: data?.logoUrl,
          heroKicker: data?.heroKicker,
          heroTitle: data?.heroTitle,
          heroSub: data?.heroSub,
          heroCtaText: data?.heroCtaText,
          heroCtaHref: data?.heroCtaHref,
        });
        setPeople(Array.isArray(data?.teamLab) ? data.teamLab : []);
      } catch (e) {
        setErr(e?.message || "Failed to load people.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  const ordered = useMemo(() => people ?? [], [people]);

  // Always go home (top of landing page). Navbar will handle section nav.
  const goHome = () => navigate("/");

  return (
    <>
      <Navbar
        siteTitle={meta.siteTitle || "AI Projects - National University"}
        logoUrl={meta.logoUrl}
      />

      {/* HERO from landing page */}
      <Hero
        kicker={meta.heroKicker}
        title={meta.heroTitle}
        sub={meta.heroSub}
        ctaText={meta.heroCtaText}
        ctaHref={meta.heroCtaHref}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={goHome}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-nu-blue ring-1 ring-nu-blue/20 hover:bg-nu-blue/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="-ml-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-10">People</h1>

        {loading && <p className="text-gray-600">Loading…</p>}
        {err && <p className="text-red-600">{err}</p>}

        {!loading && !err && (
          <div
            className="
              grid gap-4
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
              auto-rows-[auto] sm:auto-rows-[220px] md:auto-rows-[260px]
            "
          >
            {ordered.map((m, idx) => {
              const cs = clamp(m.colSpan ?? 1, 1, 4);
              const rs = clamp(m.rowSpan ?? 1, 1, 8);
              const cStart = m.colStart ? clamp(m.colStart, 1, 4) : null;
              const rStart = m.rowStart ? clamp(m.rowStart, 1, 50) : null;

              // Apply spans ONLY on large screens so mobile stays uniform
              const style = isLg
                ? {
                    gridColumn: cStart ? `${cStart} / span ${cs}` : `span ${cs} / span ${cs}`,
                    gridRow: rStart ? `${rStart} / span ${rs}` : `span ${rs} / span ${rs}`,
                  }
                : undefined;

              const key = m._key ?? m.slug?.current ?? m._id ?? m.name;
              const photoUrl = m.photo
                ? urlFor(m.photo).width(isLg ? 800 : 700).height(isLg ? 800 : 525).fit("crop").auto("format").url()
                : null;

              const CardInner = (
                <>
                  {/* MOBILE: vertical card (image on top) */}
                  <div className="sm:hidden">
                    <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                      {photoUrl && (
                        <img
                          src={photoUrl}
                          alt={m.name || "Member"}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{m.name || "—"}</h3>
                      {m.role && <p className="text-sm text-slate-600">{m.role}</p>}
                    </div>
                  </div>

                  {/* DESKTOP/TABLET: your diagonal layout */}
                  <div className="hidden sm:block h-full">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={m.name || "Member"}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>

                    <div className="absolute bottom-6 left-6 pr-6">
                      <h3 className="font-bold leading-tight text-lg md:text-xl group-hover:text-blue-600">
                        {m.name || "—"}
                      </h3>
                      {m.role && (
                        <p className="text-sm text-gray-600 group-hover:text-blue-500">
                          {m.role}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              );

              const baseClasses =
                "relative group bg-white border border-gray-200 rounded-xl overflow-hidden text-left transition shadow-sm hover:shadow-md h-full";

              return m.slug?.current ? (
                <Link key={key} to={`/people/${m.slug.current}`} style={style} className={`block ${baseClasses}`}>
                  {CardInner}
                </Link>
              ) : (
                <div key={key} style={style} className={`${baseClasses} opacity-75`} title="Missing slug">
                  {CardInner}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
