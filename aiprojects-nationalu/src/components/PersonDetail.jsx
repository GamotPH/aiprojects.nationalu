// src/components/PersonDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { fetchLandingPage } from "../lib/sanity";
import { urlFor } from "../lib/sanityImg";

// reuse the same background images your Hero uses
import bg1 from "../assets/nubuilding1.png";
import bg2 from "../assets/nubuilding2.jpg";
import bg3 from "../assets/nubuilding3.jpg";

/* ---------- Person-focused hero (no robot) ---------- */
function ProfileHero({ person }) {
  return (
    <section
      className="relative isolate text-white overflow-hidden"
      style={{
        paddingTop: "9.5rem",                 // clears sticky navbar
        paddingBottom: "3.25rem",
        minHeight: "calc(72svh - 5rem)",      // tall hero for a big portrait
        "--cycle": "15s",
      }}
    >
      {/* animated background stack (same classes as homepage hero) */}
      <div className="hero-bg anim delay-1 z-0" style={{ backgroundImage: `url(${bg1})` }} aria-hidden="true" />
      <div className="hero-bg anim delay-2 z-0" style={{ backgroundImage: `url(${bg2})` }} aria-hidden="true" />
      <div className="hero-bg anim delay-3 z-0" style={{ backgroundImage: `url(${bg3})` }} aria-hidden="true" />

      {/* gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(6,45,95,.65), rgba(4,33,70,.95))" }}
        aria-hidden="true"
      />

      {/* content */}
      <div className="relative z-[2]">
        <div className="container px-6 lg:px-8">
          <div className="py-10 md:py-14">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 md:gap-12">
              {/* Big portrait card */}
              <div className="rounded-3xl overflow-hidden bg-white/10 ring-4 ring-white/80 shadow-2xl">
                {person?.photo ? (
                  <img
                    src={urlFor(person.photo).width(1200).height(1500).fit("crop").auto("format").url()}
                    alt={person?.name || "Portrait"}
                    className="
                      block
                      h-56 w-44          /* 224 x 176 */
                      sm:h-64 sm:w-48    /* 256 x 192 */
                      md:h-72 md:w-56    /* 288 x 224 */
                      lg:h-80 lg:w-64    /* 320 x 256 */
                      xl:h-96 xl:w-72    /* 384 x 288 */
                      object-cover
                    "
                    loading="eager"
                  />
                ) : (
                  <div className="h-56 w-44 sm:h-64 sm:w-48 md:h-72 md:w-56 lg:h-80 lg:w-64 xl:h-96 xl:w-72 bg-white/10" />
                )}
              </div>

              {/* Name + role */}
              <div className="min-w-0 text-center sm:text-left">
                <h1
                  className="
                    font-bold
                    text-4xl
                    md:text-6xl
                    drop-shadow-[0_6px_18px_rgba(0,0,0,.35)]
                  "
                >
                  {person?.name || "—"}
                </h1>
                {person?.role && (
                  <p className="mt-3 text-xl md:text-2xl lg:text-3xl font-semibold text-white/95">
                    {person.role}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PersonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // site meta for navbar
  const [meta, setMeta] = useState({ siteTitle: null, logoUrl: null });

  // person + status
  const [person, setPerson] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [slug]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const data = await fetchLandingPage();
        if (!live) return;

        setMeta({ siteTitle: data?.siteTitle, logoUrl: data?.logoUrl });

        const team = Array.isArray(data?.teamLab) ? data.teamLab : [];
        const found = team.find(
          (p) => (p?.slug?.current || "").toLowerCase() === String(slug || "").toLowerCase()
        );
        if (!found) setErr("Person not found.");
        else setPerson(found);
      } catch (e) {
        setErr(e?.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [slug]);

  const backToPeople = () => navigate("/people");

  const paragraphs = useMemo(() => {
    if (!person?.overviewText) return [];
    return person.overviewText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }, [person?.overviewText]);

  return (
    <>
      <Navbar
        siteTitle={meta.siteTitle || "AI Projects - National University"}
        logoUrl={meta.logoUrl}
      />

      {/* Person-focused hero */}
      <ProfileHero person={person} />

      <main className="container py-8 md:py-10">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={backToPeople}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-nu-blue ring-1 ring-nu-blue/20 hover:bg-nu-blue/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to People
          </button>
        </div>

        {loading && <p className="text-slate-600">Loading…</p>}
        {err && !loading && <p className="text-red-600">{err}</p>}

        {!loading && !err && person && (
          <article className="mx-auto max-w-4xl">
            {person.overviewTitle && (
              <p className="text-[11px] tracking-[0.2em] uppercase font-bold text-pink-600 mb-2">
                {person.overviewTitle}
              </p>
            )}

            {paragraphs.length ? (
              <div className="space-y-4 text-slate-800 leading-relaxed text-justify">
                {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            ) : (
              <p className="text-slate-600">No bionote available.</p>
            )}
          </article>
        )}
      </main>
    </>
  );
}
