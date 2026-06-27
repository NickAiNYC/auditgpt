import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, email, businessType, address } = body;

    // 1. Honeypot check for basic bot protection
    if (address) {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
    }

    if (!url || !email || !businessType) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // 2. URL Normalization
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // 3. Prepare Lead Data
    const leadId = Date.now().toString();
    const leadData = {
      id: leadId,
      websiteUrl: normalizedUrl,
      email: email.trim(),
      businessType,
      sourcePage: "/ai-answer-reality/sample",
      submittedAt: new Date().toISOString(),
      status: "new",
      trigger_found: "unclear"
    };

    console.log('[LEAD INGESTED]', leadData);

    // 4. Send Resend Email (Production Truth)
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Scrutexity <noreply@auditgpt.ai>', // adjust depending on verified domain
            to: process.env.ADMIN_EMAIL,
            subject: `New Scan Requested: ${normalizedUrl}`,
            html: `
              <h2>New Claim Drift Scan Lead</h2>
              <p><strong>URL:</strong> <a href="${normalizedUrl}">${normalizedUrl}</a></p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Segment:</strong> ${businessType}</p>
            `
          })
        });
        console.log('[RESEND] Email sent successfully.');
      } catch (e) {
        console.error('[RESEND ERROR]', e);
      }
    } else {
      console.log('[RESEND SKIPPED] Missing RESEND_API_KEY or ADMIN_EMAIL.');
    }

    // 5. Attempt Local JSONL Write (Dev/Fallback)
    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      const filePath = path.join(dataDir, 'leads.jsonl');
      await fs.appendFile(filePath, JSON.stringify(leadData) + '\n');
      console.log('[JSONL] Saved locally.');
    } catch (fsError) {
      console.error('[JSONL ERROR] Could not save to filesystem. (Normal on Vercel)', fsError);
    }

    // 6. Return Success
    return NextResponse.json({ success: true, message: 'Scan requested successfully.' });
  } catch (error) {
    console.error('Error processing claim drift scan request:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
