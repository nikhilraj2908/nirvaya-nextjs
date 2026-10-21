import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Appointment, BlockedDate } from '@/models';
import {
  TIME_ZONE,
  SCHEDULE_SETTINGS,
  getDoctorSchedule,
  getDoctorSlotsForDate
} from '@/lib/scheduleConfig';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId') || 'doc-sandhya-01';
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing date parameter. Format must be YYYY-MM-DD' },
        { status: 400 }
      );
    }

    await connectDB();
    const doctor = getDoctorSchedule(doctorId);
    const doctorAppointments = await Appointment.find({
      doctorId,
      preferredDate: date,
      status: { $ne: 'cancelled' }
    });
    const blockedDates = await BlockedDate.find({});

    const slotResult = getDoctorSlotsForDate(doctorId, date, doctorAppointments, blockedDates);

    return NextResponse.json({
      success: true,
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      timeZone: TIME_ZONE,
      timeZoneLabel: SCHEDULE_SETTINGS.timeZoneLabel,
      isBlocked: slotResult.isBlocked,
      reason: slotResult.reason,
      slots: slotResult.slots,
      groupedSlots: slotResult.groupedSlots
    });
  } catch (err) {
    console.error('[api/slots] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve available slots', error: err.message },
      { status: 500 }
    );
  }
}
