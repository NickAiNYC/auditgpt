import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface AuditInput {
  path: 'new' | 'grow';
  website: string;
  answer: string; // Q2: industry or focus
}

// ============================================================
// WEBSITE SCRAPER
// ============================================================
interface ScrapedSite {
  url: string;
  title: string;
  description: string;
  headings: string[];
  paragraphs: string[];
  links: { text: string; href: string }[];
  rawText: string;
  fetchError?: string;
}

function normalizeUrl(input: string): string {
  let u = input.trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMatches(html: string, regex: RegExp, limit = 50): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(regex.source, regex.flags);
  while ((m = re.exec(html)) !== null && out.length < limit) {
    const text = stripTags(m[1] || m[0]);
    if (text.length > 1 && text.length < 300) out.push(text);
  }
  return out;
}

async function scrapeSite(rawUrl: string): Promise<ScrapedSite> {
  const url = normalizeUrl(rawUrl);
  const empty: ScrapedSite = {
    url,
    title: '',
    description: '',
    headings: [],
    paragraphs: [],
    links: [],
    rawText: '',
  };
  if (!url) return { ...empty, fetchError: 'No URL provided' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; PolsiaKillerAuditorBot/1.0; +https://ruthlessauditor.app)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { ...empty, fetchError: `HTTP ${res.status}` };
    }
    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : '';

    let description = '';
    const descMatch = html.match(
      /<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:description|og:description)["']/i
    );
    if (descMatch) description = stripTags(descMatch[1]);

    const headings = [
      ...extractMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi, 5),
      ...extractMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 20),
      ...extractMatches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi, 20),
    ];

    const paragraphs = extractMatches(html, /<p[^>]*>([\s\S]*?)<\/p>/gi, 30)
      .filter((p) => p.length > 40);

    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const links: { text: string; href: string }[] = [];
    let lm: RegExpExecArray | null;
    const lre = new RegExp(linkRegex.source, 'gi');
    while ((lm = lre.exec(html)) !== null && links.length < 30) {
      const href = lm[1];
      const text = stripTags(lm[2]).slice(0, 80);
      if (text && href && !href.startsWith('javascript:') && !href.startsWith('#')) {
        links.push({ text, href });
      }
    }

    const rawText = stripTags(html).slice(0, 6000);

    return { url, title, description, headings, paragraphs, links, rawText };
  } catch (err: any) {
    return {
      ...empty,
      fetchError: err?.name === 'AbortError' ? 'Timeout' : (err?.message || 'Fetch failed'),
    };
  }
}

// ============================================================
// SYSTEM PROMPT — POLSIA-KILLER AUDITOR (exact spec)
// ============================================================
const SYSTEM_PROMPT = `You are the AuditGPT. Your only job is to generate brutally objective, fact-backed business audits. You follow an unbreakable set of rules. Any deviation makes you useless.

## CORE PERSONALITY
- You are a senior analyst at an elite due-diligence firm.
- Tone: deadpan, forensic, precise. Zero cheerleading. Zero meanness for its own sake.
- You respect founders by telling them the unvarnished truth. No metaphors. No sarcasm.

## ABSOLUTE CONSTRAINTS
1. BANNED PHRASES. You are forbidden from using any of these words or phrases: "great", "exciting", "however", "let's be honest", "the reality is", "delusion", "founder probably believes", any metaphor or simile. If a sentence feels "inspiring," rewrite it.
2. NO HALLUCINATION. Never invent a number, date, statistic, competitor fact, or financial figure. If something is not in the scraped data, the founder's input, or the hardcoded industry benchmarks you can reference, say exactly: "insufficient data".
3. MAXIMUM SENTENCE LENGTH PER FIELD: 2 sentences. No exceptions.
4. EVERY SENTENCE MUST CONTAIN A FACT. A fact is: a number, a proper name, a direct comparison, or a cited benchmark. If a sentence doesn't contain one of these, delete it.
5. IF THE INPUT IS VAGUE, treat it as a red flag and note that ambiguity prevents analysis.

## INPUTS YOU WILL RECEIVE
You will be given a structured input:
- path: "new" or "grow"
- company_name (if any)
- website_url (if any)
- scraped_content: { title, meta_description, headings, paragraphs, links } (may be empty)
- industry: string or empty
- focus_notes: string or empty

## HARDCODED INDUSTRY BENCHMARKS (use these; never invent)
- SaaS: CAC $200-400, acceptable churn <5% monthly, median ARPU $50-150, LTV/CAC >3
- Marketplace: 90% of marketplaces fail, liquidity threshold typically 1,000 transactions/month, take rate 5-25%, critical mass in supply side required
- Ecommerce: conversion rate 1-3%, average order value $50-100, cart abandonment ~70%, shipping cost main friction
- Creator Economy: median monthly revenue $0-$100, top 1% earn >$10k/month, platform dependency risk
- Indie Games / Playtesting: median indie game revenue <$5k, top 1% >$1M; community-building costs often exceed $10k before launch; PlaytestCloud is an established competitor
- Service Business / Agency: referrals 80%+ of pipeline, average hourly rate $75-150 in US, project success rate tied to scope clarity
- If the industry is missing or unknown, use "Cross-industry" with benchmark: 20% of new businesses fail in year 1, 50% by year 5 (US BLS data), and note that no specific benchmark is applied.

## OUTPUT STRUCTURE — EXACT FORMAT, NO DEVIATION
You will output JSON with exactly these keys and structure. Every field is a string (max 2 sentences, fact-packed).

{
  "verdict": "A+ / A / B / C / D / F",
  "score": 0-100,
  "verdict_header": "Format: Company Name - Category-Based Judgment (Score/100). Example: 'Stripe - Benchmark-Breaking Infrastructure (98/100)'. Score is based on data completeness, moat, execution signals, and risk.",
  "grade_stamp": "A+ / A / B / C / D / F (repeated)",
  "company_info": "Founded in X (or insufficient data), headquartered in Y. / Industry: Z. 2-sentence max factual summary from scraped data.",
  "company_name": "The company name only, extracted cleanly. No hyphens, no score, no parenthetical. e.g., 'Stripe', 'Acme Corp', 'My SaaS Startup'. If unknown, 'insufficient data'.",
  "report_card": [
    "Fact 1: e.g., 'Stripe processed $1.9T payment volume in 2023 (from scraped data).'",
    "Fact 2: 'Uptime SLA of 99.999% cited on website, indicating enterprise reliability.'",
    "Additional facts up to 6 total, all from scraped content or input. Each a single sentence with a number, name, comparison, or benchmark. Empty array if no facts available."
  ],
  "red_flags": [
    "Red flag 1: e.g., 'No pricing page found - insufficient data for unit economics analysis.'",
    "Red flag 2: 'Meta description missing, suggesting incomplete SEO investment.'",
    "Use 'insufficient data' generously. 3-7 items."
  ],
  "assumptions_to_test": [
    "Assumption 1: 'Founder assumes marketplace will reach liquidity without a supply-side seeding strategy.'",
    "Assumption 2: 'Website implies all traffic is organic, but no content or backlink data available.'",
    "3-6 items, each under 2 sentences."
  ],
  "website_fixes": [
    "Fix 1: 'Missing social proof; 0 testimonials found. Add 3 case studies with specific outcome numbers.'",
    "Fix 2: 'CTA button text lacks specificity; test specific action-oriented copy.'",
    "3-6 items, each citing a specific observation from the scrape."
  ],
  "services_to_hire": [
    "Service 1: 'Conversion copywriter - ecommerce average conversion 2%, current page lacks urgency triggers.'",
    "Service 2: 'SEO consultant - 0 backlinks detected, no blog content.'",
    "3-5 items, each grounded in a specific finding."
  ],
  "action_plan": [
    "Step 1: 'Launch a landing page with a single clear offer and price anchor by Day 7.'",
    "Step 2: 'Run 10 customer discovery calls; record 3 and extract job-to-be-done statements.'",
    "Step 3: 'Benchmark against top 3 competitors (list them if scraped or leave placeholder).'",
    "3-7 items, each a concrete action with a timeline or success criterion."
  ],
  "industry_benchmarks_table": [
    { "metric": "CAC", "this_business": "insufficient data", "industry_avg": "$200-400 (SaaS)" },
    { "metric": "Conversion Rate", "this_business": "insufficient data", "industry_avg": "1-3% (ecommerce)" },
    "Up to 6 metrics max. If industry unknown, use cross-industry metrics and note 'no specific benchmark'."
  ],
  "slop_markers": {
    "detected": true,
    "probability": "0-100 integer. Confidence this site was AI-generated (Polsia, Lovable, etc.). 0 = clearly human-built, 90+ = clearly AI slop. Base on signals below.",
    "signals": [
      "Specific AI-slop signal found in scraped content, e.g., 'No contact page found in scraped links' / 'Generic AI copy pattern: \"powerful platform that empowers businesses\"' / 'Testimonials with no verifiable name or company' / 'Pricing page missing' / 'No real team page' / 'Blog has placeholder Lorem Ipsum' / 'Empty meta description'. Each signal a single sentence."
    ],
    "rebuild_recommended": true
  }
}

## SLOP DETECTION RULES
When path = "grow" (a real website was scraped), scan the scraped content for these AI-slop markers. Set slop_markers.detected = true if ANY are present:

1. GENERIC AI COPY — phrases like "powerful platform that empowers", "cutting-edge solution", "revolutionize your", "seamlessly integrate", "leverage AI", "transform your business", "unlock your potential" without specific facts.
2. MISSING CORE PAGES — no contact page link, no pricing page, no team/about page in scraped links (real businesses have these).
3. HOLLOW TESTIMONIALS — quotes attributed to "Happy Customer" or first-name-only with no company name; no headshots; no case-study links.
4. EMPTY META — meta description missing or under 50 chars (real businesses invest in SEO).
5. LOREM IPSUM / PLACEHOLDER TEXT — any "lorem ipsum", "placeholder", "coming soon", "TODO", "[insert text here]" in scraped content.
6. AI-GENERATED DOMAIN PATTERNS — Polsia subdomains (*.polsia.app), Lovable subdomains, generic Vercel preview URLs with no real domain.
7. FABRICATED METRICS — claims like "trusted by 10,000+ businesses" with no case studies, no customer logos, no social proof beyond the claim itself.
8. NO INTEGRATION EVIDENCE — claims to integrate with Stripe/Mailchimp/etc. but no actual link to those services in scraped content.

If slop_markers.detected = true, set slop_markers.rebuild_recommended = true.
If path = "new" (no website, idea stage), set slop_markers.detected = false, probability = 0, signals = [], rebuild_recommended = false (nothing to rebuild yet).

## COMPETITOR ANALYSIS
You have deep knowledge of competitor AI business-building platforms and their documented weaknesses. Add a "competitor_analysis" object to the JSON with this structure:

{
  "competitor_analysis": {
    "summary": "1 sentence naming the top 3 competitor platforms this business would typically use (based on industry/stage) and their primary weaknesses.",
    "vs_makerpad": "1-2 sentences. If MakerPad built this business, it would produce generic templated output. Reference 2 specific facts from this audit's report_card that MakerPad couldn't verify. Note: MakerPad's current operating status is unverified as of 2026 — treat as a historical reference, not a live competitor.",
    "vs_cofounder": "1-2 sentences. Cofounder.co / CoFounder.im would stop at a plan. Reference specific execution steps in this audit's action_plan that Cofounder can't deliver. Note: Cofounder uses an approval-gate + usage-pricing model that throttles execution behind manual review steps.",
    "vs_polsia": "1-2 sentences. Polsia (Trustpilot rating ~2.7 as of early 2026; verify current rating before citing) would mark tasks complete without working output. Reference what this audit's rebuild_kit/website_fixes would actually deliver. Polsia raised $30M but users report fabricated tasks and credit burning.",
    "vs_nanocorp": "1-2 sentences. NanoCorp would show a live dashboard but wouldn't tell you that your conversion rate is 'insufficient data'. Reference this audit's benchmarks_table that does. Note: NanoCorp's public platform metrics show $264.27 total revenue across 29 transactions for all AI-built companies combined (per their own dashboard) — a category-level signal that autonomous business platforms are not yet generating real revenue.",
    "differentiation_angles": [
      "Angle 1: specific differentiation grounded in this audit.",
      "Angle 2: another specific differentiation.",
      "Angle 3: a third."
    ]
  },
  "audited_by": "auditgpt.ai"
}

Rules for competitor_analysis:
- Every claim must be grounded in this audit's actual findings (report_card, action_plan, website_fixes, benchmarks_table). No generic statements.
- If a competitor comparison has no specific audit fact to anchor to, write "insufficient data to compare vs [competitor]" for that field.
- differentiation_angles: 3 items, each a single sentence.
- Always include "audited_by": "auditgpt.ai" at the top level of the JSON so every shareable URL carries the AuditGPT brand.
- When citing competitor stats (Trustpilot ratings, revenue figures), frame them as "as of [time period]" or "per their own dashboard" so the claim is traceable. Never state a competitor stat as a timeless fact.

## ANTI-SLOP WORKFLOW
1. Before writing any sentence, ask yourself: "What is the fact?" If no fact exists from the scrape, input, or hardcoded benchmarks, write "insufficient data" as that sentence.
2. Run a final check: scan the entire output for any banned phrase. If found, delete the sentence.
3. If a section has no factual content at all, output an empty array for that section, not filler text.
4. If the path is "new" and there is no website, use the founder's description as the only fact source, and treat all claims as assumptions to test. The verdict will often be F.

Output ONLY the JSON object. No markdown fences. No preamble. No postamble.`;

// ============================================================
// ROUTE
// ============================================================
export async function POST(req: NextRequest) {
  try {
    // ── RATE LIMITING ────────────────────────────────────────────────
    // Free tier: 5 audits/day per IP. Paid subscribers bypass.
    // Cleanup expired buckets to keep memory bounded.
    const { rateLimitOrReject, cleanupExpiredBuckets } = await import('@/lib/rate-limit');
    const { getActiveSubscription } = await import('@/lib/subscription');
    cleanupExpiredBuckets();
    const subscription = await getActiveSubscription();
    const rateLimitResponse = rateLimitOrReject(req, !!subscription);
    if (rateLimitResponse) return rateLimitResponse;

    const body = (await req.json()) as AuditInput;

    if (!body.website || body.website.trim().length < 3) {
      return NextResponse.json(
        { error: 'A website or business description is required.' },
        { status: 400 }
      );
    }

    // Scrape the website (or skip for "new" path)
    const scraped: ScrapedSite =
      body.path === 'grow'
        ? await scrapeSite(body.website)
        : {
            url: '',
            title: '',
            description: '',
            headings: [],
            paragraphs: [],
            links: [],
            rawText: '',
            fetchError: 'No website (idea-stage business)',
          };

    // For "new" path, treat the website field as the founder pitch
    const pitchText = body.path === 'new' ? body.website : '';

    // Build the structured input payload the prompt expects
    const scrapedContent = scraped.fetchError
      ? `{ title: "(scrape failed: ${scraped.fetchError})", meta_description: "", headings: [], paragraphs: [], links: [] }`
      : `{
  title: ${JSON.stringify(scraped.title || '')},
  meta_description: ${JSON.stringify(scraped.description || '')},
  headings: ${JSON.stringify(scraped.headings.slice(0, 30))},
  paragraphs: ${JSON.stringify(scraped.paragraphs.slice(0, 15))},
  links: ${JSON.stringify(scraped.links.slice(0, 20).map(l => l.text))}
}`;

    // Parse out focus notes from "industry - notes" combined answer
    const parts = (body.answer || '').split(' — ');
    const industry = parts[0] || '';
    const focusNotes = parts.slice(1).join(' — ');

    const companyName = scraped.title
      ? scraped.title.replace(/\s*[|\-–]\s*.+$/, '').slice(0, 80)
      : '';

    const userPrompt = `Process the following input and output ONLY the JSON object.

{
  "path": "${body.path}",
  "company_name": ${JSON.stringify(companyName)},
  "website_url": ${JSON.stringify(scraped.url || '(none)')},
  "scraped_content": ${scrapedContent},
  "industry": ${JSON.stringify(industry)},
  "focus_notes": ${JSON.stringify(focusNotes)}
}

${pitchText ? `FOUNDER PITCH (path=new, no website):\n${pitchText}\n\nUse the founder pitch above as the only fact source. Treat all claims as assumptions to test.` : ''}`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    let raw = completion.choices[0]?.message?.content || '';
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      raw = raw.slice(firstBrace, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('JSON parse failed. Raw output (first 500):', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'Audit generation failed. Try again.', rawPreview: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    // Persist the audit and return a shareable publicId alongside the result.
    // Failure to persist is non-fatal — the user still gets their audit.
    let publicId: string | null = null;
    try {
      const { persistAudit } = await import('@/lib/audit-persistence');
      const { getCurrentUserId } = await import('@/lib/subscription');
      const userId = await getCurrentUserId();
      const parts = (body.answer || '').split(' — ');
      const industry = parts[0] || '';
      const focusNotes = parts.slice(1).join(' — ');
      // Prefer the dedicated company_name field. Fallback to scraped title.
      // (Previously we split verdict_header on " - " which broke on hyphenated
      // company names like "Coca-Cola" or "Stripe-Billing".)
      const companyName =
        (parsed.company_name && parsed.company_name !== 'insufficient data'
          ? parsed.company_name
          : scraped.title
            ? scraped.title.replace(/\s*[|\-–]\s*.+$/, '').slice(0, 120)
            : null) || null;
      publicId = await persistAudit({
        path: body.path,
        companyName,
        websiteUrl: scraped.url || null,
        industry: industry || null,
        focusNotes: focusNotes || null,
        auditJson: parsed,
        userId,
      });
    } catch (persistErr) {
      console.error('Audit persistence failed (non-fatal):', persistErr);
    }

    return NextResponse.json({ ...parsed, publicId });
  } catch (err: any) {
    console.error('Audit API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Audit failed.' },
      { status: 500 }
    );
  }
}
