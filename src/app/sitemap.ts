import { MetadataRoute } from 'next';
import { topCities } from './medspa-audit/[city]/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://auditgpt.ai';

  const staticRoutes = [
    '',
    '/agency',
    '/ai-claim-accuracy-content-stack',
    '/ai-answer-reality',
    '/ai-answer-reality/sample',
    '/claim-review-methodology',
    '/personal-brand-audit',
    '/pricing',
    '/deployment',
    '/security',
    '/proof',
    '/sample-report',
    '/state-of-medspa-ai-answer-reality',
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
