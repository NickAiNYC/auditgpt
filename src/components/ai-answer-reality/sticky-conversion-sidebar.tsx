"use client";

import React, { useState, useEffect } from 'react';

const BUSINESS_TYPES = [
  "Med Spa", "Wellness Clinic", "Urgent Care", 
  "Veterinary", "Healthcare Agency", "SaaS / AI Company", "Other"
];

export function StickyConversionSidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [headline, setHeadline] = useState("Is your brand drifting across AI?");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ url: '', email: '', type: '', address: '' });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Trigger visibility after scrolling past hero / 700px
      if (window.scrollY > 700 && !isVisible) {
        setIsVisible(true);
        console.log('[ANALYTICS] EVENT: sidebar_revealed');
      }

      // Contextual headline updates based on document elements
      const aiDriftSec = document.getElementById('ai-drift-map');
      const scoreSec = document.getElementById('score-card');
      const gapsSec = document.getElementById('evidence-gaps');
      const fixSec = document.getElementById('fix-list');

      const getBoundingTop = (el: HTMLElement | null) => el ? el.getBoundingClientRect().top : Infinity;

      if (getBoundingTop(fixSec) < 300) {
        setHeadline("Get your first 5 fixes.");
      } else if (getBoundingTop(gapsSec) < 300) {
        setHeadline("Find the proof gaps before buyers do.");
      } else if (getBoundingTop(scoreSec) < 300) {
        setHeadline("What would your Claim Health Score be?");
      } else if (getBoundingTop(aiDriftSec) < 300) {
        setHeadline("AI may already be rewriting your claims.");
      } else {
        setHeadline("Is your brand drifting across AI?");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ANALYTICS] EVENT: sidebar_form_started');
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch('/api/claim-drift-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.url,
          email: formData.email,
          businessType: formData.type,
          address: formData.address // honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Failed to submit request.");
      } else {
        console.log('[ANALYTICS] EVENT: sidebar_form_submitted');
        console.log('[ANALYTICS] EVENT: sidebar_success_shown');
        setFormSubmitted(true);
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 top-[96px] w-[380px] h-[calc(100vh-120px)] bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6 flex-col justify-between hidden lg:flex z-50 animate-in fade-in slide-in-from-right-4 duration-500">
      {!formSubmitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-accent block mb-2">
              AI CLAIM DRIFT CHECK
            </span>
            <h3 className="text-2xl font-serif text-foreground leading-snug mb-3 transition-all duration-300">
              {headline}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Scrutexity will map your first 25 public-facing claims and check how AI answer engines may be describing, omitting, or distorting them.
            </p>
            
            <ul className="space-y-3 mb-8">
              {["Initial Claim Health baseline", "Unsupported or overstated claim flags", "AI Answer Reality snapshot", "Competitor displacement signals", "Safer rewrite recommendations"].map((bullet, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-center">
                  <span className="text-emerald-500 mr-2 font-bold">✓</span> {bullet}
                </li>
              ))}
            </ul>

            {errorMsg && (
              <div className="mb-4 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              {/* Honeypot field - visually hidden but accessible to screen readers/bots */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label htmlFor="address">Address (do not fill)</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} tabIndex={-1} autoComplete="off" />
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Business website URL</label>
                <input required type="url" placeholder="yourbrand.com" className="w-full text-sm border border-white/10 bg-white/[0.02] rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Work email</label>
                <input required type="email" placeholder="you@company.com" className="w-full text-sm border border-white/10 bg-white/[0.02] rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Business type</label>
                <select required className="w-full text-sm border border-white/10 bg-white/[0.02] rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent appearance-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="" className="bg-black">Select industry...</option>
                  {BUSINESS_TYPES.map((type, idx) => <option key={idx} value={type} className="bg-black">{type}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-sm py-3 rounded transition-colors duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Submitting..." : "Request Your Claim Drift Scan"}
            </button>
            <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center">
              By submitting, you authorize Scrutexity to review public-facing pages from this domain and contact you about the preliminary diagnostic scan. Public pages only. No login required.
            </p>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-2xl font-bold mb-6 border border-emerald-500/20">✓</div>
          <h4 className="text-2xl font-serif text-foreground mb-4">Scan Requested.</h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            We received your public website URL. Scrutexity will review your public-facing claim surface and send a preliminary Claim Drift baseline to your email.
          </p>
          <p className="text-xs text-muted-foreground/60">
            This diagnostic is not legal, medical, clinical, or regulatory advice.
          </p>
        </div>
      )}
    </div>
  );
}
