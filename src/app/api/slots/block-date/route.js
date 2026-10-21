import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { BlockedDate } from '@/models';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { date, reason = 'Holiday', blockedBy = 'Admin' } = body;

    if (!date) {
      return NextResponse.json({ success: false, message: 'Date is required' }, { status: 400 });
    }

    const existing = await BlockedDate.findOne({ date });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Date is already blocked' }, { status: 400 });
    }

    const created = await BlockedDate.create({
      id: `blk_${crypto.randomUUID().substring(0, 8)}`,
      date,
      reason,
      blockedBy
    });

    return NextResponse.json({
      success: true,
      message: `Date ${date} has been blocked`,
      blockedDate: created
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
