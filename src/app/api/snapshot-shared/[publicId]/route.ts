// ============================================================
// POST /api/snapshot-shared/[publicId]
// ============================================================
// Minimal share-event logger. No dashboard. No attribution.
// Just a forensic log we can grep to see whether snapshots are
// being shared publicly within 7 days.
//
// Storage: append-only CSV at .data/snapshot-shares.csv
// (created lazily). The .data/ dir is gitignored.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

const LOG_DIR = path.join(process.cwd(), '.data');
const LOG_FILE = path.join(LOG_DIR, 'snapshot-shares.csv');
const HEADER = 'ts,publicId,referrer,userAgent,ip\n';

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function ensureLog(): Promise<void> {
  await fs.mkdir(LOG_DIR, { recursive: true });
  try {
    await fs.access(LOG_FILE);
  } catch {
    await fs.writeFile(LOG_FILE, HEADER, 'utf8');
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> },
) {
  try {
    const { publicId } = await params;
    if (!publicId || typeof publicId !== 'string') {
      return NextResponse.json({ ok: false, error: 'missing publicId' }, { status: 400 });
    }

    const referrer = req.headers.get('referer') || req.headers.get('referrer') || '';
    const userAgent = req.headers.get('user-agent') || '';
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip')?.trim() ||
      '';

    await ensureLog();
    const line =
      [
        new Date().toISOString(),
        publicId.slice(0, 64),
        referrer.slice(0, 200),
        userAgent.slice(0, 200),
        ip.slice(0, 64),
      ]
        .map(csvEscape)
        .join(',') + '\n';
    await fs.appendFile(LOG_FILE, line, 'utf8');

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { message?: string };
    console.error('snapshot-share log failure:', e?.message || err);
    // Never block on logging failure.
    return NextResponse.json({ ok: false });
  }
}
