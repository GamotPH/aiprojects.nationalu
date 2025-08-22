// components/Hero.jsx
import React from "react";

// background images
import bg1 from "../assets/nubuilding1.png";
import bg2 from "../assets/nubuilding2.jpg";
import bg3 from "../assets/nubuilding3.jpg";
import robotGif from "../assets/robot.gif";

export default function Hero({
  kicker,
  title,
  sub,
  ctaText = "Read More",
  ctaHref = "#research",
  bgImage = bg1,
  bgImage2 = bg2,
  bgImage3 = bg3,
}) {
  return (
    <section
      id="home"
      className="relative isolate scroll-mt-20 text-white overflow-hidden min-h-[100svh] pb-10 sm:pb-12 md:pb-12 xl:pb-16"
      style={{
        paddingTop: "10rem",
        minHeight: "calc(100svh - 5rem)",
        "--cycle": "15s",
      }}
    >
      {/* Animated background stack */}
      <div className="hero-bg anim delay-1 z-0" style={{ backgroundImage: `url(${bgImage})` }} aria-hidden="true" />
      <div className="hero-bg anim delay-2 z-0" style={{ backgroundImage: `url(${bgImage2})` }} aria-hidden="true" />
      <div className="hero-bg anim delay-3 z-0" style={{ backgroundImage: `url(${bgImage3})` }} aria-hidden="true" />

      {/* gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(6,45,95,.65), rgba(4,33,70,.95))" }}
        aria-hidden="true"
      />

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

          {/* INLINE robot — phones, tablets, and smaller desktops (prevents overlap) */}
          <div className="xl:hidden mt-4 sm:mt-6 md:mt-8 flex justify-center">
            <img
              src={robotGif}
              alt=""
              className="pointer-events-none select-none block h-auto
                         w-[min(420px,70vw)] sm:w-[min(460px,60vw)] md:w-[min(520px,55vw)] 
                         drop-shadow-2xl rounded-xl"
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* OVERLAY robot — only when there’s ample width (≥1280px), so it never hits the text */}
      <figure
        className="
          hidden xl:block
          absolute bottom-45 right-12 z-[2]
          w-[clamp(260px,28vw,520px)]
          pointer-events-none select-none
        "
        aria-hidden="true"
      >
        <img
          src={robotGif}
          alt=""
          className="block w-full h-auto drop-shadow-2xl rounded-xl"
          draggable="false"
        />
      </figure>
    </section>
  );
}
