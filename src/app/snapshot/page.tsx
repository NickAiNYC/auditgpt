'use client';

// ============================================================
// Free 3-Point Visibility & Trust Snapshot
// ============================================================
// One claim/trust gap + one AI/search visibility gap + one
// demand/conversion gap + the single first fix + upsell to
// Starter ($99) / Full ($299).
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { WedgeStrip } from '@/components/wedge';

const COMPANY_TYPES = [
  'AI / SaaS',
  'Agency / consulting',
  'Med spa / wellness',
  'Healthcare provider',
  'Local service business',
  'Ecommerce',
  'Marketplace',
  'Other',
];

const WORRIES = [
  'Buyers don\'t trust our claims',
  'We\'re invisible in AI/search',
  'We\'re losing inbound demand',
  'Reputation surface is weak',
  'Not sure',
];

export default function SnapshotPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [worry, setWorry] = useState('');
  const [phone, setPhone] = useState('');
  const [isAgency, setIsAgency] = useState(false);
  const [isMedical, setIsMedical] = useState(false);
  const [source] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URL(window.location.href).searchParams;
    return params.get('source') || params.get('utm_source') || '';
  });
  const [loading, setLoading] = useState(false);

  const valid = website.trim().length >= 3 && /.+@.+\..+/.test(email);

  const run = async () => {
    if (!valid || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditType: 'snapshot',
          websiteUrl: website.trim(),
          companyName: company.trim() || undefined,
          industry: companyType || undefined,
          companyType: isAgency
            ? 'agency'
            : isMedical
              ? 'medical_or_wellness'
              : companyType || undefined,
          focusNotes: [
            worry ? `Primary worry: ${worry}` : '',
            name ? `Contact: ${name}` : '',
            email ? `Email: ${email}` : '',
            phone ? `Phone: ${phone}` : '',
            source ? `Source: ${source}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Snapshot failed.');
      if (data.publicId) {
        router.push(`/audit/${data.publicId}`);
      } else {
        toast.error('Snapshot ran but no shareable link was generated.');
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || 'Snapshot failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <a
            href="/pricing"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Pricing →
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-black" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Free · 3-Point Visibility &amp; Trust Snapshot
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-4">
              See one claim gap, one visibility gap, and one demand gap — free.
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto mb-5">
              Three findings, one priority fix, one recommended next step. Takes about a minute.
            </p>
            <WedgeStrip className="justify-center" />
          </div>

          <div className="bg-white border border-border rounded-sm p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Snapshot intake</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Your name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="!text-base !rounded-sm !border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="!text-base !rounded-sm !border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Company
                </label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className="!text-base !rounded-sm !border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Website URL *
                </label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="yourcompany.com"
                  className="!text-base !rounded-sm !border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Company type
                </label>
                <Select value={companyType} onValueChange={setCompanyType}>
                  <SelectTrigger className="!rounded-sm !border-black !h-10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Primary worry
                </label>
                <Select value={worry} onValueChange={setWorry}>
                  <SelectTrigger className="!rounded-sm !border-black !h-10">
                    <SelectValue placeholder="What concerns you most?" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORRIES.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Phone (optional)
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-555-5555"
                  className="!text-base !rounded-sm !border-black"
                />
              </div>
              <div className="flex items-end gap-4 text-sm text-foreground/80">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={isAgency}
                    onCheckedChange={(c) => setIsAgency(c === true)}
                  />
                  Agency
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={isMedical}
                    onCheckedChange={(c) => setIsMedical(c === true)}
                  />
                  Medical / wellness
                </label>
              </div>
            </div>

            <button
              onClick={run}
              disabled={!valid || loading}
              className="btn-cta w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin inline" /> RUNNING SNAPSHOT...
                </>
              ) : (
                <>
                  RUN FREE SNAPSHOT <ArrowRight className="h-4 w-4 ml-2 inline" />
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              AuditGPT outputs are based on public website review and provided context. They are not legal,
              clinical, regulatory, compliance, ranking, revenue, or AI visibility guarantees.
            </p>
          </div>

          {/* Upsell strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="card-polsia p-5">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Want 5–7 findings + a 7-day fix list?
              </div>
              <div className="font-serif text-xl mb-2">Starter Audit · $99</div>
              <a
                href="/pricing"
                className="text-xs font-mono uppercase tracking-widest underline"
              >
                See Starter →
              </a>
            </div>
            <div className="card-polsia p-5">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Full visibility &amp; trust review with 30-day plan
              </div>
              <div className="font-serif text-xl mb-2">Full Audit · $299</div>
              <a
                href="/pricing"
                className="text-xs font-mono uppercase tracking-widest underline"
              >
                See Full →
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          AuditGPT by Scrutexity · Find what is unsupported, invisible, risky, or leaking.
        </div>
      </footer>
    </div>
  );
}
