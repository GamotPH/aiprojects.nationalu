import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID, // e.g. 'o5wzr5z8'
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});

/** One-shot fetch helper */
export async function fetchLandingPage() {
  const query = `
  *[_type == "landingPage"][0]{
    siteTitle, "logoUrl": logo.asset->url, 
    heroKicker, heroTitle, heroSub,
    heroCtaText, heroCtaHref,
    projects[]{
      title, subtitle, summary, tags, href,
      "imageUrl": image.asset->url
    },
    highlights[]{ title, body, "iconUrl": icon.asset->url },
    applications[]{ title, body, "iconUrl": icon.asset->url },
    sdgs[]{
  "iconUrl": icon.asset->url,
  "iconAlt": icon.alt,
  blurb
},
    partners[]{ name, href, "logoUrl": logo.asset->url },
    collabTitle, collabBody, contactEmail,
    footerNote
  }`;
  return sanity.fetch(query);
}
