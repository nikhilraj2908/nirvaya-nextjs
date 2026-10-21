import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Appointment } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const total = await Appointment.countDocuments();
    const pending = await Appointment.countDocuments({ status: 'pending' });
    const confirmed = await Appointment.countDocuments({ status: 'confirmed' });
    const inConsultation = await Appointment.countDocuments({ status: 'in_consultation' });
    const completed = await Appointment.countDocuments({ status: 'completed' });
    const cancelled = await Appointment.countDocuments({ status: 'cancelled' });

    return NextResponse.json({
      success: true,
      summary: {
        total,
        pending,
        confirmed,
        inConsultation,
        completed,
        cancelled
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
