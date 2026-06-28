import nodemailer from 'nodemailer';

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
