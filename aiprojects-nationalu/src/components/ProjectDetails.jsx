import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PortableText } from "@portabletext/react";

import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import { fetchLandingPage, sanity } from "../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanity);
const urlForImage = (source) => builder.image(source).auto("format");

// ------- PortableText components -------
const ptComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mt-8 mb-3">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-semibold text-slate-900 mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-slate-700 leading-7 my-5 whitespace-pre-wrap first:mt-0 last:mb-0">
        {children}
      </p>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-700">
        {children}
      </blockquote>
    ),
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
  types: {
    image: ({ value }) => {
      const src = value?.asset?._ref
        ? urlForImage(value).width(1600).url()
        : (value?.asset?.url || value?.url);
      return (
        <img
          src={src}
          alt={value?.alt || ""}
          className="rounded-xl border border-slate-100 my-4"
        />
      );
    },
  },
};

// ------- Helpers / constants -------
const slugify = (s = "") =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const HEADER_H = 80;
const PAD = 24;
const START_OFFSET = 80;

// article slug helper
const articleSlugOf = (a) => a?.slug?.current ?? a?.slug ?? slugify(a?.title || "");

// Hash parsing for routes like:
// #/projects/:slug
// #/projects/:slug/articles
// #/projects/:slug/articles/:articleSlug
const hashParts = (hash) =>
  (hash || window.location.hash || "").replace(/^#/, "").split("/").filter(Boolean);

const parseProjectArticlesPath = (hash, projectSlug) => {
  const p = hashParts(hash);
  const inProject   = p[0] === "projects" && p[1] === projectSlug;
  const inArticles  = inProject && p[2] === "articles";
  const articleSlug = inArticles && p[3] ? decodeURIComponent(p[3]) : null;
  return { inProject, inArticlesList: inArticles && !p[3], articleSlug };
};

// Pick a date field and return a sortable timestamp (newest first)
const articleTime = (a) => {
  const raw =
    a?.date ||
    a?.publishedAt ||
    a?.datePublished ||
    a?._createdAt ||
    a?._updatedAt;

  if (!raw) return 0;
  const t = Date.parse(raw);
  if (!Number.isNaN(t)) return t;

  // Fallback for bare YYYY-MM-DD strings
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : 0;
};


export default function ProjectDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnPolicyPage = (() => {
  const parts = (location.hash || "").replace(/^#/, "").split("/").filter(Boolean);
  return parts[0] === "projects" && parts[1] === slug && parts[2] === "policy";
})();


  const [data, setData] = useState(null);
  const [err,  setErr]  = useState(null);

  // queued section to scroll to after leaving article detail
  const [pendingSection, setPendingSection] = useState(null);

  // Track the sliding top of the main Navbar so we can dock just beneath it
  const [headerTop, setHeaderTop] = useState(START_OFFSET);
  useEffect(() => {
    const onScroll = () => setHeaderTop(Math.max(0, START_OFFSET - window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Where the local nav should dock, and scroll offset for anchors
  const stickyTop = headerTop + HEADER_H;
  const currentOffsetY = stickyTop + PAD;

  // Load landing page data
  useEffect(() => {
    let isMounted = true;
    fetchLandingPage()
      .then((d) => isMounted && setData(d))
      .catch((e) => setErr(e?.message || "Failed to load"));
    return () => { isMounted = false; };
  }, []);

  // Scroll to top (show hero) when landing on the base project page
  useEffect(() => {
    const { inArticlesList, articleSlug } = parseProjectArticlesPath(location.hash, slug);
    if (inArticlesList || articleSlug) return; // stay put inside articles views
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }));
  }, [slug, location.hash]);

  // Resolve current project
  const project = useMemo(() => {
    if (!data?.projects?.length) return null;
    for (const p of data.projects) {
      const s = p?.slug?.current ?? p?.slug ?? slugify(p?.title || "");
      if (s === slug) return p;
    }
    return null;
  }, [data, slug]);

  // Articles (prefer embedded array on the project)
const articles = useMemo(() => {
  let arr = [];
  if (project?.articles?.length) {
    arr = project.articles;
  } else if (data?.papers?.length && project?.title) {
    const key = project.title.toLowerCase();
    arr = data.papers.filter((paper) => {
      const hay = `${paper?.title || ""} ${paper?.citation || ""}`.toLowerCase();
      return hay.includes(key);
    });
  }
  // newest → oldest
  return arr.slice().sort((a, b) => articleTime(b) - articleTime(a));
}, [data, project]);


  // Partners (project-level, falling back to global)
  const partners = useMemo(() => {
    if (project?.partners?.length) return project.partners;
    return data?.partners || [];
  }, [data, project]);

  // ---------------------------
  // ARTICLE DETAILS (local page)
  // ---------------------------
  const [articleSlug, setArticleSlug] = useState(null);

  // Detect article detail from the hash and set the active tab early
  useEffect(() => {
    const { articleSlug } = parseProjectArticlesPath(location.hash, slug);
    setArticleSlug(articleSlug || null);
  }, [location.hash, slug]);

  const articleDetail = useMemo(
    () => (articleSlug ? articles.find((a) => articleSlugOf(a) === articleSlug) || null : null),
    [articles, articleSlug]
  );

  const inArticleDetail = !!articleDetail;

  // ------- Local nav (About / Articles / Partners) -------
  const sectionIds = ["about", "articles", "partners"];
  const [activeLocal, setActiveLocal] = useState("about");

  const scrollToWithOffset = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - currentOffsetY;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  // When a click happens while in a detail, queue the section and leave the detail first
  const goLocal = (id) => (e) => {
    e.preventDefault();

    if (id === "articles") {
      history.replaceState(null, "", `#/projects/${slug}/articles`);
      setArticleSlug(null);
      setActiveLocal("articles");
      // if we were in a detail, wait for list mount; otherwise scroll now
      if (inArticleDetail) setPendingSection("articles");
      else setTimeout(() => scrollToWithOffset("articles"), 0);
      return;
    }

    // About or Partners
    history.replaceState(null, "", `#/projects/${slug}`);
    setArticleSlug(null);
    setActiveLocal(id);
    if (inArticleDetail) setPendingSection(id);
    else setTimeout(() => scrollToWithOffset(id), 0);
  };

  // Perform the queued scroll once the detail view is gone and sections exist
  useEffect(() => {
    if (!pendingSection || inArticleDetail) return;
    const raf = requestAnimationFrame(() => {
      scrollToWithOffset(pendingSection);
      setPendingSection(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [pendingSection, inArticleDetail]);

  // Deep-link support (#about / #articles / #partners)
  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (!hash || !sectionIds.includes(hash)) return;
    setActiveLocal(hash);
    // if a detail is open, queue the scroll; else do it now
    if (inArticleDetail) {
      history.replaceState(null, "", `#/projects/${slug}`);
      setArticleSlug(null);
      setPendingSection(hash);
    } else {
      setTimeout(() => scrollToWithOffset(hash), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
  if (location.hash === "#policy") {
    navigate(`/projects/${slug}/policy`, { replace: true });
  }
  }, [location.hash, navigate, slug]);


  // Keep "Articles" active when viewing list (not detail)
  useEffect(() => {
    const { inArticlesList } = parseProjectArticlesPath(location.hash, slug);
    if (inArticlesList) {
      setActiveLocal("articles");
      setTimeout(() => scrollToWithOffset("articles"), 0);
    }
  }, [location.hash, slug]);

  // Scroll spy (skip while in a detail so the underline stays on Articles)
  useEffect(() => {
    if (inArticleDetail) {
      setActiveLocal("articles");
      return;
    }
    const spy = () => {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - currentOffsetY;
        if (top <= 1) current = id; else break;
      }
      setActiveLocal((prev) => (prev !== current ? current : prev));
    };
    spy();
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    return () => {
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", spy);
    };
  }, [currentOffsetY, inArticleDetail]);

  // ---- Sentinel-driven visibility + docking for local nav ----
  const sentinelRef = useRef(null);
  const dockRef = useRef(null);
  const [showLocalNav, setShowLocalNav] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [dockH, setDockH] = useState(0);

  // Smooth show/hide animation
  const [renderLocalNav, setRenderLocalNav] = useState(false);
  const [navEntered, setNavEntered] = useState(false);
  const [freezeDock, setFreezeDock] = useState(false);

  useEffect(() => {
    if (showLocalNav) {
      setFreezeDock(false);
      setRenderLocalNav(true);
      setNavEntered(false);
      const r = requestAnimationFrame(() => setNavEntered(true));
      return () => cancelAnimationFrame(r);
    } else {
      setFreezeDock(true);
      setNavEntered(false);
      const t = setTimeout(() => {
        setRenderLocalNav(false);
        setFreezeDock(false);
      }, 260);
      return () => clearTimeout(t);
    }
  }, [showLocalNav]);

  useEffect(() => {
    const measure = () => {
      if (dockRef.current) setDockH(dockRef.current.offsetHeight || 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const top = entry.boundingClientRect.top;
        const before = top > stickyTop;
        const passed = top <= stickyTop;
        setShowLocalNav(!before);
        setIsDocked(passed);
      },
      { root: null, threshold: 0, rootMargin: `-${stickyTop}px 0px 0px 0px` }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [stickyTop]);

  // --- Article cover helpers ---
  const articleTopRef = useRef(null);
  const openArticle = (a) => (e) => {
    e.preventDefault();
    const s = articleSlugOf(a);
    history.replaceState(null, "", `#/projects/${slug}/articles/${s}`);
    setActiveLocal("articles");
    setArticleSlug(s);
    requestAnimationFrame(() => {
      const el = articleTopRef.current;
      if (!el) return;
      const y = window.scrollY + el.getBoundingClientRect().top - currentOffsetY;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    });
  };

  // Lightbox state & handlers
const [lightboxIndex, setLightboxIndex] = useState(null);
const openLightbox = (i) => setLightboxIndex(i);
const closeLightbox = () => setLightboxIndex(null);
const goLight = (step) =>
  setLightboxIndex((i) => (i + step + detailGallery.length) % detailGallery.length);



  const backToArticles = () => {
    history.replaceState(null, "", `#/projects/${slug}/articles`);
    setArticleSlug(null);
    setTimeout(() => scrollToWithOffset("articles"), 0);
  };

  const detailBody = useMemo(() => {
    if (!articleDetail) return null;
    return (
      articleDetail.body ||
      articleDetail.content ||
      articleDetail.richText ||
      articleDetail.blocks ||
      null
    );
  }, [articleDetail]);

  const detailGallery = useMemo(() => {
    if (!articleDetail) return [];
    const g = articleDetail.gallery || articleDetail.images || articleDetail.photos || [];
    return Array.isArray(g) ? g : [];
  }, [articleDetail]);

  const currentLight = useMemo(
  () => (lightboxIndex !== null ? detailGallery[lightboxIndex] : null),
  [lightboxIndex, detailGallery]
);

useEffect(() => {
  if (lightboxIndex === null) return;
  const onKey = (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % detailGallery.length);
    if (e.key === "ArrowLeft")  setLightboxIndex((i) => (i - 1 + detailGallery.length) % detailGallery.length);
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [lightboxIndex, detailGallery]);


  const imgUrl = (img) => img?.url || img?.imageUrl || img?.src || img?.asset?.url || null;

  // put under imgUrl
const thumbUrl = (img) =>
  img?.asset?._ref
    ? urlForImage(img).width(900).height(675).fit("crop").url() // fast, uniform 4:3 thumbs
    : imgUrl(img);
useEffect(() => {
  if (lightboxIndex === null) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => { document.body.style.overflow = prev; };
}, [lightboxIndex]);


  const coverObj =
    (articleDetail && (articleDetail.cover || articleDetail.coverImage || articleDetail.mainImage)) || null;

  const coverUrl = coverObj?.asset?._ref
    ? urlForImage(coverObj).width(2400).height(700).fit("crop").url()
    : (articleDetail?.coverUrl || null);

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
        <section className="section">
          <div className="container section-pad"><div>Loading…</div></div>
        </section>
      )}
      {err && (
        <section className="section">
          <div className="container section-pad"><div className="text-red-600">Error: {err}</div></div>
        </section>
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
        <>
          {/* sentinel for local nav position */}
          <div ref={sentinelRef} aria-hidden="true" />

          {/* LOCAL NAV */}
          {renderLocalNav && (
            <>
              {(() => {
                const dockedForAnim = freezeDock ? true : isDocked;
                const currentTab = inArticleDetail ? "articles" : activeLocal;
                return (
                  <div
                    ref={dockRef}
                    className={[
                      dockedForAnim ? "fixed left-0 right-0 z-40" : "relative z-40",
                      "transition-[opacity,transform] duration-250 ease-[cubic-bezier(.22,.61,.36,1)]",
                      "will-change-transform will-change-opacity",
                      navEntered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3",
                    ].join(" ")}
                    style={dockedForAnim ? { top: `${stickyTop}px` } : undefined}
                  >
                    <nav className="bg-white/70 backdrop-blur border-b border-slate-100 shadow-sm">
                      <div className="container">
                        <div className="flex items-center gap-6 py-3 text-sm">
                          {[
                            { id: "about", label: "About" },
                            { id: "articles", label: "Articles" },
                            { id: "partners", label: "Partners" },
                          ].map(({ id, label }) => {
                            const isActive = (inArticleDetail ? "articles" : activeLocal) === id && !isOnPolicyPage;
                            return (
                              <a
                                key={id}
                                href={`#${id}`}
                                onClick={goLocal(id)}
                                className={[
                                  "relative pb-2 transition-colors",
                                  isActive ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900",
                                ].join(" ")}
                                aria-current={isActive ? "page" : undefined}
                              >
                                {label}
                                <span
                                  className={[
                                    "pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full transition-all duration-200",
                                    isActive ? "w-8 bg-nu-blue" : "w-0 bg-slate-300",
                                  ].join(" ")}
                                />
                              </a>
                            );
                          })}

                          {/* Policy → route */}
                          <a
                            href={`#/projects/${slug}/policy`}
                            className={[
                              "relative pb-2 transition-colors",
                              isOnPolicyPage ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900",
                            ].join(" ")}
                            aria-current={isOnPolicyPage ? "page" : undefined}
                          >
                            Policy
                            <span
                              className={[
                                "pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full transition-all duration-200",
                                isOnPolicyPage ? "w-8 bg-nu-blue" : "w-0 bg-slate-300",
                              ].join(" ")}
                            />
                          </a>


                          <div className="ml-auto">
                            <button
                              onClick={inArticleDetail
                                ? backToArticles
                                : () => navigate("/", { state: { section: "projects" } })}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                            >
                              ← {inArticleDetail ? "Back to Articles" : "Back"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                );
              })()}
              {(isDocked || freezeDock) && <div style={{ height: dockH }} aria-hidden="true" />}
            </>
          )}

          {/* ===== ARTICLE DETAILS ===== */}
          {articleDetail ? (
            <>
              <div id="article-top" ref={articleTopRef} />
              <section className="relative bg-slate-200">
                <div className="relative h-[320px] md:h-[620px] overflow-hidden">
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt={articleDetail.title || "Cover"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-900/50" />
                  <div className="absolute inset-0">
                    <div className="container h-full">
                      <div className="h-full flex items-center">
                        <div className="pb-0">
                          {articleDetail.date && (
                            <div className="text-xs md:text-sm text-white/80 mb-1">
                              {articleDetail.date}
                            </div>
                          )}
                          <h1 className="text-2xl md:text-5xl font-semibold tracking-tight text-white">
                            {articleDetail.title}
                          </h1>
                          {articleDetail.excerpt && (
                            <h2 className="mt-3 max-w-3xl text-base md:text-xl text-white/90">
                              {articleDetail.excerpt}
                            </h2>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section bg-white">
                <div className="container section-pad">
                  <div className="grid grid-cols-1 gap-10 items-start">
                    <div className="lg:col-span-2 flex justify-center">
                      {Array.isArray(detailBody) ? (
                        <div className="prose prose-slate md:w-3/4 text-justify">
                          <PortableText value={detailBody} components={ptComponents} />
                        </div>
                      ) : detailBody ? (
                        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: detailBody }} />
                      ) : (
                        <p className="text-slate-600">No content yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

             <section className="section bg-white">
                <div className="container section-pad pt-0">
                  <div className="flex justify-center">
                    <div className="w-full md:w-3/4">
                      {/* Optional heading */}
                      {/* <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">Gallery</h3> */}

                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {detailGallery.map((img, i) => {
                          const u = thumbUrl(img); // or imgUrl(img) if you didn't add thumbUrl
                          if (!u) return null;
                          return (
                            <li key={(u || "") + i} className="group">
                              <button
                                type="button"
                                onClick={() => openLightbox(i)}
                                className="block w-full rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-sm transition
                                          hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nu-blue"
                              >
                                <div className="aspect-[4/3]">
                                  <img
                                    src={u}
                                    alt={img?.alt || `Gallery ${i + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition group-hover:scale-[1.02] select-none"
                                    draggable="false"
                                  />
                                </div>
                              </button>
                              {(img?.caption || img?.alt) && (
                                <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                                  {img.caption || img.alt}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {lightboxIndex !== null && currentLight && (
                <div
                  role="dialog"
                  aria-modal="true"
                  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 md:p-6
                            flex items-center justify-center"
                  onClick={closeLightbox}
                >
                  <div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[min(92vw,1100px)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close */}
                    <button
                      aria-label="Close"
                      onClick={closeLightbox}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-slate-700
                                grid place-items-center shadow ring-1 ring-slate-200 hover:bg-white"
                    >
                      ×
                    </button>

                    {/* Prev / Next */}
                    {detailGallery.length > 1 && (
                      <>
                        <button
                          aria-label="Previous"
                          onClick={() => goLight(-1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full
                                    bg-white/90 text-slate-700 grid place-items-center shadow ring-1 ring-slate-200
                                    hover:bg-white"
                        >
                          ‹
                        </button>
                        <button
                          aria-label="Next"
                          onClick={() => goLight(1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full
                                    bg-white/90 text-slate-700 grid place-items-center shadow ring-1 ring-slate-200
                                    hover:bg-white"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Counter */}
                    <div className="absolute left-4 top-3 text-xs text-slate-600 bg-white/90 rounded-full px-2 py-0.5 ring-1 ring-slate-200">
                      {(lightboxIndex ?? 0) + 1} / {detailGallery.length}
                    </div>

                    {/* Image */}
                    <img
                      src={
                        currentLight?.asset?._ref
                          ? urlForImage(currentLight).width(2000).url()
                          : imgUrl(currentLight)
                      }
                      alt={currentLight?.alt || ""}
                      className="w-full h-auto max-h-[76vh] object-contain rounded-t-2xl select-none"
                      draggable="false"
                    />

                    {/* Caption */}
                    {(currentLight?.caption || currentLight?.alt) && (
                      <div className="px-6 py-4 text-center text-sm text-slate-700">
                        {currentLight.caption || currentLight.alt}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* ===== BASE SECTIONS ===== */}
              <section id="about" className="section scroll-mt-24 bg-white">
                <div className="container section-pad">
                  <div className="grid grid-cols-1 gap-10 items-start">
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">About</h2>
                      {project.about?.length ? (
                        <div className="mt-6 prose prose-slate max-w-none text-justify">
                          <PortableText value={project.about} components={ptComponents} />
                        </div>
                      ) : project.summary ? (
                        <p className="mt-6 text-slate-700 leading-7 whitespace-pre-wrap">
                          {project.summary}
                        </p>
                      ) : null}
                      {project.href && (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
                        >
                          Visit project site ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section id="articles" className="section scroll-mt-24 bg-slate-50">
                <div className="container section-pad">
                  <div className="grid grid-cols-1 gap-10 items-start">
                    <div>
                      <header className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Articles</h2>
                        <p className="mt-2 text-slate-600">
                          {articles.length
                            ? project?.articles?.length
                              ? ""
                              : `Related papers mentioning “${project.title}”.`
                            : "No linked articles found yet."}
                        </p>
                      </header>

                      {articles.length > 0 ? (
                        <ul className="space-y-5">
                          {articles.map((p, i) => (
                            <li
                              key={p.slug || i}
                              className="w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                            >
                              <div className="flex items-start gap-4">
                                {p.coverUrl && (
                                  <img
                                    src={p.coverUrl}
                                    alt={p.title}
                                    className="w-24 h-24 object-cover rounded-lg border border-slate-100 flex-none"
                                  />
                                )}
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-slate-900">
                                    <a
                                      href={`#/projects/${slug}/articles/${articleSlugOf(p)}`}
                                      onClick={openArticle(p)}
                                      className="hover:underline"
                                    >
                                      {p.title}
                                    </a>
                                  </h3>
                                  {p.date && <p className="text-xs text-slate-500 mt-0.5">{p.date}</p>}
                                  {p.excerpt && (
                                    <div className="mt-2 text-sm text-slate-600 line-clamp-3">
                                      {p.excerpt}
                                    </div>
                                  )}
                                  <div className="mt-3 flex gap-3">
                                    {p.link && (
                                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-700 underline">
                                        View
                                      </a>
                                    )}
                                    {p.pdfUrl && (
                                      <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-700 underline">
                                        PDF
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-slate-600">
                          Connect articles to this project in Sanity to show them here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section id="partners" className="section scroll-mt-24 bg-white">
                <div className="container section-pad">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Partners</h2>
                  <p className="mt-2 text-slate-600">Project partners and supporters.</p>

                  {partners?.length ? (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-10 gap-y-8 place-items-center">
                      {partners
                        .filter((org) => org.logoUrl) // logos only
                        .map((org, i) => {
                          const img = (
                            <img
                              src={org.logoUrl}
                              alt={org.name || "Partner"}
                              className="mx-auto h-14 md:h-16 lg:h-20 w-auto object-contain max-w-[180px]" // uniform size
                              loading="lazy"
                            />
                          );
                          return org.href ? (
                            <a
                              key={org.name || i}
                              href={org.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                              title={org.name || undefined}
                            >
                              {img}
                            </a>
                          ) : (
                            <div key={org.name || i} className="block">
                              {img}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-6 text-slate-600">
                      No partners listed yet.
                    </div>
                  )}

                </div>
              </section>

            </>
          )}
        </>
      )}

      <div className="h-16" />
    </>
  );
}
