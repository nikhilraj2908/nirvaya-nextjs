import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Doctor } from '@/models';
import { ensureDatabaseSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    await ensureDatabaseSeeded();

    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const all = searchParams.get('all') === 'true';

    const filter = {};
    if (!all) {
      filter.isActive = true;
    }
    if (specialty) {
      filter.specialties = { $regex: specialty, $options: 'i' };
    }

    const doctors = await Doctor.find(filter).sort({ displayOrder: 1 });

    return NextResponse.json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (err) {
    console.error('[api/doctors] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve doctors', error: err.message },
      { status: 500 }
    );
  }
}
