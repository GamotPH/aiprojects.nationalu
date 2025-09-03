// src/pages/Papers.jsx
import React, { useEffect, useState } from "react";
import { fetchLandingPage } from "../lib/sanity";

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLandingPage().then((data) => {
      setPapers(data?.papers || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-6">Loading papers…</p>;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-8">
          Papers
        </h2>
      </header>

      <div className="flex flex-col gap-6">
        {papers.map((p, i) => (
          <article
            key={i}
            className="w-full rounded-2xl shadow bg-white p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{p.title}</h2>

            {/* Citation (authors, venue, date) */}
            <p className="text-sm text-gray-600 mt-1">
              {p.authors}
              {p.venue && ` · ${p.venue}`}
              {p.date && ` · ${new Date(p.date).toLocaleDateString()}`}
            </p>

            {/* Optional excerpt if you still want it */}
            {p.excerpt && (
              <p className="mt-3 text-gray-700">{p.excerpt}</p>
            )}

            {/* Links */}
            <div className="mt-4 flex gap-6">
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View online →
                </a>
              )}
              {p.pdfUrl && (
                <a
                  href={p.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  PDF ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
