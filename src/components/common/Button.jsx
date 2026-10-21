import React from 'react';
import Link from 'next/link';

/**
 * Premium Button component for Nirvaya Eyecare Centre
 * Variants:
 * - 'primary' (deep brand navy with subtle gold accent / hover depth)
 * - 'gold' (refined warm gold CTA for key actions)
 * - 'secondary' (white with clean navy border)
 * - 'outline' (transparent with delicate border)
 * - 'ghost' (clean text button with subtle hover background)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  target,
  rel,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-2 rounded min-h-[38px] gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-md min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3.5 rounded-md min-h-[48px] gap-2.5 font-semibold tracking-wide'
  };

  const variantClasses = {
    primary:
      'bg-[#0A1E3F] text-white hover:bg-[#16325C] shadow-sm hover:shadow active:scale-[0.99] border border-transparent',
    gold:
      'bg-[#C59B27] text-white hover:bg-[#b0871d] shadow-sm hover:shadow active:scale-[0.99] border border-transparent font-semibold',
    secondary:
      'bg-white text-[#0A1E3F] border border-[#0A1E3F]/30 hover:border-[#0A1E3F] hover:bg-[#F8FAFC] shadow-2xs active:scale-[0.99]',
    outline:
      'bg-transparent text-[#0A1E3F] border border-[#CBD5E1] hover:border-[#0A1E3F] hover:bg-slate-50/50',
    ghost:
      'bg-transparent text-[#0A1E3F] hover:bg-slate-100/70'
  };

  const classes = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
    variantClasses[variant] || variantClasses.primary
  } ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
    </>
  );

  const destination = to || href;

  if (destination) {
    // If external link
    if (destination.startsWith('http') || destination.startsWith('tel:') || destination.startsWith('mailto:') || target === '_blank') {
      return (
        <a
          href={destination}
          className={classes}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : rel}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={destination}
        className={classes}
        onClick={onClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
}
