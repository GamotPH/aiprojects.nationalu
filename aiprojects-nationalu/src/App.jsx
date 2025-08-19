import { useEffect, useState } from "react";
import { fetchLandingPage } from "./lib/sanity";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Projects from "./components/Projects.jsx";
import Highlights from "./components/Highlights.jsx";
import Applications from "./components/Applications.jsx";
import SDG from "./components/SDG.jsx";
import Collaborate from "./components/Collaborate.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchLandingPage()
      .then(setData)
      .catch((e) => setErr(e?.message || "Failed to load"));
  }, []);

  return (
    <>
      <Navbar
        siteTitle={data?.siteTitle || "AI Projects - National University"}
        logoUrl={data?.logoUrl}
      />
      {!data && !err && (
        <section className="section">
          <div className="container section-pad"><div>Loading…</div></div>
        </section>
      )}
      {err && (
        <section className="section">
          <div className="container section-pad">
            <div className="text-red-600">Error: {err}</div>
          </div>
        </section>
      )}
      {data && (
        <>
          <Hero
            kicker={data.heroKicker}
            title={data.heroTitle}
            sub={data.heroSub}
            ctaText={data.heroCtaText}
            ctaHref={data.heroCtaHref}
          />
          <Projects items={Array.isArray(data.projects) ? data.projects : []} />
          <Highlights items={Array.isArray(data.highlights) ? data.highlights : []} />
          <Applications items={Array.isArray(data.applications) ? data.applications : []} />
          <SDG items={Array.isArray(data.sdgs) ? data.sdgs : []} />
          <Collaborate
            title={data.collabTitle}
            body={data.collabBody}
            email={data.contactEmail}
          />
        </>
      )}
    </>
  );
}
