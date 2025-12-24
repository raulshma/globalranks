/**
 * Sitemap generation script for Global Indicies
 * Run with: npx tsx scripts/generate-sitemap.ts
 */

import * as fs from "node:fs"
import * as path from "node:path"
import { db } from "../src/lib/db"
import { domains, rankingIndices } from "../src/lib/db/schema"

const BASE_URL = process.env.SITE_URL ?? "https://globalranks.vercel.app"

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

async function generateSitemap() {
  console.log("Generating sitemap...")

  const urls: Array<SitemapUrl> = []
  const today = new Date().toISOString().split("T")[0]

  // Static pages
  urls.push(
    { loc: `${BASE_URL}/`, lastmod: today, changefreq: "daily", priority: 1.0 },
    { loc: `${BASE_URL}/rankings`, lastmod: today, changefreq: "daily", priority: 0.9 },
    { loc: `${BASE_URL}/compare`, lastmod: today, changefreq: "weekly", priority: 0.8 },
    { loc: `${BASE_URL}/trends`, lastmod: today, changefreq: "weekly", priority: 0.8 },
    { loc: `${BASE_URL}/custom-index`, lastmod: today, changefreq: "weekly", priority: 0.7 }
  )

  // Get all domains
  const allDomains = await db.select().from(domains)
  for (const domain of allDomains) {
    urls.push({
      loc: `${BASE_URL}/rankings/${domain.id}`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8,
    })
  }

  // Get all ranking indices
  const allIndices = await db.select().from(rankingIndices)
  for (const index of allIndices) {
    const lastModDate = new Date(index.lastUpdated).toISOString().split("T")[0]
    urls.push({
      loc: `${BASE_URL}/rankings/${index.domainId}/${index.id}`,
      lastmod: lastModDate,
      changefreq: "monthly",
      priority: 0.7,
    })
  }

  // Generate XML
  const xml = generateSitemapXml(urls)

  // Write to public directory
  const outputPath = path.join(process.cwd(), "public", "sitemap.xml")
  fs.writeFileSync(outputPath, xml, "utf-8")
  console.log(`Sitemap generated: ${outputPath}`)
  console.log(`Total URLs: ${urls.length}`)

  // Generate robots.txt
  const robotsTxt = `# Robots.txt for Global Indicies
User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
  const robotsPath = path.join(process.cwd(), "public", "robots.txt")
  fs.writeFileSync(robotsPath, robotsTxt, "utf-8")
  console.log(`Robots.txt updated: ${robotsPath}`)
}

function generateSitemapXml(urls: Array<SitemapUrl>): string {
  const urlElements = urls
    .map((url) => {
      let element = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`
      if (url.lastmod) {
        element += `\n    <lastmod>${url.lastmod}</lastmod>`
      }
      if (url.changefreq) {
        element += `\n    <changefreq>${url.changefreq}</changefreq>`
      }
      if (url.priority !== undefined) {
        element += `\n    <priority>${url.priority.toFixed(1)}</priority>`
      }
      element += "\n  </url>"
      return element
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>
`
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// Run the script
generateSitemap()
  .then(() => {
    console.log("Sitemap generation complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error generating sitemap:", error)
    process.exit(1)
  })
