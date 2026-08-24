// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = "https://petserpentes.com.br"

const SUPABASE_URL = "https://xlhcneenthhhsjqqdmbm.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaGNuZWVudGhoaHNqcXFkbWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTkxMDAsImV4cCI6MjA2Mjg5NTEwMH0.sfzXDOllb7xUo2GSYslS_pQ3ei7rjKdEOcJI56EITt8"

interface SitemapEntry {
  path: string
  lastmod?: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: string
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/catalogo", changefreq: "daily", priority: "0.9" },
  { path: "/especies", changefreq: "weekly", priority: "0.8" },
  { path: "/manuais", changefreq: "monthly", priority: "0.7" },
  { path: "/educacao", changefreq: "monthly", priority: "0.7" },
  { path: "/sobre", changefreq: "yearly", priority: "0.6" },
  { path: "/academy", changefreq: "monthly", priority: "0.6" },
  { path: "/contato", changefreq: "yearly", priority: "0.6" },
  { path: "/lista-de-espera", changefreq: "monthly", priority: "0.4" },
  { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.2" },
  { path: "/termos-de-uso", changefreq: "yearly", priority: "0.2" },
]

async function fetchRows<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
    if (!response.ok) {
      console.warn(`sitemap: could not fetch ${path} [${response.status}]`)
      return []
    }
    return (await response.json()) as T[]
  } catch (error) {
    console.warn(`sitemap: could not fetch ${path}:`, error)
    return []
  }
}

async function buildEntries(): Promise<SitemapEntry[]> {
  const products = await fetchRows<{ id: string }>(
    "products?select=id&visible=eq.true&limit=1000",
  )
  const species = await fetchRows<{ slug: string }>("species?select=slug&limit=1000")

  return [
    ...staticEntries,
    ...products.map((product) => ({
      path: `/produtos/${product.id}`,
      changefreq: "weekly" as const,
      priority: "0.8",
    })),
    ...species
      .filter((row) => Boolean(row.slug))
      .map((row) => ({
        path: `/especies?selected=${row.slug}`,
        changefreq: "monthly" as const,
        priority: "0.6",
      })),
  ]
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${escapeXml(`${BASE_URL}${e.path}`)}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  )

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n")
}

const entries = await buildEntries()
writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries))
console.log(`sitemap.xml written (${entries.length} entries)`)
