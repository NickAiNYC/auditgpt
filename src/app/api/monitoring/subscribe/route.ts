import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/subscription';

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url, frequency = 'monthly' } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const subscription = await db.monitorSubscription.upsert({
      where: {
        userId_url: { userId, url },
      },
      update: {
        status: 'active',
        frequency,
      },
      create: {
        userId,
        url,
        frequency,
        status: 'active',
        notificationsEnabled: true,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error('Failed to create monitor subscription:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
