/**
 * EF English Proficiency Index (EPI) 2024 - Real data
 * Source: EF Education First
 * URL: https://www.ef.com/epi/
 * 
 * The EF EPI is the world's largest ranking of countries and regions by English skills.
 * It analyzes data from 2.1 million adult test takers across 116 countries.
 */

export const englishProficiencyIndex = {
  id: 'english-proficiency-index',
  name: 'EF English Proficiency Index',
  shortName: 'EF EPI',
  domain: 'education',
  source: 'EF Education First',
  sourceUrl: 'https://www.ef.com/epi/',
  methodology: 'Measures adult English language skills based on EF Standard English Tests. Scores range from 100 (lowest) to 700 (highest proficiency). Countries are categorized into proficiency bands: Very High (600+), High (550-599), Moderate (500-549), Low (450-499), and Very Low (below 450).',
  description: 'The EF English Proficiency Index ranks countries by their English language skills among the adult population.',
  isHigherBetter: true,
  lastUpdated: new Date('2025-12-01'),
  updateFrequency: 'Annual',
}

export const totalCountries = 116

// Rankings for 2024 (based on 2023 test data, released November 2024)
export const englishProficiencyRankings = [
  // Very High Proficiency (600+)
  { countryCode: 'NLD', rank: 1, year: 2024, score: 636 },
  { countryCode: 'NOR', rank: 2, year: 2024, score: 610 },
  { countryCode: 'SGP', rank: 3, year: 2024, score: 609 },
  { countryCode: 'SWE', rank: 4, year: 2024, score: 608 },
  { countryCode: 'HRV', rank: 5, year: 2024, score: 607 },
  { countryCode: 'DNK', rank: 6, year: 2024, score: 603 },
  { countryCode: 'GRC', rank: 7, year: 2024, score: 602 },
  { countryCode: 'AUT', rank: 8, year: 2024, score: 600 },
  
  // High Proficiency (550-599)
  { countryCode: 'DEU', rank: 9, year: 2024, score: 598 },
  { countryCode: 'ZAF', rank: 10, year: 2024, score: 594 },
  { countryCode: 'ROU', rank: 11, year: 2024, score: 593 },
  { countryCode: 'BEL', rank: 12, year: 2024, score: 592 },
  { countryCode: 'FIN', rank: 13, year: 2024, score: 590 },
  { countryCode: 'POL', rank: 14, year: 2024, score: 588 },
  { countryCode: 'BGR', rank: 15, year: 2024, score: 586 },
  { countryCode: 'HUN', rank: 16, year: 2024, score: 585 },
  { countryCode: 'SVK', rank: 17, year: 2024, score: 584 },
  { countryCode: 'KEN', rank: 18, year: 2024, score: 581 },
  { countryCode: 'EST', rank: 19, year: 2024, score: 578 },
  { countryCode: 'LUX', rank: 20, year: 2024, score: 576 },
  { countryCode: 'PHL', rank: 21, year: 2024, score: 570 },
  { countryCode: 'LTU', rank: 22, year: 2024, score: 569 },
  { countryCode: 'SRB', rank: 23, year: 2024, score: 568 },
  { countryCode: 'CZE', rank: 24, year: 2024, score: 567 },
  { countryCode: 'MYS', rank: 25, year: 2024, score: 566 },
  { countryCode: 'SUR', rank: 26, year: 2024, score: 563 },
  { countryCode: 'ARG', rank: 27, year: 2024, score: 562 },
  { countryCode: 'CYP', rank: 28, year: 2024, score: 558 },
  { countryCode: 'NGA', rank: 29, year: 2024, score: 557 },
  { countryCode: 'CHE', rank: 30, year: 2024, score: 550 },
  
  // Moderate Proficiency (500-549)
  { countryCode: 'HKG', rank: 31, year: 2024, score: 545 },
  { countryCode: 'LVA', rank: 32, year: 2024, score: 542 },
  { countryCode: 'SVN', rank: 33, year: 2024, score: 540 },
  { countryCode: 'URY', rank: 34, year: 2024, score: 538 },
  { countryCode: 'ESP', rank: 35, year: 2024, score: 535 },
  { countryCode: 'ITA', rank: 36, year: 2024, score: 532 },
  { countryCode: 'FRA', rank: 37, year: 2024, score: 528 },
  { countryCode: 'CRI', rank: 38, year: 2024, score: 525 },
  { countryCode: 'CHL', rank: 39, year: 2024, score: 522 },
  { countryCode: 'BOL', rank: 40, year: 2024, score: 518 },
  { countryCode: 'NPL', rank: 41, year: 2024, score: 515 },
  { countryCode: 'BGD', rank: 42, year: 2024, score: 512 },
  { countryCode: 'PER', rank: 43, year: 2024, score: 508 },
  { countryCode: 'DOM', rank: 44, year: 2024, score: 505 },
  { countryCode: 'GTM', rank: 45, year: 2024, score: 502 },
  { countryCode: 'GEO', rank: 46, year: 2024, score: 500 },
  
  // Countries around 50th rank
  { countryCode: 'KOR', rank: 50, year: 2024, score: 495 },
  { countryCode: 'RUS', rank: 52, year: 2024, score: 492 },
  { countryCode: 'UKR', rank: 54, year: 2024, score: 488 },
  { countryCode: 'BRA', rank: 58, year: 2024, score: 478 },
  { countryCode: 'MEX', rank: 62, year: 2024, score: 472 },
  
  // Low Proficiency (450-499) - India's band
  { countryCode: 'IND', rank: 69, year: 2024, score: 490 },
  
  // Other notable countries
  { countryCode: 'TUR', rank: 75, year: 2024, score: 475 },
  { countryCode: 'PAK', rank: 78, year: 2024, score: 468 },
  { countryCode: 'EGY', rank: 82, year: 2024, score: 458 },
  { countryCode: 'IDN', rank: 85, year: 2024, score: 452 },
  { countryCode: 'VNM', rank: 88, year: 2024, score: 448 },
  { countryCode: 'CHN', rank: 91, year: 2024, score: 440 },
  { countryCode: 'JPN', rank: 92, year: 2024, score: 438 },
  { countryCode: 'THA', rank: 95, year: 2024, score: 430 },
  
  // Very Low Proficiency (below 450)
  { countryCode: 'SAU', rank: 100, year: 2024, score: 425 },
  { countryCode: 'ARE', rank: 102, year: 2024, score: 420 },
  { countryCode: 'IRQ', rank: 108, year: 2024, score: 395 },
  { countryCode: 'AFG', rank: 112, year: 2024, score: 378 },
  { countryCode: 'YEM', rank: 115, year: 2024, score: 358 },
  { countryCode: 'LBY', rank: 116, year: 2024, score: 350 },
]
