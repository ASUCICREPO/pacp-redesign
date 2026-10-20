import { Bell, BellOff, CircleCheckBig, Clock, Eye, FlaskConical, GraduationCap, HardHat, Lock, Mail, MessageSquare, SquarePen, UserCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from '../router.jsx';
import { useRole } from '../context/RoleContext.jsx';
import { SAMPLE_SUBMISSIONS } from '../data/SAMPLE_SUBMISSIONS.js';

export const SAMPLE_RESEARCHERS = [{
  id: "res-001",
  name: "Dr. Elena Martinez",
  institution: "University of Barcelona",
  sharedInterests: ["Roman ceramics", "Production technology"],
  recentSubmissions: 12
}, {
  id: "res-002",
  name: "Prof. James Wong",
  institution: "Stanford University",
  sharedInterests: ["Archaeometry", "Mediterranean trade"],
  recentSubmissions: 8
}];

export const SAMPLE_NOTIFICATIONS = [{
  id: "notif-001",
  type: "approval",
  title: "Submission Approved",
  message: 'Your submission "Late Bronze Age storage jar from Mycenae" has been approved and is now public.',
  timestamp: new Date(Date.now() - 7200 * 1e3).toISOString(),
  read: !1,
  link: "/vessel/sub-001"
}, {
  id: "notif-002",
  type: "comment",
  title: "New Comment on Your Submission",
  message: 'Admin left a comment: "Excellent documentation of firing temperatures. Please add petrographic analysis if available."',
  timestamp: new Date(Date.now() - 300 * 60 * 1e3).toISOString(),
  read: !1,
  link: "/vessel/sub-002"
}, {
  id: "notif-003",
  type: "edit",
  title: "Submission Edited",
  message: 'Dr. Martinez edited your submission "Cypriote White Painted ware classification" - updated chronology references.',
  timestamp: new Date(Date.now() - 1440 * 60 * 1e3).toISOString(),
  read: !0,
  link: "/vessel/sub-002"
}, {
  id: "notif-004",
  type: "claim",
  title: "Ownership Claim",
  message: 'Prof. Wong claimed ownership of your submission "Hellenistic kiln structure documentation" citing prior fieldwork.',
  timestamp: new Date(Date.now() - 2880 * 60 * 1e3).toISOString(),
  read: !0,
  link: "/vessel/sub-003"
}, {
  id: "notif-005",
  type: "match",
  title: "Researcher Match Found",
  message: "AI detected Dr. Elena Martinez working on similar Roman ceramic production. Would you like to connect?",
  timestamp: new Date(Date.now() - 4320 * 60 * 1e3).toISOString(),
  read: !0,
  link: "/profile?tab=matches"
}];

export function MatchCard({
  match: i,
  onAction: n
}) {
  return <div className="bg-card border border-border rounded-lg p-6"><div className="flex items-start justify-between mb-4"><div><h3 className="font-serif text-foreground mb-1">{i.name}</h3><p className="text-sm text-muted-foreground">{i.institution}</p></div><button onClick={() => n("dismiss")} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button></div><div className="mb-4"><p className="text-sm mb-2">Shared interests:</p><div className="flex flex-wrap gap-2">{i.sharedInterests.map((o, s) => <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm" key={s}>{o}</span>)}</div><p className="text-sm text-muted-foreground mt-2">{i.recentSubmissions}{" recent submissions"}</p></div><div className="flex gap-2"><button onClick={() => n("connect")} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Connect via PACP</button><button onClick={() => n("email")} className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"><Mail className="w-4 h-4" /></button><button onClick={() => n("later")} className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"><Clock className="w-4 h-4" /></button></div></div>;
}

export function NotificationsPanel({
  notifications: i,
  onMarkAsRead: n,
  onMarkAllAsRead: o
}) {
  const s = h => {
      switch (h) {
        case "approval":
          return <CircleCheckBig className="w-5 h-5 text-green-600" />;
        case "comment":
          return <MessageSquare className="w-5 h-5 text-blue-600" />;
        case "edit":
          return <SquarePen className="w-5 h-5 text-yellow-600" />;
        case "claim":
          return <UserCheck className="w-5 h-5 text-purple-600" />;
        case "match":
          return <Users className="w-5 h-5 text-primary" />;
        default:
          return <Bell className="w-5 h-5 text-muted-foreground" />;
      }
    },
    c = h => {
      const f = new Date(h),
        b = ((new Date()).getTime() - f.getTime()) / (1e3 * 60 * 60);
      if (b < 1) {
        const x = Math.floor(b * 60);
        return `${x} minute${x !== 1 ? "s" : ""} ago`;
      } else if (b < 24) {
        const x = Math.floor(b);
        return `${x} hour${x !== 1 ? "s" : ""} ago`;
      } else return b < 48 ? "Yesterday" : f.toLocaleDateString();
    },
    u = i.filter(h => !h.read).length;
  return <div className="space-y-4"><div className="flex items-center justify-between"><h2 className="font-serif text-foreground">Notifications</h2>{u > 0 && <button onClick={o} className="text-sm text-primary hover:text-primary/80 transition-colors">Mark all as read</button>}</div>{i.length === 0 ? <div className="text-center py-12"><Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No notifications yet</p></div> : <div className="space-y-2">{i.map(h => <div onClick={() => !h.read && n?.(h.id)} className={`p-4 rounded-lg border transition-colors cursor-pointer ${h.read ? "bg-card border-border" : "bg-primary/5 border-primary/20 hover:bg-primary/10"}`} key={h.id}><div className="flex gap-3"><div className="flex-shrink-0 mt-0.5">{s(h.type)}</div><div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-2 mb-1"><h4 className="text-foreground">{h.title}</h4>{!h.read && <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />}</div><p className="text-sm text-muted-foreground mb-2">{h.message}</p><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">{c(h.timestamp)}</span>{h.link && <Link to={h.link} className="text-xs text-primary hover:text-primary/80 transition-colors">View details →</Link>}</div></div></div></div>)}</div>}</div>;
}

export const ROLE_PROFILE_OPTIONS = [{
  id: "crm",
  icon: HardHat,
  label: "CRM Archaeologist",
  description: "Fast identification, regional parallels, project data submission"
}, {
  id: "grad_student",
  icon: FlaskConical,
  label: "Graduate Student",
  description: "Assemblage comparison, data submission, research collections"
}, {
  id: "undergrad_student",
  icon: GraduationCap,
  label: "Undergraduate Student",
  description: "Guided identification, visual recognition, type comparison"
}];

export function ProfilePage() {
  const {
      role: i,
      setRole: n
    } = useRole(),
    [o, s] = useState("submissions"),
    [c, u] = useState(!0),
    [h, f] = useState(!1),
    [p, b] = useState(SAMPLE_NOTIFICATIONS),
    x = (P, S) => {
      (S === "connect" || S === "email") && f(!0);
    },
    y = P => {
      b(S => S.map(E => E.id === P ? {
        ...E,
        read: !0
      } : E));
    },
    _ = () => {
      b(P => P.map(S => ({
        ...S,
        read: !0
      })));
    },
    N = p.filter(P => !P.read).length;
  return <div className="min-h-screen bg-background"><div className="max-w-7xl mx-auto px-4 py-6"><div className="mb-6"><h1 className="font-serif text-foreground mb-2">My Profile</h1><p className="text-muted-foreground">Dr. Sarah Chen · University of Cambridge</p></div><div className="flex gap-4 mb-6 border-b border-border"><button onClick={() => s("submissions")} className={`px-4 py-2 border-b-2 transition-colors ${o === "submissions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>My Submissions</button><button onClick={() => s("matches")} className={`px-4 py-2 border-b-2 transition-colors ${o === "matches" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Researcher Matches{SAMPLE_RESEARCHERS.length > 0 && <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">{SAMPLE_RESEARCHERS.length}</span>}</button><button onClick={() => s("notifications")} className={`px-4 py-2 border-b-2 transition-colors ${o === "notifications" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Notifications{N > 0 && <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">{N}</span>}</button><button onClick={() => s("settings")} className={`px-4 py-2 border-b-2 transition-colors ${o === "settings" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Settings</button></div>{o === "submissions" && <div className="space-y-4"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Submission History</h2><div className="flex gap-4 text-sm"><span className="text-green-600">{SAMPLE_SUBMISSIONS.filter(P => P.status === "approved").length}{" Approved"}</span><span className="text-yellow-600">{SAMPLE_SUBMISSIONS.filter(P => P.status === "pending").length}{" Pending"}</span><span className="text-red-600">{SAMPLE_SUBMISSIONS.filter(P => P.status === "rejected").length}{" Rejected"}</span></div></div>{SAMPLE_SUBMISSIONS.map(P => <div className="bg-card border border-border rounded-lg p-4" key={P.id}><div className="flex items-start justify-between"><div className="flex-1"><h3 className="font-serif text-foreground mb-1">{P.title}</h3><div className="flex items-center gap-4 text-sm text-muted-foreground"><span>{P.type}</span><span>·</span><span>{"Submitted "}{new Date(P.submittedDate).toLocaleDateString()}</span><span>·</span><span className="flex items-center gap-1">{P.privacy === "Public" ? <Eye className="w-3 h-3" /> : <Lock className="w-3 h-3" />}{P.privacy}</span></div></div><span className={`px-3 py-1 rounded-full text-sm ${P.status === "approved" ? "bg-green-100 text-green-800" : P.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{P.status.charAt(0).toUpperCase() + P.status.slice(1)}</span></div></div>)}</div>}{o === "matches" && <div className="space-y-4"><div className="mb-4"><h2 className="font-serif text-foreground mb-2">Researcher Matches</h2><p className="text-muted-foreground text-sm">Connect with researchers working on similar topics</p></div>{SAMPLE_RESEARCHERS.map(P => <MatchCard match={P} onAction={S => x(P.id, S)} key={P.id} />)}</div>}{o === "notifications" && <NotificationsPanel notifications={p} onMarkAsRead={y} onMarkAllAsRead={_} />}{o === "settings" && <div className="max-w-2xl space-y-6"><div className="bg-card border border-border rounded-lg p-6"><h3 className="font-serif text-foreground mb-1">Role Settings</h3><p className="text-sm text-muted-foreground mb-5">Your role adjusts which workflows appear first on the home screen. All workflows remain accessible regardless of role.</p><div className="space-y-3">{ROLE_PROFILE_OPTIONS.map(P => {
              const S = P.icon,
                E = i === P.id;
              return <button type="button" onClick={() => n(P.id)} className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${E ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`} key={P.id}><div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${E ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><S className="w-4 h-4" /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-medium text-foreground text-sm">{P.label}</span>{E && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Current</span>}</div><p className="text-xs text-muted-foreground mt-0.5">{P.description}</p></div></button>;
            })}</div></div><div className="bg-card border border-border rounded-lg p-6"><h3 className="font-serif text-foreground mb-4">Notification Settings</h3><div className="space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3">{c ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}<div><p className="text-foreground">Researcher Match Notifications</p><p className="text-sm text-muted-foreground">Get notified when we find potential collaborators</p></div></div><button onClick={() => u(!c)} className={`relative w-12 h-6 rounded-full transition-colors ${c ? "bg-primary" : "bg-muted"}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${c ? "translate-x-7" : "translate-x-1"}`} /></button></div></div></div><div className="bg-card border border-border rounded-lg p-6"><h3 className="font-serif text-foreground mb-4">Privacy Management</h3><p className="text-sm text-muted-foreground mb-4">Control how your profile and submissions are visible to other researchers</p><div className="space-y-3"><label className="flex items-center gap-3"><input type="checkbox" defaultChecked={!0} className="rounded border-border" /><span className="text-sm">Show my name on public submissions</span></label><label className="flex items-center gap-3"><input type="checkbox" defaultChecked={!0} className="rounded border-border" /><span className="text-sm">Allow researcher matching</span></label><label className="flex items-center gap-3"><input type="checkbox" className="rounded border-border" /><span className="text-sm">Share my email with matched researchers</span></label></div></div></div>}</div>{h && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-card rounded-lg p-6 max-w-md"><h3 className="font-serif text-foreground mb-3">Researcher Connection Consent</h3><p className="text-sm text-muted-foreground mb-4">By connecting with this researcher, you consent to sharing your name, institution, and research interests. You can revoke this connection at any time from your settings.</p><div className="flex gap-3"><button onClick={() => f(!1)} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">I Consent</button><button onClick={() => f(!1)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button></div></div></div>}</div>;
}

export default ProfilePage;
