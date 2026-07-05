'use client';

import { ArrowRight, Users, AlertTriangle, ShieldCheck, Eye, TrendingUp, Bell, Twitter, Instagram } from 'lucide-react';
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
      staggerChildren: 0.12,
    },
  },
};

export default function InfluencerMonitoringPage() {
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
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                Influencer &amp; Finfluencer Drift Monitoring
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-serif font-light text-5xl sm:text-6xl leading-tight mb-6 text-stone-900"
            >
              The FTC holds you responsible for what your influencers post.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              When a creator or affiliate posts an unsupported claim on behalf of your brand, regulatory liability lands on <em>your</em> desk — not theirs. The FTC has made clear that brands are responsible for claims made by sponsored creators, affiliates, and paid talent. AuditGPT monitors third-party feeds so you catch risky language before the FTC does.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex justify-center gap-4">
              <Link href="/pricing" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors flex items-center">
                Add Influencer Monitoring <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Risk Fact Strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 bg-amber-50 border border-amber-200 rounded-sm p-6 sm:p-8 text-center"
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">
                Regulatory Risk
              </span>
            </div>
            <p className="text-lg sm:text-xl font-serif text-amber-900 leading-relaxed max-w-2xl mx-auto">
              The FTC has issued 73% more warning letters since deploying AI enforcement tools.
            </p>
            <p className="text-sm text-amber-700 mt-3 max-w-xl mx-auto">
              Affiliate posts, TikTok reviews, and Instagram stories are scanned alongside your website claims — because the FTC holds you liable for both.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  What You Get
                </span>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900"
              >
                Expand your compliance perimeter to social feeds.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-stone-500 max-w-lg mx-auto">
                Your website is only half the picture. Here&apos;s how we cover the rest.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={fadeInUp}
                className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm"
              >
                <Eye className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Real-Time Social Feed Scanning</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  AuditGPT monitors Instagram, TikTok, YouTube, and Twitter feeds for claims made by your affiliate network. Every post, story, and video transcript is scanned against your approved claim library.
                </p>
                <div className="flex items-center gap-2 text-stone-400">
                  <Instagram className="h-4 w-4" />
                  <Twitter className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Instagram &bull; TikTok &bull; YouTube &bull; X</span>
                </div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm"
              >
                <AlertTriangle className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Affiliate Compliance Alerts</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Get flagged the moment a creator posts a restricted health claim, unapproved testimonial, or language that contradicts your compliance playbook. Automated alerts route to your legal, marketing, or agency team.
                </p>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Slack &bull; Email &bull; Dashboard</div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm"
              >
                <ShieldCheck className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Evidence Documentation</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Every flagged post is captured with timestamp, screenshot, transcript, and claim classification. Build an audit trail for FTC inquiries, brand-safety reviews, or creator contract enforcement.
                </p>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Audit-Ready Evidence Package</div>
              </motion.div>
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  How It Works
                </span>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900"
              >
                Connect. Scan. Get alerted.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-stone-500 max-w-lg mx-auto">
                Three steps to extend your compliance monitoring from your website to every creator in your network.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-5 font-mono text-sm font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-stone-900">Connect Creator Accounts</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Link your affiliate network or individual creator handles. AuditGPT follows their public feeds and indexes new content within minutes of posting.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-5 font-mono text-sm font-bold">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-stone-900">AI Scans for Risky Claims</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Our compliance models scan every post for regulated health claims, unapproved language, and disclosure violations — calibrated to FTC Endorsement Guides.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-5 font-mono text-sm font-bold">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-stone-900">Instant Alert — &ldquo;Permanent Fat Loss&rdquo; on TikTok</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  The moment a creator posts an unsupported claim, your team gets an alert with the post, the flagged language, and a suggested remediation action.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Pricing Integration */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="bg-white border border-stone-200 p-8 sm:p-10 rounded-sm shadow-sm text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  Pricing
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-4 text-stone-900">
                Add-on to $299/mo Claim Drift Monitoring
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                Influencer &amp; Finfluencer Monitoring is available as an add-on to any AuditGPT Claim Drift Monitoring plan. Cover your website <em>and</em> your creator network under one compliance umbrella.
              </p>
              <Link
                href="/pricing"
                className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center"
              >
                Add Influencer Monitoring <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </motion.section>

          {/* Boundary Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 border-t border-stone-200 pt-8"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-4">
                Boundary &amp; Disclaimer
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed max-w-2xl mx-auto">
                AuditGPT Influencer Monitoring provides claim drift detection on third-party social media content associated with your brand. It is not a substitute for legal review, FTC compliance counsel, or a formal regulatory defense. Monitoring coverage depends on public feed accessibility and may not capture all affiliate content, especially private accounts, Stories with limited visibility, or platform API restrictions. AuditGPT does not guarantee removal of non-compliant content — flagged posts require your team&apos;s action. No tool can eliminate all regulatory risk. Use AuditGPT as part of a broader compliance program, not as your sole compliance mechanism.
              </p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
