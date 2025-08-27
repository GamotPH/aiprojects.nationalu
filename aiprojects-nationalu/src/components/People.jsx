// src/pages/People.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";      // ← add Link
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import { fetchLandingPage } from "../lib/sanity";
import { urlFor } from "../lib/sanityImg";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));

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

  const sorted = useMemo(() => {
    return [...people].sort((a, b) => {
      const ao = Number.isFinite(a?.displayOrder) ? a.displayOrder : 1e9;
      const bo = Number.isFinite(b?.displayOrder) ? b.displayOrder : 1e9;
      if (ao !== bo) return ao - bo;
      return (a?.name || "").localeCompare(b?.name || "");
    });
  }, [people]);

const goHome = () => navigate("/#home");

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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px]">
            {sorted.map((m, idx) => {
              const cs = clamp(m.colSpan ?? 1, 1, 4);
              const rs = clamp(m.rowSpan ?? 1, 1, 8);
              const cStart = m.colStart ? clamp(m.colStart, 1, 4) : null;
              const rStart = m.rowStart ? clamp(m.rowStart, 1, 50) : null;
              const style = {
                gridColumn: cStart ? `${cStart} / span ${cs}` : `span ${cs} / span ${cs}`,
                gridRow: rStart ? `${rStart} / span ${rs}` : `span ${rs} / span ${rs}`,
              };
              const key = m._key || m.slug?.current || `${m.name || "person"}-${idx}`;

              // If slug is missing, make the card non-clickable
              const content = (
                <>
                  <div className="absolute top-0 right-0 w-1/2 h-1/2">
                    {m.photo ? (
                      <img
                        src={urlFor(m.photo).width(800).height(800).fit("crop").auto("format").url()}
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
                </>
              );

              return m.slug?.current ? (
                <Link
                  key={key}
                  to={`/people/${m.slug.current}`}
                  style={style}
                  className="relative group block bg-white border border-gray-200 rounded-xl overflow-hidden text-left transition shadow-sm hover:shadow-md h-full"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={key}
                  style={style}
                  className="relative group bg-white border border-gray-200 rounded-xl overflow-hidden text-left h-full opacity-75"
                  title="Missing slug"
                >
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}