import type { Metadata } from "next";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd, ScrutexityOrganizationSchema, AuditGPTSoftwareSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  metadataBase: new URL("https://auditgpt.ai"),
  title: "AuditGPT by Scrutexity — Public claim scanner for med-spa and wellness pages",
  description:
    "Paste a public med-spa or wellness page and get a first-pass review of unsupported claims, weak proof, and safer wording. Public pages only. No login. A Scrutexity product.",
  keywords: [
    "AI Answer Reality",
    "claim intelligence",
    "AI search visibility audit",
    "claim audit",
    "Scrutexity",
    "auditgpt",
  ],
  authors: [{ name: "AuditGPT by Scrutexity" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "AuditGPT by Scrutexity — Public claim scanner for med-spa and wellness pages",
    description:
      "Paste a website URL and get a first-pass review of unsupported claims, weak proof, and safer wording.",
    type: "website",
    siteName: "AuditGPT by Scrutexity",
    images: [{ url: "/logo-full.png", width: 1200, height: 285, alt: "AuditGPT by Scrutexity" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuditGPT by Scrutexity — Public claim scanner for med-spa and wellness pages",
    description:
      "Paste a website URL and get a first-pass review of unsupported claims, weak proof, and safer wording.",
    images: ["/logo-full.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd type="Organization" data={ScrutexityOrganizationSchema} />
        <JsonLd type="SoftwareApplication" data={AuditGPTSoftwareSchema} />
      </head>
      <body
        className="antialiased bg-background text-foreground min-h-screen"
      >
        <Providers>
          {children}
          <SonnerToaster richColors position="top-center" />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
