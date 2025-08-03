// Sitemap utility for generating XML sitemaps
export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const baseUrl = 'https://viticultwhisky.co.uk';
  
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const xmlFooter = `</urlset>`;

  const urlEntries = entries.map(entry => {
    const fullUrl = entry.url.startsWith('http') ? entry.url : `${baseUrl}${entry.url}`;
    const lastmod = entry.lastmod || new Date().toISOString().split('T')[0];
    const changefreq = entry.changefreq || 'weekly';
    const priority = entry.priority !== undefined ? entry.priority : 0.5;

    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `${xmlHeader}\n${urlEntries}\n${xmlFooter}`;
};

export const defaultSitemapEntries: SitemapEntry[] = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    url: '/how-it-works',
    changefreq: 'monthly',
    priority: 0.9
  },
  {
    url: '/blog',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: '/faq',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: '/terms',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    url: '/privacy-policy',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    url: '/buy-sell',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: '/sell-whisky',
    changefreq: 'weekly',
    priority: 0.7
  }
];

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://viticultwhisky.co.uk';
  
  return `# Robots.txt for ViticultWhisky - Premium Whisky Cask Investment Platform
# https://www.robotstxt.org/robotstxt.html
# Site: ${baseUrl}

# Allow all major search engines to crawl public content
User-agent: Googlebot
Allow: /
Allow: /about
Allow: /how-it-works
Allow: /blog
Allow: /blog/*
Allow: /contact
Allow: /faq
Allow: /terms
Allow: /privacy-policy
Allow: /buy-sell
Allow: /sell-whisky
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*
Disallow: /test*
Disallow: /*.json$
Disallow: /*?*
Crawl-delay: 1

User-agent: *
Allow: /
Allow: /whisky/*
Allow: /static/*
Allow: /favicon.ico
Allow: /favicon.svg
Allow: /manifest.json
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*
Disallow: /test*
Disallow: /*.json$
Disallow: /*?utm_*
Disallow: /whisky_backup_*
Disallow: /videos/
Crawl-delay: 1

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Host specification
Host: viticultwhisky.co.uk`;
};