// src/components/SDG.jsx
import React from "react";

export default function SDG({
  items = [],
  heading = "Sustainable Development Goals We Support",
  compact = false,
}) {
  const data = items?.length ? items : FALLBACK_SDG;

  return (
    <section
      id="sdgs"
      className={`w-full ${compact ? "py-6" : "py-12"} scroll-mt-20 md:scroll-mt-[96px]`}
    >
      <div className="mx-auto max-w-7xl px-8 sm:px-6 lg:px-16">
        {heading && (
          <div className="mb-8 text-center">
            <h2 className={`font-semibold tracking-tight ${compact ? "text-2xl" : "text-4xl"}`}>
              {heading}
            </h2>
          </div>
        )}

        {/* Wider cards, centered; still max 3 per row */}
        <ul className="mx-auto max-w-[1200px] flex flex-wrap justify-center gap-8">
          {data.map((sdg, i) => (
            <li key={sdg.iconUrl ?? i} className="w-full sm:w-[340px] lg:w-[360px]">
              <SDGCard sdg={sdg} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SDGCard({ sdg }) {
  return (
    <article
      className="
        flex flex-col overflow-hidden
        rounded-3xl border border-slate-200 bg-white
        shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
        mx-auto
        h-[400px]   /* uniform height */
      "
    >
      {/* Icon area (fixed height) */}
      <div className="bg-slate-50 flex items-center justify-center w-full h-48">
        {sdg.iconUrl ? (
          <img
            src={sdg.iconUrl}
            alt={sdg.iconAlt || "SDG icon"}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="p-6 text-slate-300" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 13h4l2-5 3 9 2-4h7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Blurb (clamped, more room now) */}
      <div className="p-4 text-center flex-1 min-h-0 flex">
        <p
          className="text-slate-700 text-base leading-relaxed m-auto"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 6,         // was 5
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {sdg.blurb}
        </p>
      </div>
    </article>
  );
}

/** Fallback so the section doesn’t look empty during wiring */
const FALLBACK_SDG = [
  {
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sustainable_Development_Goal_3.png",
    iconAlt: "SDG 3",
    blurb:
      "Developing AI tools for disease surveillance, mental health monitoring, and healthcare delivery directly supports improved health outcomes and access to services.",
  },
];
