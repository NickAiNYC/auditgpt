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
  description: 'Scrutexity is the claim intelligence platform for high-risk, high-growth brands. We help businesses find unsupported claims, evidence gaps, and AI Answer Reality risks before buyers repeat or distrust them.',
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
  description: 'The diagnostic tool that maps the gap between claim, evidence, AI readability, and claim drift.',
};

export const generateLocalFaqSchema = (cityName: string, topClaim: string) => ({
  mainEntity: [
    {
      '@type': 'Question',
      name: `Why are medical spas in ${cityName} losing visibility in AI search results?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Many clinics in ${cityName} are being omitted from AI-generated recommendations because their public-facing pages contain unsupported claims (like "${topClaim}") that AI answer engines cannot verify. AuditGPT identifies which claims are supported, overstated, or missing proof so you can fix them before buyers distrust them.`,
      },
    },
    {
      '@type': 'Question',
      name: `What is a Claim Intelligence audit for ${cityName} aesthetics practices?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `A Claim Intelligence audit reviews your public buyer-facing pages to find unsupported claims, evidence gaps, and AI Answer Reality risks. AuditGPT helps ${cityName} medspas identify exactly which claims need stronger proof before patients, investors, or AI search systems repeat or distrust them.`,
      },
    },
  ],
});
