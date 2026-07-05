import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  X,
} from 'lucide-react';
import { Logo } from '@/components/logo';

const ACCENT = 'text-[#0B3D2E]';
const ACCENT_BG = 'bg-[#0B3D2E]';
const ACCENT_BORDER = 'border-[#0B3D2E]';

export const metadata: Metadata = {
  title: 'Claim Intelligence for Creators & Influencers | AuditGPT',
  description:
    'Review sponsorships, affiliate pages, course sales pages, newsletters, and creator landing pages before audiences or AI answer engines repeat unsupported claims.',
  alternates: {
    canonical: '/creator',
  },
};

const REVIEW_ROWS = [
  ['Creator', 'Mara Lee'],
  ['Surface', 'Course landing page'],
  ['Source URL', 'maralee.co/ai-course'],
  ['Review type', 'Creator trust review'],
] as const;

const FINDINGS = [
  {
    icon: X,
    mark: 'Unsupported',
    claim: '"This increased my revenue by 40%."',
    note: 'No visible baseline, date range, cohort, attribution, or disclosure near the claim.',
    tone: 'text-red-700',
  },
  {
    icon: AlertTriangle,
    mark: 'Sponsor risk',
    claim: '"Best AI tool for creators."',
    note: 'Broad ranking language without comparison method, personal-use context, or sponsorship disclosure.',
    tone: 'text-amber-700',
  },
  {
    icon: Check,
    mark: 'Supported',
    claim: '"No sponsorship. I paid for this account."',
    note: 'Clear claim with visible disclosure and a specific relationship statement.',
    tone: ACCENT,
  },
] as const;

const SURFACES = [
  'Creator websites',
  'Link-in-bio pages',
  'Course landing pages',
  'Gumroad pages',
  'Substack archives',
  'YouTube descriptions',
  'Podcast websites',
  'Brand sponsorship pages',
] as const;

const REPORT_FIELDS = [
  ['Trust Score', 'Audience-facing claim risk summarized without implying legal compliance.'],
  ['Sponsor Risk', 'Claims a brand, platform, or partner may ask you to substantiate.'],
  ['Affiliate Claims', 'Use, ranking, comparison, result, and sponsorship language checked for visible proof.'],
  ['Proof Blocks', 'What evidence should sit near the claim: dates, screenshots, receipts, disclosures, or sources.'],
  ['AI Summary', 'How AI answer engines may summarize your public reputation and claims.'],
  ['Suggested Rewrite', 'Safer language that keeps the recommendation useful without overstating proof.'],
] as const;

const SAMPLE_REPORT = [
  ['Trust Score', '68 /100'],
  ['Sponsor Risk', '2 claims need disclosure context'],
  ['Affiliate Claims', '1 ranking claim lacks proof'],
  ['Proof Blocks', 'Add date range, receipt, and result context'],
  ['AI Summary', 'May overstate revenue result if quoted alone'],
  ['Suggested Rewrite', 'Personal-use framing with proof nearby'],
] as const;

function CreatorReportArtifact() {
  return (
    <div className="border border-[#DADADA] bg-white">
      <div className="border-b border-[#EAEAEA] px-5 py-4 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">AuditGPT Creator Trust Review</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-black">Creator: Mara Lee</h2>
          </div>
          <div className="inline-flex items-center gap-2 self-start border border-[#EAEAEA] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
            <FileCheck2 className={`h-4 w-4 ${ACCENT}`} />
            Public content
          </div>
        </div>
      </div>

      <div className="grid border-b border-[#EAEAEA] lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-[#EAEAEA] p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Trust Score</div>
          <div className="mt-5 flex items-end gap-3">
            <div className="text-7xl font-semibold tracking-[-0.06em] text-black">68</div>
            <div className="mb-3 text-sm font-medium text-neutral-500">/100<br />review ready</div>
          </div>
          <div className="mt-8 space-y-3">
            {REVIEW_ROWS.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[100px_1fr] gap-4 border-t border-[#EAEAEA] pt-3 text-sm">
                <div className="text-neutral-500">{label}</div>
                <div className="font-medium text-black">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Top findings</div>
            <div className="text-xs text-neutral-500">Prepared for creator review</div>
          </div>
          <div className="divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
            {FINDINGS.map(({ icon: Icon, mark, claim, note, tone }) => (
              <div key={claim} className="grid gap-4 py-5 sm:grid-cols-[140px_1fr]">
                <div className={`flex items-center gap-2 text-sm font-semibold ${tone}`}>
                  <Icon className="h-4 w-4" />
                  {mark}
                </div>
                <div>
                  <div className="text-base font-semibold tracking-[-0.01em] text-black">{claim}</div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 text-sm text-neutral-700 sm:grid-cols-3">
            {['Sponsor risk', 'Affiliate claims', 'Suggested rewrite'].map((item) => (
              <div key={item} className="border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3">
                <CheckCircle2 className={`mb-3 h-4 w-4 ${ACCENT}`} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#FAFAFA] px-5 py-4 text-xs leading-5 text-neutral-500 sm:px-8">
        AuditGPT reviews public claims, visible evidence, and AI interpretation. It is not legal, regulatory, platform, or sponsorship compliance advice.
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className={`mb-5 text-xs font-semibold uppercase tracking-[0.18em] ${ACCENT}`}>{eyebrow}</div>
      <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-black sm:text-5xl">{title}</h2>
      {body ? <p className="mt-6 text-lg leading-8 text-neutral-600">{body}</p> : null}
    </div>
  );
}

export default function CreatorPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 border-b border-[#EAEAEA] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="AuditGPT home">
            <Logo variant="full" height={29} priority />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[#EAEAEA] bg-white px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
            <div>
              <div className={`mb-8 text-xs font-semibold uppercase tracking-[0.2em] ${ACCENT}`}>Creators & Influencers</div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-black sm:text-6xl lg:text-7xl">
                Claim Intelligence for creators whose reputation is the product.
              </h1>
              <p className="mt-8 max-w-xl text-xl leading-8 text-neutral-600">
                Review sponsorships, affiliate pages, course sales pages, newsletters, and landing pages before your audience or AI answer engines repeat unsupported claims.
              </p>
              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                <Link href="/snapshot?path=creator" className={`inline-flex items-center justify-center ${ACCENT_BG} px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-black`}>
                  Run Sponsor-Ready Claim Review <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <div className="text-sm leading-6 text-neutral-500">
                  Public surfaces only.<br />
                  Reputation review.<br />
                  No compliance promise.
                </div>
              </div>
            </div>
            <CreatorReportArtifact />
          </div>
        </section>

        <section className="border-b border-[#EAEAEA] bg-[#FAFAFA] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="What Gets Reviewed"
              title="The public surfaces where creators make trust claims."
              body="AuditGPT looks at the pages and content your audience, sponsors, affiliates, and AI systems can see."
            />
            <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SURFACES.map((surface) => (
                <div key={surface} className="border border-[#EAEAEA] bg-white p-5">
                  <FileText className={`mb-8 h-4 w-4 ${ACCENT}`} />
                  <div className="text-lg font-semibold tracking-[-0.02em] text-black">{surface}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#EAEAEA] bg-white px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Sample Report Preview"
              title="A premium review artifact for sponsor-facing trust."
              body="The creator report is built to be read by the person whose reputation is on the line: concise findings, visible proof gaps, and rewrite guidance that preserves credibility."
            />
            <div className="border border-[#DADADA] bg-white">
              <div className="border-b border-[#EAEAEA] px-6 py-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Sponsor-ready claim review</div>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-black">Creator sponsorship page</h3>
              </div>
              <div className="divide-y divide-[#EAEAEA]">
                {SAMPLE_REPORT.map(([label, value]) => (
                  <div key={label} className="grid gap-3 px-6 py-5 sm:grid-cols-[180px_1fr]">
                    <div className={`text-sm font-semibold ${ACCENT}`}>{label}</div>
                    <div className="text-sm leading-7 text-neutral-700">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#EAEAEA] bg-white px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Creator Report"
              title="A claim review for people whose name is the business."
              body="The report changes emphasis without becoming a separate product. It still reviews claims, proof, rewrites, and AI interpretation."
            />
            <div className="border-t border-[#EAEAEA]">
              {REPORT_FIELDS.map(([title, body]) => (
                <div key={title} className="grid gap-5 border-b border-[#EAEAEA] py-7 sm:grid-cols-[180px_1fr]">
                  <div className={`text-sm font-semibold ${ACCENT}`}>{title}</div>
                  <p className="text-base leading-7 text-neutral-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#EAEAEA] bg-[#FAFAFA] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr]">
            <div className="border border-[#DADADA] bg-white p-6 sm:p-8">
              <div className="mb-12 border-b border-[#EAEAEA] pb-5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Before
              </div>
              <p className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-black">
                "This tool doubled my revenue. Everyone should use it."
              </p>
              <div className="mt-10 border-t border-[#EAEAEA] pt-5 text-sm leading-7 text-neutral-600">
                Risk: result claim and recommendation language without proof, context, or disclosure.
              </div>
            </div>
            <div className="border border-[#DADADA] bg-white p-6 sm:p-8">
              <div className={`mb-12 border-b border-[#EAEAEA] pb-5 text-xs font-semibold uppercase tracking-[0.18em] ${ACCENT}`}>
                Suggested rewrite
              </div>
              <p className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-black">
                "I use this tool in my weekly workflow. In my own business, it helped me identify revenue opportunities I had been missing."
              </p>
              <div className="mt-10 border-t border-[#EAEAEA] pt-5 text-sm leading-7 text-neutral-600">
                Stronger: personal-use context, no universal ranking, and room to add a disclosure or proof block.
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.86fr_1.14fr]">
            <SectionHeading
              eyebrow="Positioning"
              title="Not compliance for creators. Reputation review for public claims."
              body="AuditGPT stays broader and more defensible: what did you claim, what proof is visible, how might AI summarize it, and what language would be safer?"
            />
            <div className="border border-[#DADADA] bg-[#FAFAFA] p-6 sm:p-8">
              {[
                'Sponsorship claims',
                'Affiliate recommendations',
                'Course outcomes',
                'Audience and credential statements',
                'AI-generated public content',
              ].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-[#EAEAEA] py-5 last:border-b-0">
                  <span className="text-lg font-medium text-black">{item}</span>
                  <Check className={`h-5 w-5 ${ACCENT}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#EAEAEA] bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo variant="full" height={28} />
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500">
              AuditGPT is a Scrutexity product for claim intelligence, public proof review, and AI Answer Reality.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            <Link href="/legal" className="hover:text-black">Legal</Link>
            <Link href="/security" className="hover:text-black">Security</Link>
            <Link href="/claim-review-methodology" className="hover:text-black">Methodology</Link>
            <Link href="/agency" className="hover:text-black">Agencies</Link>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-[#EAEAEA] pt-5 text-xs leading-6 text-neutral-500">
          AuditGPT does not provide legal, clinical, regulatory, platform, sponsorship, ranking, revenue, or compliance advice. It identifies visible gaps in claims, evidence, AI/search readability, and demand paths based on reviewed public surfaces.
        </div>
      </footer>
    </div>
  );
}
