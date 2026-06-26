import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/internal/', '/api/'],
    },
    sitemap: 'https://scrutexity.com/sitemap.xml',
  };
}
