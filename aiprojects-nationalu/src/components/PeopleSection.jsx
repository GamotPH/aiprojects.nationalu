import React, { useEffect, useMemo, useState } from "react";

const slugify = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 96);

export default function PeopleSection({ items }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];

  // sort by displayOrder then name
  const people = useMemo(
    () =>
      [...list].sort((a, b) => {
        const ao = Number.isFinite(a?.displayOrder) ? a.displayOrder : 1e9;
        const bo = Number.isFinite(b?.displayOrder) ? b.displayOrder : 1e9;
        if (ao !== bo) return ao - bo;
        return (a?.name || "").localeCompare(b?.name || "");
      }),
    [list]
  );

  const [active, setActive] = useState(null);

  // open via hash #people/<slug>
  useEffect(() => {
    if (!location.hash.startsWith("#people/") || people.length === 0) return;
    const wanted = location.hash.replace("#people/", "");
    const found =
      people.find(p => p?.slug?.current === wanted) ||
      people.find(p => slugify(p?.name) === wanted);
    if (found) setActive(found);
  }, [people]);

  const onSelect = (p) => {
    setActive(p);
    const s = p?.slug?.current || slugify(p?.name || "");
    if (s) history.replaceState(null, "", `#people/${s}`);
    queueMicrotask(() => {
      document.getElementById("bionote-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const onClear = () => {
    setActive(null);
    if (location.hash.startsWith("#people/")) history.replaceState(null, "", "#people");
  };

  // make the first card “featured” (2x) like your reference
  const featuredId = people[0]?._id;

  return (
    <section id="people" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl sm:text-4xl font-bold mb-10">People</h2>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {people.map((m) => {
          const isFeatured = m._id === featuredId;
          const col = isFeatured ? "lg:col-span-2" : "lg:col-span-1";
          const row = isFeatured ? "lg:row-span-2" : "lg:row-span-1";
          const aspect = isFeatured ? "aspect-[3/2]" : "aspect-square";
          const isActive = active?._id === m._id;

          return (
            <button
              key={m._id}
              onClick={() => onSelect(m)}
              className={[
                "relative group bg-white border border-gray-200 rounded-xl overflow-hidden text-left",
                "transition shadow-sm hover:shadow-md",
                col, row, aspect,
                isActive ? "ring-2 ring-blue-500 border-blue-500" : ""
              ].join(" ")}
            >
              {/* top-right image */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2">
                {m.photoUrl ? (
                  <img
                    src={m.photoUrl}
                    alt={m.name || "Member"}
                    className={[
                      "w-full h-full transition",
                      isFeatured ? "object-contain" : "object-cover",
                      "grayscale group-hover:grayscale-0"
                    ].join(" ")}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>

              {/* bottom-left text */}
              <div className="absolute bottom-6 left-6 pr-6">
                <h3 className={["font-bold leading-tight", isFeatured ? "text-2xl md:text-3xl" : "text-lg", "group-hover:text-blue-600"].join(" ")}>
                  {m.name || "—"}
                </h3>
                {m.role && (
                  <p className={[isFeatured ? "text-lg md:text-xl text-gray-700" : "text-sm text-gray-600", "group-hover:text-blue-500"].join(" ")}>
                    {m.role}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* bionote panel */}
      <div id="bionote-panel" className="mt-10">
        {active ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-60 shrink-0">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50">
                  {active.photoUrl && <img src={active.photoUrl} alt={active.name} className="w-full h-full object-cover" />}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold">{active.name}</h3>
                    {active.role && <p className="text-blue-600 font-medium mt-1">{active.role}</p>}
                  </div>
                  <button
                    onClick={onClear}
                    className="ml-auto rounded-lg px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    Close
                  </button>
                </div>

                {active.overviewTitle && (
                  <p className="mt-6 text-xs font-semibold tracking-widest text-pink-600">
                    {active.overviewTitle}
                  </p>
                )}
                {active.overviewText && (
                  <div className="mt-2 space-y-4 text-gray-800 leading-relaxed">
                    {active.overviewText.split(/\n{2,}/).map((para, idx) => <p key={idx}>{para}</p>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Click a person to view their bionote.</p>
        )}
      </div>
    </section>
  );
}
