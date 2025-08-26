import React, { useEffect, useMemo, useState } from "react";

/** Helpers */
const fmt = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt) ? "" : dt.toISOString().slice(0, 10);
};
const yearOf = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt) ? "" : dt.getFullYear();
};
const slugify = (s = "") =>
  s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

/** Modal (unstyled-native <dialog> fallback) */
function PaperModal({ paper, onClose }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!paper) return null;

  const citation =
    paper.citation ||
    [paper.authors, paper.title, paper.venue, yearOf(paper.date)]
      .filter(Boolean)
      .join(". ");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl m-6"
        onClick={(e) => e.stopPropagation()}
      >
        {paper.coverUrl && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
            <img
              src={paper.coverUrl}
              alt={paper.title || "Paper cover"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <h2 className="absolute bottom-4 left-6 right-6 text-white text-2xl md:text-3xl font-bold drop-shadow">
              {paper.title || "Untitled paper"}
            </h2>
          </div>
        )}

        {!paper.coverUrl && (
          <div className="px-6 pt-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {paper.title || "Untitled paper"}
            </h2>
          </div>
        )}

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600">
              {[paper.authors, paper.venue, fmt(paper.date)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Citation</h3>
            <p className="text-gray-800">{citation}</p>
          </div>

          {paper.excerpt && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Abstract</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{paper.excerpt}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {paper.link && (
              <a
                href={paper.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50"
              >
                View Full Publication →
              </a>
            )}
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50"
              >
                PDF ↗
              </a>
            )}
            <button
              onClick={onClose}
              className="ml-auto inline-flex items-center rounded-xl px-4 py-2 bg-gray-900 text-white hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Main section */
export default function PapersSection({ items }) {
  const list = Array.isArray(items) ? items : [];

  // Sort newest → oldest
  const papers = useMemo(
    () => [...list].sort((a, b) => (b?.date || "").localeCompare(a?.date || "")),
    [list]
  );

  // Modal state + hash deep-link (#paper/<slug>)
  const [active, setActive] = useState(null);

  // Open via click and push hash for shareable link
  const openPaper = (p) => {
    setActive(p);
    const slug = p.slug?.current || p.slug || slugify(p.title || "");
    if (slug) history.replaceState(null, "", `#paper/${slug}`);
  };

  // Close & clean hash
  const closePaper = () => {
    setActive(null);
    if (location.hash.startsWith("#paper/")) history.replaceState(null, "", "#papers");
  };

  // Support opening directly from a hash link
  useEffect(() => {
    if (!location.hash.startsWith("#paper/") || papers.length === 0) return;
    const slug = location.hash.replace("#paper/", "");
    const found =
      papers.find((p) => p.slug?.current === slug || p.slug === slug) ||
      papers.find((p) => slugify(p.title || "") === slug);
    if (found) setActive(found);
  }, [papers]);

  return (
    <section
      id="papers"
      className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <header className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Papers
          </h2>
        </header>

      {papers.length === 0 ? (
        <p className="text-gray-600">No papers yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((p, i) => (
            <button
              key={i}
              onClick={() => openPaper(p)}
              className="text-left bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden group"
            >
              {p.coverUrl ? (
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={p.coverUrl}
                    alt={p.title || "Paper cover"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-40 w-full bg-gray-100" />
              )}

              <div className="p-5">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {p.title || "Untitled paper"}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {[p.authors, p.venue, yearOf(p.date)].filter(Boolean).join(" · ")}
                </p>

                {p.excerpt && (
                  <p className="text-gray-700 mt-3 line-clamp-3">{p.excerpt}</p>
                )}

                <div className="mt-4 flex items-center gap-3">
                  {p.featured && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                      Featured
                    </span>
                  )}
                  <span className="ml-auto text-blue-600 group-hover:underline">
                    View details →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <PaperModal paper={active} onClose={closePaper} />
    </section>
  );
}
