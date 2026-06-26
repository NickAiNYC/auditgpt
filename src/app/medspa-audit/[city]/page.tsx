import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { topCities, CityData } from './cities';
import { Logo } from '@/components/logo';

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
    title: `Medical Spa Compliance & Demand Governance Audit in ${cityData.name}, ${cityData.state} | Scrutexity`,
    description: `Stop demand leakage for your medical aesthetics practice in ${cityData.name}. Get a diagnostic snapshot mapping the gap between your clinical claims, evidence, and local booking conversions.`,
  };
}

export default function MedspaAuditCityPage({ params }: Props) {
  const cityData = topCities.find((c) => c.slug === params.city);

  if (!cityData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] text-stone-900 font-sans selection:bg-stone-200">
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
          Local Availability: {cityData.name}, {cityData.state}
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Stop Demand Leakage for <br />
          <span className="text-stone-500">Medical Spas in {cityData.name}.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
          High-volume clinics in {cityData.name} are losing bookings because their marketing claims are disconnected from their clinical governance. We map exactly where your high-intent traffic abandons.
        </p>

        <a 
          href="/deployment" 
          className="inline-block bg-stone-900 text-stone-50 font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-800 transition-colors shadow-sm"
        >
          Request Baseline Snapshot
        </a>

        <div className="mt-20 text-left border border-stone-200 bg-white p-8 rounded-sm shadow-sm">
          <h2 className="text-xl font-medium mb-4">Why {cityData.name} Clinics Need Demand Governance</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The medical aesthetics market in {cityData.name} is highly competitive. When patients search for "zero-downtime" or "FDA-approved" treatments, they expect immediate clinical substantiation. 
          </p>
          <p className="text-stone-600 leading-relaxed">
            If your marketing funnel makes an aggressive claim that isn't instantly supported by an executing provider's bio or a clinical study, educated patients bounce. Our Radar Pilot establishes a read-only parallel connection to your booking software to measure exactly how much revenue this disconnect is costing you locally.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 mt-auto bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-stone-500 font-mono">
          System 01 // Demand Governance explicitly tailored for {cityData.name}, {cityData.state}
        </div>
      </footer>
    </div>
  );
}
