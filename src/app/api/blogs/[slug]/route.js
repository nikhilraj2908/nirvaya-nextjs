import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Blog } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const blog = await Blog.findOne({
      $or: [{ slug: slug.toLowerCase() }, { id: slug }]
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog article not found' }, { status: 404 });
    }

    // Increment views count asynchronously
    Blog.updateOne({ _id: blog._id }, { $inc: { viewsCount: 1 } }).exec().catch(() => {});

    const seo = {
      metaTitle: `${blog.title} | Dr. Sandhya Gaur | Nirvaya Eyecare Bhopal`,
      metaDescription: blog.excerpt ? blog.excerpt.substring(0, 155) : '',
      canonicalUrl: `https://nirvayaeyecare.com/blog/${blog.slug}`,
      og: {
        title: blog.title,
        description: blog.excerpt,
        image: blog.coverImage || '/assets/logo.png',
        type: 'article',
        publishedTime: blog.publishedAt || blog.createdAt
      },
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        headline: blog.title,
        description: blog.excerpt,
        image: blog.coverImage,
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt || blog.createdAt,
        author: {
          '@type': 'Physician',
          name: blog.author || 'Dr. Sandhya Gaur',
          honorificSuffix: 'MD (AIIMS), FVRS, FAICO'
        },
        publisher: {
          '@type': 'MedicalOrganization',
          name: 'Nirvaya Eyecare Centre',
          url: 'https://nirvayaeyecare.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://nirvayaeyecare.com/assets/logo.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://nirvayaeyecare.com/blog/${blog.slug}`
        },
        keywords: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags
      }
    };

    return NextResponse.json({
      success: true,
      blog,
      seo
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const deleted = await Blog.findOneAndDelete({
      $or: [{ id: slug }, { slug }]
    });

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
