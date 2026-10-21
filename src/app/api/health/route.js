import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ensureDatabaseSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    await ensureDatabaseSeeded();
    return NextResponse.json({
      status: 'online',
      system: 'Nirvaya Eyecare Centre Full-Stack Next.js Engine',
      version: '2.0.0',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({
      status: 'degraded',
      system: 'Nirvaya Eyecare Centre Full-Stack Next.js Engine',
      version: '2.0.0',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
