import { useEffect, useState } from "react";
import { fetchLandingPage } from "./lib/sanity";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Projects from "./components/Projects.jsx";
import Highlights from "./components/Highlights.jsx";
import SDG from "./components/SDG.jsx";
import Collaborate from "./components/Collaborate.jsx";
import PapersSection from "./components/PapersSection.jsx";
import PeopleSection from "./components/PeopleSection.jsx";

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
          <Highlights items={Array.isArray(data.highlights) ? data.highlights : []}
          apps={Array.isArray(data.applications) ? data.applications : []} />
          <Projects items={Array.isArray(data.projects) ? data.projects : []} />
          <SDG items={Array.isArray(data.sdgs) ? data.sdgs : []} />
          <PapersSection items={Array.isArray(data.papers) ? data.papers : []} />
          <PeopleSection items={Array.isArray(data.teamLab) ? data.teamLab : []} />
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
