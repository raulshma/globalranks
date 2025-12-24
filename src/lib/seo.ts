/**
 * SEO utilities for generating meta tags and structured data
 */

export interface PageMeta {
  title: string
  description: string
  keywords?: Array<string>
  canonicalUrl?: string
  ogImage?: string
  ogType?: "website" | "article"
  noIndex?: boolean
}

/**
 * Generate meta tags array for TanStack Router head
 */
export function generateMetaTags(meta: PageMeta) {
  const tags: Array<{ name?: string; property?: string; content: string }> = [
    { name: "description", content: meta.description },
  ]

  if (meta.keywords && meta.keywords.length > 0) {
    tags.push({ name: "keywords", content: meta.keywords.join(", ") })
  }

  if (meta.noIndex) {
    tags.push({ name: "robots", content: "noindex, nofollow" })
  }

  // Open Graph tags
  tags.push(
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    { property: "og:type", content: meta.ogType ?? "website" }
  )

  if (meta.canonicalUrl) {
    tags.push({ property: "og:url", content: meta.canonicalUrl })
  }

  if (meta.ogImage) {
    tags.push({ property: "og:image", content: meta.ogImage })
  }

  // Twitter Card tags
  tags.push(
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description }
  )

  if (meta.ogImage) {
    tags.push({ name: "twitter:image", content: meta.ogImage })
  }

  return tags
}

/**
 * Generate JSON-LD structured data for a ranking index
 */
export function generateRankingIndexJsonLd(data: {
  indexName: string
  indexDescription: string
  source: string
  sourceUrl: string
  countryName: string
  rank: number
  totalCountries: number
  year: number
  score?: number | null
  percentile: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${data.indexName} - ${data.countryName} Ranking`,
    description: data.indexDescription,
    creator: {
      "@type": "Organization",
      name: data.source,
      url: data.sourceUrl,
    },
    temporalCoverage: data.year.toString(),
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Rank",
        value: data.rank,
        maxValue: data.totalCountries,
      },
      {
        "@type": "PropertyValue",
        name: "Percentile",
        value: data.percentile,
        unitText: "percent",
      },
      ...(data.score !== null && data.score !== undefined
        ? [
            {
              "@type": "PropertyValue",
              name: "Score",
              value: data.score,
            },
          ]
        : []),
    ],
    about: {
      "@type": "Country",
      name: data.countryName,
    },
  }
}

/**
 * Generate JSON-LD structured data for a country comparison
 */
export function generateComparisonJsonLd(data: {
  baseCountry: string
  comparedCountries: Array<string>
  indicesCount: number
  year: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Country Comparison: ${data.baseCountry} vs ${data.comparedCountries.join(", ")}`,
    description: `Comparison of ${data.baseCountry} with ${data.comparedCountries.length} countries across ${data.indicesCount} global ranking indices`,
    temporalCoverage: data.year.toString(),
    about: [
      { "@type": "Country", name: data.baseCountry },
      ...data.comparedCountries.map((c) => ({ "@type": "Country", name: c })),
    ],
  }
}

/**
 * Generate JSON-LD structured data for the website
 */
export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "India Ranks",
    description:
      "Track and analyze India's position across global ranking indices. Compare with peer nations, explore trends, and build custom composite indices.",
    url: "https://indiaranks.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://indiaranks.com/rankings?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * Generate JSON-LD structured data for a domain/category page
 */
export function generateDomainJsonLd(data: {
  domainName: string
  domainDescription: string
  indicesCount: number
  countryName: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${data.domainName} Rankings - ${data.countryName}`,
    description: data.domainDescription,
    about: {
      "@type": "Thing",
      name: data.domainName,
    },
    numberOfItems: data.indicesCount,
  }
}

/**
 * Generate JSON-LD BreadcrumbList
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
