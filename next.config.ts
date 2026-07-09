import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    // Consolidation: marketing surfaces forward to scrutexity.com, which now
    // hosts the scanner. Deliberately scoped — NOT a catch-all — because:
    //   /api/*    must keep serving (cron jobs, scan APIs, casefile endpoints)
    //   /audit/*  are issued receipt URLs; receipts must verify forever
    //   /verify*, /claim-review-methodology are referenced by sent emails
    // All redirects are temporary (307): the prior catch-all was permanent
    // (308) and is already cached by some clients; do not deepen that.
    return [
      { source: "/", destination: "https://scrutexity.com/", permanent: false },
      { source: "/snapshot", destination: "https://scrutexity.com/scanner", permanent: false },
      { source: "/auditgpt", destination: "https://scrutexity.com/scanner", permanent: false },
      { source: "/pricing", destination: "https://scrutexity.com/pricing", permanent: false },
      { source: "/sample-report", destination: "https://scrutexity.com/sample-report", permanent: false },
      { source: "/agency", destination: "https://scrutexity.com/partners", permanent: false },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
