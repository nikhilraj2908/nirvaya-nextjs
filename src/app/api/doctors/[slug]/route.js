import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Doctor } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const doctor = await Doctor.findOne({
      $or: [{ slug: slug.toLowerCase() }, { id: slug }]
    });

    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      doctor
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
