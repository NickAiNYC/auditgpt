import nodemailer from 'nodemailer';

const FROM = () => process.env.EMAIL_FROM || 'AuditGPT <noreply@auditgpt.ai>';
const APP_URL = () => process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// Prefer the Resend HTTP API; fall back to the configured SMTP transport.
async function deliver(input: { to: string; subject: string; text: string }): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM(), to: input.to, subject: input.subject, text: input.text }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Resend delivery failed (${res.status}): ${body.slice(0, 200)}`);
    }
    return;
  }

  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  if (!host || !user || !pass) throw new Error('Email server is not configured');
  const port = Number(process.env.EMAIL_SERVER_PORT || 465);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({ from: FROM(), to: input.to, subject: input.subject, text: input.text });
}

export type StaleMarkStage = 'stale_warning' | 'stale_expired';

export interface StaleMarkEmailInput {
  to: string;
  companyName: string;
  publicId: string;
  websiteUrl: string | null;
  stage: StaleMarkStage;
  issuedAt: Date;
  staleAt: Date; // when the review is (or was) marked stale
}

function fmt(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const LEGAL_FOOTER =
  'AuditGPT is a Scrutexity product. A claim review is a first-pass public-claims record, not legal, clinical, regulatory, or financial advice. Reviewed does not mean approved, endorsed, or error-free.';

export async function sendStaleMarkEmail(input: StaleMarkEmailInput): Promise<void> {
  const appUrl = APP_URL();
  const reportUrl = `${appUrl}/audit/${input.publicId}`;
  const rescanUrl = input.websiteUrl
    ? `${appUrl}/?url=${encodeURIComponent(input.websiteUrl)}`
    : appUrl;

  if (input.stage === 'stale_warning') {
    await deliver({
      to: input.to,
      subject: `${input.companyName}: your claim review is about to be marked stale`,
      text: [
        `The claim review we issued for ${input.companyName} on ${fmt(input.issuedAt)} carries a dated receipt.`,
        `On ${fmt(input.staleAt)} it will be marked stale in our registry. Pages change and AI answers change, and we do not stand behind an aging snapshot as if it were current.`,
        `Two ways to keep a current record:`,
        `1. Re-scan — a fresh first-pass review with an updated receipt:\n${rescanUrl}`,
        `2. Guardian monitoring — a continuous review cycle that never goes stale:\n${appUrl}/pricing`,
        `Or let it lapse: after ${fmt(input.staleAt)} the report page will show this review as stale.`,
        `Current report: ${reportUrl}`,
        LEGAL_FOOTER,
      ].join('\n\n'),
    });
    return;
  }

  await deliver({
    to: input.to,
    subject: `${input.companyName}: your claim review is now marked stale`,
    text: [
      `As of ${fmt(input.staleAt)}, the claim review for ${input.companyName} is marked stale in our registry.`,
      `That is not a penalty — it is accuracy. We no longer know what your public pages say, so we no longer present the ${fmt(input.issuedAt)} findings as current.`,
      `If your pages have changed even once since ${fmt(input.issuedAt)}, you have unreviewed claims live right now.`,
      `Run a fresh first-pass review:\n${rescanUrl}`,
      `Keep it continuously current with Guardian monitoring:\n${appUrl}/pricing`,
      `Past report (now marked stale): ${reportUrl}`,
      LEGAL_FOOTER,
    ].join('\n\n'),
  });
}

export interface ExpiryEmailInput {
  to: string;
  companyName: string;
  publicId: string;
  expiredClaimCount: number;
}

export async function sendClaimExpiryEmail(input: ExpiryEmailInput): Promise<void> {
  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  if (!host || !user || !pass) throw new Error('Email server is not configured');

  const port = Number(process.env.EMAIL_SERVER_PORT || 465);
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'AuditGPT <noreply@auditgpt.ai>',
    to: input.to,
    subject: `${input.companyName}: ${input.expiredClaimCount} trust claim${input.expiredClaimCount === 1 ? '' : 's'} expired`,
    text: [
      `${input.expiredClaimCount} claim${input.expiredClaimCount === 1 ? '' : 's'} in ${input.companyName}'s evidence ledger reached the review deadline.`,
      'The original evidence record is unchanged. The audit is now marked stale until a rescan refreshes the evidence.',
      `Review the audit: ${appUrl}/audit/${input.publicId}`,
    ].join('\n\n'),
  });
}
