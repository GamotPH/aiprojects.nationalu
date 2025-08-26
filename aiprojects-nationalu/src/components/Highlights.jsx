// components/Highlights.jsx
export default function Highlights({ items = [], apps = [] }) {
  // --- Research Highlights (existing) ---
  const cleaned = (Array.isArray(items) ? items : [])
    .filter(Boolean)
    .filter((h) => h.title || h.body || h.iconUrl);

  // group into pairs (rows)
  const pairs = [];
  for (let i = 0; i < cleaned.length; i += 2) pairs.push(cleaned.slice(i, i + 2));

  // --- Applications (moved here) ---
  const arr = Array.isArray(apps) ? apps.filter(Boolean) : [];
  // Normalize to objects
  const normalizedApps = arr.map((it) => (typeof it === "string" ? { title: it } : it));
  const top = normalizedApps.slice(0, 3);    // small cards
  const bottom = normalizedApps.slice(3, 5); // two banners

  const showResearch = cleaned.length > 0;
  const showApps = normalizedApps.length > 0;

  if (!showResearch && !showApps) return null;

  return (
    <section id="research" className="section scroll-mt-20">
      {/* Research heading */}
      {showResearch && (
        <div className="container section-pad pb-6">
          <header className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Research Highlights
            </h2>
          </header>
        </div>
      )}

      {/* Research rows (full-bleed) */}
      {showResearch && (
        <div className="w-screen max-w-none mx-[calc(50%-50vw)]">
          {pairs.map((pair, rowIdx) => {
            const blueOnLeft = rowIdx % 2 === 0;
            const [left, right] = pair;
            const isLastSingle = pair.length === 1 && rowIdx === pairs.length - 1;

            return (
              <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2">
                {isLastSingle ? (
                  <div className="md:col-span-2">
                    <Tile data={left} blue={blueOnLeft} center />
                  </div>
                ) : (
                  <>
                    <Tile data={left} blue={blueOnLeft} />
                    {right ? (
                      <Tile data={right} blue={!blueOnLeft} />
                    ) : (
                      <div className="hidden md:block bg-slate-50" aria-hidden />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Applications (inside Research section) */}
      {showApps && (
        <div className={`container ${showResearch ? "pt-14 md:pt-16" : "section-pad pt-4"}`}>
          <header className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Real-World Applications
            </h3>
          </header>

          {/* Row 1: three compact feature cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((f, i) => (
              <CompactCard key={i} title={f.title} body={f.body} iconUrl={f.iconUrl} />
            ))}
          </div>

          {/* Row 2: two banners (full width inside container) */}
          {bottom.length > 0 && (
            <div className="py-6">
              <div className="grid gap-6 md:grid-cols-2">
                {bottom.map((f, i) => (
                  <BannerCard key={i} title={f.title} body={f.body} iconUrl={f.iconUrl} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------- Research tiles (unchanged) ---------- */
function Tile({ data, blue, center = false }) {
  if (!data) return <div className="hidden md:block bg-slate-50" aria-hidden />;

  const { title, body, iconUrl } = data;

  return (
    <article
      className={[
        "min-h-[260px] md:min-h-[300px] px-6 py-10 md:px-12 md:py-14",
        "flex flex-col justify-center",
        blue ? "bg-nu-blue text-white" : "bg-slate-50 text-ink",
        center ? "md:text-center" : "",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-5 md:gap-6",
          center ? "md:justify-center" : "",
        ].join(" ")}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className={[
              "h-[4.75rem] w-[4.75rem] md:h-24 md:w-24 object-contain",
              blue ? "filter invert brightness-0" : "",
            ].join(" ")}
          />
        ) : (
          <div
            className={[
              "h-[4.75rem] w-[4.75rem] md:h-24 md:w-24 rounded-md",
              blue ? "bg-white/20" : "bg-nu-blue/10",
            ].join(" ")}
            aria-hidden
          />
        )}

        <h3
          className={[
            "font-semibold leading-snug text-xl md:text-2xl",
            blue ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {title || "—"}
        </h3>
      </div>

      {body && (
        <p
          className={[
            "mt-4 text-base leading-relaxed",
            blue ? "text-white/90" : "text-slate-600",
            center ? "md:text-center" : "",
          ].join(" ")}
        >
          {body}
        </p>
      )}
    </article>
  );
}

/* ---------- Applications UI (moved here) ---------- */
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
      <h4 className="text-lg md:text-xl font-semibold text-ink">{title}</h4>
      {body && <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>}
    </article>
  );
}

function BannerCard({ title, body, iconUrl }) {
  return (
    <article className="rounded-xl bg-gradient-to-r from-nu-blue to-nu-blue-600 px-8 py-10 md:py-12 text-white shadow-card">
      <div className="flex items-center md:items-start gap-6 md:gap-8">
        {iconUrl && (
          <img src={iconUrl} alt="" className="h-24 w-24 md:h-28 md:w-28 object-contain" />
        )}
        <div className="flex flex-col justify-center">
          <h4 className="text-xl md:text-2xl font-semibold leading-tight">{title}</h4>
          {body && <p className="mt-3 text-white/90 leading-relaxed">{body}</p>}
        </div>
      </div>
    </article>
  );
}
