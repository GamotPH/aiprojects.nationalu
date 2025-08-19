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
        // ✅ Uniform width + height (adjust numbers to taste)
        "w-[360px] sm:w-[380px] lg:w-[396px]",
        "h-[520px] sm:h-[540px] lg:h-[560px]",
        "group rounded-2xl border border-slate-100 bg-white shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        "overflow-hidden flex flex-col",
        className,
      ].join(" ")}
    >
      {/* Top image area (uniform height) */}
      <div className="relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
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
          <ul className="mt-1 flex flex-wrap gap-2">
            {tags.map((t, idx) => (
              <li
                key={`${t}-${idx}`}
                className="text-xs rounded-full bg-slate-100 text-slate-700 px-2.5 py-1"
              >
                {t}
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
            className="block w-full text-center rounded-lg bg-white text-nu-blue font-medium border border-slate-200 shadow-sm px-4 py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Live View
          </a>
        </div>
      </div>
    </article>
  );
}
