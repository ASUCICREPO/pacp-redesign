'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronRight, Info, X } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Building blocks in the original PACP prototype's visual language.
 *
 * Every class string here is lifted from an existing prototype screen, noted
 * alongside, so the report-upload feature looks like it was always part of
 * PACP rather than a separate design system bolted on.
 */

/** Buttons — Submit page "Bulk Upload" and the submission form's action bar. */
export const button = {
  primary:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  neutral:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  smallPrimary:
    'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  smallNeutral:
    'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  link: 'text-primary hover:underline font-medium',
};

/** Form input — submission form fields. */
export const inputClass =
  'w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring';

/** Header band with breadcrumb, title and reasoning callout — Identify page. */
export function PageHeader({
  crumbs,
  title,
  description,
  callout,
}: {
  crumbs: Array<{ label: string; href?: string }>;
  title: string;
  description: string;
  callout?: ReactNode;
}) {
  return (
    <div className="bg-card border-b border-border px-6 py-5">
      <div className="max-w-[1600px] mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="font-serif text-foreground text-3xl mb-1">{title}</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">{description}</p>
        {callout && (
          <div className="mt-4 flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 text-sm text-primary max-w-2xl">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{callout}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Small uppercase section label — Submit page ("Core Entries"). */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-xs uppercase tracking-wider text-primary mb-6 font-semibold', className)}>{children}</h2>
  );
}

/** Informational banner — the submission form's InfoBanner. */
export function InfoNote({
  children,
  tone = 'info',
  action,
}: {
  children: ReactNode;
  tone?: 'info' | 'warning';
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-lg p-4 flex items-start gap-3',
        tone === 'info' ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/20 border border-secondary',
      )}
    >
      <Info className={cn('w-5 h-5 shrink-0 mt-0.5', tone === 'info' ? 'text-primary' : 'text-secondary-foreground')} />
      <div className="text-sm text-foreground flex-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Status pill — the prototype's Badge and STATUS_STYLES. */
export function Pill({
  children,
  tone = 'primary',
  title,
}: {
  children: ReactNode;
  tone?: 'primary' | 'secondary' | 'accent' | 'muted' | 'destructive';
  title?: string;
}) {
  const tones = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/20 text-secondary-foreground border-secondary',
    accent: 'bg-accent/20 text-accent-foreground border-accent',
    muted: 'bg-muted text-muted-foreground border-border',
    destructive: 'bg-destructive/10 text-destructive border-destructive/30',
  };
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Thin progress bar — the submission form's "Record Completion". */
export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('w-full h-1.5 bg-muted rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-primary transition-all duration-300 rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/** Underline tabs — Profile page. */
export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: Array<{ id: T; label: string }>;
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 border-b-2 transition-colors ${
            value === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** Sticky side list — Submit page's "Jump to Section". */
export function SideList<T extends string>({
  heading,
  items,
  value,
  onChange,
}: {
  heading: string;
  items: Array<{ id: T; label: string; count?: number }>;
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="sticky top-24 space-y-1">
      <h4 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">{heading}</h4>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`flex w-full items-center justify-between text-left px-3 py-2 rounded-md text-sm transition-colors ${
            value === item.id
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <span>{item.label}</span>
          {item.count !== undefined && <span className="text-xs opacity-70">{item.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Confirmation toast — Identify page. Dismisses itself. */
export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2600);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-foreground text-background rounded-xl shadow-xl text-sm max-w-xs">
      <Check className="w-4 h-4 text-primary shrink-0" />
      <span>{message}</span>
      <button type="button" onClick={onDismiss} className="ml-auto opacity-60 hover:opacity-100" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>,
    document.body,
  );
}
