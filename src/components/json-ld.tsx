import React from 'react';

type JsonLdProps = {
  type: 'Organization' | 'WebSite' | 'SoftwareApplication' | 'LocalBusiness' | 'Service' | 'FAQPage';
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

export const generateLocalFaqSchema = (cityName: string, topClaim: string) => ({
  mainEntity: [
    {
      '@type': 'Question',
      name: `Why are medical spas in ${cityName} losing bookings to competitors?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Many clinics in ${cityName} lose high-intent traffic because their marketing makes claims (like "${topClaim}") that aren't substantiated by clinical evidence on their website. Educated patients abandon the booking funnel when claims seem unsupported.`,
      },
    },
    {
      '@type': 'Question',
      name: `What is a demand governance audit for ${cityName} aesthetics practices?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `A demand governance audit securely maps the gap between your marketing claims and your actual clinical evidence. It helps ${cityName} medspas identify exactly where patients drop off before booking a consultation.`,
      },
    },
  ],
});
