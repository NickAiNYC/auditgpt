import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Admin Key Protection
    const providedKey = req.headers.get('x-admin-key');
    const adminKey = process.env.ADMIN_KEY;
    
    if (!adminKey || !providedKey || providedKey !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, trigger_found } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'leads.jsonl');

    // Read existing leads
    let fileContent = '';
    try {
      fileContent = await fs.readFile(filePath, "utf-8");
    } catch (e) {
      return NextResponse.json({ error: 'No leads found' }, { status: 404 });
    }

    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    let updated = false;

    const updatedLines = lines.map(line => {
      try {
        const lead = JSON.parse(line);
        if (lead.id === id || (!lead.id && lead.email === id)) { // fallback to email if id is missing in older leads
          lead.status = status || lead.status;
          lead.trigger_found = trigger_found || lead.trigger_found;
          updated = true;
        }
        return JSON.stringify(lead);
      } catch (e) {
        return line;
      }
    });

    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Write back to JSONL
    await fs.writeFile(filePath, updatedLines.join('\n') + '\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
