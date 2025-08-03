import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
  type: 'organization' | 'website' | 'webpage' | 'article' | 'product' | 'service' | 'faq' | 'breadcrumb';
  data?: any;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data = {} }) => {
  const getSchema = () => {
    const baseUrl = 'https://viticultwhisky.co.uk';
    
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": ["Organization", "LocalBusiness", "FinancialService"],
          "name": "ViticultWhisky",
          "alternateName": "Viticult Whisky Investment",
          "legalName": "ViticultWhisky Limited",
          "url": baseUrl,
          "logo": `${baseUrl}/whisky/hero/hero-1.webp`,
          "image": `${baseUrl}/whisky/hero/hero-1.webp`,
          "description": "Premium whisky cask investment platform offering expert-curated Scottish whisky casks for sophisticated investors. Based in Edinburgh, Scotland.",
          "foundingDate": "2020",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Whisky Lane",
            "addressLocality": "Edinburgh",
            "addressRegion": "Scotland",
            "postalCode": "EH1 1AA",
            "addressCountry": "GB"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 55.9533,
            "longitude": -3.1883
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+44-20-3595-3910",
              "contactType": "customer service",
              "availableLanguage": ["English"],
              "areaServed": "GB",
              "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "17:00"
              }
            },
            {
              "@type": "ContactPoint",
              "contactType": "sales",
              "telephone": "+44-20-3595-3910",
              "availableLanguage": ["English"],
              "areaServed": "GB"
            }
          ],
          "sameAs": [
            "https://www.linkedin.com/company/viticultwhisky",
            "https://twitter.com/viticultwhisky",
            "https://www.facebook.com/viticultwhisky"
          ],
          "areaServed": [
            {
              "@type": "Country",
              "name": "United Kingdom"
            },
            {
              "@type": "State",
              "name": "Scotland"
            }
          ],
          "knowsAbout": [
            "Whisky Investment",
            "Scottish Whisky",
            "Cask Investment",
            "Alternative Investments",
            "Luxury Spirits",
            "Financial Advisory",
            "Investment Portfolio Management"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Whisky Investment Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Whisky Cask Investment Advisory",
                  "description": "Expert guidance on selecting premium whisky casks for investment"
                },
                "priceRange": "£5,000-£50,000"
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service", 
                  "name": "Cask Storage & Management",
                  "description": "Secure HMRC bonded warehouse storage and cask management services"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Investment Exit Strategy",
                  "description": "Strategic guidance for selling whisky casks at optimal market conditions"
                }
              }
            ]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          },
          "openingHours": "Mo-Fr 09:00-17:00",
          "currenciesAccepted": "GBP",
          "paymentAccepted": "Bank Transfer, Wire Transfer",
          "priceRange": "£5,000-£50,000"
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ViticultWhisky - Premium Cask Investment",
          "alternateName": "Viticult Whisky",
          "url": baseUrl,
          "description": "Discover premium Scottish whisky cask investments with expert guidance, secure storage, and exceptional returns.",
          "publisher": {
            "@type": "Organization",
            "name": "ViticultWhisky"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "mainEntity": {
            "@type": "ItemList",
            "name": "Investment Services",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Cask Selection",
                "url": `${baseUrl}/how-it-works`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Investment Advisory",
                "url": `${baseUrl}/about`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Secure Storage",
                "url": `${baseUrl}/how-it-works`
              }
            ]
          }
        };

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.name || "Whisky Cask Investment Services",
          "description": data.description || "Professional whisky cask investment advisory, acquisition, and management services for discerning investors.",
          "provider": {
            "@type": "Organization",
            "name": "ViticultWhisky",
            "url": baseUrl
          },
          "areaServed": {
            "@type": "Country",
            "name": "United Kingdom"
          },
          "serviceType": "Investment Advisory",
          "category": "Alternative Investments",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Whisky Investment Options",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Premium Scottish Whisky Casks",
                  "category": "Investment Product"
                },
                "priceRange": "£5,000 - £50,000",
                "availability": "https://schema.org/InStock"
              }
            ]
          },
          "offers": {
            "@type": "Offer",
            "description": "Whisky cask investment opportunities",
            "priceCurrency": "GBP",
            "priceRange": "£5,000 - £50,000"
          }
        };

      case 'product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name || "Premium Scottish Whisky Cask",
          "description": data.description || "Investment-grade Scottish whisky cask with provenance documentation and storage included.",
          "image": data.image || `${baseUrl}/whisky/casks/viticult-cask.webp`,
          "brand": {
            "@type": "Brand",
            "name": data.distillery || "Premium Scottish Distillery"
          },
          "category": "Alternative Investment",
          "productID": data.id || "WHK-CASK-001",
          "sku": data.sku || "VW-CASK-001",
          "offers": {
            "@type": "Offer",
            "price": data.price || "25000",
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "ViticultWhisky"
            },
            "priceValidUntil": data.priceValidUntil || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Cask Type",
              "value": data.caskType || "Ex-Bourbon Barrel"
            },
            {
              "@type": "PropertyValue",
              "name": "Volume",
              "value": data.volume || "200 litres"
            },
            {
              "@type": "PropertyValue",
              "name": "ABV",
              "value": data.abv || "58.5%"
            },
            {
              "@type": "PropertyValue",
              "name": "Year Distilled",
              "value": data.year || "2018"
            }
          ]
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title || "Whisky Investment Insights",
          "description": data.description || "Expert insights into whisky cask investment opportunities and market trends.",
          "image": data.image || `${baseUrl}/whisky/blog/hero-blog.webp`,
          "author": {
            "@type": "Person",
            "name": data.author || "ViticultWhisky Expert Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "ViticultWhisky",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/whisky/hero/hero-1.webp`
            }
          },
          "datePublished": data.datePublished || new Date().toISOString(),
          "dateModified": data.dateModified || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url || `${baseUrl}/blog`
          },
          "articleSection": "Investment",
          "wordCount": data.wordCount || 1000,
          "keywords": data.keywords || "whisky investment, cask investment, Scottish whisky, alternative investments"
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.faqs || [
            {
              "@type": "Question",
              "name": "How does whisky cask investment work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Whisky cask investment involves purchasing whole casks of maturing whisky directly from distilleries. As the whisky ages, it typically increases in value due to evaporation (angel's share), brand appreciation, and market demand."
              }
            },
            {
              "@type": "Question",
              "name": "What are the minimum investment amounts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our whisky cask investments typically start from £5,000 for premium casks, with most investment opportunities ranging between £15,000 to £50,000 depending on the distillery, age, and cask type."
              }
            },
            {
              "@type": "Question",
              "name": "How are the casks stored?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "All casks are stored in HMRC bonded warehouses in Scotland under optimal conditions. Storage includes temperature control, security, and regular monitoring to ensure the whisky matures properly."
              }
            }
          ]
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.breadcrumbs || [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": baseUrl
            }
          ]
        };

      default:
        return null;
    }
  };

  const schema = getSchema();
  
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;