export default {
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    // Header / Branding
    { name: "siteTitle", type: "string", title: "Site Title", initialValue: "AI For Health" },
    { name: "logo", type: "image", title: "Logo" },

    // Hero
    { name: "heroTitle", type: "string", title: "Hero Title" },
    { name: "heroKicker", type: "string", title: "Hero Kicker" },
    { name: "heroSub", type: "text", title: "Hero Subtitle" },
    { name: "heroCtaText", type: "string", title: "Hero CTA Text" },
    { name: "heroCtaHref", type: "url", title: "Hero CTA Link" },

    // Projects (cards)
    {
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", type: "string" },
          { name: "subtitle", type: "string" },
          { name: "summary", type: "text" },
          { name: "tags", type: "array", of: [{ type: "string" }] },
          { name: "href", type: "url" },
          { name: "image", type: "image" }
        ]
      }]
    },

    // Research Highlights (grid)
    {
      name: "highlights",
      title: "Research Highlights",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", type: "string" },
          { name: "body", type: "text" },
          { name: "icon", type: "image" }
        ]
      }]
    },

    // Real-World Applications (list)
    {
  name: "applications",
  title: "Real-World Applications",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "title", type: "string", validation: Rule => Rule.required() },
      { name: "body", type: "text" },
      { name: "icon", type: "image", options: { hotspot: true } }
    ]
  }]
},
{
  name: "sdgs",
  title: "Sustainable Development Goals",
  type: "array",
  of: [{
    type: "object",
    fields: [
      {
        name: "icon",
        title: "Icon",
        type: "image",
        options: { hotspot: true },
        fields: [{ name: "alt", title: "Alt text", type: "string" }]
      },
      {
        name: "blurb",
        title: "Blurb",
        type: "text",
        rows: 4,
        validation: Rule => Rule.required()
      }
    ],
    preview: {
      select: { title: "blurb", media: "icon" }
    }
  }]
},

    // >>> NEW: Publications embedded on landing page
    {
  name: "papers",
  title: "Papers (Landing Page)",
  description: "Add papers to feature on the homepage.",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "title", type: "string", validation: R => R.required() },
      { name: "authors", type: "string" },
      { name: "citation", type: "text", rows: 4, title: "Citation (formatted)" },
      { name: "date", type: "date", options: { dateFormat: "YYYY-MM-DD" } },
      { name: "venue", type: "string", title: "Venue / Journal" },
      { name: "excerpt", type: "text", title: "Abstract / Excerpt" },
      { name: "link", type: "url", title: "External Link" },
      { name: "pdf", type: "file", options: { accept: ".pdf" } },
      { name: "coverImage", type: "image", options: { hotspot: true } },
      { name: "featured", type: "boolean" }
    ],
    preview: {
      select: { title: "title", subtitle: "authors", media: "coverImage" }
    }
  }]
},

// NEW — People / Research Team Lab (embedded on landing page)
{
  name: "teamLab",
  title: "Research Team Lab (People)",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "name", title: "Full Name", type: "string", validation: R => R.required() },
      { name: "role", title: "Role", type: "string" },
      { name: "image", title: "Image", type: "image", options: { hotspot: true } },

      // Layout helpers (optional)
      { name: "colSpan", title: "Column Span (1–4)", type: "number" },
      { name: "rowSpan", title: "Row Span (1–7)", type: "number" },
      { name: "colStart", title: "Column Start (Optional)", type: "number" },
      { name: "rowStart", title: "Row Start (Optional)", type: "number" },

      { name: "displayOrder", title: "Display Order", type: "number", validation: R => R.required().min(0) },

      { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: R => R.required() },

      // Bionote
      { name: "overviewTitle", title: "Overview Title", type: "string" },
      { name: "overviewText", title: "Overview Text", type: "text" }
    ],
    preview: {
      select: { title: "name", subtitle: "role", media: "image" }
    }
  }]
},


    // Partners (logos row)
    {
      name: "partners",
      title: "Partners",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "name", type: "string" },
        { name: "logo", type: "image" },
        { name: "href", type: "url" }
      ]}]
    },

    // Contact / Collaborate
    { name: "collabTitle", type: "string", title: "Collaborate Title" },
    { name: "collabBody", type: "text", title: "Collaborate Body" },
    { name: "contactEmail", type: "string", title: "Contact Email" },

    // Footer
    { name: "footerNote", type: "string", title: "Footer Note" }
  ]
};
