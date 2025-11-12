import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PortableText } from "@portabletext/react";

import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import { fetchLandingPage } from "../lib/sanity";

// if you already have shared ptComponents somewhere, import and re-use that instead
const ptComponents = {
  block: {
    h1: ({ children }) => <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">{children}</h2>,
    h2: ({ children }) => <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mt-8 mb-3">{children}</h3>,
    h3: ({ children }) => <h4 className="text-xl md:text-2xl font-semibold text-slate-900 mt-6 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="text-slate-700 leading-7 my-5 whitespace-pre-wrap first:mt-0 last:mb-0">{children}</p>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-700">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="underline text-nu-blue">
        {children}
      </a>
    ),
  },
};

export default function PolicyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const project = useMemo(() => {
    if (!data?.projects?.length) return null;
    return data.projects.find(p => (p?.slug?.current ?? p?.slug) === slug) || null;
  }, [data, slug]);

  useEffect(() => {
    let live = true;
    fetchLandingPage()
      .then(d => live && setData(d))
      .catch(e => live && setErr(e?.message || "Failed to load"));
    return () => { live = false; };
  }, []);

  return (
    <>
      <Navbar
        siteTitle={data?.siteTitle || "AI Projects - National University"}
        logoUrl={data?.logoUrl}
        active="projects"
      />

      <Hero
        kicker={project?.status || data?.heroKicker}
        title={project?.subtitle || data?.heroTitle}
        sub={project?.summary || project?.subtitle || data?.heroSub}
        ctaText={project?.href ? "Visit project site" : data?.heroCtaText}
        ctaHref={project?.href || data?.heroCtaHref}
      />

      {!data && !err && (
        <section className="section"><div className="container section-pad">Loading…</div></section>
      )}
      {err && (
        <section className="section"><div className="container section-pad text-red-600">Error: {err}</div></section>
      )}

      {data && !project && (
        <section className="section bg-white">
          <div className="container section-pad text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Project not found</h2>
            <p className="mt-3 text-slate-600">We couldn't find a project for “{slug}”.</p>
            <button
              onClick={() => navigate("/", { state: { section: "projects" } })}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              ← Back to Projects
            </button>
          </div>
        </section>
      )}

      {data && project && (
        <section className="section bg-white">
          <div className="container section-pad">
            <div className="mb-6">
              <button
                onClick={() => navigate(`/projects/${slug}`)}
                className="text-sm underline hover:no-underline"
              >
                ← Back to {project.title}
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {project.title}: Policy
            </h1>
            <p className="mt-2 text-slate-600">Privacy policy and related notices for this project.</p>

            {project?.privacyPolicy?.length ? (
              <div className="mt-8 prose prose-slate max-w-none">
                <PortableText value={project.privacyPolicy} components={ptComponents} />
              </div>
            ) : (
              <div className="mt-8 text-slate-600">No policy published yet.</div>
            )}
          </div>
        </section>
      )}

      <div className="h-16" />
    </>
  );
}
