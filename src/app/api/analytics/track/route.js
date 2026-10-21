import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { AnalyticsEvent, Session } from '@/models';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { eventType, sessionId, path = '/', referrer = '', device = 'desktop', metadata = {} } = body;

    if (!eventType || !sessionId) {
      return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
    }

    await AnalyticsEvent.create({
      eventType,
      sessionId,
      path,
      referrer,
      device,
      metadata,
      timestamp: new Date()
    });

    // Update or insert session
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: { device, lastPath: path },
        $setOnInsert: { firstPath: path, referrer },
        $inc: { pageViews: 1 }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, recorded: true });
  } catch (err) {
    // Non-fatal telemetry catch
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
