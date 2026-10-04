export interface RouteConfig {
  path: string;
  title: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

export const SITE_BASE_URL = 'https://the-centre-of-islam.vercel.app';

export const SITE_ROUTES: RouteConfig[] = [
  { path: '', title: 'Home', changefreq: 'daily', priority: 1.0 },
  { path: 'quran', title: 'The Noble Quran', changefreq: 'daily', priority: 0.95 },
  { path: 'para-recitation', title: 'Para by Para Quran Recitation', changefreq: 'weekly', priority: 0.95 },
  { path: 'all-hadiths', title: 'Complete Hadith Library (40k+)', changefreq: 'weekly', priority: 0.92 },
  { path: 'calendar', title: 'Islamic & Hijri Calendar', changefreq: 'daily', priority: 0.90 },
  { path: 'hadith', title: 'Hadith Collection & Highlights', changefreq: 'weekly', priority: 0.90 },
  { path: 'zakat-calculator', title: 'Zakat Calculator', changefreq: 'monthly', priority: 0.85 },
  { path: 'convert-guide', title: 'Convert Guide for New Muslims', changefreq: 'monthly', priority: 0.85 },
  { path: 'community-qa', title: 'Community Questions & Answers', changefreq: 'daily', priority: 0.85 },
  { path: 'study-notes', title: 'Islamic Study Notes', changefreq: 'weekly', priority: 0.80 },
  { path: 'daily-quotes', title: 'Daily Islamic Quotes', changefreq: 'daily', priority: 0.80 },
  { path: 'printables', title: 'Printable Charts & Posters', changefreq: 'weekly', priority: 0.80 },
  { path: 'salah-counter', title: 'Monthly Salah Habit Counter', changefreq: 'monthly', priority: 0.75 },
  { path: 'tasbih', title: 'Digital Tasbih Counter', changefreq: 'monthly', priority: 0.75 },
  { path: 'about', title: 'About Us', changefreq: 'monthly', priority: 0.70 },
  { path: 'privacy', title: 'Privacy Policy', changefreq: 'yearly', priority: 0.50 },
  { path: 'terms', title: 'Terms & Conditions', changefreq: 'yearly', priority: 0.50 },
];

export function generateSitemapXml(baseUrl: string = SITE_BASE_URL, routes: RouteConfig[] = SITE_ROUTES): string {
  const today = new Date().toISOString().split('T')[0];
  const urlsXml = routes
    .map((route) => {
      const loc = route.path ? `${baseUrl}/${route.path}` : `${baseUrl}/`;
      const lastmod = route.lastmod || today;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(2)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsXml}
</urlset>`;
}
