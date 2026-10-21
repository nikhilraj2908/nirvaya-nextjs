import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BlockedDate } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const blockedDates = await BlockedDate.find({}).sort({ date: 1 });
    return NextResponse.json({
      success: true,
      blockedDates
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
