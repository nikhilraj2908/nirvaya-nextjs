import connectDB from '@/lib/db';
import { Blog } from '@/models';
import localBlogs from '@/data/blogs.json';
import BlogDetailContent from '@/components/blog/BlogDetailContent';

async function getBlogData(slug) {
  try {
    await connectDB();
    const blog = await Blog.findOne({
      $or: [{ slug: slug.toLowerCase() }, { id: slug }]
    }).lean();

    if (blog) {
      return {
        ...blog,
        _id: blog._id.toString()
      };
    }
  } catch (err) {
    console.warn('[BlogDetailPage] DB query fallback to local blogs:', err.message);
  }

  // Fallback to local JSON
  const match = localBlogs.find(
    (b) => b.slug.toLowerCase() === slug.toLowerCase() || b.id === slug
  );
  return match || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | Nirvaya Eyecare Centre Bhopal'
    };
  }

  return {
    title: `${blog.title} | Dr. Sandhya Gaur | Nirvaya Eyecare Bhopal`,
    description: blog.excerpt ? blog.excerpt.substring(0, 155) : '',
    alternates: {
      canonical: `https://nirvayaeyecare.com/blog/${blog.slug}`
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `https://nirvayaeyecare.com/blog/${blog.slug}`,
      siteName: 'Nirvaya Eyecare Centre',
      locale: 'en_IN',
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      images: blog.coverImage ? [{ url: blog.coverImage, alt: blog.coverAlt || blog.title }] : []
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    return <BlogDetailContent blog={null} />;
  }

  const jsonLd = {
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
      url: 'https://nirvayaeyecare.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://nirvayaeyecare.com/blog/${blog.slug}`
    },
    keywords: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailContent blog={blog} />
    </>
  );
}
