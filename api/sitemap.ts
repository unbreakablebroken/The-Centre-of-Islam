import type { IncomingMessage, ServerResponse } from 'http';
import { generateSitemapXml } from '../src/config/siteRoutes';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const xml = generateSitemapXml();

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=86400, stale-while-revalidate=43200'
    );
    res.statusCode = 200;
    res.end(xml);
  } catch {
    res.statusCode = 500;
    res.end('Error generating dynamic sitemap');
  }
}
