import { getBusiness, getLogo, SITE_URL } from '@/lib/site-data'

const business = getBusiness()
const logo = getLogo()

export function SEOJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
    name: business.name,
    url: SITE_URL,
    logo: logo ? `${SITE_URL}${logo}` : undefined,
    image: `${SITE_URL}/assets/images/bg_header.jpg`,
    description: `${business.name} – ${business.tagline}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12/233 Flemington Road',
      addressLocality: 'Franklin',
      addressRegion: 'ACT',
      postalCode: '2913',
      addressCountry: 'AU',
    },
    telephone: business.phone,
    email: business.email,
    areaServed: {
      '@type': 'State',
      name: 'Australian Capital Territory',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:30',
      },
    ],
    priceRange: '$$',
  }

  // Remove undefined values
  const clean = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean) }}
    />
  )
}
