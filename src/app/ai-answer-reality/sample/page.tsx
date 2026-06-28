import { Metadata } from "next";
import { SampleReportClient } from "./sample-report-client";

export const metadata: Metadata = {
  title: "AI Answer Reality Sample Report — Med Spa Claim Audit | AuditGPT",
  description:
    "See a live AI Answer Reality scan for a multi-location med spa. AuditGPT surfaces unsupported claims, AI distortion, evidence gaps, and competitor displacement across ChatGPT, Perplexity, and Gemini.",
  openGraph: {
    title: "AI Answer Reality Sample Report — Med Spa Claim Audit",
    description:
      "See how AuditGPT detects claim drift, AI answer distortion, and proof gaps across 12 pages and 4 AI engines for a multi-location med spa.",
    type: "website",
    siteName: "AuditGPT by Scrutexity",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Answer Reality Sample Report — Med Spa Claim Audit",
    description:
      "See how AuditGPT detects unsupported claims and AI answer distortion across ChatGPT, Perplexity, and Gemini.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/ai-answer-reality/sample",
  },
};

export default function Page() {
  return <SampleReportClient />;
}
