// components/Hero.jsx
import React from "react";
import aiIcon from "../assets/AIdoc.png";

// three images
import bg1 from "../assets/nubuilding1.png";
import bg2 from "../assets/nubuilding2.jpg";
import bg3 from "../assets/nubuilding3.jpg";

export default function Hero({
  kicker,
  title,
  sub,
  ctaText = "Read More",
  ctaHref = "#projects",
  bgImage = bg1,
  bgImage2 = bg2,
  bgImage3 = bg3,
  personName = "Dr. Mideth Abisado",
}) {
  return (
    <section
      id="home"
      className="relative isolate scroll-mt-20 text-white overflow-hidden min-h-[100svh]"
      style={{
        paddingTop: "7rem",
        minHeight: "calc(100svh - 5rem)",
        "--cycle": "15s", // 3 images × 5s each
      }}
    >
      {/* --- animated background stack --- */}
      <div
        className="hero-bg anim delay-1 z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />
      <div
        className="hero-bg anim delay-2 z-0"
        style={{ backgroundImage: `url(${bgImage2})` }}
        aria-hidden="true"
      />
      <div
        className="hero-bg anim delay-3 z-0"
        style={{ backgroundImage: `url(${bgImage3})` }}
        aria-hidden="true"
      />

      {/* gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(6,45,95,.65), rgba(4,33,70,.95))",
        }}
        aria-hidden="true"
      />

{/* Floating person + name bar, both bottom-0 and the same width */}
<figure
  className="
    absolute bottom-0 right-12 z-[2]
    w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px]
    pointer-events-none select-none
  "
>
  <img
    src={aiIcon}
    alt={personName}
    className="block w-full h-auto drop-shadow-2xl"
  />

  {personName && (
  // Left edge fixed at 0, right edge pulled in a bit (tweak % as needed)
  <figcaption
    className="
      absolute left-0 bottom-0
     right-[58px] md:right-[72px] lg:right-[186px]
    "
  >
    <span
      className="
        block w-full
        px-5 py-3
        bg-[#0B2F6B] text-white
        text-sm sm:text-base md:text-2xl font-serif font-semibold leading-none
        rounded-t-md shadow-lg
      "
    >
      {personName}
    </span>
  </figcaption>
)}

</figure>
      {/* Content */}
      <div className="relative z-[2]">
        <div className="container px-6 lg:px-8">
          <div className="py-20 md:py-24 lg:py-28 max-w-3xl">
            {kicker && (
              <p className="mb-4 text-sm uppercase tracking-wide text-white/80">
                {kicker}
              </p>
            )}

            <h1 className="text-4xl md:text-5xl/[1.15] font-bold">
              {title ?? (
                <>
                  Empowering Communities
                  <br />
                  Through <span className="text-white">Language Technology</span>
                </>
              )}
            </h1>

            {sub && <p className="mt-5 leading-relaxed text-white/90">{sub}</p>}

            {ctaText && (
              <a
                href={ctaHref}
                className="inline-block mt-8 rounded-lg bg-white px-6 py-3 font-semibold text-nu-blue shadow hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
