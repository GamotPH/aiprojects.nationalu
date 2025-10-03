// components/cards/ProjectCards.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

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
  href = "",           // external URL from Sanity (preferred if present)
  slug,                // string or { current }
  imageUrl,
  className = "",
  newTab = true,       // open EXTERNAL links in a new tab by default
}) {
  const navigate = useNavigate();
  const [first, rest] = splitTitle(title);

  // Resolve slug robustly (string or {current}); leave undefined if missing
  const effectiveSlug =
    typeof slug === "string" ? slug : slug?.current ? slug.current : undefined;

  // Decide link target: prefer EXTERNAL if provided, else INTERNAL
  const hasExternal = !!href && href !== "#" && href.trim() !== "";
  const internalTo = effectiveSlug ? `/projects/${effectiveSlug}` : undefined;

  const linkClass = [
    "group block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-blue/40",
    className,
  ].join(" ");

  const ariaBase = title ? `Open ${title}` : "Open project";
  const aria = hasExternal ? `${ariaBase} (external)` : ariaBase;

  // Fallback click (only kicks in if we're NOT rendering <a> or <Link>)
  const handleArticleClick = (e) => {
    if (!hasExternal && internalTo) {
      navigate(internalTo);
    }
  };

  // Wrapper chooses <a> (external) or <Link> (internal) or <div> (no link)
  const Wrapper = ({ children }) =>
    hasExternal ? (
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        aria-label={aria}
        className={linkClass}
        title={href}
        data-link-type="external"
      >
        {children}
      </a>
    ) : internalTo ? (
      <Link
        to={internalTo}
        aria-label={aria}
        className={linkClass}
        data-link-type="internal"
      >
        {children}
      </Link>
    ) : (
      <div className={linkClass} aria-label="No link available" data-link-type="none">
        {children}
      </div>
    );

  return (
    <Wrapper>
      <article
        onClick={handleArticleClick}
        className={[
          "w-full h-full cursor-pointer",
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

        {/* Invisible overlay ensures any click triggers the link (within Wrapper) */}
        <span className="absolute inset-0" aria-hidden="true" />
      </article>
    </Wrapper>
  );
}
