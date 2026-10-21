import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Appointment } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const appointment = await Appointment.findOne({
      $or: [{ id }, { bookingRef: id }]
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const deleted = await Appointment.findOneAndDelete({
      $or: [{ id }, { bookingRef: id }]
    });

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
