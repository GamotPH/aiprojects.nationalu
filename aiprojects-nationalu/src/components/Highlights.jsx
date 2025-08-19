// components/Highlights.jsx
export default function Highlights({ items = [] }) {
  const cleaned = (Array.isArray(items) ? items : [])
    .filter(Boolean)
    .filter((h) => h.title || h.body || h.iconUrl);

  if (!cleaned.length) return null;

  // group into pairs (rows)
  const pairs = [];
  for (let i = 0; i < cleaned.length; i += 2) pairs.push(cleaned.slice(i, i + 2));

  return (
    <section id="research" className="section scroll-mt-20">
      {/* Heading */}
      <div className="container section-pad pb-6">
        <header className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Research Highlights
          </h2>
        </header>
      </div>

      {/* Full-width rows */}
      <div className="w-screen max-w-none mx-[calc(50%-50vw)]">
        {pairs.map((pair, rowIdx) => {
          const blueOnLeft = rowIdx % 2 === 0;
          const [left, right] = pair;
          const isLastSingle = pair.length === 1 && rowIdx === pairs.length - 1;

          return (
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2">
              {isLastSingle ? (
                // Last row has one item -> span both columns and center content
                <div className="md:col-span-2">
                  <Tile data={left} blue={blueOnLeft} center />
                </div>
              ) : (
                <>
                  <Tile data={left} blue={blueOnLeft} />
                  {right ? (
                    <Tile data={right} blue={!blueOnLeft} />
                  ) : (
                    // filler keeps alternating background on full rows only
                    <div className="hidden md:block bg-slate-50" aria-hidden />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

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
