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

      {/* Research rows — full bleed only on large for nicer mobile gutters */}
      {showResearch && (
        <div className="lg:w-screen lg:max-w-none lg:mx-[calc(50%-50vw)]">
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

          {/* Row 1: three compact feature cards (equal height, better mobile sizing) */}
          {/* Row 1: three compact feature cards — centered last card on small/tablet */}
<div className="mt-8 flex flex-wrap justify-center gap-5 sm:gap-6 lg:grid lg:grid-cols-3 lg:gap-6 items-stretch">
  {top.map((f, i) => (
    <CompactCard
      key={i}
      title={f.title}
      body={f.body}
      iconUrl={f.iconUrl}
      // On small/tablet: two per row with equal width; the 3rd will wrap and be centered
      // On lg+: grid takes over and width is auto
      className="w-full sm:w-[calc(50%-0.75rem)] lg:w-auto"
    />
  ))}
</div>


          {/* Row 2: two banners (kept within container; responsive spacing) */}
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

/* ---------- Research tiles ---------- */
function Tile({ data, blue, center = false }) {
  if (!data) return <div className="hidden md:block bg-slate-50" aria-hidden />;

  const { title, body, iconUrl } = data;

  return (
    <article
      className={[
        "min-h-[220px] md:min-h-[300px] px-6 py-10 md:px-12 md:py-14",
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
              "h-16 w-16 md:h-24 md:w-24 object-contain",
              blue ? "filter invert brightness-0" : "",
            ].join(" ")}
            loading="lazy"
          />
        ) : (
          <div
            className={[
              "h-16 w-16 md:h-24 md:w-24 rounded-md",
              blue ? "bg-white/20" : "bg-nu-blue/10",
            ].join(" ")}
            aria-hidden
          />
        )}

        <h3
          className={[
            "font-semibold leading-snug text-lg md:text-2xl",
            blue ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {title || "—"}
        </h3>
      </div>

      {body && (
        <p
          className={[
            "mt-4 text-sm md:text-base leading-relaxed",
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

/* ---------- Applications UI ---------- */
function CompactCard({ title, body, iconUrl, className = "" }) {
  return (
    <article
      className={[
        "h-full rounded-xl border border-slate-200 bg-white p-5 sm:p-6",
        "shadow-card/30 hover:shadow-card transition-shadow",
        "flex flex-col items-center text-center",
        className,
      ].join(" ")}
    >
      {iconUrl && (
        <img
          src={iconUrl}
          alt=""
          className="mx-auto mb-4 h-16 w-16 sm:h-20 sm:w-20 object-contain"
          loading="lazy"
        />
      )}
      <h4 className="text-base sm:text-lg md:text-xl font-semibold text-ink">{title}</h4>
      {body && <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>}
      <div className="mt-auto" />
    </article>
  );
}


function BannerCard({ title, body, iconUrl }) {
  return (
    <article className="rounded-xl bg-gradient-to-r from-nu-blue to-nu-blue-600 px-6 py-8 md:px-8 md:py-12 text-white shadow-card">
      <div className="flex items-center md:items-start gap-4 md:gap-6">
        {iconUrl && (
          <img
            src={iconUrl}
            alt=""
            className="h-16 w-16 md:h-20 md:w-20 object-contain"
            loading="lazy"
          />
        )}
        <div className="flex-1">
          <h4 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">{title}</h4>
          {body && <p className="mt-2 md:mt-3 text-white/90 leading-relaxed">{body}</p>}
        </div>
      </div>
    </article>
  );
}
