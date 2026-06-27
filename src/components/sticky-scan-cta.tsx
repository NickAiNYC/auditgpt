'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function StickyScanCTA() {
  const router = useRouter();
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!website || !email || !businessType || loading) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/claim-drift-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: website, email, businessType, sourcePage: '/ai-answer-reality/sample' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan request failed.');
      toast.success("Request received! We will send your scan shortly.");
      setWebsite('');
      setEmail('');
      setBusinessType('');
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 p-4 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white hidden md:block">
          <h3 className="font-serif text-xl">Request Your Claim Drift Scan</h3>
          <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mt-1 max-w-sm leading-tight">
            Public pages only. No login required. Diagnostic review only — not legal, medical, clinical, or regulatory advice.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input 
            type="url" 
            placeholder="Website URL" 
            className="px-4 py-2 bg-stone-800 text-white rounded border border-stone-700 text-sm w-full sm:w-48 focus:outline-none focus:border-stone-500"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Work Email" 
            className="px-4 py-2 bg-stone-800 text-white rounded border border-stone-700 text-sm w-full sm:w-48 focus:outline-none focus:border-stone-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select 
            className="px-4 py-2 bg-stone-800 text-white rounded border border-stone-700 text-sm w-full sm:w-40 focus:outline-none focus:border-stone-500"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          >
            <option value="" disabled>Business Type</option>
            <option value="Med Spa / Wellness">Med Spa / Wellness</option>
            <option value="Healthcare Provider">Healthcare Provider</option>
            <option value="AI / SaaS">AI / SaaS</option>
            <option value="Agency">Agency</option>
            <option value="Other">Other</option>
          </select>
          <button 
            onClick={run}
            disabled={loading}
            className="px-6 py-2 bg-white text-stone-900 font-medium rounded hover:bg-stone-200 transition-colors whitespace-nowrap text-sm flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Scan'}
          </button>
        </div>
      </div>
    </div>
  );
}
