import { Bot, Image, Send, User } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from '../router.jsx';
import { ArtifactCard } from '../components/ArtifactCard.jsx';
import { SAMPLE_ARTIFACTS } from '../data/SAMPLE_ARTIFACTS.js';

export function ConfidenceBadge({
  level: i
}) {
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${{
    High: "bg-green-100 text-green-800 border-green-300",
    Moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Uncertain: "bg-orange-100 text-orange-800 border-orange-300"
  }[i]}`}>{i}{" Confidence"}</span>;
}

export function ChatBubble({
  type: i,
  content: n,
  aiResponse: o
}) {
  return i === "user" ? <div className="flex gap-3 justify-end"><div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 max-w-2xl">{n}</div><div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"><User className="w-4 h-4 text-secondary-foreground" /></div></div> : <div className="flex gap-3"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center"><Bot className="w-4 h-4 text-accent-foreground" /></div><div className="flex-1 max-w-4xl"><div className="bg-card border border-border rounded-lg p-4">{o && <div className="mb-3"><ConfidenceBadge level={o.confidence} /></div>}<p className="text-foreground mb-4">{n}</p>{o?.artifacts && o.artifacts.length > 0 && <div className="mb-4"><p className="text-sm mb-3">Related artifacts:</p><div className="grid grid-cols-3 gap-4">{o.artifacts.map(s => <ArtifactCard artifact={s} key={s.id} />)}</div></div>}{o?.sources && o.sources.length > 0 && <div className="mb-4 pt-4 border-t border-border"><p className="text-sm mb-2">Sources:</p><ul className="space-y-1">{o.sources.map((s, c) => <li className="text-sm text-muted-foreground" key={c}>{c + 1}{". "}{s}</li>)}</ul></div>}{o?.suggestedPrompts && o.suggestedPrompts.length > 0 && <div className="pt-4 border-t border-border"><p className="text-sm mb-2">Follow-up questions:</p><div className="flex flex-wrap gap-2">{o.suggestedPrompts.map((s, c) => <button className="px-3 py-1 text-sm border border-border rounded-full hover:bg-muted transition-colors" key={c}>{s}</button>)}</div></div>}</div></div></div>;
}

export function ChatPage() {
  const [i] = useSearchParams(),
    n = i.get("q") || "",
    [o, s] = useState(n ? [{
      id: "1",
      type: "user",
      content: n
    }, {
      id: "2",
      type: "ai",
      content: "Based on your query, I found several relevant entries in our database. The production techniques varied significantly across these regions, with distinct firing temperatures and clay preparation methods.",
      aiResponse: {
        confidence: "High",
        sources: ["Peacock, D.P.S. (1982) Pottery in the Roman World", "Rice, P.M. (2015) Pottery Analysis: A Sourcebook"],
        artifacts: SAMPLE_ARTIFACTS,
        suggestedPrompts: ["What firing temperatures were used?", "Show distribution map", "Compare to Corinthian production"]
      }
    }] : []),
    [c, u] = useState(""),
    h = () => {
      if (!c.trim()) return;
      const f = {
          id: Date.now().toString(),
          type: "user",
          content: c
        },
        p = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "I can help you explore that topic. Let me search the database for relevant entries.",
          aiResponse: {
            confidence: "Moderate",
            sources: ["Example Source 1", "Example Source 2"],
            artifacts: [SAMPLE_ARTIFACTS[0]],
            suggestedPrompts: ["Tell me more", "Show related vessels"]
          }
        };
      s([...o, f, p]), u("");
    };
  return <div className="min-h-screen bg-background flex flex-col"><div className="border-b border-border bg-card"><div className="max-w-4xl mx-auto px-4 py-6"><h1 className="font-serif text-foreground mb-2">Identify a Sherd</h1><p className="text-muted-foreground mb-3">Narrow possibilities quickly and defensibly — describe or upload an image to find similar artifacts</p><div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2"><p className="text-sm text-foreground"><strong>This tool helps you narrow possibilities — it does not replace your expertise.</strong>{" Results are ranked matches for comparison, not automatic classifications."}</p><p className="text-xs text-muted-foreground">Accepts vessel photos, sherd images, and petrographic thin-section images — the system will detect the type and return appropriate matches.</p></div></div></div><div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">{o.length === 0 ? <div className="h-full flex items-center justify-center"><div className="text-center max-w-2xl"><h2 className="font-serif text-foreground mb-4">Describe your ceramic or upload an image</h2><p className="text-muted-foreground mb-6">Use your own terms — descriptive, typological, technological, or even uncertain language. Works for vessels, sherds, and petrographic samples.</p><div className="space-y-4"><div><div className="text-xs text-muted-foreground mb-2 font-medium text-left">Vessel descriptions:</div><div className="grid grid-cols-2 gap-3">{["red slipped bowl", "Panama Plain", "black on white jar", "possible Formative period serving vessel"].map((f, p) => <button onClick={() => u(f)} className="p-3 border border-border rounded-lg hover:bg-muted hover:border-primary transition-colors text-left text-sm" key={p}>{f}</button>)}</div></div><div><div className="text-xs text-muted-foreground mb-2 font-medium text-left">Fabric & petrographic:</div><div className="grid grid-cols-2 gap-3">{["coarse fabric with quartz temper", "reddish brown matrix with light inclusions", "vesicular fabric", "gritty temper"].map((f, p) => <button onClick={() => u(f)} className="p-3 border border-border rounded-lg hover:bg-muted hover:border-primary transition-colors text-left text-sm" key={p}>{f}</button>)}</div></div></div></div></div> : <div className="space-y-6">{o.map(f => <ChatBubble type={f.type} content={f.content} aiResponse={f.aiResponse} key={f.id} />)}</div>}</div><div className="border-t border-border bg-card"><div className="max-w-4xl mx-auto px-4 py-4"><div className="flex gap-3"><button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"><Image className="w-5 h-5 text-muted-foreground" /></button><input type="text" value={c} onChange={f => u(f.target.value)} onKeyDown={f => f.key === "Enter" && h()} placeholder="Describe your sherd in your own terms..." className="flex-1 px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" /><button onClick={h} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"><Send className="w-5 h-5" /></button></div></div></div></div>;
}

export default ChatPage;
