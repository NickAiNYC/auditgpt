import { ArrowRight, Plug, Database, Bell } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'CRM Integrations — AuditGPT',
  description: 'Deep API integrations with Zenoti, Mangomint, and Portrait Care. AuditGPT is a continuous compliance layer on top of the tools you already use.',
};

const integrations = [
  {
    name: 'Zenoti',
    tagline: 'The enterprise standard for med-spa and salon management.',
    description:
      'Pull treatment menus, provider credentials, pricing history, and consent records directly from Zenoti. AuditGPT cross-references every service claim against your actual catalog — catching unsupported before patients do.',
    unlocks: [
      'Auto-sync treatment catalog & pricing',
      'Provider credential verification',
      'Consent-record anchoring for claims',
      'Real-time drift alerts on live service pages',
    ],
  },
  {
    name: 'Mangomint',
    tagline: 'Modern booking, reimagined for high-end studios.',
    description:
      'Connect Mangomint to stream service catalogs, seasonal promotions, and booking data into AuditGPT. We flag mismatches between what your site promises and what your Mangomint catalog actually delivers.',
    unlocks: [
      'Live service catalog sync',
      'Promotion-to-claim alignment checks',
      'Booking-driven claim validation',
      'Automated weekly drift reports',
    ],
  },
  {
    name: 'Portrait Care',
    tagline: 'Scheduling and compliance for aesthetic providers.',
    description:
      'Portrait Care integration surfaces intake forms, treatment plans, and follow-up schedules. AuditGPT maps those records against your public claims to ensure every patient-facing promise has a documented clinical path.',
    unlocks: [
      'Intake-to-claim traceability',
      'Treatment plan evidence mapping',
      'Follow-up schedule monitoring',
      'Consent-linked claim anchoring',
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans">
      <header className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 inline-flex items-center gap-1">
              <ArrowRight className="h-3 w-3 rotate-180" /> Back
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                CRM Integrations
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-6xl leading-tight mb-6 text-stone-900">
              Claim intelligence that lives inside your tech stack.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              AuditGPT isn&apos;t another dashboard. It&apos;s a continuous compliance layer on top of
              Zenoti, Mangomint, and Portrait Care.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/snapshot" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors flex items-center">
                Start with a free Snapshot <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Integration Cards */}
          <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm flex flex-col"
                >
                  {/* Logo Placeholder */}
                  <div className="w-14 h-14 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center mb-5">
                    <Plug className="h-6 w-6 text-stone-400" />
                  </div>

                  <h3 className="font-serif text-2xl mb-1 text-stone-900">{integration.name}</h3>
                  <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-4">
                    {integration.tagline}
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed mb-6 flex-1">
                    {integration.description}
                  </p>

                  <div className="border-t border-stone-100 pt-4">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">
                      What this unlocks
                    </div>
                    <ul className="space-y-2">
                      {integration.unlocks.map((item) => (
                        <li key={item} className="text-sm text-stone-700 flex items-start gap-2">
                          <span className="text-stone-300 mt-0.5">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  How It Works
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900">
                Connect once. Monitor forever.
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto">
                Three steps to a continuously reviewed claim environment across your entire stack.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-5 font-mono text-sm font-bold">
                  <Plug className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-stone-900">Connect via API</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Authenticate AuditGPT with your Zenoti, Mangomint, or Portrait Care account. One-time setup — no ongoing maintenance.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-5 font-mono text-sm font-bold">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-stone-900">Automated Claim Scanning</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  AuditGPT cross-references your live website claims against the data flowing through your CRM — treatments, pricing, credentials, consent records.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-5 font-mono text-sm font-bold">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-stone-900">Drift Alerts in Your Workflow</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  When a claim drifts — new pricing, retired treatment, changed provider — you get an alert in Slack, email, or your dashboard before patients notice.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-24 bg-white border border-stone-200 rounded-sm shadow-sm p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">
                  <ArrowRight className="h-5 w-5 text-stone-900 mx-auto mb-2" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-stone-900">No Separate Login</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  No extra dashboard to check. Compliance data lives alongside your CRM — claims, treatments, and alerts surface where you already work.
                </p>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">
                  <Database className="h-5 w-5 text-stone-900 mx-auto mb-2" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-stone-900">Continuous Monitoring</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Your site changes, your CRM updates, your claims drift. AuditGPT monitors both sides 24/7 and surfaces mismatches the moment they appear.
                </p>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">
                  <Bell className="h-5 w-5 text-stone-900 mx-auto mb-2" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-stone-900">Real-Time Alerts</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Get notified in Slack, email, or Teams the instant a claim no longer matches your operational reality. Respond before anyone flags it.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12 border-t border-stone-200">
            <h2 className="font-serif text-3xl mb-4 text-stone-900">See what your CRM already knows about your claims.</h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Connect one of your platforms and get a free claim snapshot. No commitment, no credit card.
            </p>
            <Link
              href="/snapshot"
              className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center"
            >
              Start with a free Snapshot <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
