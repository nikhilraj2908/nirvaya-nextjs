import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { SlotConfig } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let config = await SlotConfig.findOne({ id: 'cfg_default_slots' });
    if (!config) {
      config = await SlotConfig.create({
        id: 'cfg_default_slots',
        slots: [
          'Morning (10:00 AM – 1:00 PM)',
          'Evening (5:00 PM – 8:00 PM)'
        ],
        capacityPerSlot: 10
      });
    }

    return NextResponse.json({
      success: true,
      config
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    const config = await SlotConfig.findOneAndUpdate(
      { id: 'cfg_default_slots' },
      {
        slots: body.slots,
        capacityPerSlot: body.capacityPerSlot
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Slot configuration updated',
      config
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
