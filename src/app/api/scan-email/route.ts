import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// Post-result email capture: the scan itself is never gated on this.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { publicId, email, address } = body as {
      publicId?: string;
      email?: string;
      address?: string; // honeypot
    };

    if (address) {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
    }
    if (!publicId || typeof publicId !== 'string' || publicId.length > 40) {
      return NextResponse.json({ error: 'A scan id is required.' }, { status: 400 });
    }
    const trimmedEmail = (email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 254) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const { getPublicAudit } = await import('@/lib/audit-persistence');
    const audit = await getPublicAudit(publicId);
    if (!audit) {
      return NextResponse.json({ error: 'Scan not found.' }, { status: 404 });
    }

    const reportUrl = `https://auditgpt.ai/audit/${audit.publicId}`;
    const leadData = {
      id: Date.now().toString(),
      publicId: audit.publicId,
      websiteUrl: audit.websiteUrl || null,
      email: trimmedEmail,
      sourcePage: `/audit/${audit.publicId}`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      await fs.appendFile(
        path.join(dataDir, 'leads.jsonl'),
        JSON.stringify(leadData) + '\n'
      );
    } catch (fsErr) {
      console.error('Lead persistence failed (non-fatal):', fsErr);
    }

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AuditGPT <noreply@auditgpt.ai>',
            to: trimmedEmail,
            subject: `Your AuditGPT scan of ${audit.websiteUrl || 'your website'}`,
            html: `
              <p>Here is the full copy of your first-pass claim scan:</p>
              <p><a href="${reportUrl}">${reportUrl}</a></p>
              <p style="color:#666;font-size:12px">This is a first-pass public-claims review, not legal, medical, regulatory, or financial advice. AuditGPT is a Scrutexity product.</p>
            `,
          }),
        });
        if (process.env.ADMIN_EMAIL) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'AuditGPT <noreply@auditgpt.ai>',
              to: process.env.ADMIN_EMAIL,
              subject: `Scan copy requested: ${audit.websiteUrl || audit.publicId}`,
              html: `
                <p><strong>Email:</strong> ${trimmedEmail}</p>
                <p><strong>Scan:</strong> <a href="${reportUrl}">${reportUrl}</a></p>
              `,
            }),
          });
        }
      } catch (mailErr) {
        console.error('Resend send failed (non-fatal):', mailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const e = err as { message?: string };
    console.error('Scan email capture error:', e?.message || err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
