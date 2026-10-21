import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Blog } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const categories = await Blog.distinct('category', { status: 'published' });
    return NextResponse.json({
      success: true,
      categories: ['All', ...categories.filter(Boolean)]
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
