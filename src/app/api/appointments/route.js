import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { Appointment } from '@/models';
import { generateBookingRef } from '@/lib/scheduleConfig';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const search = searchParams.get('search');

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (doctorId && doctorId !== 'all') {
      filter.doctorId = doctorId;
    }
    if (date) {
      filter.preferredDate = date;
    }
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookingRef: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const bookingRef = generateBookingRef();
    const newAppointment = await Appointment.create({
      id: crypto.randomUUID(),
      bookingRef,
      patientName: body.patientName,
      phone: body.phone,
      email: body.email || null,
      age: body.age ? parseInt(body.age, 10) : null,
      city: body.city || 'Bhopal',
      specialty: body.specialty || 'Retina & Vitreoretinal Surgery',
      preferredDate: body.preferredDate,
      preferredSlot: body.preferredSlot,
      doctorId: body.doctorId || 'doc-sandhya-01',
      slotId: body.slotId || null,
      reason: body.reason || '',
      status: body.status || 'pending',
      internalNotes: body.internalNotes || '',
      assignedDoctor: body.assignedDoctor || 'Dr Sandhya Gaur (MD AIIMS)',
      source: body.source || 'admin',
      sessionId: body.sessionId || null
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: newAppointment
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
