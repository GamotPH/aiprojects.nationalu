// components/cards/ProjectCards.jsx
import React from "react";

/** Split the title so the first word can be bolded/colored */
function splitTitle(text = "") {
  const parts = text.trim().split(/\s+/);
  if (!parts.length) return ["", ""];
  const [first, ...rest] = parts;
  return [first, rest.join(" ")];
}

export default function ProjectCard({
  title = "",
  subtitle = "",
  tags = [],
  href = "#",           // e.g. https://gamotph.aiproject-nationalu.com
  imageUrl,
  className = "",
  newTab = false,       // set true if you want it to open in a new tab
}) {
  const [first, rest] = splitTitle(title);
  const target = newTab ? "_blank" : undefined;
  const rel = newTab ? "noopener noreferrer" : undefined;

  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title ? `Open ${title}` : "Open project"}
      className={[
        "group block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-blue/40",
        className,
      ].join(" ")}
    >
      <article
        className={[
          "w-full h-full",
          "relative rounded-2xl bg-white shadow-sm border border-slate-100",
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          "overflow-hidden flex flex-col",
        ].join(" ")}
      >
        {/* Top image */}
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || "Project image"}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-48 w-full bg-slate-100" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:to-black/5 transition-colors" />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-6 flex-1 min-h-0">
          {/* Title + subtitle */}
          <div className="min-h-0">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:underline">
              <span className="text-nu-blue font-bold">{first}</span>
              {rest ? ` ${rest}` : ""}
            </h3>

            {subtitle && (
              <p
                className="mt-1 text-slate-600"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Tags */}
          {!!tags?.length && (
            <ul className="mt-1 flex flex-wrap gap-2 min-h-[44px]">
              {tags.slice(0, 3).map((t, idx) => (
                <li
                  key={`${t}-${idx}`}
                  className="inline-flex items-center h-7 px-3 rounded-full bg-slate-100 text-slate-700 text-xs font-medium leading-none whitespace-nowrap"
                  title={t?.trim?.() || t}
                >
                  {(t?.trim?.() ?? t) || ""}
                </li>
              ))}
            </ul>
          )}

          {/* Spacer to keep heights consistent */}
          <div className="flex-1" />
        </div>

        {/* Invisible overlay ensures any click triggers the link (not strictly necessary, but nice) */}
        <span className="absolute inset-0" aria-hidden="true" />
      </article>
    </a>
  );
}
