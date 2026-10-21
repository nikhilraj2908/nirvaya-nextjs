'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import { getResearchPapers } from '@/services/api';
import {
  BookOpen,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Quote,
  Sparkles
} from 'lucide-react';

export default function ResearchContent() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [expandedAbstracts, setExpandedAbstracts] = useState({});

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedSpecialty !== 'ALL') {
        params.specialty = selectedSpecialty;
      }
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }
      const data = await getResearchPapers(params);
      setPapers(data.data || data.papers || []);
    } catch (err) {
      console.error('Failed to fetch research papers:', err);
      setError('Unable to load clinical research publications at this time.');
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialty, searchQuery]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPapers();
  };

  const toggleAbstract = (id) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const specialties = [
    'ALL',
    'Vitreoretinal Surgery',
    'Retinopathy of Prematurity (ROP)',
    'Diabetic Macular Edema (DME)',
    'Surgical Innovation'
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 bg-[#061226] text-white border-b border-slate-800">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-[#DFBF64] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#DFBF64]">Research & Publications</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Based Medicine</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Peer-Reviewed Ophthalmology Research
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Scientific contributions authored and co-authored by{' '}
              <strong className="text-[#DFBF64]">Dr. Sandhya Gaur (MD AIIMS, FVRS)</strong> in leading
              international ophthalmic journals.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Filter & Publications List */}
      <section className="py-12 sm:py-16">
        <Container>
          {/* Controls: Search & Filter Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            {/* Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSpecialty === spec
                      ? 'bg-[#0A1E3F] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {spec === 'ALL' ? 'All Publications' : spec}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by keyword, author, DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#C59B27] focus:border-transparent text-slate-800 placeholder-slate-400"
              />
            </form>
          </div>

          {/* List Display */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-[#C59B27] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-500">Loading indexed scientific publications...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-red-200 p-8 max-w-md mx-auto">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchPapers}
                className="px-4 py-2 bg-[#0A1E3F] text-white text-xs font-bold rounded-lg hover:bg-[#16325C]"
              >
                Retry Loading
              </button>
            </div>
          ) : papers.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#0A1E3F]">No publications found</h3>
              <p className="text-sm text-slate-500 mt-1">Try selecting another specialty or resetting search.</p>
              <button
                onClick={() => {
                  setSelectedSpecialty('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#0A1E3F] text-white text-xs font-bold rounded-lg hover:bg-[#16325C]"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {papers.map((paper) => {
                const isExpanded = Boolean(expandedAbstracts[paper._id || paper.id]);
                return (
                  <article
                    key={paper._id || paper.id}
                    className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#9A7818] bg-[#FDF9EE] px-2.5 py-1 rounded border border-[#DFBF64]/40">
                          {paper.journal}
                        </span>
                        {paper.year && (
                          <span className="text-xs text-slate-500 font-medium">
                            • {paper.year}
                          </span>
                        )}
                        {paper.volume && (
                          <span className="text-xs text-slate-400">
                            Vol. {paper.volume}
                            {paper.issue ? `(${paper.issue})` : ''}
                            {paper.pages ? `: ${paper.pages}` : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {paper.citationCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            <Quote className="w-3 h-3" />
                            {paper.citationCount} Citations
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {paper.specialty}
                        </span>
                      </div>
                    </div>

                    {/* Paper Title */}
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0A1E3F] group-hover:text-[#9A7818] transition-colors leading-snug mb-2">
                      {paper.title}
                    </h2>

                    {/* Authors */}
                    <div className="text-xs text-slate-600 mb-4 flex flex-wrap items-center gap-1">
                      <span className="font-semibold text-slate-700">Authors:</span>
                      <span>
                        {paper.authors?.map((author, idx) => (
                          <span key={idx}>
                            {author.includes('Sandhya Gaur') ? (
                              <strong className="text-[#0A1E3F] font-bold underline decoration-[#DFBF64]">
                                {author}
                              </strong>
                            ) : (
                              author
                            )}
                            {idx < paper.authors.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </span>
                    </div>

                    {/* Abstract Section */}
                    {paper.abstract && (
                      <div className="mb-4">
                        <div
                          className={`text-xs sm:text-sm text-slate-600 leading-relaxed relative ${
                            !isExpanded ? 'line-clamp-2' : ''
                          }`}
                        >
                          <p>{paper.abstract}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAbstract(paper._id || paper.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#C59B27] hover:text-[#0A1E3F] mt-1.5 transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              <span>Collapse Abstract</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              <span>Read Full Abstract</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Keywords */}
                    {paper.keywords && paper.keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-5 pt-1">
                        {paper.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions: DOI, PubMed, Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {paper.doi && (
                          <span className="text-slate-500 font-mono text-[11px]">
                            DOI: {paper.doi}
                          </span>
                        )}
                        {paper.pmid && (
                          <span className="text-slate-400 font-mono text-[11px]">
                            PMID: {paper.pmid}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {paper.externalUrl && (
                          <a
                            href={paper.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A1E3F] text-slate-700 hover:text-white text-xs font-semibold transition-all"
                          >
                            <span>Publisher Index</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <Link
                          href="/pre-book"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <span>Consult Author</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom Academic Box */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#0A1E3F] to-[#122B55] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DFBF64]">
                Evidence-Led Clinical Ophthalmology
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Every Surgery Informed by Peer-Reviewed Scientific Excellence
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                At Nirvaya Eyecare Centre, your treatment is not guided by commercial targets, but by published clinical trials, precise micro-surgical protocols, and international vitreoretinal benchmarks.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/pre-book"
                  className="px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-md transition-all"
                >
                  Book Specialist Consultation
                </Link>
                <Link
                  href="/doctors"
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all"
                >
                  View Dr Sandhya Gaur’s Full Profile
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
