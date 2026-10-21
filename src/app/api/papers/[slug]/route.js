import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ResearchPaper } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const paper = await ResearchPaper.findOne({
      $or: [{ slug: slug.toLowerCase() }, { id: slug }]
    });

    if (!paper) {
      return NextResponse.json({ success: false, message: 'Research paper not found' }, { status: 404 });
    }

    const schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ScholarlyArticle',
      headline: paper.title,
      name: paper.title,
      description: paper.abstract,
      author: [
        {
          '@type': 'Person',
          name: 'Dr. Sandhya Gaur',
          affiliation: {
            '@type': 'MedicalOrganization',
            name: 'All India Institute of Medical Sciences (AIIMS) / BMHRC Bhopal'
          }
        }
      ],
      isPartOf: {
        '@type': 'Periodical',
        name: paper.journal
      },
      datePublished: String(paper.year),
      sameAs: paper.doi ? `https://doi.org/${paper.doi}` : undefined
    };

    return NextResponse.json({
      success: true,
      paper,
      schemaJsonLd
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const deleted = await ResearchPaper.findOneAndDelete({
      $or: [{ id: slug }, { slug }]
    });

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Research paper not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Research paper deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
