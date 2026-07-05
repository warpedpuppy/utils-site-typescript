// Pure sitemap builder — no side effects, safe to import from tests.
// The writer lives in scripts/generate-sitemap.ts; registry.test.ts ("A7")
// asserts the committed public/sitemap.xml matches this exact output.

export const SITE_BASE = "https://utilspalooza.com";

interface SitemapUrl {
  loc: string;
  changefreq: string;
  priority: string;
}

const STATIC_URLS: SitemapUrl[] = [
  { loc: `${SITE_BASE}/`, changefreq: "monthly", priority: "1.0" },
  { loc: `${SITE_BASE}/examples`, changefreq: "weekly", priority: "0.9" },
  { loc: `${SITE_BASE}/api`, changefreq: "weekly", priority: "0.9" },
  { loc: `${SITE_BASE}/quickstart`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_BASE}/studio`, changefreq: "weekly", priority: "0.8" },
  { loc: `${SITE_BASE}/create-json`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_BASE}/about`, changefreq: "yearly", priority: "0.5" },
];

export function buildSitemapXml(
  records: { slug: string; include?: boolean }[]
): string {
  const exampleUrls: SitemapUrl[] = records
    .filter((r) => r.include !== false)
    .map((r) => ({
      loc: `${SITE_BASE}/examples/${r.slug}`,
      changefreq: "monthly",
      priority: "0.7",
    }));

  const entries = [...STATIC_URLS, ...exampleUrls]
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}
