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
    const month = searchParams.get('month');

    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or missing month parameter. Format must be YYYY-MM (e.g., 2026-10)'
        },
        { status: 400 }
      );
    }

    await connectDB();
    const doctor = getDoctorSchedule(doctorId);
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    const daysInMonth = new Date(year, monthNum, 0).getDate();

    const doctorAppointments = await Appointment.find({
      doctorId,
      preferredDate: { $regex: `^${month}` },
      status: { $ne: 'cancelled' }
    });

    const blockedDates = await BlockedDate.find({});

    const daysMap = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${month}-${dayStr}`;

      const slotResult = getDoctorSlotsForDate(doctorId, dateStr, doctorAppointments, blockedDates);

      if (slotResult.isBlocked) {
        daysMap[dateStr] = {
          isBookable: false,
          reason: slotResult.reason,
          availableSlotsCount: 0,
          totalSlots: 0
        };
      } else {
        const availableCount = slotResult.slots.filter((s) => s.isAvailable).length;
        const totalCount = slotResult.slots.length;

        daysMap[dateStr] = {
          isBookable: availableCount > 0,
          reason: availableCount === 0 ? 'Fully booked' : null,
          availableSlotsCount: availableCount,
          totalSlots: totalCount
        };
      }
    }

    return NextResponse.json({
      success: true,
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      month,
      timeZone: TIME_ZONE,
      timeZoneLabel: SCHEDULE_SETTINGS.timeZoneLabel,
      days: daysMap
    });
  } catch (err) {
    console.error('[api/availability] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve doctor availability', error: err.message },
      { status: 500 }
    );
  }
}
