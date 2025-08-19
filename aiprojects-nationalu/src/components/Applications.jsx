// components/Applications.jsx
/**
 * Accepts either:
 * - string[]  (titles only)   -> top 3 + bottom 2
 * - {title, body?, iconUrl?}[]  -> richer content
 */
export default function Applications({ items = [] }) {
  const arr = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!arr.length) return null;

  // Normalize to objects
  const normalized = arr.map((it) =>
    typeof it === "string" ? { title: it } : it
  );

  // Split: 3 compact cards (top), 2 banners (bottom)
  const top = normalized.slice(0, 3);
  const bottom = normalized.slice(3, 5);

  return (
    <section id="application" className="section scroll-mt-20 bg-white">
      {/* Heading (kept inside container) */}
      <div className="container section-pad pb-6">
        <header className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Real‑World Applications
          </h2>
        </header>

        {/* Row 1: three compact feature cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((f, i) => (
            <CompactCard
              key={i}
              title={f.title}
              body={f.body}
              iconUrl={f.iconUrl}
            />
          ))}
        </div>
      </div>

      {/* Row 2: full‑width 2 banners */}
      {bottom.length > 0 && (
        <div className="w-screen max-w-none mx-[calc(50%-50vw)]">
          <div className="container py-6">
            <div className="grid gap-6 md:grid-cols-2">
              {bottom.map((f, i) => (
                <BannerCard
                  key={i}
                  title={f.title}
                  body={f.body}
                  iconUrl={f.iconUrl}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Small feature (top row) ---------- */
function CompactCard({ title, body, iconUrl }) {
  return (
    <article className="text-center">
      {iconUrl && (
        <img
          src={iconUrl}
          alt=""
          className="mx-auto mb-6 h-24 w-24 md:h-28 md:w-28 object-contain"
        />
      )}

      <h3 className="text-lg md:text-xl font-semibold text-ink">{title}</h3>

      {body && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
      )}
    </article>
  );
}

/* ---------- Wide gradient banner (bottom row) ---------- */
function BannerCard({ title, body, iconUrl }) {
  return (
    <article className="rounded-xl bg-gradient-to-r from-nu-blue to-nu-blue-600 px-8 py-10 md:py-12 text-white shadow-card">
      <div className="flex items-center md:items-start gap-6 md:gap-8">
        {/* Bigger icon */}
        {iconUrl && (
          <img
            src={iconUrl}
            alt=""
            className="h-24 w-24 md:h-28 md:w-28 object-contain"
          />
        )}

        <div className="flex flex-col justify-center">
          <h3 className="text-xl md:text-2xl font-semibold leading-tight">
            {title}
          </h3>
          {body && (
            <p className="mt-3 text-white/90 leading-relaxed">{body}</p>
          )}
        </div>
      </div>
    </article>
  );
}
