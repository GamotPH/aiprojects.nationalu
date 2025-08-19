// src/components/Collaborate.jsx
import React from "react";
import pchrd from "../assets/dost-pchrd-light.png";
import nu from "../assets/national-university.png";
import bagong from "../assets/bagong-pilipinas.png";
import gamotph from "../assets/gamotph-light.png";

const logos = [
  // Replace the src paths with your real assets
  { src: bagong, alt: "Bagong Pilipinas" },
  { src: pchrd, alt: "DOST PCHRD" },
  { src: nu, alt: "National University" },
  { src: gamotph, alt: "GAMOT PH" },
];

export default function Collaborate({
  email = "mbabisado@national-u.edu.ph",
  onBackToTop, // optional: pass a handler; falls back to window.scrollTo
}) {
  const handleBackToTop = () => {
    if (typeof onBackToTop === "function") {
      onBackToTop();
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section id="collaborate"
      aria-labelledby="collab-title"
      className="relative w-full overflow-hidden bg-[#0A2448] text-white scroll-mt-20"
    >
      {/* Thin gold top border */}
      <div className="h-1 w-full bg-[#C8A64B]" />

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2
          id="collab-title"
          className="text-3xl font-semibold tracking-tight md:text-5xl"
        >
          Collaborate with Us
        </h2>

        <p className="mt-6 max-w-5xl text-base leading-8 md:text-xl md:leading-9 text-white/90">
          We invite researchers, healthcare institutions, and tech developers
          to join us in building inclusive, AI-powered health solutions
          for every Filipino—regardless of language.
        </p>

        {/* Email pill */}
        <div className="mt-10 flex max-w-3xl items-stretch">
          {/* Icon block */}
          <div className="flex items-center justify-center rounded-l-lg bg-white/10 p-6">
            {/* Envelope icon (SVG) */}
            <svg
              className="h-10 w-10 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M4 7l8 6 8-6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Address block */}
          <a
            href={`mailto:${email}`}
            className="flex w-full items-center justify-start rounded-r-lg bg-white/10 px-6 py-5 text-lg outline-none ring-0 transition hover:bg-white/15"
          >
            <span className="select-all break-all font-medium">
              {email}
            </span>
          </a>
        </div>
      </div>

      {/* Divider / dark bar with logos + nav links mock (as in screenshot) */}
      <div className="w-full bg-[#0A1C36]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-10 md:flex-row md:justify-between">
          {/* Logos row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {logos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-16 w-auto opacity-90 md:h-20"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom lockup & tagline */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm tracking-wide text-white/80">
            NATIONAL UNIVERSITY
          </p>
          <p className="mt-1 text-2xl font-semibold">
            <span className="opacity-90">AI </span>
            <span className="opacity-100">Projects</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-center text-lg leading-7 text-white/90 md:text-right">
            Empowering Communities
            <br className="hidden sm:block" />
            Through Language Technology
          </p>
          {/* small decorative bar */}
          <div className="h-12 w-1 rounded bg-white/70" aria-hidden="true" />
        </div>
      </div>

      {/* Floating Back-to-Top button */}
      <button
        type="button"
        onClick={handleBackToTop}
        aria-label="Back to top"
        className="fixed bottom-8 right-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 shadow-lg backdrop-blur-md ring-1 ring-white/20 transition hover:bg-white/20"
      >
        {/* Up arrow */}
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 10l6-6 6 6" />
          <path d="M12 4v16" />
        </svg>
      </button>
    </section>
  );
}
