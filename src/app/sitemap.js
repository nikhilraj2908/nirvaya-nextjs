import connectDB from '@/lib/db';
import { Blog } from '@/models';
import localBlogs from '@/data/blogs.json';

const BASE_URL = 'https://nirvayaeyecare.com';

export default async function sitemap() {
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/doctors`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/technology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${BASE_URL}/pre-book`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85
    },
    {
      url: `${BASE_URL}/research`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85
    }
  ];

  let blogRoutes = [];
  try {
    await connectDB();
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt createdAt').lean();
    if (blogs && blogs.length > 0) {
      blogRoutes = blogs.map((b) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt || b.createdAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.75
      }));
    }
  } catch (err) {
    console.warn('[sitemap.js] Falling back to local blogs JSON:', err.message);
  }

  if (blogRoutes.length === 0 && localBlogs && localBlogs.length > 0) {
    blogRoutes = localBlogs.map((b) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt || b.publishedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.75
    }));
  }

  return [...staticRoutes, ...blogRoutes];
}
