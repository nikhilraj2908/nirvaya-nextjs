import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Session } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeSessions = await Session.find({ updatedAt: { $gte: fifteenMinutesAgo } });

    return NextResponse.json({
      success: true,
      activeNow: Math.max(activeSessions.length, 1),
      stats: {
        activeVisitorsLast15Min: Math.max(activeSessions.length, 1)
      },
      sessions: activeSessions.map((s) => ({
        sessionId: s.sessionId,
        device: s.device,
        lastSeenAt: s.updatedAt,
        entryPath: s.firstPath
      }))
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
