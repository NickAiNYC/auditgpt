'use client';

import { useState } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, ArrowRight, Download, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

type EnforcementLevel = 'active' | 'guidance' | 'nodata';

interface StateData {
  name: string;
  abbreviation: string;
  level: EnforcementLevel;
  enforcementType: string;
  keyStat: string;
  sourceLabel: string;
  sourceUrl: string;
}

const STATES: StateData[] = [
  // Active Enforcement (Red)
  {
    name: 'New York',
    abbreviation: 'NY',
    level: 'active',
    enforcementType: 'Multi-agency task force + license audits',
    keyStat: '223 inspected, 87 cited (Jan 2026). NYC operation Jun–Sep 2024: 15/15 locations had violations — 93% license-display, 86% safety records.',
    sourceLabel: 'NYSDOH Laser Spa Enforcement',
    sourceUrl: '#',
  },
  {
    name: 'New Jersey',
    abbreviation: 'NJ',
    level: 'active',
    enforcementType: 'Medical Spa Task Force active',
    keyStat: 'Mirza case — license revoked. Velazco — suspension. Active task force targeting unlicensed practice and supervision violations.',
    sourceLabel: 'NJ Medical Spa Task Force',
    sourceUrl: '#',
  },
  {
    name: 'California',
    abbreviation: 'CA',
    level: 'active',
    enforcementType: 'Medical Board med-spa guidance',
    keyStat: 'Medical Board of California issued formal med-spa guidance on physician supervision, scope of practice, and delegation protocols.',
    sourceLabel: 'CA Medical Board Guidance',
    sourceUrl: '#',
  },
  {
    name: 'Texas',
    abbreviation: 'TX',
    level: 'active',
    enforcementType: 'IV therapy regulation enacted',
    keyStat: 'Regulation enacted after a patient death during an IV therapy treatment at a med-spa. Stricter oversight on delegation and RN scope.',
    sourceLabel: 'TX Medical Board IV Rule',
    sourceUrl: '#',
  },
  {
    name: 'Florida',
    abbreviation: 'FL',
    level: 'active',
    enforcementType: 'Aesthetic Medicine Board oversight',
    keyStat: 'Active aesthetic medicine board oversight with dedicated enforcement. Regular inspections of med-spa facilities for scope violations.',
    sourceLabel: 'FL Aesthetic Medicine Board',
    sourceUrl: '#',
  },
  // Recent Guidance (Yellow)
  {
    name: 'Illinois',
    abbreviation: 'IL',
    level: 'guidance',
    enforcementType: 'Medical board guidance on supervision',
    keyStat: 'Illinois Medical Board issued formal guidance on physician supervision requirements in med-spa settings, clarifying delegation limits.',
    sourceLabel: 'IL Medical Board',
    sourceUrl: '#',
  },
  {
    name: 'Colorado',
    abbreviation: 'CO',
    level: 'guidance',
    enforcementType: 'Emerging enforcement framework',
    keyStat: 'State medical board developing enforcement framework for aesthetic medical practices. Public comment period underway.',
    sourceLabel: 'CO Medical Board',
    sourceUrl: '#',
  },
  {
    name: 'Washington',
    abbreviation: 'WA',
    level: 'guidance',
    enforcementType: 'Legislative review in progress',
    keyStat: 'Washington State considering med-spa oversight legislation. DOH issued advisory on RN scope in aesthetic settings.',
    sourceLabel: 'WA DOH Advisory',
    sourceUrl: '#',
  },
  {
    name: 'Massachusetts',
    abbreviation: 'MA',
    level: 'guidance',
    enforcementType: 'Board registration guidance',
    keyStat: 'Massachusetts Board of Registration in Medicine issued advisory on physician responsibilities in med-spa settings.',
    sourceLabel: 'MA BORIM Advisory',
    sourceUrl: '#',
  },
  {
    name: 'Pennsylvania',
    abbreviation: 'PA',
    level: 'guidance',
    enforcementType: 'State board review active',
    keyStat: 'Pennsylvania State Board of Medicine reviewing supervision rules for aesthetic procedures. No formal enforcement actions yet.',
    sourceLabel: 'PA Medical Board',
    sourceUrl: '#',
  },
  // No Data (Grey) — remaining states represented as regional groupings
  {
    name: 'Alabama',
    abbreviation: 'AL',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Alaska',
    abbreviation: 'AK',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Arizona',
    abbreviation: 'AZ',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Arkansas',
    abbreviation: 'AR',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Connecticut',
    abbreviation: 'CT',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Delaware',
    abbreviation: 'DE',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Georgia',
    abbreviation: 'GA',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Hawaii',
    abbreviation: 'HI',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Idaho',
    abbreviation: 'ID',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Indiana',
    abbreviation: 'IN',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Iowa',
    abbreviation: 'IA',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Kansas',
    abbreviation: 'KS',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Kentucky',
    abbreviation: 'KY',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Louisiana',
    abbreviation: 'LA',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Maine',
    abbreviation: 'ME',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Maryland',
    abbreviation: 'MD',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Michigan',
    abbreviation: 'MI',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Minnesota',
    abbreviation: 'MN',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Mississippi',
    abbreviation: 'MS',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Missouri',
    abbreviation: 'MO',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Montana',
    abbreviation: 'MT',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Nebraska',
    abbreviation: 'NE',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Nevada',
    abbreviation: 'NV',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'New Hampshire',
    abbreviation: 'NH',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'New Mexico',
    abbreviation: 'NM',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'North Carolina',
    abbreviation: 'NC',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'North Dakota',
    abbreviation: 'ND',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Ohio',
    abbreviation: 'OH',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Oklahoma',
    abbreviation: 'OK',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Oregon',
    abbreviation: 'OR',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Rhode Island',
    abbreviation: 'RI',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'South Carolina',
    abbreviation: 'SC',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'South Dakota',
    abbreviation: 'SD',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Tennessee',
    abbreviation: 'TN',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Utah',
    abbreviation: 'UT',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Vermont',
    abbreviation: 'VT',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Virginia',
    abbreviation: 'VA',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'West Virginia',
    abbreviation: 'WV',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Wisconsin',
    abbreviation: 'WI',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'Wyoming',
    abbreviation: 'WY',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
  {
    name: 'District of Columbia',
    abbreviation: 'DC',
    level: 'nodata',
    enforcementType: 'No public med-spa enforcement data',
    keyStat: 'No state-level enforcement actions or formal guidance identified from public sources.',
    sourceLabel: '',
    sourceUrl: '#',
  },
];

const LEVEL_CONFIG: Record<EnforcementLevel, { label: string; badgeClass: string; borderClass: string; icon: 'alert' | 'shield' | 'map' }> = {
  active: {
    label: 'Active Enforcement',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    borderClass: 'border-l-red-500',
    icon: 'alert',
  },
  guidance: {
    label: 'Recent Guidance',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    borderClass: 'border-l-amber-400',
    icon: 'shield',
  },
  nodata: {
    label: 'No Data',
    badgeClass: 'bg-stone-50 text-stone-500 border-stone-200',
    borderClass: 'border-l-stone-300',
    icon: 'map',
  },
};

export default function EnforcementHeatmapPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'enforcement-heatmap',
          intent: 'Download Full Enforcement Heatmap PDF',
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getIcon = (level: EnforcementLevel) => {
    switch (level) {
      case 'active':
        return <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />;
      case 'guidance':
        return <ShieldCheck className="h-5 w-5 text-amber-500 flex-shrink-0" />;
      case 'nodata':
        return <MapPin className="h-5 w-5 text-stone-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans">
      <header className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
          >
            <ArrowRight className="h-3 w-3 rotate-180" /> Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                Med-Spa Enforcement Tracker
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-serif font-light text-5xl sm:text-6xl leading-tight mb-6 text-stone-900"
            >
              Which states are enforcing med-spa claims right now?
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed"
            >
              State medical boards and task forces are moving faster than most operators expect.{' '}
              <strong className="text-stone-900">New York alone inspected 223 med-spas and cited 87 under its laser-spa enforcement statute (NY 223/87)</strong> — and that is just one state. The regulatory patchwork is widening, and enforcement risk is no longer theoretical.
            </motion.p>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-wrap items-center justify-center gap-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-red-500" />
              <span className="font-mono uppercase tracking-wider text-stone-600">Active Enforcement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-amber-400" />
              <span className="font-mono uppercase tracking-wider text-stone-600">Recent Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-stone-300" />
              <span className="font-mono uppercase tracking-wider text-stone-600">No Data / Under Review</span>
            </div>
          </motion.div>

          {/* State Cards Grid */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20"
          >
            {STATES.map((state) => {
              const config = LEVEL_CONFIG[state.level];
              return (
                <motion.div
                  key={state.abbreviation}
                  variants={fadeInUp}
                  className={`bg-white border border-stone-200 rounded-sm shadow-sm hover:shadow-md transition-shadow border-l-4 ${config.borderClass}`}
                >
                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getIcon(state.level)}
                        <h3 className="font-serif text-xl text-stone-900">{state.name}</h3>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 bg-stone-50 px-2 py-0.5 rounded-sm border border-stone-200">
                        {state.abbreviation}
                      </span>
                    </div>

                    {/* Badge */}
                    <span
                      className={`inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm border mb-3 ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>

                    {/* Enforcement type */}
                    <p className="text-sm font-medium text-stone-700 mb-2">{state.enforcementType}</p>

                    {/* Key stat */}
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">{state.keyStat}</p>

                    {/* Source link */}
                    {state.sourceLabel && state.level !== 'nodata' && (
                      <a
                        href={state.sourceUrl}
                        className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {state.sourceLabel}
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Lead Capture Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="bg-stone-900 text-white rounded-sm p-8 sm:p-12 text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  Gated Content
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-4">
                Get the Full Enforcement Heatmap PDF
              </h2>
              <p className="text-stone-400 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                Download the complete 50-state enforcement heatmap with source links, statute references, and actionable compliance steps for each jurisdiction — compiled from public medical board records, task force announcements, and published guidance.
              </p>

              {submitted ? (
                <div className="max-w-md mx-auto bg-stone-800 rounded-sm p-6">
                  <div className="flex items-center gap-2 mb-3 justify-center">
                    <Download className="h-5 w-5 text-emerald-400" />
                    <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                      Thank You
                    </span>
                  </div>
                  <p className="text-stone-300 text-sm">
                    Your download link has been sent to <strong className="text-white">{email}</strong>. Check your inbox for the full Enforcement Heatmap PDF.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work email address"
                      className="flex-1 px-4 py-3 rounded-sm text-sm text-stone-900 bg-white placeholder:text-stone-400 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
                      disabled={submitting}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-white text-stone-900 px-6 py-3 rounded-sm text-sm font-medium hover:bg-stone-100 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span className="h-4 w-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Download <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-xs mt-2 text-left">{error}</p>}
                  <p className="text-stone-500 text-[10px] mt-3 font-mono uppercase tracking-widest">
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </motion.section>

          {/* Footer Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 border-t border-stone-200 pt-8"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-4">
                Disclaimer
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                This enforcement heatmap is compiled from publicly available sources including state medical board records, published guidance documents, task force announcements, and legislative filings. It is provided for informational purposes only and does not constitute legal advice. Enforcement landscapes change rapidly — consult with qualified legal counsel for jurisdiction-specific compliance guidance. AuditGPT makes no representation that the information is complete, current, or applicable to your specific circumstances. Some states classified as &ldquo;No Data&rdquo; may have enforcement activity not captured in the public record or not yet identified. Reference to specific cases (e.g., Mirza, Velazco) is based on published board orders and public records.
              </p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
