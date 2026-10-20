'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BookOpen,
  Compass,
  Heart,
  Info,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  User,
  LayoutGrid,
} from 'lucide-react';

import { RoleBadge } from '@/components/RoleBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { roleLabel } from '@/lib/onboarding';
import { clearStoredUser, initialsOf, useStoredUser } from '@/lib/user-storage';
import { cn } from '@/lib/utils';

const PRIMARY_LINKS = [
  { label: 'Chat', href: '/chat', icon: MessageSquare },
  { label: 'Submit', href: '/submit', icon: Upload },
  { label: 'Extract', href: '/upload', icon: Upload },
  { label: 'Browse', href: '/browse', icon: LayoutGrid },
];

const INFO_LINKS = [
  { label: 'Resources', href: '/resources', icon: BookOpen },
  { label: 'About PACP', href: '/about', icon: Info },
  { label: 'Donate', href: '/donate', icon: Heart },
  { label: 'Land Acknowledgement', href: '/land-acknowledgement', icon: MapPin },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');

  // `ready` is false until after mount. localStorage does not exist on the
  // server, so branching on it before then would mismatch during hydration.
  const { user, ready } = useStoredUser();

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-warm bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/pacp-logo.png"
            alt=""
            width={164}
            height={184}
            className="h-9 w-auto"
            priority
          />
          <span className="hidden font-serif text-base leading-tight font-semibold sm:block">
            Pan-American
            <span className="block text-charcoal-muted">Ceramics Project</span>
          </span>
        </Link>

        {/* Search is the primary entry point for CRM users under time pressure,
            so it sits in the chrome rather than behind a page. */}
        <form onSubmit={onSearch} className="relative hidden max-w-md flex-1 md:block">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-charcoal-muted"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search wares, types, vessels, sites…"
            aria-label="Search PACP records"
            className="bg-cream pl-9"
          />
        </form>

        <div className="ml-auto flex items-center gap-1">
          {PRIMARY_LINKS.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                'hidden text-charcoal-muted hover:text-terracotta lg:inline-flex',
                isActive(link.href) && 'text-terracotta',
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-charcoal-muted hover:text-terracotta lg:inline-flex"
              >
                Info
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {INFO_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>
                    <link.icon className="size-4 text-charcoal-muted" aria-hidden />
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              'hidden text-charcoal-muted hover:text-terracotta lg:inline-flex',
              isActive('/admin') && 'text-terracotta',
            )}
          >
            <Link href="/admin">Admin</Link>
          </Button>

          {/* Reserve the slot while storage is being read, so the nav does not
              shift when the signed-in state resolves. */}
          {!ready ? (
            <span className="h-8 w-24" aria-hidden />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 pl-2"
                  aria-label={`Profile menu${user.role ? ` — working as ${roleLabel(user.role)}` : ''}`}
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-terracotta/12 text-[11px] font-semibold text-terracotta">
                    {initialsOf(user.name)}
                  </span>
                  <span className="hidden sm:inline">Profile</span>
                  {user.role && <RoleBadge role={user.role} />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user.name || 'PACP Researcher'}</p>
                  <p className="text-xs text-charcoal-muted">
                    {user.affiliation || user.email}
                  </p>
                  {user.role && (
                    <p className="mt-2 text-xs text-charcoal-muted">
                      Working as <span className="text-terracotta">{roleLabel(user.role)}</span>
                    </p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="size-4 text-charcoal-muted" aria-hidden />
                    My profile and contributions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/reviews">
                    <ShieldCheck className="size-4 text-charcoal-muted" aria-hidden />
                    Records I review
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/onboarding">
                    <Compass className="size-4 text-charcoal-muted" aria-hidden />
                    Change focus
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="size-4 text-charcoal-muted" aria-hidden />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    clearStoredUser();
                    router.push('/signin');
                  }}
                >
                  <LogOut className="size-4 text-charcoal-muted" aria-hidden />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="ml-1">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
