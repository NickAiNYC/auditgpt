import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteUrl, email, address } = body;

    // 1. Honeypot check for basic bot protection
    if (address) {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
    }

    if (!websiteUrl || !email) {
      return NextResponse.json({ error: 'Missing required fields: websiteUrl, email.' }, { status: 400 });
    }

    // 2. URL normalization
    let normalizedUrl = websiteUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // 3. Prepare dossier metadata
    const dossierId = `ld-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const leadData = {
      dossierId,
      websiteUrl: normalizedUrl,
      email: email.trim().toLowerCase(),
      sourcePage: '/legitscript-dossier',
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    console.log('[LEGITSCRIPT DOSSIER LEAD]', leadData);

    // 4. Attempt Resend email (Production)
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AuditGPT <noreply@auditgpt.ai>',
            to: process.env.ADMIN_EMAIL,
            subject: `New LegitScript Dossier Request: ${normalizedUrl}`,
            html: `
              <h2>LegitScript Dossier Request</h2>
              <p><strong>Dossier ID:</strong> ${dossierId}</p>
              <p><strong>URL:</strong> <a href="${normalizedUrl}">${normalizedUrl}</a></p>
              <p><strong>Email:</strong> ${email}</p>
            `,
          }),
        });
        console.log('[RESEND] LegitScript dossier lead email sent.');
      } catch (e) {
        console.error('[RESEND ERROR]', e);
      }
    } else {
      console.log('[RESEND SKIPPED] Missing RESEND_API_KEY or ADMIN_EMAIL.');
    }

    // 5. Local JSONL write (Dev/Fallback)
    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      const filePath = path.join(dataDir, 'leads.jsonl');
      await fs.appendFile(filePath, JSON.stringify(leadData) + '\n');
      console.log('[JSONL] LegitScript dossier lead saved locally.');
    } catch (fsError) {
      console.error('[JSONL ERROR] Could not save to filesystem. (Normal on Vercel)', fsError);
    }

    // 6. Return structured dossier response
    return NextResponse.json({
      dossierId,
      claimCount: 0,
      practitionerCount: 0,
      remediationLog: {
        total: 0,
        resolved: 0,
        pending: 0,
        items: [],
      },
      status: 'pending',
    });
  } catch (error) {
    console.error('Error processing LegitScript dossier request:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
