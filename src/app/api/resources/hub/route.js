import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Blog, ResearchPaper } from '@/models';
import { ensureDatabaseSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    await ensureDatabaseSeeded();

    const blogs = await Blog.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 });
    const papers = await ResearchPaper.find({}).sort({ year: -1, createdAt: -1 });

    const hub = {
      sectionTitle: 'Knowledge & Publications',
      sectionSubtitle: 'Explore peer-reviewed scientific studies and patient education guides from Nirvaya Eyecare Centre',
      subOptions: [
        {
          id: 'blogs',
          title: 'Articles & Patient Guides',
          slug: 'blog',
          icon: 'FileText',
          description: 'Read practical medical perspectives on retinal health, digital eye strain, diabetic eye care, and emergency warning signs.',
          count: blogs.length,
          countLabel: `${blogs.length} Articles Published`,
          ctaText: 'Read Articles',
          route: '/blog',
          recentHighlights: blogs.slice(0, 3).map((b) => ({
            id: b.id,
            title: b.title,
            slug: b.slug,
            category: b.category,
            readingMinutes: b.readingMinutes,
            publishedAt: b.publishedAt || b.createdAt
          }))
        },
        {
          id: 'papers',
          title: 'Research Papers & Clinical Studies',
          slug: 'research',
          icon: 'BookOpen',
          description: 'Explore indexed peer-reviewed publications, surgical techniques, and clinical research in vitreoretinal surgery by Dr. Sandhya Gaur.',
          count: papers.length,
          countLabel: `${papers.length} Indexed Publications`,
          ctaText: 'Explore Research',
          route: '/research',
          recentHighlights: papers.slice(0, 3).map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            journal: p.journal,
            year: p.year,
            specialty: p.specialty,
            citationsCount: p.citationsCount
          }))
        }
      ]
    };

    return NextResponse.json({
      success: true,
      hub
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
