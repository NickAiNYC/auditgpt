import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, email, businessType, address } = body;

    // Honeypot check for basic bot protection
    if (address) {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
    }

    if (!url || !email || !businessType) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // URL Normalization
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const leadData = {
      websiteUrl: normalizedUrl,
      email: email.trim(),
      businessType,
      sourcePage: "/ai-answer-reality/sample",
      submittedAt: new Date().toISOString(),
      status: "new"
    };

    // Save submission locally to data/leads.jsonl as a Supabase alternative for MVP
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    const filePath = path.join(dataDir, 'leads.jsonl');
    await fs.appendFile(filePath, JSON.stringify(leadData) + '\n');

    console.log('[LEAD INGESTED]', leadData);

    return NextResponse.json({ success: true, message: 'Scan requested successfully.' });
  } catch (error) {
    console.error('Error processing claim drift scan request:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
