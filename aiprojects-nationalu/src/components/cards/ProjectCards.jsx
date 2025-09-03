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
  href = "#",
  imageUrl,
  className = "",
}) {
  const [first, rest] = splitTitle(title);

  return (
    <article
      className={[
        // Fill the grid column and keep consistent height
        "w-full h-full",
        "min-h-[520px] sm:min-h-[540px] lg:min-h-[560px]",
        // Card chrome
        "group rounded-2xl bg-white shadow-sm border border-slate-100",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        "overflow-hidden flex flex-col",
        // Better keyboard focus
        "focus-within:ring-2 focus-within:ring-nu-blue/30",
        className,
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
          <h3 className="text-lg font-semibold text-slate-900">
            <span className="text-nu-blue font-bold">{first}</span>
            {rest ? ` ${rest}` : ""}
          </h3>

          {subtitle && (
            <p
              className="mt-1 text-slate-600"
              // Clamp to 3 lines without Tailwind plugin
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
  <ul className="mt-1 flex flex-wrap gap-2 min-h-[44px]">  {/* reserve space */}
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


        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="pt-2">
          <a
            href={href || "#"}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener noreferrer" : undefined}
            className="block w-full text-center rounded-lg bg-white text-nu-blue font-medium border border-slate-200 shadow-sm px-4 py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-blue/40"
            aria-label={title ? `Open ${title}` : "Open project"}
          >
            Live View
          </a>
        </div>
      </div>
    </article>
  );
}
