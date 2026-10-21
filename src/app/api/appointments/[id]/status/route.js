import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Appointment } from '@/models';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const { status, notes } = body;

    const updateFields = { status };
    if (notes !== undefined) {
      updateFields.internalNotes = notes;
    }

    const updated = await Appointment.findOneAndUpdate(
      { $or: [{ id }, { bookingRef: id }] },
      updateFields,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: updated
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
