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
  // >>> People (sorted by 'order' then name)
    "people": people[] | order(coalesce(order, 1e9) asc, name asc){
      name, role, bio, email, linkedin, order,
      "photoUrl": photo.asset->url
    },

    // >>> Publications (sorted by date desc)
    papers[] | order(date desc){
      title, authors, date, venue, excerpt, link, featured, citation, slug,
      "coverUrl": coverImage.asset->url,
      "pdfUrl": pdf.asset->url
    },
    "teamLab": teamLab[] | order(displayOrder asc){
      _id, name, role, slug, overviewTitle, overviewText,
      colSpan, rowSpan, colStart, rowStart, displayOrder,
      "photoUrl": image.asset->url
    },
    partners[]{ name, href, "logoUrl": logo.asset->url },
    collabTitle, collabBody, contactEmail,
    footerNote
  }`;
  return sanity.fetch(query);
}
