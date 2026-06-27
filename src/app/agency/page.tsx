import { ArrowRight, ArrowLeft, ShieldCheck, FileText, Bot, Shield } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'Agency Claims Intelligence — AuditGPT',
  description: 'White-label claim intelligence reports for agencies serving regulated or trust-sensitive clients.',
};

export default function AgencyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans">
      <header className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                For Agencies
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl leading-tight mb-6 text-stone-900">
              Protect your clients from claim drift.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              White-label claim intelligence reports for agencies serving regulated, medical, or trust-sensitive clients. Show them you govern their growth.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/pricing" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors flex items-center">
                Start Agency Plan — $799/mo <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/snapshot" className="px-8 py-4 text-base font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors flex items-center justify-center shadow-sm">
                Run one client sample
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <FileText className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">White-Label Export</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Export beautiful, client-ready PDF reports with your agency's branding. Present claim gaps and AI answer reality risks as your own proprietary audit.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">Custom Branding Included</div>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <Bot className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">25 Audits / Month</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Run comprehensive Multi-Surface Audits for up to 25 client domains per month. Use them as powerful sales wedges for prospects or quarterly reviews for retained clients.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">High Volume Capacity</div>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <ShieldCheck className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">Claim Verification Certificate</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Provide your clients with a quarterly AuditGPT Claim Verification Certificate, proving that their public claims have been independently reviewed against visible evidence.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">Quarterly Certification</div>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm bg-stone-50">
                <Shield className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">Built for Trust Sectors</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Perfect for agencies serving healthcare, med spas, legal, finance, and AI/SaaS — industries where an unsupported claim can lead to regulatory action or lost deals.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">Compliance-Adjacent</div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="text-center py-12 border-t border-stone-200">
            <h2 className="font-serif text-3xl mb-4 text-stone-900">Ready to differentiate your agency?</h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">Equip your team with the intelligence engine that stops claim drift before it becomes a liability.</p>
            <Link href="/pricing" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center">
              Start Agency Plan — $799/mo <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
