'use client';

export function PrivacyPolicy() {
  return (
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">
      <h1 className="font-serif text-3xl mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-xs mb-8"><strong>Last updated:</strong> June 20, 2026</p>

      <h2 className="font-serif text-xl mt-8 mb-3">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li><strong>Account Information:</strong> When you sign up, we collect your email address, name (optional), and authentication provider details (Google/GitHub IDs or magic link).</li>
        <li><strong>Audit Data:</strong> When you submit a URL, we scrape and store the publicly accessible content of that website, the generated audit report, extracted claims, evidence, and scores.</li>
        <li><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your full credit card details; Stripe provides us with a payment token and subscription status.</li>
        <li><strong>Usage Data:</strong> We collect anonymised analytics (page views, feature usage) to improve the Service.</li>
      </ul>

      <h2 className="font-serif text-xl mt-8 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>To provide the audit service and generate reports.</li>
        <li>To manage your account, subscriptions, and customer support.</li>
        <li>To improve our detection algorithms and build aggregated benchmarking data (the &ldquo;Evidence Ledger&rdquo;).</li>
        <li>To send transactional emails (password resets, subscription invoices, and expiry notifications).</li>
      </ul>

      <h2 className="font-serif text-xl mt-8 mb-3">3. Public Visibility</h2>
      <p className="mb-4">Audit reports may be publicly accessible via a unique, unguessable URL. The report includes the audited website&apos;s domain, grade, and specific claims extracted from that website. We do not publicly display your personal email or account details. You may request that a specific audit be made unlisted or deleted by contacting <a href="mailto:privacy@auditgpt.ai" className="underline">privacy@auditgpt.ai</a>.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">4. Data Retention</h2>
      <p className="mb-4">Audits and extracted claims are retained to power the Evidence Ledger and to enable historical rescans. You may request deletion of your account and associated audits at any time. Anonymised, aggregated data may be retained indefinitely.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">5. Third-Party Services</h2>
      <p className="mb-2">We use the following sub-processors:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li><strong>Stripe</strong> – payment processing</li>
        <li><strong>Google / GitHub</strong> – OAuth authentication</li>
        <li><strong>DeepSeek (LLM)</strong> – to generate audit analyses</li>
        <li><strong>Resend / Nodemailer</strong> – to send emails</li>
      </ul>
      <p className="mb-4">Each sub-processor is contractually obligated to protect your data.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">6. Cookies</h2>
      <p className="mb-4">We use only essential cookies for authentication (NextAuth session cookie) and, if you consent, a cookie to remember your cookie preferences. We do not use advertising or tracking cookies.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">7. Your Rights (GDPR / CCPA)</h2>
      <p className="mb-4">If you are located in the EEA, UK, or California, you have the right to access, rectify, erase, or port your personal data, and to object to or restrict processing. To exercise your rights, email <a href="mailto:privacy@auditgpt.ai" className="underline">privacy@auditgpt.ai</a>.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">8. Security</h2>
      <p className="mb-4">We implement appropriate technical and organisational measures, including encryption at rest (AES-256-GCM), TLS in transit, server-side rate limiting, and SSRF protections.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">9. Changes to This Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of material changes via email or a notice on the Service.</p>
    </div>
  );
}
