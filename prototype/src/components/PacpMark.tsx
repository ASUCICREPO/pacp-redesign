import { cn } from '@/lib/utils';

/**
 * The PACP amphora mark, inline so it can be tinted and sized freely.
 *
 * Kept in sync with `public/logo.svg`, which is the same artwork for anywhere
 * that needs a file (favicons, share images, static contexts).
 */
export function PacpMark({
  size = 64,
  className,
  title = 'PACP',
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 80"
      width={size}
      height={(size * 80) / 64}
      role="img"
      aria-label={title}
      className={cn('shrink-0', className)}
    >
      {/* handles */}
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <path d="M24 21C13.5 23.5 10.5 33 16 41" />
        <path d="M40 21C50.5 23.5 53.5 33 48 41" />
      </g>
      {/* body */}
      <path
        d="M26.5 23.5C15 29.5 8 40.5 8 50.5 8 64 18.5 72 32 72s24-8 24-21.5c0-10-7-21-18.5-27z"
        fill="currentColor"
      />
      {/* neck */}
      <path d="M25.5 11h13l-1 13.5h-11z" fill="currentColor" />
      {/* rim and foot, a shade darker */}
      <ellipse cx="32" cy="11" rx="8.5" ry="3" className="fill-terracotta-dark" />
      <path d="M27 71.5h10l2 5.5H25z" className="fill-terracotta-dark" />
    </svg>
  );
}
