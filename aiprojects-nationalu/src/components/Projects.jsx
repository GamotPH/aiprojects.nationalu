// components/Projects.jsx
import ProjectCard from "./cards/ProjectCards";

// add this helper (or import one if you already have it)
const slugify = (s = "") =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Projects({ items = [] }) {
  const len = items.length;

  return (
    <section id="projects" className="section scroll-mt-24 bg-white">
      <div className="container section-pad">
        <header className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Our Projects
          </h2>
        </header>

        {!len && (
          <p className="mt-12 text-center text-slate-500">
            Projects will appear here once added in Sanity.
          </p>
        )}

        {!!len && (
          <div className="mt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 items-stretch">
                {items.map((p, i) => {
                  const isLast = i === len - 1;

                  const centerOn2Col =
                    isLast && len % 2 === 1
                      ? "sm:col-span-2 sm:flex sm:justify-center lg:col-span-1 lg:justify-self-auto"
                      : "";

                  const innerWidth =
                    isLast && len % 2 === 1
                      ? "sm:w-[calc(50%-1rem)] md:w-[calc(50%-1rem)] lg:w-auto"
                      : "";

                  const centerOn3Col =
                    isLast && len % 3 === 1 ? "lg:col-start-2" : "";

                  const slug =
                    (typeof p.slug === "string" && p.slug) ||
                    (p.slug?.current) ||
                    slugify(p.title || `project-${i}`);


                  return (
                    <div key={p._id || i} className={`h-full ${centerOn2Col} ${centerOn3Col}`}>
                      <div className={`h-full ${innerWidth}`}>
                        <ProjectCard
                          title={p.title}
                          subtitle={p.subtitle}
                          summary={p.summary}
                          tags={p.tags}
                          href={p.href}
                          imageUrl={p.imageUrl}
                          className="h-full"
                          slug={slug}           
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
