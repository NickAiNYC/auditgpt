import { MetadataRoute } from 'next';
import { topCities } from './medspa-audit/[city]/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scrutexity.com';

  const staticRoutes = [
    '',
    '/agency',
    '/ai-answer-reality',
    '/ai-answer-reality/sample',
    '/personal-brand-audit',
    '/pricing',
    '/deployment',
    '/security',
    '/proof',
    '/sample-report',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const geoRoutes = topCities.map((city) => ({
    url: `${baseUrl}/medspa-audit/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...geoRoutes];
}
