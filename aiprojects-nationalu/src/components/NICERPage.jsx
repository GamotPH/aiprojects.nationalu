import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import { fetchLandingPage } from "../lib/sanity";

import bg1 from "../assets/nubuilding1.png";
import bg2 from "../assets/nubuilding2.jpg";
import bg3 from "../assets/nubuilding3.jpg";

const heroTitle = `NICER: Building the Philippines’
Foundational Infrastructure for Ethical
and Multilingual Healthcare AI`;

const lists = {
  futureDrivers: [
    "artificial intelligence",
    "multilingual data ecosystems",
    "predictive health intelligence",
    "explainable machine learning",
    "and digitally empowered public institutions",
  ],
  underrepresented: [
    "billions of people remain underrepresented in healthcare AI",
    "low-resource languages remain digitally marginalized",
    "culturally grounded health intelligence systems remain scarce",
    "and many developing nations remain dependent on imported AI infrastructures that inadequately reflect local realities",
  ],
  globalChallenge: ["healthcare equity", "digital sovereignty", "AI governance", "and public trust"],
  centerDedicatedTo: [
    "multilingual healthcare NLP",
    "ethical AI systems",
    "explainable digital-health technologies",
    "and culturally grounded AI innovation",
  ],
  infrastructureTransitions: [
    "intelligent public health systems",
    "multilingual healthcare analytics",
    "AI-assisted disease intelligence",
    "and responsible digital-health governance",
  ],
  expertiseAreas: [
    "artificial intelligence",
    "natural language processing (NLP)",
    "geospatial analytics",
    "disease surveillance",
    "explainable AI",
    "misinformation intelligence",
    "and public health informatics",
  ],
  aiDivide: ["high-resource languages", "centralized datasets", "and healthcare systems from wealthier economies"],
  nicerResponse: [
    "multilingual NLP",
    "low-resource AI research",
    "ethical AI governance",
    "and inclusive public health intelligence systems",
  ],
  projectFoundations: [
    "disease intelligence",
    "public health monitoring",
    "misinformation analysis",
    "trust-aware AI governance",
    "and predictive health analytics",
  ],
  sovereignty: [
    "developing locally grounded AI systems",
    "creating multilingual national datasets",
    "reducing dependence on foreign AI infrastructures",
    "and establishing culturally relevant healthcare intelligence systems",
  ],
  capacity: [
    "graduate research ecosystems",
    "interdisciplinary AI-health training",
    "multilingual NLP research",
    "healthcare informatics development",
    "and next-generation AI leadership formation",
  ],
  outputs: [
    "internationally indexed scientific publications",
    "multilingual annotated datasets",
    "software platforms",
    "policy frameworks",
    "intellectual property assets",
    "and scalable public-sector AI systems",
  ],
  collaborators: [
    "universities",
    "hospitals",
    "local government units",
    "public health agencies",
    "NGOs",
    "AI research institutes",
    "development organizations",
    "and technology companies",
  ],
  collaborationAreas: [
    "multilingual NLP",
    "healthcare analytics",
    "ethical AI governance",
    "explainable AI",
    "public health intelligence",
    "geospatial disease analytics",
    "dataset co-development",
    "pilot implementations",
    "and AI capacity-building initiatives",
  ],
  partnerOpportunities: [
    "multilingual healthcare AI research",
    "real-world deployment environments",
    "policy innovation",
    "public-sector digital transformation",
    "and emerging Global South AI ecosystems",
  ],
  globalPressures: ["misinformation", "healthcare inequities", "linguistic exclusion", "and ethical AI deployment"],
  futureAi: [
    "multilingual",
    "transparent",
    "ethically governed",
    "culturally grounded",
    "and accessible to historically underrepresented populations",
  ],
};

const projects = [
  {
    name: "HealthPH+",
    title: "Intelligent Multilingual Disease Surveillance",
    leader: "Dr. Marilen F. Pacis",
    funding: "₱7,045,144.28",
    body: "HealthPH+ advances AI-driven disease surveillance using multilingual NLP, misinformation analytics, and One Health-aligned intelligence systems.",
    analyzes: ["disease-related discourse", "symptom narratives", "outbreak indicators", "and misinformation patterns"],
    note: "Unlike conventional surveillance systems limited to English-language datasets, HealthPH+ develops multilingual NLP pipelines capable of processing Filipino and regional Philippine languages. The project builds upon earlier DOST-funded HealthPH research, which successfully developed transformer-based multilingual NLP systems and health-intelligence datasets presented in international research venues.",
  },
  {
    name: "AdvocAid PH",
    title: "Geospatial AI for HIV Intelligence and Public Health Analytics",
    leader: "Dr. Aldrin L. Salipande",
    funding: "₱18,729,219.19",
    body: "AdvocAid PH transforms digital conversations into actionable HIV intelligence using geospatial analytics, multilingual sentiment analysis, behavioral modeling, and public health AI.",
    analyzes: ["HIV-related stigma", "misinformation", "public sentiment", "and emerging behavioral trends"],
    note: "By integrating AI with geospatial public health intelligence, AdvocAid PH supports evidence-based HIV prevention strategies while helping public institutions better understand digital health behaviors within vulnerable populations.",
  },
  {
    name: "Bantay Lamok PH",
    title: "Predictive AI for Mosquito-Borne Disease Prevention",
    leader: "Ramon L. Rodriguez",
    funding: "₱18,574,371.18",
    body: "Bantay Lamok PH develops predictive AI systems for mosquito-borne disease forecasting using environmental analytics, crowdsourced reporting, weather intelligence, and machine learning.",
    analyzes: ["environmental analytics", "crowdsourced reporting", "weather intelligence", "and machine learning"],
    note: "The initiative aims to strengthen national and local outbreak preparedness by generating predictive intelligence for dengue and other vector-borne diseases. The project contributes to the development of AI-assisted early warning infrastructures capable of supporting proactive and data-driven public health interventions.",
  },
  {
    name: "AIKasalig Toolkit",
    title: "Building Trustworthy and Explainable Healthcare AI",
    leader: "Dr. Mideth B. Abisado",
    funding: "₱21,682,574.79",
    body: "AIKasalig addresses one of the most urgent and underdeveloped frontiers in healthcare AI: explainability, trust, fairness, transparency, and ethical governance.",
    analyzes: [
      "trust signals",
      "misinformation",
      "ethical concerns",
      "AI acceptance patterns",
      "and healthcare AI sentiment",
    ],
    note: "The initiative also develops explainable AI frameworks, governance protocols, fairness indicators, and AI literacy programs to support responsible AI adoption in healthcare systems.",
  },
];

const sdgs = [
  {
    title: "SDG 3 - Good Health and Well-Being",
    body: "Strengthening disease surveillance, healthcare intelligence, and public health responsiveness.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Sustainable_Development_Goal_3.png",
  },
  {
    title: "SDG 4 - Quality Education",
    body: "Developing AI literacy ecosystems, multilingual educational resources, and next-generation research training.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sustainable_Development_Goal_4.png",
  },
  {
    title: "SDG 9 - Industry, Innovation, and Infrastructure",
    body: "Establishing foundational healthcare AI infrastructures and scalable digital-health innovation platforms.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Sustainable_Development_Goal_9.png",
  },
  {
    title: "SDG 10 - Reduced Inequalities",
    body: "Supporting low-resource languages and underserved communities through inclusive multilingual AI.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sustainable_Development_Goal_10.png",
  },
  {
    title: "SDG 16 - Peace, Justice, and Strong Institutions",
    body: "Advancing ethical AI governance, transparency, explainability, and evidence-based policymaking.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/68/Sustainable_Development_Goal_16.png",
  },
  {
    title: "SDG 17 - Partnerships for the Goals",
    body: "Building collaborative ecosystems among universities, LGUs, hospitals, NGOs, industry, and government agencies.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Sustainable_Development_Goal_17.png",
  },
];

const programInfo = [
  ["Program Title", "NICER Research and Development Center on Natural Language Processing for Health Applications (RDC-NLPHA)"],
  ["Program Leader", "Dr. Mideth B. Abisado"],
  ["Lead Institution", "National University"],
  ["Funding Agency", "Department of Science and Technology - Philippine Council for Health Research and Development (DOST-PCHRD)"],
  ["Total Program Funding", "₱66,091,309.44"],
  ["Flagship Projects and Leaders", "HealthPH+ - Dr. Marilen F. Pacis; AdvocAid PH - Dr. Aldrin L. Salipande; Bantay Lamok PH - Ramon L. Rodriguez; AIKasalig Toolkit - Dr. Mideth B. Abisado"],
  ["Core Focus Areas", "Artificial Intelligence | Natural Language Processing | Digital Health | Ethical AI | Explainable AI | Disease Surveillance | Public Health Analytics | Multilingual AI | Healthcare Governance"],
];

function BulletList({ items, inverted = false }) {
  return (
    <ul className={inverted ? "mt-5 space-y-2 text-white/90" : "mt-5 space-y-2 text-slate-700"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className={inverted ? "mt-2 h-2 w-2 flex-none rounded-full bg-[#C8A64B]" : "mt-2 h-2 w-2 flex-none rounded-full bg-nu-blue"}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ eyebrow, title, children, tone = "white" }) {
  const blue = tone === "blue";
  return (
    <section className={blue ? "bg-[#0A2448] text-white" : tone === "soft" ? "bg-slate-50" : "bg-white"}>
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        {eyebrow && (
          <p className={blue ? "text-sm font-semibold uppercase text-white/70" : "text-sm font-semibold uppercase text-nu-blue"}>
            {eyebrow}
          </p>
        )}
        <h2 className={blue ? "mt-3 text-3xl font-semibold text-white md:text-4xl" : "mt-3 text-3xl font-semibold text-slate-950 md:text-4xl"}>
          {title}
        </h2>
        <div className={blue ? "mt-7 space-y-5 text-base leading-8 text-white/90 md:text-lg" : "mt-7 space-y-5 text-base leading-8 text-slate-700 md:text-lg"}>
          {children}
        </div>
      </div>
    </section>
  );
}

function Callout({ children }) {
  return (
    <p className="my-7 border-l-4 border-[#C8A64B] bg-white px-5 py-4 text-xl font-semibold leading-8 text-slate-950 shadow-sm md:text-2xl">
      {children}
    </p>
  );
}

export default function NICERPage() {
  const [meta, setMeta] = useState({ siteTitle: null, logoUrl: null });

  useEffect(() => {
    let live = true;
    fetchLandingPage()
      .then((data) => {
        if (live) setMeta({ siteTitle: data?.siteTitle, logoUrl: data?.logoUrl });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar
        siteTitle={meta.siteTitle || "AI Projects - National University"}
        logoUrl={meta.logoUrl}
      />

      <section
        className="relative isolate min-h-[92svh] overflow-hidden text-white"
        style={{ paddingTop: "10rem", "--cycle": "15s" }}
      >
        <div className="hero-bg anim delay-1 z-0" style={{ backgroundImage: `url(${bg1})` }} aria-hidden="true" />
        <div className="hero-bg anim delay-2 z-0" style={{ backgroundImage: `url(${bg2})` }} aria-hidden="true" />
        <div className="hero-bg anim delay-3 z-0" style={{ backgroundImage: `url(${bg3})` }} aria-hidden="true" />
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(6,45,95,.66),rgba(4,33,70,.96))]" aria-hidden="true" />

        <div className="relative z-[2] mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
          <h1 className="mt-5 max-w-5xl whitespace-pre-line text-4xl font-bold leading-tight md:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/90 md:text-xl">
            A national initiative for ethical, multilingual, and inclusive healthcare AI systems designed for Philippine realities and underrepresented communities.
          </p>
        </div>
      </section>

      <Section eyebrow="Context" title="The Healthcare AI Challenge">
        <p>The future of healthcare will not be determined solely by hospitals, medicines, or medical devices.</p>
        <p>It will increasingly be shaped by:</p>
        <BulletList items={lists.futureDrivers} />
        <p>Yet despite the rapid acceleration of global AI innovation, a critical structural problem remains unresolved:</p>
        <Callout>Most healthcare AI systems were never designed for linguistically diverse, low-resource, and developing nations.</Callout>
        <p>
          Today&apos;s dominant AI ecosystems are overwhelmingly concentrated in high-income countries, trained primarily on English-language datasets, and optimized for healthcare systems vastly different from those of Southeast Asia and the Global South.
        </p>
        <p>As a result:</p>
        <BulletList items={lists.underrepresented} />
        <p>This is not merely a technical limitation. It is a growing global challenge involving:</p>
        <BulletList items={lists.globalChallenge} />
      </Section>

      <Section eyebrow="National Initiative" title="The Philippines' Response" tone="soft">
        <p>The Philippines is responding to this challenge through a bold national initiative:</p>
        <Callout>the NICER Research and Development Center on Natural Language Processing for Health Applications (RDC-NLPHA).</Callout>
        <p>
          Funded by the Department of Science and Technology - Philippine Council for Health Research and Development (DOST-PCHRD) under the Niche Centers in the Regions for R&D (NICER) Program, the initiative represents one of the country&apos;s most ambitious investments in multilingual healthcare AI, ethical digital-health governance, and AI-driven public health innovation.
        </p>
        <p>
          With a total approved funding of ₱66,091,309.44, the Center supports four interconnected flagship projects addressing disease surveillance, geospatial health intelligence, AI trust and governance, and predictive public health analytics.
        </p>
        <p>
          Hosted by National University and led by Program Leader Dr. Mideth B. Abisado, the Center establishes one of the Philippines&apos; first integrated national infrastructures dedicated to:
        </p>
        <BulletList items={lists.centerDedicatedTo} />
        <Callout>Building healthcare AI systems that are ethical, multilingual, inclusive, and designed for underrepresented populations.</Callout>
      </Section>

      <Section eyebrow="Infrastructure" title="From Research Projects to National AI Infrastructure">
        <p>The NICER RDC-NLPHA is not merely a collection of research initiatives.</p>
        <p>It is designed as a long-term national innovation infrastructure capable of supporting the Philippines&apos; transition toward:</p>
        <BulletList items={lists.infrastructureTransitions} />
        <p>The Center integrates expertise across:</p>
        <BulletList items={lists.expertiseAreas} />
        <p>
          Its strategic mission is transformative: to establish scalable, culturally grounded, and ethically governed healthcare AI infrastructures capable of addressing both present and emerging public health challenges in multilingual and low-resource environments.
        </p>
        <p>This mission directly addresses one of the most underdeveloped frontiers in global AI research: healthcare AI for low-resource linguistic communities.</p>
        <Callout>AI designed with local languages, local health realities, and local communities at the center.</Callout>
      </Section>

      <Section eyebrow="Global Equity" title="A Strategic Response to the Global AI Divide" tone="blue">
        <p>Globally, artificial intelligence is reshaping healthcare systems at unprecedented speed. However, the benefits of AI remain unevenly distributed.</p>
        <p>Most foundational healthcare AI models are trained using:</p>
        <BulletList items={lists.aiDivide} inverted />
        <p>This creates a widening AI divide between technologically dominant nations and countries whose populations remain digitally underrepresented.</p>
        <p>NICER directly confronts this inequity through:</p>
        <BulletList items={lists.nicerResponse} inverted />
        <p>In doing so, the Center contributes not only to Philippine healthcare transformation, but also to a broader international movement toward more equitable and globally inclusive AI systems.</p>
      </Section>

      <Section eyebrow="Flagship Projects" title="Four Projects Driving National and Regional Transformation">
        <p>At the heart of the Center are four interconnected flagship projects designed to function as an integrated healthcare AI ecosystem.</p>
        <p>Together, these projects create foundational infrastructures for:</p>
        <BulletList items={lists.projectFoundations} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-950">{project.name}</h3>
              <p className="mt-2 text-lg font-semibold text-nu-blue">{project.title}</p>
              <p className="mt-4 text-sm font-semibold text-slate-600">Project Leader: {project.leader}</p>
              <p className="mt-4">{project.body}</p>
              <BulletList items={project.analyzes} />
              <p className="mt-5 text-base leading-7">{project.note}</p>
              <p className="mt-5 rounded-md bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                Project Funding: {project.funding}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Development Goals" title="Advancing the United Nations Sustainable Development Goals" tone="soft">
        <p>
          The NICER RDC-NLPHA directly advances multiple United Nations Sustainable Development Goals (SDGs), aligning Philippine healthcare AI innovation with globally recognized development priorities.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sdgs.map((sdg) => (
            <article key={sdg.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <img
                  src={sdg.logo}
                  alt={sdg.title}
                  className="h-28 w-28 flex-none rounded-sm object-contain shadow-sm"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-semibold text-slate-950">{sdg.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-700">{sdg.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Sovereignty" title="Strengthening Philippine AI Sovereignty">
        <p>Beyond technological innovation, NICER contributes to a strategically important national objective: strengthening Philippine AI sovereignty.</p>
        <p>This includes:</p>
        <BulletList items={lists.sovereignty} />
        <p>
          In an era where global AI ecosystems are increasingly concentrated among a small number of technological powers, the ability to develop localized, ethical, and linguistically inclusive AI systems has become a matter of national capability and long-term resilience.
        </p>
        <p>NICER helps build that capability.</p>
      </Section>

      <Section eyebrow="Capacity" title="Building National Capacity for the AI Era" tone="soft">
        <p>
          The Center is also designed as a long-term talent and research ecosystem. Leveraging National University's multi-campus presence across Luzon, Visayas, and Mindanao, the initiative supports:
        </p>
        <BulletList items={lists.capacity} />
        <p>The Center aims to generate:</p>
        <BulletList items={lists.outputs} />
        <p>These outputs are intended not merely for academic publication, but for long-term translational and societal impact.</p>
      </Section>

      <Section eyebrow="Partnerships" title="A Platform for Strategic Collaboration and International Partnerships">
        <p>The NICER RDC-NLPHA is designed as an open and collaborative innovation ecosystem capable of supporting local, regional, and international partnerships.</p>
        <p>The Center welcomes collaboration with:</p>
        <BulletList items={lists.collaborators} />
        <p>Potential collaboration areas include:</p>
        <BulletList items={lists.collaborationAreas} />
        <p>Strategic partners gain opportunities to contribute to:</p>
        <BulletList items={lists.partnerOpportunities} />
        <p>As nations worldwide confront the interconnected challenges of:</p>
        <BulletList items={lists.globalPressures} />
        <p>the need for globally inclusive healthcare AI infrastructures has never been more urgent.</p>
        <p>NICER positions the Philippines as an active contributor to shaping that future.</p>
      </Section>

      <Section eyebrow="Future" title="Toward a More Inclusive Future for Global Healthcare AI" tone="blue">
        <p>
          The establishment of the NICER Research and Development Center on Natural Language Processing for Health Applications signals a transformative moment in Philippine healthcare innovation.
        </p>
        <p>It reflects a growing recognition that the future of healthcare AI must not be linguistically exclusive, technologically centralized, or socially disconnected.</p>
        <p>Instead, future healthcare AI systems must be:</p>
        <BulletList items={lists.futureAi} inverted />
        <p>More importantly, NICER demonstrates that globally relevant AI innovation does not need to emerge solely from high-income nations.</p>
        <p>
          Through NICER, the Philippines is contributing to a broader global vision for healthcare AI: one that is inclusive, equitable, trustworthy, and built for the realities of diverse human communities.
        </p>
      </Section>

      <Section eyebrow="Program Information" title="NICER RDC-NLPHA">
        <dl className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {programInfo.map(([label, value]) => (
            <div key={label} className="grid gap-2 p-5 md:grid-cols-[220px_1fr]">
              <dt className="font-semibold text-slate-950">{label}</dt>
              <dd className="text-slate-700">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
