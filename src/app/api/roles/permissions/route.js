import { NextResponse } from 'next/server';
import { PERMISSION_DEFINITIONS } from '@/lib/permissions';

export async function GET() {
  return NextResponse.json({
    success: true,
    definitions: PERMISSION_DEFINITIONS
  });
}
