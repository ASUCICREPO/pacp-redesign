import { BookOpen, ChevronDown, Heart, Info, Mail, MapPin, Search, User, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '../router.jsx';
import { useStoredUser } from '@/lib/user-storage';
import { useAssistant } from '../context/AssistantContext.jsx';
import { useRole } from '../context/RoleContext.jsx';
import { PacpLogo } from '../components/PacpLogo.jsx';

export function InfoDropdown() {
  const [i, n] = useState(!1),
    o = useRef(null);
  return useEffect(() => {
    const c = u => {
      o.current && !o.current.contains(u.target) && n(!1);
    };
    return document.addEventListener("mousedown", c), () => document.removeEventListener("mousedown", c);
  }, []), <div className="relative" ref={o}><button onClick={() => n(!i)} className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1">Info<ChevronDown className={`w-4 h-4 transition-transform ${i ? "rotate-180" : ""}`} /></button>{i && <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">{[{
        icon: BookOpen,
        label: "Resources",
        path: "/resources"
      }, {
        icon: Info,
        label: "About",
        path: "/about"
      }, {
        icon: Mail,
        label: "Editors & Contact",
        path: "/contact"
      }, {
        icon: Heart,
        label: "Donate",
        path: "/donate"
      }, {
        icon: MapPin,
        label: "Land Acknowledgement Notice",
        path: "/land-acknowledgement"
      }].map(c => {
        const U = c.icon;
        return <Link to={c.path} onClick={() => n(!1)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors" key={c.path}><U className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-foreground">{c.label}</span></Link>;
      })}</div>}</div>;
}



export const ROLE_SHORT_LABELS = {
  crm: "CRM",
  grad_student: "Grad Student",
  undergrad_student: "Undergrad"
};

export function TopNav() {
  const navigate = useNavigate(),
    [query, setQuery] = useState(""),
    [menuOpen, setMenuOpen] = useState(false),
    { role } = useRole(),
    { open: assistantOpen, toggle: toggleAssistant } = useAssistant(),
    { user } = useStoredUser();

  // FR-4.1: anonymous visitors get a Login link. Someone who only went through
  // prototype onboarding has a role but no account, so check for an email.
  const signedIn = Boolean(user?.email);

  const submitSearch = e => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setMenuOpen(false);
    }
  };

  const searchField = (
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search wares, types, vessels, sites..." className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring" /></div>
  );

  return <nav className="border-b border-border bg-card sticky top-0 z-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16"><Link to="/" className="flex items-center gap-3"><PacpLogo className="h-10 w-auto shrink-0" /><span className="font-serif text-foreground">Pan-American Ceramics Project</span></Link><form onSubmit={submitSearch} className="hidden lg:block flex-1 max-w-2xl mx-8">{searchField}</form><div className="hidden lg:flex items-center gap-6"><button type="button" onClick={toggleAssistant} className={`transition-colors ${assistantOpen ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary"}`}>Chat</button><Link to="/submit" className="text-foreground hover:text-primary transition-colors">Submit</Link><Link to="/browse" className="text-foreground hover:text-primary transition-colors">Browse</Link><InfoDropdown /><Link to="/admin" className="text-foreground hover:text-primary transition-colors">Admin</Link>{!signedIn && <Link to="/signin" className="text-foreground hover:text-primary transition-colors">Login</Link>}<Link to="/profile" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"><User className="w-4 h-4" /><span>Profile</span>{role && <span className="hidden sm:inline text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{ROLE_SHORT_LABELS[role]}</span>}</Link></div>{/* FR-4.2: below lg the row above would overflow, so it collapses to a menu. */}<button type="button" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} className="lg:hidden text-foreground hover:text-primary transition-colors">{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button></div>{menuOpen && <div className="lg:hidden border-t border-border py-4 space-y-4"><form onSubmit={submitSearch}>{searchField}</form><div className="flex flex-col gap-3"><button type="button" onClick={() => { toggleAssistant(); setMenuOpen(false); }} className="text-left text-foreground hover:text-primary transition-colors">Chat</button>{[{ to: "/submit", label: "Submit" }, { to: "/browse", label: "Browse" }, { to: "/search", label: "Search" }, { to: "/resources", label: "Resources" }, { to: "/about", label: "About" }, { to: "/contact", label: "Editors & Contact" }, { to: "/donate", label: "Donate" }, { to: "/land-acknowledgement", label: "Land Acknowledgement Notice" }, { to: "/admin", label: "Admin" }, ...(signedIn ? [] : [{ to: "/signin", label: "Login" }]), { to: "/profile", label: "Profile" }].map(link => <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">{link.label}</Link>)}</div></div>}</div></nav>;
}

export default TopNav;
