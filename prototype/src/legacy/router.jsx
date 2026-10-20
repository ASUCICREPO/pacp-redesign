'use client';

/**
 * React Router → Next.js compatibility layer for the original prototype UI.
 *
 * The prototype was a Vite single-page app built on react-router-dom. Rather
 * than rewrite 16 pages by hand, its imports point here and get the same shapes
 * backed by Next's router. Only the surface the prototype actually uses is
 * implemented: Link, useNavigate, useParams, useLocation, useSearchParams.
 */

import NextLink from 'next/link';
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import { forwardRef } from 'react';

/** `<Link to="/x">` → Next's `<Link href="/x">`. */
export const Link = forwardRef(function Link({ to, replace, ...rest }, ref) {
  // react-router's navigation `state` has no Next.js equivalent; keep it off the DOM.
  delete rest.state;
  return <NextLink ref={ref} href={to} replace={replace} {...rest} />;
});

/** `navigate('/x')`, `navigate('/x', { replace: true })`, `navigate(-1)`. */
export function useNavigate() {
  const router = useRouter();
  return (to, options) => {
    if (typeof to === 'number') {
      if (to < 0) router.back();
      else router.forward();
      return;
    }
    if (options?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useParams() {
  return useNextParams() ?? {};
}

export function useLocation() {
  const pathname = usePathname() ?? '/';
  const query = useNextSearchParams()?.toString() ?? '';
  return { pathname, search: query ? `?${query}` : '', hash: '', state: null };
}

/** Returns `[searchParams, setSearchParams]`, like react-router. */
export function useSearchParams() {
  const params = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const setSearchParams = (next) => {
    const current = new URLSearchParams(params?.toString() ?? '');
    const resolved = new URLSearchParams(typeof next === 'function' ? next(current) : next);
    const qs = resolved.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };
  return [params ?? new URLSearchParams(), setSearchParams];
}
