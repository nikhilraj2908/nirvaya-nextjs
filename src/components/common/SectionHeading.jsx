import React from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  align = 'center',
  className = '',
  light = false
}) {
  const alignClasses = {
    center: 'text-center mx-auto items-center',
    left: 'text-left items-start mr-auto',
    right: 'text-right items-end ml-auto'
  };

  const bodyText = subtitle || description;

  return (
    <div className={`flex flex-col max-w-3xl mb-12 lg:mb-16 ${alignClasses[align] || alignClasses.center} reveal-up ${className}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FDF9EE] text-[#C59B27] border border-[#C59B27]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></span>
          <span>{eyebrow}</span>
        </div>
      )}

      {title && (
        <h2
          className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight ${
            light ? 'text-white' : 'text-[#0A1E3F]'
          }`}
        >
          {title}
        </h2>
      )}

      {bodyText && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-slate-300' : 'text-[#475569]'
          }`}
        >
          {bodyText}
        </p>
      )}

      <div className={`mt-5 h-0.5 w-12 bg-gradient-to-r from-[#C59B27] to-[#DFBF64] rounded-full ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}
