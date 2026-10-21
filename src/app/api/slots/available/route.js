import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Appointment, BlockedDate } from '@/models';
import { getDoctorSlotsForDate } from '@/lib/scheduleConfig';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const doctorId = searchParams.get('doctorId') || 'doc-sandhya-01';

    if (!date) {
      return NextResponse.json({ success: false, message: 'Date is required' }, { status: 400 });
    }

    await connectDB();
    const doctorAppointments = await Appointment.find({
      doctorId,
      preferredDate: date,
      status: { $ne: 'cancelled' }
    });
    const blockedDates = await BlockedDate.find({});

    const slotResult = getDoctorSlotsForDate(doctorId, date, doctorAppointments, blockedDates);
    const availableSlotStrings = slotResult.slots
      .filter((s) => s.isAvailable)
      .map((s) => s.displayTime);

    return NextResponse.json({
      success: true,
      date,
      slots: availableSlotStrings
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
