import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { Blog } from '@/models';
import { ensureDatabaseSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    await ensureDatabaseSeeded();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';

    const filter = {};
    if (status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const blogs = await Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (err) {
    console.error('[api/blogs] Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newBlog = await Blog.create({
      id: `blog-${crypto.randomUUID().substring(0, 8)}`,
      title: body.title,
      slug,
      excerpt: body.excerpt || '',
      body: body.body,
      category: body.category || 'Retina',
      tags: body.tags || [],
      coverImage: body.coverImage || '',
      coverAlt: body.coverAlt || body.title,
      author: body.author || 'Dr. Sandhya Gaur (MD AIIMS)',
      readingMinutes: body.readingMinutes || 5,
      status: body.status || 'published',
      publishedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Blog published successfully',
      blog: newBlog
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
