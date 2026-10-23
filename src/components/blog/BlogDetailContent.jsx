'use client';

import React, { useState } from 'react';
import SafeLink from '@/components/common/SafeLink';
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  Tag,
  Phone
} from 'lucide-react';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import { CLINIC_INFO } from '@/data/siteData';

export default function BlogDetailContent({ blog }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: blog?.title,
          url: typeof window !== 'undefined' ? window.location.href : ''
        })
        .catch(() => {});
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-28 text-center">
        <Container>
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-[#0A1E3F] mb-2">Article Not Found</h2>
            <p className="text-sm text-slate-500 mb-6">
              The requested article may have been unpublished or moved.
            </p>
            <SafeLink
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A1E3F] text-white text-xs font-bold hover:bg-[#16325C]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </SafeLink>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Article Header */}
      <section className="bg-[#061226] text-white py-12 sm:py-16 border-b border-slate-800">
        <Container>
          <div className="max-w-3xl mx-auto">
            <SafeLink
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#DFBF64] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Articles</span>
            </SafeLink>

            <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
              <span className="px-3 py-1 rounded-full font-bold bg-[#C59B27] text-white">
                {blog.category}
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingMinutes || 5} min read
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Recent'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-8 h-8 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center text-[#DFBF64] font-bold">
                  SG
                </div>
                <div>
                  <div className="font-bold text-white">{blog.author || 'Dr. Sandhya Gaur'}</div>
                  <div className="text-[11px] text-[#DFBF64]">
                    Senior Vitreoretinal Consultant (MD AIIMS)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Body */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Excerpt Lead */}
            {blog.excerpt && (
              <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200/90 shadow-sm text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-8 border-l-4 border-l-[#C59B27]">
                {blog.excerpt}
              </div>
            )}

            {/* Rich HTML Body */}
            <article
              className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-sm prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-[#0A1E3F] prose-h3:text-xl prose-h4:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-blockquote:border-l-[#C59B27] prose-blockquote:bg-[#FDF9EE] prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-strong:text-[#0A1E3F]"
              dangerouslySetInnerHTML={{ __html: blog.body || blog.content || '' }}
            />

            {/* Tags Strip */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-xs font-bold text-slate-500 mr-2">Keywords:</span>
                {blog.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Consultation CTA Banner */}
            <div className="mt-10 bg-[#0A1E3F] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold uppercase tracking-widest text-[#DFBF64]">
                  Clinical Consultation
                </div>
                <h3 className="text-xl font-heading font-bold text-white">
                  Concerned about your eye symptoms?
                </h3>
                <p className="text-xs text-slate-300 max-w-md">
                  Consult directly with Dr Sandhya Gaur at Nirvaya Eyecare Centre, Bhopal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Button variant="gold" size="md" href="/pre-book" icon={ArrowRight} iconPosition="right">
                  Pre-book Slot
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <Phone className="w-4 h-4 mr-1.5" />
                  Call Clinic
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
