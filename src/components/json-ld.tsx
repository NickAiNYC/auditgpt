import React from 'react';

type JsonLdProps = {
  type: 'Organization' | 'WebSite' | 'SoftwareApplication' | 'LocalBusiness' | 'Service';
  data: Record<string, any>;
};

export function JsonLd({ type, data }: JsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-defined Schemas
export const ScrutexityOrganizationSchema = {
  name: 'Scrutexity',
  url: 'https://scrutexity.com',
  logo: 'https://scrutexity.com/logo-full.png',
  description: 'Scrutexity provides clinical demand governance infrastructure for high-volume medical aesthetics practices.',
};

export const AuditGPTSoftwareSchema = {
  name: 'AuditGPT',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: 'https://scrutexity.com',
  provider: {
    '@type': 'Organization',
    name: 'Scrutexity',
  },
  description: 'The diagnostic tool that maps the gap between claim, evidence, AI readability, and demand leakage.',
};
