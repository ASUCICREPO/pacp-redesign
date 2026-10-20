import { Archive, ArrowLeft, ArrowRight, BookOpen, Check, ClipboardList, Compass, Database, Eye, EyeOff, FileText, Flag, Layers, LayoutGrid, MessageSquare, ScanSearch, Upload, User, Zap } from 'lucide-react';
import { useState } from 'react';
import { useRole } from '../context/RoleContext.jsx';
import { palette, sansFont, serifFont } from '../lib/theme.js';
import { PacpLogo } from '../components/PacpLogo.jsx';

export function PacpLogoCard() {
  return <div style={{
    width: 80,
    height: 80,
    background: palette.card,
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(61,53,48,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}><PacpLogo size={56} /></div>;
}

export function StepDots({
  current: i
}) {
  return <div style={{
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center"
  }}>{[0, 1, 2, 3].map(n => <div style={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: n === i ? palette.terra : palette.border,
      transition: "background 0.2s"
    }} key={n} />)}</div>;
}

export function OnboardingStep({
  step: i,
  children: n,
  dots: hasDots = !0
}) {
  return <div style={{
    minHeight: "100vh",
    background: palette.bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    boxSizing: "border-box"
  }}><div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      marginBottom: 48
    }}><PacpLogoCard />{hasDots && <StepDots current={i} />}</div><div style={{
      width: "100%",
      maxWidth: 720,
      background: palette.card,
      borderRadius: 16,
      boxShadow: "0 4px 32px rgba(61,53,48,0.09)",
      padding: "56px 64px 52px",
      boxSizing: "border-box"
    }}>{n}</div></div>;
}

export function StepLabel({
  label: i
}) {
  return <p style={{
    fontFamily: sansFont,
    fontSize: 12,
    fontWeight: 500,
    color: palette.muted,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20
  }}>{i}</p>;
}

export function OnboardingTitle({
  children: i
}) {
  return <h1 style={{
    fontFamily: serifFont,
    fontSize: 32,
    fontWeight: 600,
    color: palette.charcoal,
    textAlign: "center",
    margin: "0 0 14px",
    lineHeight: 1.25
  }}>{i}</h1>;
}

export function OnboardingSubtitle({
  children: i
}) {
  return <p style={{
    fontFamily: sansFont,
    fontSize: 15,
    color: palette.muted,
    textAlign: "center",
    margin: "0 auto 36px",
    lineHeight: 1.6,
    maxWidth: 480
  }}>{i}</p>;
}

export function PrimaryButton({
  onClick: i,
  children: n,
  disabled: o
}) {
  return <button type="button" onClick={o ? void 0 : i} disabled={o} style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: o ? palette.border : palette.terra,
    color: o ? palette.muted : "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 28px",
    fontFamily: sansFont,
    fontSize: 15,
    fontWeight: 600,
    cursor: o ? "not-allowed" : "pointer",
    transition: "background 0.15s"
  }} onMouseEnter={s => {
    o || (s.currentTarget.style.opacity = "0.88");
  }} onMouseLeave={s => {
    o || (s.currentTarget.style.opacity = "1");
  }}>{n}</button>;
}

export function SecondaryButton({
  onClick: i,
  children: n
}) {
  return <button type="button" onClick={i} style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    color: palette.charcoal,
    border: `1.5px solid ${palette.border}`,
    borderRadius: 8,
    padding: "14px 24px",
    fontFamily: sansFont,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer"
  }} onMouseEnter={o => o.currentTarget.style.borderColor = palette.muted} onMouseLeave={o => o.currentTarget.style.borderColor = palette.border}>{n}</button>;
}

export function StepFooter({
  left: i,
  right: n
}) {
  return <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: i ? "space-between" : "flex-end",
    marginTop: 44
  }}>{i}{n}</div>;
}

export const ROLE_OPTIONS = [{
  id: "crm",
  title: "CRM Archaeologist",
  description: "Compliance archaeology, reporting, time pressure, large volumes of material."
}, {
  id: "grad_student",
  title: "Graduate Student",
  description: "Training, thesis research, learning comparative frameworks."
}, {
  id: "undergrad_student",
  title: "Undergraduate Student",
  description: "Introductory learning, visual recognition, guided exploration."
}];

export function RoleOptionCard({
  role: i,
  selected: n,
  onSelect: o
}) {
  const [s, c] = useState(!1);
  return <button type="button" onClick={o} onMouseEnter={() => c(!0)} onMouseLeave={() => c(!1)} style={{
    position: "relative",
    width: "100%",
    padding: "28px 32px",
    background: palette.card,
    border: `1.5px solid ${n || s ? palette.terra : palette.border}`,
    borderRadius: 12,
    textAlign: "left",
    cursor: "pointer",
    transition: "border-color 0.15s",
    outline: "none"
  }}>{n && <div style={{
      position: "absolute",
      top: 14,
      right: 14,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: palette.terra,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}><Check size={12} color="#fff" strokeWidth={3} /></div>}<p style={{
      fontFamily: serifFont,
      fontSize: 18,
      fontWeight: 600,
      color: palette.charcoal,
      marginBottom: 6,
      lineHeight: 1.3
    }}>{i.title}</p><p style={{
      fontFamily: sansFont,
      fontSize: 14,
      color: palette.muted,
      lineHeight: 1.55,
      margin: 0
    }}>{i.description}</p></button>;
}

export function RoleStep({
  onContinue: i,
  selectedRole: n,
  setSelectedRole: o
}) {
  return <OnboardingStep step={0}><StepLabel label="Step 1 of 3" /><OnboardingTitle>Which best describes your work?</OnboardingTitle><OnboardingSubtitle>This tailors the language and suggested tasks on your home screen.</OnboardingSubtitle><div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>{ROLE_OPTIONS.map(s => <RoleOptionCard role={s} selected={n === s.id} onSelect={() => o(s.id)} key={s.id} />)}</div><StepFooter left={<button type="button" onClick={i} style={{
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontFamily: sansFont,
      fontSize: 14,
      color: palette.muted,
      textDecoration: "underline",
      textUnderlineOffset: 3
    }}>Skip for now — I'll explore</button>} right={<PrimaryButton onClick={i}>{"Continue "}<ArrowRight size={16} strokeWidth={2.5} /></PrimaryButton>} /></OnboardingStep>;
}

export const TASK_OPTIONS = {
  crm: [{
    id: "rapid-id",
    icon: Zap,
    title: "Rapid identification",
    description: "Fast field IDs with defensible results"
  }, {
    id: "reports",
    icon: FileText,
    title: "Report preparation",
    description: "Compile compliance-ready outputs"
  }, {
    id: "legacy",
    icon: Archive,
    title: "Legacy data recovery",
    description: "Bring older records into PACP"
  }, {
    id: "needs-review",
    icon: Flag,
    title: "Needs-review submissions",
    description: "Flag uncertain finds for expert review"
  }],
  grad_student: [{
    id: "guided-id",
    icon: Compass,
    title: "Guided identification",
    description: "Narrow possibilities with transparent reasoning"
  }, {
    id: "literature",
    icon: BookOpen,
    title: "Literature exploration",
    description: "Find comparable studies and references"
  }, {
    id: "dataset",
    icon: Database,
    title: "Research dataset building",
    description: "Assemble records for thesis or publication"
  }, {
    id: "debate",
    icon: MessageSquare,
    title: "Learning through debate",
    description: "Compare interpretations and reasoning histories"
  }],
  undergrad_student: [{
    id: "intro-id",
    icon: ScanSearch,
    title: "Introductory identification",
    description: "Visual, guided workflows for new learners"
  }, {
    id: "comparison",
    icon: Layers,
    title: "Learning-by-comparison",
    description: "Place examples side by side to build intuition"
  }, {
    id: "assignments",
    icon: ClipboardList,
    title: "Training assignments",
    description: "Complete coursework tied to PACP records"
  }, {
    id: "browse",
    icon: LayoutGrid,
    title: "Browse curated examples",
    description: "Explore approachable starter collections"
  }]
};

export const ROLE_FULL_LABELS = {
  crm: "CRM Archaeologist",
  grad_student: "Graduate Student",
  undergrad_student: "Undergraduate Student"
};

export function TaskOptionCard({
  task: i,
  selected: n,
  onToggle: o
}) {
  const [s, c] = useState(!1),
    U = i.icon;
  return <button type="button" onClick={o} onMouseEnter={() => c(!0)} onMouseLeave={() => c(!1)} style={{
    position: "relative",
    padding: "24px 20px",
    background: palette.card,
    border: `1.5px solid ${n || s ? palette.terra : palette.border}`,
    borderRadius: 12,
    textAlign: "left",
    cursor: "pointer",
    transition: "border-color 0.15s",
    outline: "none",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    minHeight: 100
  }}>{n && <div style={{
      position: "absolute",
      top: 10,
      right: 10,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: palette.terra,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}><Check size={11} color="#fff" strokeWidth={3} /></div>}<div style={{
      width: 40,
      height: 40,
      borderRadius: 10,
      flexShrink: 0,
      background: n ? palette.terra : palette.terraLight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.15s"
    }}><U size={18} color={n ? "#fff" : palette.terra} strokeWidth={1.8} /></div><div><p style={{
        fontFamily: serifFont,
        fontSize: 16,
        fontWeight: 600,
        color: palette.charcoal,
        margin: "0 0 5px",
        lineHeight: 1.25
      }}>{i.title}</p><p style={{
        fontFamily: sansFont,
        fontSize: 13,
        color: palette.muted,
        margin: 0,
        lineHeight: 1.5
      }}>{i.description}</p></div></button>;
}

export function TasksStep({
  onBack: i,
  onContinue: n,
  selectedRole: o,
  selectedTasks: s,
  setSelectedTasks: c
}) {
  const u = o ?? "crm",
    h = TASK_OPTIONS[u],
    f = p => c(s.includes(p) ? s.filter(b => b !== p) : [...s, p]);
  return <OnboardingStep step={1}><StepLabel label="Step 2 of 3" /><OnboardingTitle>What are you here to do?</OnboardingTitle><OnboardingSubtitle>Pick all that apply — we'll set up your home screen around these. You can always do everything else too.</OnboardingSubtitle><p style={{
      fontFamily: sansFont,
      fontSize: 13,
      color: palette.muted,
      textAlign: "center",
      marginBottom: 20
    }}>{"Tasks tailored for "}<span style={{
        color: palette.charcoal,
        fontWeight: 500
      }}>{ROLE_FULL_LABELS[u]}</span></p><div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }}>{h.map(p => <TaskOptionCard task={p} selected={s.includes(p.id)} onToggle={() => f(p.id)} key={p.id} />)}</div><p style={{
      fontFamily: sansFont,
      fontSize: 12,
      color: palette.muted,
      textAlign: "center",
      marginTop: 12
    }}>Select one or more.</p><StepFooter left={<SecondaryButton onClick={i}><ArrowLeft size={15} />{" Back"}</SecondaryButton>} right={<PrimaryButton onClick={n} disabled={s.length === 0}>{"Continue "}<ArrowRight size={16} strokeWidth={2.5} /></PrimaryButton>} /></OnboardingStep>;
}

export function FieldLabel({
  label: i,
  required: n,
  optional: o
}) {
  return <label style={{
    display: "block",
    fontFamily: sansFont,
    fontSize: 13,
    fontWeight: 500,
    color: palette.charcoal,
    marginBottom: 6
  }}>{i}{n && <span style={{
      color: palette.terra,
      marginLeft: 3
    }}>*</span>}{o && <span style={{
      color: palette.muted,
      fontWeight: 400,
      marginLeft: 5,
      fontSize: 12
    }}>(optional)</span>}</label>;
}

export function TextField({
  placeholder: i,
  type: n = "text",
  value: v,
  onChange: onChangeValue,
  autoComplete: ac
}) {
  return <input type={n} placeholder={i} autoComplete={ac} {...(onChangeValue ? {
    value: v ?? "",
    onChange: e => onChangeValue(e.target.value)
  } : {})} style={{
    width: "100%",
    padding: "12px 14px",
    background: palette.inputBg,
    border: "none",
    borderRadius: 8,
    fontFamily: sansFont,
    fontSize: 14,
    color: palette.charcoal,
    outline: "none",
    boxSizing: "border-box"
  }} onFocus={o => o.currentTarget.style.boxShadow = `0 0 0 2px ${palette.terra}40`} onBlur={o => o.currentTarget.style.boxShadow = "none"} />;
}

export function PasswordField({
  placeholder: i,
  value: v,
  onChange: onChangeValue,
  autoComplete: ac
}) {
  const [n, o] = useState(!1);
  return <div style={{
    position: "relative"
  }}><input type={n ? "text" : "password"} placeholder={i} autoComplete={ac} {...(onChangeValue ? {
    value: v ?? "",
    onChange: e => onChangeValue(e.target.value)
  } : {})} style={{
      width: "100%",
      padding: "12px 44px 12px 14px",
      background: palette.inputBg,
      border: "none",
      borderRadius: 8,
      fontFamily: sansFont,
      fontSize: 14,
      color: palette.charcoal,
      outline: "none",
      boxSizing: "border-box"
    }} onFocus={s => s.currentTarget.style.boxShadow = `0 0 0 2px ${palette.terra}40`} onBlur={s => s.currentTarget.style.boxShadow = "none"} /><button type="button" onClick={() => o(!n)} style={{
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: palette.muted,
      padding: 0
    }}>{n ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>;
}

export function AccountStep({
  onBack: i,
  onContinue: n,
  account: acct,
  setAccount: setAcct
}) {
  const o = (s, c, u, h) => <div style={{
    display: "flex",
    flexDirection: "column"
  }} key={s}><FieldLabel label={s} required={u} optional={h} />{c}</div>;
  return <OnboardingStep step={2}><StepLabel label="Step 3 of 3" /><OnboardingTitle>Create your account</OnboardingTitle><OnboardingSubtitle>Save your setup and start contributing. You can edit any of this later.</OnboardingSubtitle><div style={{
      display: "flex",
      flexDirection: "column",
      gap: 18
    }}><div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      }}><div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: palette.inputBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${palette.border}`,
          cursor: "pointer"
        }}><User size={28} color={palette.muted} strokeWidth={1.5} /></div><span style={{
          fontFamily: sansFont,
          fontSize: 12,
          color: palette.muted
        }}>{"Upload photo "}<span style={{
            color: palette.muted,
            opacity: 0.6
          }}>(optional)</span></span></div>{o("Full Name", <TextField placeholder="Dr. Jane Smith" value={acct?.name} onChange={x => setAcct?.(y => ({ ...y, name: x }))} autoComplete="name" />, !0)}{o("Email", <TextField placeholder="your.email@university.edu" type="email" value={acct?.email} onChange={x => setAcct?.(y => ({ ...y, email: x }))} autoComplete="email" />, !0)}{o("Password", <PasswordField placeholder="Minimum 8 characters" />, !0)}{o("Confirm Password", <PasswordField placeholder="Re-enter your password" />, !0)}<div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }}><div><FieldLabel label="Title" optional={!0} /><TextField placeholder="e.g., Graduate Researcher" /></div><div><FieldLabel label="Affiliation" optional={!0} /><TextField placeholder="e.g., University of Arizona" value={acct?.affiliation} onChange={x => setAcct?.(y => ({ ...y, affiliation: x }))} autoComplete="organization" /></div></div>{o("Website", <TextField placeholder="https://" />, !1, !0)}<div><FieldLabel label="Attach CV (PDF)" optional={!0} /><div style={{
          width: "100%",
          padding: "18px 0",
          background: palette.inputBg,
          border: `1.5px dashed ${palette.border}`,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          cursor: "pointer",
          boxSizing: "border-box"
        }}><Upload size={15} color={palette.muted} /><span style={{
            fontFamily: sansFont,
            fontSize: 13,
            color: palette.muted
          }}>No file attached · Click to upload</span></div></div></div><StepFooter left={<SecondaryButton onClick={i}><ArrowLeft size={15} />{" Back"}</SecondaryButton>} right={<PrimaryButton onClick={n}>{"Create account "}<ArrowRight size={16} strokeWidth={2.5} /></PrimaryButton>} /><p style={{
      fontFamily: sansFont,
      fontSize: 13,
      color: palette.muted,
      textAlign: "center",
      marginTop: 20
    }}>Already have an account?{" "}<button type="button" style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: palette.terra,
        fontSize: 13,
        fontFamily: sansFont
      }}>Sign in</button></p></OnboardingStep>;
}

export function workflowSummary(i, n) {
  const o = TASK_OPTIONS[n],
    s = i.map(c => o.find(u => u.id === c)?.title).filter(Boolean);
  return s.length === 0 ? "your selected workflows" : s.length === 1 ? s[0] : s.length === 2 ? `${s[0]} and ${s[1]}` : `${s.slice(0, -1).join(", ")}, and ${s[s.length - 1]}`;
}

export function HomeScreenPreview() {
  return <div style={{
    margin: "0 auto",
    maxWidth: 520,
    border: `1.5px solid ${palette.border}`,
    borderRadius: 12,
    background: palette.bg,
    padding: "20px 24px"
  }}><p style={{
      fontFamily: sansFont,
      fontSize: 11,
      color: palette.muted,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginBottom: 14
    }}>Your personalized home screen</p><div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10
    }}>{["Primary workflow", "Second workflow", "Third workflow"].map((i, n) => <div style={{
        background: n === 0 ? palette.terra : palette.card,
        border: `1.5px solid ${n === 0 ? palette.terra : palette.border}`,
        borderRadius: 8,
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "center"
      }} key={i}><div style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: n === 0 ? "rgba(255,255,255,0.25)" : palette.terraLight
        }} /><div style={{
          width: "80%",
          height: 7,
          borderRadius: 4,
          background: n === 0 ? "rgba(255,255,255,0.4)" : palette.border
        }} /><div style={{
          width: "60%",
          height: 5,
          borderRadius: 4,
          background: n === 0 ? "rgba(255,255,255,0.25)" : palette.border
        }} /></div>)}</div></div>;
}

export function ReadyStep({
  onBack: i,
  onFinish: n,
  selectedRole: o,
  selectedTasks: s
}) {
  const c = o ?? "crm",
    u = workflowSummary(s, c);
  return <OnboardingStep step={3}><div style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: 28
    }}><div style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: palette.terraLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}><Check size={36} color={palette.terra} strokeWidth={2.5} /></div></div><OnboardingTitle>Your workspace is ready</OnboardingTitle><OnboardingSubtitle>Welcome — here's your PACP, set up for{" "}<span style={{
        color: palette.charcoal,
        fontWeight: 500
      }}>{ROLE_FULL_LABELS[c]}</span>{" "}{"to support "}{u}.</OnboardingSubtitle><HomeScreenPreview /><div style={{
      margin: "24px auto 0",
      maxWidth: 520,
      background: palette.terraLight,
      borderRadius: 10,
      padding: "14px 18px",
      display: "flex",
      alignItems: "flex-start",
      gap: 10
    }}><span style={{
        color: palette.terra,
        fontSize: 16,
        lineHeight: 1,
        flexShrink: 0
      }}>ℹ</span><p style={{
        fontFamily: sansFont,
        fontSize: 13,
        color: palette.charcoal,
        margin: 0,
        lineHeight: 1.6
      }}><strong style={{
          fontWeight: 600
        }}>Note:</strong>{" You can access every PACP workflow anytime through search or Browse — this just sets your starting point."}</p></div><StepFooter left={<SecondaryButton onClick={i}><ArrowLeft size={15} />{" Back"}</SecondaryButton>} right={<PrimaryButton onClick={n}>{"Go to my home "}<ArrowRight size={16} strokeWidth={2.5} /></PrimaryButton>} /></OnboardingStep>;
}

export function OnboardingFlow({ onFinish: finished }) {
  const {
      setRole: i,
      setTasks: n
    } = useRole(),
    [o, s] = useState(0),
    [c, u] = useState(null),
    [h, f] = useState([]),
    [account, setAccount] = useState({ name: "", email: "", affiliation: "" }),
    p = () => {
      const role = c ?? "crm";
      i(role), n(h), finished?.({ role, tasks: h, account });
    },
    b = x => {
      x !== c && f([]), u(x);
    };
  return o === 0 ? <RoleStep selectedRole={c} setSelectedRole={b} onContinue={() => s(1)} /> : o === 1 ? <TasksStep selectedRole={c} selectedTasks={h} setSelectedTasks={f} onBack={() => s(0)} onContinue={() => s(2)} /> : o === 2 ? <AccountStep onBack={() => s(1)} onContinue={() => s(3)} account={account} setAccount={setAccount} /> : <ReadyStep selectedRole={c} selectedTasks={h} onBack={() => s(2)} onFinish={p} />;
}

export default OnboardingFlow;
