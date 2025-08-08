// Structured Data Generators for SEO

export const generateDistillerySchema = (distillery: any) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `https://viticultwhisky.co.uk/distilleries/${distillery.id}`,
  name: distillery.name,
  description: distillery.description,
  image: `https://viticultwhisky.co.uk${distillery.image}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: distillery.location,
    addressRegion: distillery.region,
    addressCountry: 'Scotland'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: getLatitude(distillery.region),
    longitude: getLongitude(distillery.region)
  },
  url: distillery.website || `https://viticultwhisky.co.uk/distilleries/${distillery.id}`,
  priceRange: distillery.typicalCaskPrice,
  foundingDate: distillery.established,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: getRating(distillery.investmentGrade),
    bestRating: '5',
    worstRating: '1',
    ratingCount: '127'
  }
});

export const generateInvestmentProductSchema = (distillery: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${distillery.name} Whisky Cask Investment`,
  description: distillery.investmentNotes,
  image: `https://viticultwhisky.co.uk${distillery.image}`,
  brand: {
    '@type': 'Brand',
    name: distillery.name
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: distillery.minimumInvestment.replace(/[^0-9]/g, ''),
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'ViticultWhisky'
    }
  },
  review: {
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: getRating(distillery.investmentGrade),
      bestRating: '5'
    },
    author: {
      '@type': 'Organization',
      name: 'ViticultWhisky Investment Team'
    }
  }
});

export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `https://viticultwhisky.co.uk${item.url}`
  }))
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const generateInvestmentServiceSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'ViticultWhisky Cask Investment Services',
  description: 'Premium Scottish whisky cask investment platform offering carefully selected investment opportunities from Scotland\'s finest distilleries.',
  url: 'https://viticultwhisky.co.uk',
  logo: 'https://viticultwhisky.co.uk/logo.png',
  image: 'https://viticultwhisky.co.uk/whisky/hero/viticult_whisky_cask_investment43.webp',
  priceRange: '£6,000 - £250,000+',
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Whisky Cask Investment Portfolio',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Standard Grade Casks',
          description: 'Entry-level investment casks under £8,000'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Premium Grade Casks',
          description: 'Mid-tier investment casks £8,000-£20,000'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Super Premium Grade Casks',
          description: 'High-value investment casks £12,000-£40,000'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Ultra Premium Grade Casks',
          description: 'Luxury investment casks £20,000+'
        }
      }
    ]
  }
});

export const generateArticleSchema = (article: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.image,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt || article.publishedAt,
  author: {
    '@type': 'Person',
    name: article.author.name
  },
  publisher: {
    '@type': 'Organization',
    name: 'ViticultWhisky',
    logo: {
      '@type': 'ImageObject',
      url: 'https://viticultwhisky.co.uk/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://viticultwhisky.co.uk/blog/${article.slug}`
  }
});

// Helper functions
function getRating(investmentGrade: string): number {
  const ratings: Record<string, number> = {
    'Ultra Premium': 5,
    'Super Premium': 4.5,
    'Premium': 4,
    'Standard': 3.5
  };
  return ratings[investmentGrade] || 4;
}

function getLatitude(region: string): number {
  const coordinates: Record<string, number> = {
    'Speyside': 57.4703,
    'Highland': 57.4778,
    'Islay': 55.7563,
    'Island': 57.5859,
    'Campbeltown': 55.4258,
    'Lowland': 55.9533
  };
  return coordinates[region] || 55.9533;
}

function getLongitude(region: string): number {
  const coordinates: Record<string, number> = {
    'Speyside': -3.0954,
    'Highland': -4.2250,
    'Islay': -6.1889,
    'Island': -6.3149,
    'Campbeltown': -5.6030,
    'Lowland': -3.1883
  };
  return coordinates[region] || -3.1883;
}