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

    // Projects (cards + detail content)
    {
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{
        type: "object",
        fields: [
          // Core identity
          { name: "title", type: "string", validation: R => R.required() },
          {
            name: "slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: R => R.required()
          },
          { name: "subtitle", type: "string" },
          { name: "summary", type: "text", title: "Short Summary (for cards)" },

          // Detail content (About)
          {
            name: "about",
            title: "About the Project",
            type: "array",
            of: [
              { type: "block" },
              {
                type: "image",
                options: { hotspot: true },
                fields: [{ name: "alt", type: "string", title: "Alt text" }]
              }
            ]
          },

          {
            name: "privacyPolicy",
            title: "Privacy Policy",
            description: "Project-specific privacy policy text. Leave blank to hide the Policy section.",
            type: "array",
            of: [
              { type: "block" },
              {
                type: "image",
                options: { hotspot: true },
                fields: [{ name: "alt", type: "string", title: "Alt text" }]
              }
            ]

          },

          // Meta
          { name: "tags", type: "array", of: [{ type: "string" }] },

          // Links
          { name: "href", type: "url", title: "External Project URL" },
          {
            name: "links",
            title: "Additional Links",
            type: "array",
            of: [{
              type: "object",
              fields: [
                { name: "label", type: "string", validation: R => R.required() },
                { name: "url", type: "url", validation: R => R.required() }
              ],
              preview: { select: { title: "label", subtitle: "url" } }
            }]
          },

          // Hero/Card image
          {
            name: "image",
            type: "image",
            options: { hotspot: true },
            fields: [{ name: "alt", type: "string", title: "Alt text" }]
          },

          // Related Articles 
          {
  name: "articles",
  title: "Articles",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "title", type: "string", title: "Title" },
      { name: "date", type: "date", title: "Date" },
      {
        name: "excerpt",
        type: "text",
        title: "Excerpt",
        description: "Short summary of the article",
      },
      {
        name: "content",
        type: "array",
        title: "Content",
        of: [{ type: "block" }],
      },
      {
        name: "image",
        type: "image",
        title: "Cover Image",
        options: { hotspot: true },
      },
      {
        name: "slug",
        type: "slug",
        title: "Slug",
        options: {
          source: (_doc, { parent }) => parent?.title,
          maxLength: 96,
          slugify: (input) =>
            input
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w\-]+/g, "")
              .slice(0, 96),
        },
      },
      {
        name: "gallery",
        title: "Gallery",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              { name: "image", type: "image", title: "Image" },
              { name: "caption", type: "string", title: "Caption" },
            ],
            preview: { select: { title: "caption", media: "image" } },
          },
        ],
      },
    ],
    preview: { select: { title: "title", subtitle: "date", media: "image" } },
  }],
},


          // Per-project partners (optional; separate from global partners)
          {
            name: "partners",
            title: "Project Partners",
            type: "array",
            of: [{
              type: "object",
              fields: [
                { name: "name", type: "string" },
                { name: "logo", type: "image", options: { hotspot: true } },
                { name: "href", type: "url" }
              ],
              preview: { select: { title: "name", media: "logo" } }
            }]
          }
        ],
        preview: { select: { title: "title", subtitle: "subtitle", media: "image" } }
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

    // SDGs
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
        preview: { select: { title: "blurb", media: "icon" } }
      }]
    },

    // Papers on landing page
    {
      name: "papers",
      title: "Papers (Landing Page)",
      description: "Add papers to feature on the homepage.",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", type: "string", validation: R => R.required() },
          { name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: R => R.required() },
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
        preview: { select: { title: "title", subtitle: "authors", media: "coverImage" } }
      }]
    },

    // People
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
          { name: "colSpan", title: "Column Span (1–4)", type: "number" },
          { name: "rowSpan", title: "Row Span (1–7)", type: "number" },
          { name: "colStart", title: "Column Start (Optional)", type: "number" },
          { name: "rowStart", title: "Row Start (Optional)", type: "number" },
          { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: R => R.required() },
          { name: "overviewTitle", title: "Overview Title", type: "string" },
          { name: "overviewText", title: "Overview Text", type: "text" }
        ],
        preview: { select: { title: "name", subtitle: "role", media: "image" } }
      }]
    },

    // Global partners (site-wide)
    {
      name: "partners",
      title: "Partners",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "name", type: "string" },
          { name: "logo", type: "image" },
          { name: "href", type: "url" }
        ],
        preview: { select: { title: "name", media: "logo" } }
      }]
    },

    // Contact / Collaborate
    { name: "collabTitle", type: "string", title: "Collaborate Title" },
    { name: "collabBody", type: "text", title: "Collaborate Body" },
    { name: "contactEmail", type: "string", title: "Contact Email" },

    // Footer
    { name: "footerNote", type: "string", title: "Footer Note" }
  ]
};
