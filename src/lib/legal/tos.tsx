'use client';

export function TermsOfService() {
  return (
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">
      <h1 className="font-serif text-3xl mb-2">Terms of Service</h1>
      <p className="text-muted-foreground text-xs mb-8"><strong>Last updated:</strong> June 20, 2026</p>

      <h2 className="font-serif text-xl mt-8 mb-3">1. Acceptance of Terms</h2>
      <p className="mb-4">By accessing or using AuditGPT (“the Service”), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">2. Description of Service</h2>
      <p className="mb-4">AuditGPT is an AI-powered business audit platform that analyses publicly accessible websites to detect unsupported claims, missing trust signals, and AI-generated content patterns (“audits”). The Service generates reports that may include a grade, factual findings, and suggested corrections.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">3. Third-Party Content Auditing</h2>
      <p className="mb-2">You may submit the URL of any publicly available website for auditing. By providing a URL, you represent and warrant that:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>You have the legal right to cause the Service to access and analyse the content at that URL.</li>
        <li>Your use of the Service with respect to that URL is for a lawful purpose and does not violate any applicable laws or third-party rights.</li>
      </ul>
      <p className="mb-4">AuditGPT provides an automated analysis based solely on the visible content of the website. The Service does not endorse, verify, or assume responsibility for the accuracy of the information on third-party websites.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">4. Public Audit Reports</h2>
      <p className="mb-2">Each audit may generate a shareable, publicly accessible report page containing the audited website&apos;s domain, grade, detected claims, and evidence analysis. By using the Service, you acknowledge and agree that:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Audit reports may be accessible to anyone with the unique report URL.</li>
        <li>You may request that a specific report be made unlisted or removed by following the Dispute Resolution process below.</li>
        <li>AuditGPT reserves the right to publish anonymised, aggregated data from audits for research, benchmarking, and promotional purposes.</li>
      </ul>

      <h2 className="font-serif text-xl mt-8 mb-3">5. Dispute Resolution &amp; Removal Requests</h2>
      <p className="mb-2">Owners of audited websites who believe an audit contains factual errors, misrepresentations, or information that should not be publicly visible may submit a correction or removal request. To do so:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Use the &ldquo;Request Correction / Dispute&rdquo; link available on every public audit page, or</li>
        <li>Email <a href="mailto:disputes@auditgpt.ai" className="underline">disputes@auditgpt.ai</a> with the audit report URL and the specific findings you wish to dispute.</li>
      </ul>
      <p className="mb-4">AuditGPT will review the request within 14 business days and may, at its discretion, update the report, add a counter-statement, or remove the public listing.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">6. User Accounts</h2>
      <p className="mb-4">To access paid features, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">7. Payment and Subscriptions</h2>
      <p className="mb-4">Paid plans are billed through Stripe. Subscription fees are non-refundable except as required by law. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">8. Acceptable Use</h2>
      <p className="mb-2">You agree not to:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Use the Service to harass, defame, or illegally target any individual or entity.</li>
        <li>Attempt to circumvent rate limits, access controls, or paid features.</li>
        <li>Scrape or extract the Service&apos;s outputs for the purpose of building a competing product.</li>
      </ul>

      <h2 className="font-serif text-xl mt-8 mb-3">9. Intellectual Property</h2>
      <p className="mb-4">The Service&apos;s software, algorithms, prompt designs, and generated audit methodologies are proprietary. You retain ownership of any content you submit; AuditGPT retains ownership of the audit results and aggregate data.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">10. Disclaimers and Limitation of Liability</h2>
      <p className="mb-4">The Service is provided &ldquo;as is&rdquo; without warranties of any kind. AuditGPT does not guarantee the accuracy, completeness, or reliability of audit reports. To the fullest extent permitted by law, AuditGPT shall not be liable for any damages arising from the use of the Service.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">11. Governing Law</h2>
      <p className="mb-4">These Terms shall be governed by the laws of the State of New York without regard to conflict of law principles.</p>

      <h2 className="font-serif text-xl mt-8 mb-3">12. Changes to Terms</h2>
      <p className="mb-4">We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
    </div>
  );
}
