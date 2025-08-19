// components/Projects.jsx
import ProjectCard from "./cards/ProjectCards";

export default function Projects({ items = [] }) {
  return (
    <section id="projects" className="section scroll-mt-24 bg-white">
      <div className="container section-pad">
        {/* Section heading */}
        <header className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Our Projects
          </h2>
        </header>

        {/* Empty / loading state */}
        {!items?.length && (
          <p className="mt-12 text-center text-slate-500">
            Projects will appear here once added in Sanity.
          </p>
        )}

        {/* Cards */}
        {!!items?.length && (
          <div className="mt-10">
            {/*
              Centered rows, up to 3 cards per row.
              The wrapper width fits 3 cards + gaps (adjust if you tweak card width/gap).
            */}
            <div className="mx-auto max-w-[1260px] flex flex-wrap justify-center gap-8">
              {items.map((p, i) => (
                <ProjectCard
                  key={p._id || i}
                  title={p.title}
                  subtitle={p.subtitle}
                  summary={p.summary}
                  tags={p.tags}
                  href={p.href}
                  imageUrl={p.imageUrl}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
