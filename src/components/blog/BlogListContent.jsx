'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, User, Sparkles, FileText } from 'lucide-react';
import Container from '@/components/common/Container';
import { getBlogs, getBlogCategories } from '@/services/api';

export default function BlogListContent() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getBlogs({
        category: selectedCategory !== 'All' ? selectedCategory : '',
        search: searchQuery
      }),
      getBlogCategories()
    ])
      .then(([blogsRes, catsRes]) => {
        if (!isMounted) return;
        if (blogsRes && blogsRes.success) {
          setBlogs(blogsRes.blogs || []);
        }
        if (catsRes && catsRes.success) {
          setCategories(catsRes.categories || []);
        }
      })
      .catch((err) => {
        console.warn('Error fetching blogs from API:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 bg-[#061226] text-white border-b border-slate-800">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-[#DFBF64] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#DFBF64]">Clinical Blog</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patient Education & Medical Guides</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
              Clinical Articles & Insights
            </h1>

            <p className="mt-3.5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Practical medical perspectives on vitreoretinal health, diabetic eye disease, early warning signs, and modern ophthalmic surgical care by <span className="text-[#DFBF64] font-medium">Dr. Sandhya Gaur (MD AIIMS)</span>.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Filter & Articles Grid */}
      <section className="py-12 sm:py-16">
        <Container>
          {/* Controls: Search & Category Chips */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {(categories.length > 0
                ? categories
                : [
                    { name: 'All' },
                    { name: 'Retina' },
                    { name: 'Diabetic Eye Care' },
                    { name: 'General Eye Health' }
                  ]
              ).map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.name
                      ? 'bg-[#0A1E3F] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat.name} {cat.count !== undefined && `(${cat.count})`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#C59B27] focus:border-transparent text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-[#C59B27] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-500">Loading articles from clinical database...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#0A1E3F]">No articles found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try selecting another category or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#0A1E3F] text-white text-xs font-bold rounded-lg hover:bg-[#16325C]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id || blog.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#C59B27]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image or Category Banner */}
                    <div className="relative h-48 bg-[#0A1E3F] overflow-hidden">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.coverAlt || blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#061226]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3.5 left-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#C59B27] text-white shadow-xs">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {blog.readingMinutes || 5} min read
                        </span>
                        <span>•</span>
                        <span>
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Recent'}
                        </span>
                      </div>

                      <h2 className="text-xl font-heading font-bold text-[#0A1E3F] group-hover:text-[#C59B27] transition-colors leading-snug mb-3">
                        <Link href={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {blog.excerpt || 'Read the full clinical perspective by Dr. Sandhya Gaur.'}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <User className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span className="truncate max-w-[140px]">
                        {blog.author || 'Dr. Sandhya Gaur'}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C59B27] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
