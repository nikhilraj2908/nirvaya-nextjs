'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { IS_PREVIEW } from '@/lib/preview';

/**
 * SafeLink: Reusable wrapper around Next.js <Link> and <a>.
 *
 * In Client Preview Mode (IS_PREVIEW = true):
 * - Renders the same element with identical visual styling and hover effects.
 * - Disables navigation, redirection, URL changing, new tab opening, and scroll jumping.
 * - Calls e.preventDefault() and e.stopPropagation() on click.
 * - Sets aria-disabled="true" and tabIndex={-1}.
 * - Enforces cursor: default instead of pointer.
 *
 * In Normal Mode (IS_PREVIEW = false or unset):
 * - Functions as a standard Link (internal) or <a> (external/tel/mailto/blank).
 */
const SafeLink = forwardRef(function SafeLink(
  {
    href,
    to,
    children,
    className = '',
    onClick,
    onKeyDown,
    target,
    rel,
    style,
    ...props
  },
  ref
) {
  const destination = to || href || '#';

  if (IS_PREVIEW) {
    const handleDisabledClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDisabledKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
      }
      if (onKeyDown) onKeyDown(e);
    };

    return (
      <a
        ref={ref}
        href="#"
        onClick={handleDisabledClick}
        onKeyDown={handleDisabledKeyDown}
        aria-disabled="true"
        tabIndex={-1}
        className={`${className} !cursor-default`}
        style={{ cursor: 'default', ...style }}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Normal Mode: standard external vs internal link behaviour
  const isExternal =
    typeof destination === 'string' &&
    (destination.startsWith('http://') ||
      destination.startsWith('https://') ||
      destination.startsWith('tel:') ||
      destination.startsWith('mailto:') ||
      target === '_blank');

  if (isExternal) {
    return (
      <a
        ref={ref}
        href={destination}
        className={className}
        onClick={onClick}
        onKeyDown={onKeyDown}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : rel}
        style={style}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={destination}
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={style}
      {...props}
    >
      {children}
    </Link>
  );
});

SafeLink.displayName = 'SafeLink';

export default SafeLink;
