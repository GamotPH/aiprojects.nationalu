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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-8">
            Papers
          </h2>
        </header>
      <div className="grid gap-6 md:grid-cols-2">
        {papers.map((p, i) => (
          <article key={i} className="rounded-2xl shadow bg-white overflow-hidden">
            {p.coverUrl && (
              <img src={p.coverUrl} alt={p.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600">
                {p.authors} {p.venue && ` · ${p.venue}`}{" "}
                {p.date && ` · ${new Date(p.date).toLocaleDateString()}`}
              </p>
              {p.excerpt && <p className="mt-3 text-gray-700">{p.excerpt}</p>}
              <div className="mt-4 flex gap-4">
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    View online →
                  </a>
                )}
                {p.pdfUrl && (
                  <a href={p.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    PDF ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
