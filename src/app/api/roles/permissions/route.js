import { NextResponse } from 'next/server';
import { PERMISSION_DEFINITIONS } from '@/lib/permissions';

export async function GET() {
  const flatCatalog = PERMISSION_DEFINITIONS.flatMap((cat) => cat.permissions);
  return NextResponse.json({
    success: true,
    definitions: PERMISSION_DEFINITIONS,
    catalog: flatCatalog
  });
}
