import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { topCities, CityData } from './cities';
import { Logo } from '@/components/logo';
import { JsonLd, generateLocalFaqSchema } from '@/components/json-ld';

type Props = {
  params: { city: string };
};

export async function generateStaticParams() {
  return topCities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityData = topCities.find((c) => c.slug === params.city);
  
  if (!cityData) {
    return {};
  }

  return {
    title: `Claim Intelligence Audit for Medical Spas in ${cityData.name}, ${cityData.state} | AuditGPT`,
    description: `Stop claim drift for your medical aesthetics practice in ${cityData.name}. Understand ${cityData.state} compliance risks and map the gap between your clinical claims and evidence.`,
  };
}

export default function MedspaAuditCityPage({ params }: Props) {
  const cityData = topCities.find((c) => c.slug === params.city);

  if (!cityData) {
    notFound();
  }

  const faqSchema = generateLocalFaqSchema(cityData.name, cityData.topLocalClaim);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] text-stone-900 font-sans selection:bg-stone-200">
      <JsonLd type="FAQPage" data={faqSchema} />
      <header className="border-b border-stone-200/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <a href="/deployment" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">
            Get Snapshot
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono uppercase tracking-widest text-stone-500 mb-8">
          Local Market Report: {cityData.name}, {cityData.state}
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Stop Claim Drift for <br />
          <span className="text-stone-500">Medical Spas in {cityData.name}.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
          The {cityData.name} market is <strong>{cityData.marketSaturation.toLowerCase()}ly saturated</strong>. Clinics are losing bookings because aggressive marketing claims—like <em>"{cityData.topLocalClaim}"</em>—are disconnected from clinical governance.
        </p>

        <a 
          href="/deployment" 
          className="inline-block bg-stone-900 text-stone-50 font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-800 transition-colors shadow-sm"
        >
          Request Baseline Snapshot
        </a>

        <div className="mt-20 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-stone-200 bg-white p-8 rounded-sm shadow-sm">
            <h2 className="text-sm font-mono uppercase tracking-widest text-stone-500 mb-4 border-b border-stone-100 pb-2">The Leakage Vector</h2>
            <p className="text-stone-600 leading-relaxed text-sm mb-4">
              When patients search for advanced aesthetic treatments in {cityData.name}, they expect immediate clinical substantiation. If your funnel makes a claim that isn't immediately supported by an executing provider's bio or a clinical study, educated patients bounce.
            </p>
            <p className="text-stone-600 leading-relaxed text-sm">
              Our Radar Pilot establishes a read-only parallel connection to your booking software to measure exactly how much revenue this disconnect is costing you locally.
            </p>
          </div>

          <div className="border border-amber-200 bg-amber-50/50 p-8 rounded-sm shadow-sm">
            <h2 className="text-sm font-mono uppercase tracking-widest text-amber-800 mb-4 border-b border-amber-200/50 pb-2">State Compliance Risk: {cityData.state}</h2>
            <p className="text-amber-900/80 leading-relaxed text-sm">
              Beyond lost conversions, unsupported claims carry significant regulatory exposure. In {cityData.state}, clinics face intense scrutiny:
            </p>
            <div className="mt-4 p-4 bg-white/60 border border-amber-200 rounded text-sm text-amber-900 font-medium">
              {cityData.stateComplianceRisk}
            </div>
          </div>
        </div>

        <div className="mt-16 text-left max-w-3xl mx-auto">
          <h2 className="text-2xl font-medium mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-6">
              <h3 className="font-medium text-lg mb-2">Why are medical spas in {cityData.name} losing visibility in AI search results?</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Many clinics in {cityData.name} are being omitted from AI-generated recommendations because their public-facing pages contain unsupported claims (like "{cityData.topLocalClaim}") that AI answer engines cannot verify. AuditGPT identifies which claims need stronger proof.
              </p>
            </div>
            <div className="border-b border-stone-200 pb-6">
              <h3 className="font-medium text-lg mb-2">What is a Claim Intelligence audit for {cityData.name} aesthetics practices?</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                A Claim Intelligence audit reviews your public buyer-facing pages to identify unsupported claims, evidence gaps, and AI Answer Reality risks before buyers, investors, or AI search systems repeat or distrust them.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 mt-auto bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-stone-500 font-mono">
          AuditGPT by Scrutexity — Claim Intelligence for {cityData.name}, {cityData.state}
        </div>
      </footer>
    </div>
  );
}
