import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { ResearchPaper } from '@/models';
import { ensureDatabaseSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    await ensureDatabaseSeeded();

    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const q = searchParams.get('q') || searchParams.get('search');
    const year = searchParams.get('year');

    const filter = {};
    if (specialty && specialty !== 'ALL') {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }
    if (year) {
      filter.year = parseInt(year, 10);
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { abstract: { $regex: q, $options: 'i' } },
        { journal: { $regex: q, $options: 'i' } },
        { authors: { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    const papers = await ResearchPaper.find(filter).sort({ year: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: papers.length,
      papers,
      data: papers
    });
  } catch (err) {
    console.error('[api/papers] Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPaper = await ResearchPaper.create({
      id: `paper-${crypto.randomUUID().substring(0, 8)}`,
      title: body.title,
      slug,
      authors: body.authors || 'Dr. Sandhya Gaur, et al.',
      journal: body.journal,
      year: parseInt(body.year, 10) || new Date().getFullYear(),
      volume: body.volume || '',
      issue: body.issue || '',
      pages: body.pages || '',
      abstract: body.abstract || '',
      doi: body.doi || '',
      scholarUrl: body.scholarUrl || '',
      pdfUrl: body.pdfUrl || '',
      specialty: body.specialty || 'Retina',
      citationsCount: parseInt(body.citationsCount, 10) || 0,
      keywords: body.keywords || []
    });

    return NextResponse.json({
      success: true,
      message: 'Research paper published successfully',
      paper: newPaper
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
