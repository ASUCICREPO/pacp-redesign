import { Check, ChevronRight, Ellipsis, Image, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from '../router.jsx';
import { useAssistant } from '../context/AssistantContext.jsx';
import { localize } from '../data/localize.js';
import {
  clearConversations,
  relativeTime,
  saveConversation,
  titleFor,
  useConversations,
} from '@/lib/assistant-storage';
import { assistantEngine } from './assistantEngine.js';
import { helpAnswer } from './assistantData.js';

export function assistantGreeting(i) {
  return {
    id: "greeting",
    role: "assistant",
    text: localize(i, "Hi Jenny — I'm the PACP Assistant. I can help you find records, identify sherds, compare assemblages, submit data, or just answer questions about ceramics or how PACP works. What are you working on?", "Hola Jenny — soy el Asistente PACP. Puedo ayudarte a encontrar registros, identificar fragmentos, comparar ensamblajes, enviar datos o responder preguntas sobre cerámica o cómo funciona PACP. ¿En qué estás trabajando?")
  };
}

export const QUICK_STARTS_EN = [{
  icon: "🔍",
  title: "Identify a sherd",
  sub: "I have a photo or description"
}, {
  icon: "⚖️",
  title: "Compare records",
  sub: "Help me find similarities"
}, {
  icon: "📝",
  title: "Submit data",
  sub: "Add a vessel or site"
}, {
  icon: "❓",
  title: "Explain a concept",
  sub: "What's a petro-fabric?"
}];

export const QUICK_STARTS_ES = [{
  icon: "🔍",
  title: "Identificar un fragmento",
  sub: "Tengo una foto o descripción"
}, {
  icon: "⚖️",
  title: "Comparar registros",
  sub: "Ayúdame a encontrar similitudes"
}, {
  icon: "📝",
  title: "Enviar datos",
  sub: "Agregar una vasija o sitio"
}, {
  icon: "❓",
  title: "Explicar un concepto",
  sub: "¿Qué es un petro-fabric?"
}];

export function InlineDocLink({
  label: i,
  href: n
}) {
  return <Link to={n} className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 border border-[#B5563B] text-[#B5563B] rounded-lg text-[12px] font-medium hover:bg-[#B5563B]/8 transition-colors">{i}{" "}<ChevronRight className="w-3 h-3" /></Link>;
}

export function ChatOptionPicker({
  prompt: i,
  options: n,
  onPick: o
}) {
  const [s, c] = useState(null);
  return <div className="mt-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F3] overflow-hidden">{i && <p className="px-3 pt-2.5 pb-1 text-[12px] text-[#888]">{i}</p>}<div className="divide-y divide-[#EDE5DB]">{n.map((u, h) => <button onClick={() => {
        s || (c(u.label), o(u.label));
      }} className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${s === u.label ? "bg-[#B5563B]/8" : "hover:bg-[#F0E8DC]"}`} key={h}><span className="flex-1"><span className="text-[13px] font-medium text-[#3D3530] block">{u.label}</span>{u.sub && <span className="text-[11px] text-[#888]">{u.sub}</span>}</span>{s === u.label && <Check className="w-3.5 h-3.5 text-[#B5563B] shrink-0" />}</button>)}</div></div>;
}

export function ChatInlineInput({
  fieldLabel: i,
  placeholder: n,
  onSubmit: o
}) {
  const [s, c] = useState(""),
    [u, h] = useState(!1),
    f = () => {
      !s.trim() || u || (h(!0), o(s.trim()));
    };
  return <div className="mt-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F3] px-3 py-3"><label className="block text-[11px] font-semibold text-[#5C4A3A] uppercase tracking-wide mb-1.5">{i}</label><div className="flex gap-2"><input value={s} onChange={p => c(p.target.value)} onKeyDown={p => p.key === "Enter" && f()} placeholder={n} disabled={u} className="flex-1 px-3 py-2 border border-[#E0D5C8] rounded-lg bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#B5563B]/30 disabled:opacity-60 placeholder:text-[#CCC]" /><button onClick={f} disabled={!s.trim() || u} className="px-3 py-2 bg-[#B5563B] text-white rounded-lg text-[13px] font-medium hover:bg-[#9E4A32] transition-colors disabled:opacity-40 min-w-[36px]">{u ? <Check className="w-4 h-4" /> : "→"}</button></div></div>;
}

export function ChatResultList({
  title: i,
  results: n,
  button: o
}) {
  return <div className="mt-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F3] overflow-hidden"><p className="px-3 pt-2.5 pb-1.5 text-[12px] font-semibold text-[#5C4A3A]">{i}</p><div className="divide-y divide-[#EDE5DB]">{n.map((s, c) => <div className="flex items-center gap-3 px-3 py-2.5" key={c}><div className={`w-9 h-9 rounded-lg ${s.color} shrink-0 flex items-center justify-center`}><Image className="w-4 h-4 text-[#B5563B]/40" /></div><div className="flex-1 min-w-0"><p className="text-[13px] font-medium text-[#3D3530] truncate">{s.name}</p><p className="text-[11px] text-[#888]">{s.ware}</p></div><p className="text-[11px] text-[#B5563B] text-right max-w-[110px] leading-snug shrink-0">{s.match}</p></div>)}</div><p className="px-3 pb-1.5 pt-1 text-[11px] text-[#999] italic">You decide — these are suggestions, not classifications.</p><div className="px-3 pb-3"><Link to={o.href} className="block text-center py-2 bg-[#B5563B] text-white rounded-lg text-[12px] font-medium hover:bg-[#9E4A32] transition-colors">{o.label}</Link></div></div>;
}

export function ChatPayload({
  payload: i,
  addMsg: n
}) {
  switch (i.kind) {
    case "button":
      return <InlineDocLink {...i.button} />;
    case "picker":
      return <ChatOptionPicker prompt={i.prompt} options={i.options} onPick={i.onPick} />;
    case "quick-input":
      return <ChatInlineInput fieldLabel={i.fieldLabel} placeholder={i.placeholder} onSubmit={i.onSubmit} />;
    case "results":
      return <ChatResultList title={i.title} results={i.results} button={i.button} />;
  }
}

export function ChatMessage({
  msg: i,
  addMsg: n
}) {
  const o = i.role === "user";
  return <div className={`flex ${o ? "justify-end" : "justify-start"}`}><div className={`${o ? "max-w-[85%]" : "w-full"}`}>{!o && <div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-3 h-3 text-[#B5563B]" /><span className="text-[11px] text-[#999]">PACP Assistant</span></div>}<div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${o ? "bg-[#B5563B] text-white rounded-br-sm" : "bg-white border border-[#E8DDD0] text-[#3D3530] rounded-bl-sm shadow-sm whitespace-pre-line"}`}>{i.text}{!o && i.payload && <ChatPayload payload={i.payload} addMsg={n} />}</div></div></div>;
}

export function ChatHeaderMenu({
  onNewConversation: i,
  onViewAll: v,
  onSettings: g,
  onHelp: m
}) {
  const [o, s] = useState(!1);
  // Every item used to close the menu and do nothing; each now runs.
  const items = [{
    label: localize(g.lang, "New conversation", "Nueva conversación"),
    action: i
  }, {
    label: localize(g.lang, "View all conversations", "Ver todas las conversaciones"),
    action: v
  }, {
    label: localize(g.lang, "Settings", "Ajustes"),
    action: g.open
  }, {
    label: localize(g.lang, "Help", "Ayuda"),
    action: m
  }];
  return <div className="relative"><button onClick={() => s(u => !u)} className="p-1.5 rounded-lg text-[#888] hover:text-[#3D3530] hover:bg-[#EDE5DB] transition-colors"><Ellipsis className="w-4 h-4" /></button>{o && <><div className="fixed inset-0 z-10" onClick={() => s(!1)} /><div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white border border-[#E8DDD0] rounded-xl shadow-lg py-1 overflow-hidden">{items.map((u, h) => <button onClick={() => {
          u.action(), s(!1);
        }} className="w-full text-left px-3.5 py-2 text-[13px] text-[#3D3530] hover:bg-[#F7F4EE] transition-colors" key={h}>{u.label}</button>)}</div></>}</div>;
}

/** The assistant is composing. The reply already took a beat; now it shows. */
export function ChatTyping() {
  return <div className="flex justify-start"><div className="w-full"><div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-3 h-3 text-[#B5563B]" /><span className="text-[11px] text-[#999]">PACP Assistant</span></div><div className="px-3.5 py-3 rounded-2xl bg-white border border-[#E8DDD0] rounded-bl-sm shadow-sm inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#B5563B]/50 animate-pulse" /><span className="w-1.5 h-1.5 rounded-full bg-[#B5563B]/50 animate-pulse [animation-delay:150ms]" /><span className="w-1.5 h-1.5 rounded-full bg-[#B5563B]/50 animate-pulse [animation-delay:300ms]" /></div></div></div>;
}

export function ChatWelcome({
  lang: i,
  onPrompt: n,
  conversations: c,
  onOpen: d,
  showAll: a
}) {
  const o = i === "en" ? QUICK_STARTS_EN : QUICK_STARTS_ES;
  const list = a ? c : c.slice(0, 3);
  return <div className="space-y-5 pt-1"><div><p className="text-[11px] font-semibold text-[#B5563B] uppercase tracking-widest mb-2.5">{localize(i, "Quick starts", "Acciones rápidas")}</p><div className="grid grid-cols-2 gap-2">{o.map((s, k) => <button onClick={() => n(s.title)} className="flex flex-col gap-1 text-left px-3 py-3 bg-white border border-[#E8DDD0] rounded-xl hover:border-[#B5563B]/40 hover:shadow-sm transition-all" key={k}><span className="text-[16px]">{s.icon}</span><span className="text-[12px] font-semibold text-[#3D3530] leading-snug">{s.title}</span><span className="text-[11px] text-[#999] leading-snug">{s.sub}</span></button>)}</div></div><div><p className="text-[11px] font-semibold text-[#B5563B] uppercase tracking-widest mb-2.5">{a ? localize(i, "All conversations", "Todas las conversaciones") : localize(i, "Recent conversations", "Conversaciones recientes")}</p><div className="space-y-1.5">{list.length === 0 ? <p className="text-[12px] text-[#999] px-1">{localize(i, "No conversations yet — ask me anything and it will be saved here.", "Aún no hay conversaciones — pregúntame algo y se guardará aquí.")}</p> : list.map(s => <button onClick={() => d(s)} className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-white border border-[#E8DDD0] rounded-xl hover:border-[#B5563B]/30 hover:shadow-sm transition-all text-left" key={s.id}><span className="w-1.5 h-1.5 rounded-full bg-[#B5563B]/40 shrink-0 mt-0.5" /><span className="flex-1 text-[12px] text-[#3D3530] leading-snug">{s.title}</span><span className="text-[11px] text-[#999] shrink-0">{relativeTime(s.updated_at, i)}</span></button>)}</div></div></div>;
}

export function followUpSuggestions(i) {
  const {
    pathname: n
  } = useLocation();
  return n.includes("/identify") ? i === "en" ? ["Help me refine this match", "What does this attribute mean?", "Show me similar records", "Save my reasoning"] : ["Ayúdame a refinar esta coincidencia", "¿Qué significa este atributo?", "Mostrar registros similares", "Guardar mi razonamiento"] : n.includes("/compare") ? i === "en" ? ["Compare these records", "What attributes differ?", "Add another record", "Export this comparison"] : ["Comparar estos registros", "¿Qué atributos difieren?", "Agregar otro registro", "Exportar esta comparación"] : n.includes("/submit") ? i === "en" ? ["Fill out for me", "What fields are required?", "Add a new site", "Save as draft"] : ["Rellenar por mí", "¿Qué campos son obligatorios?", "Agregar nuevo sitio", "Guardar como borrador"] : n.includes("/search") ? i === "en" ? ["Find parallels for this", "What does this match mean?", "Show me sites in PACP", "How many records are there?"] : ["Buscar paralelos", "¿Qué significa esta coincidencia?", "Muéstrame los sitios en PACP", "¿Cuántos registros hay?"] : i === "en" ? ["Tell me about petro-fabrics", "Show me sites in PACP", "Help me identify a sherd", "Help me submit data"] : ["Cuéntame sobre petro-fabrics", "Muéstrame los sitios en PACP", "Ayúdame a identificar un fragmento", "Ayúdame a enviar datos"];
}

const newConversationId = () => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Links and result lists are plain data and are kept; pickers and inline
 * inputs hold live callbacks, so a reopened conversation shows the answer
 * without re-offering a choice that was already made.
 */
const STORABLE_PAYLOADS = ["button", "results"];

const storable = (msg) => ({
  id: msg.id,
  role: msg.role,
  text: msg.text,
  ...(STORABLE_PAYLOADS.includes(msg.payload?.kind) ? { payload: msg.payload } : {})
});

export function AssistantPanel() {
  const {
      setOpen: i
    } = useAssistant(),
    [n, o] = useState("en"),
    [s, c] = useState([assistantGreeting("en")]),
    [u, h] = useState(!0),
    [f, p] = useState(""),
    [conversationId, setConversationId] = useState(newConversationId),
    [showAll, setShowAll] = useState(!1),
    [thinking, setThinking] = useState(!1),
    conversations = useConversations(),
    // The transcript as loaded from storage; reading one must not re-date it.
    loadedRef = useRef(null),
    b = useRef(null),
    x = useRef(null),
    y = followUpSuggestions(n),
    _ = E => {
      const B = {
        id: `${Date.now()}-${Math.random()}`,
        ...E
      };
      c(F => [...F, B]);
    };
  useEffect(() => {
    b.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [s, thinking]);
  // Saved as you talk, so closing the panel or the tab does not lose it.
  useEffect(() => {
    if (s === loadedRef.current) return;
    const body = s.filter(m => m.id !== "greeting");
    if (!body.some(m => m.role === "user")) return;
    saveConversation({
      id: conversationId,
      title: titleFor(body, n),
      updated_at: new Date().toISOString(),
      lang: n,
      messages: body.map(storable)
    });
  }, [s, conversationId, n]);
  const N = E => {
      // Switching language used to wipe the conversation; only the greeting
      // needs translating.
      o(E), c(F => F.map(m => m.id === "greeting" ? assistantGreeting(E) : m));
    },
    P = () => {
      setConversationId(newConversationId()), c([assistantGreeting(n)]), h(!0), setShowAll(!1);
    },
    openConversation = conversation => {
      const loaded = [assistantGreeting(conversation.lang ?? n), ...conversation.messages];
      loadedRef.current = loaded;
      setConversationId(conversation.id), o(conversation.lang ?? n), c(loaded), h(!1), setShowAll(!1);
    },
    settingsPrompt = () => {
      h(!1), _({
        role: "assistant",
        text: localize(n, "What would you like to change?", "¿Qué te gustaría cambiar?"),
        payload: {
          kind: "picker",
          prompt: "",
          options: [{
            label: localize(n, "Switch to Español", "Cambiar a English"),
            sub: localize(n, "Change the assistant's language", "Cambiar el idioma del asistente")
          }, {
            label: localize(n, "Clear conversation history", "Borrar el historial"),
            sub: localize(n, "Removes every saved conversation from this browser", "Elimina todas las conversaciones guardadas de este navegador")
          }, {
            label: localize(n, "Nothing, thanks", "Nada, gracias"),
            sub: localize(n, "Close this and carry on", "Cerrar y continuar")
          }],
          onPick: label => {
            if (label.startsWith("Switch") || label.startsWith("Cambiar")) {
              const next = n === "en" ? "es" : "en";
              N(next), _({
                role: "assistant",
                text: localize(next, "Switched to English.", "Cambiado a español.")
              });
              return;
            }
            if (label.startsWith("Clear") || label.startsWith("Borrar")) {
              clearConversations(), _({
                role: "assistant",
                text: localize(n, "Cleared. Saved conversations are gone from this browser — this one is still here until you start a new one.", "Listo. Las conversaciones guardadas se borraron de este navegador.")
              });
              return;
            }
            _({
              role: "assistant",
              text: localize(n, "No changes made.", "Sin cambios.")
            });
          }
        }
      });
    },
    showHelp = () => {
      h(!1), _(helpAnswer(n));
    },
    S = E => {
      const B = (E ?? f).trim();
      B && (h(!1), setShowAll(!1), _({
        role: "user",
        text: B
      }), p(""), setThinking(!0), setTimeout(() => {
        const F = assistantEngine(B, n, _);
        setThinking(!1), _(F);
      }, 380));
    };
  return <div className="fixed right-0 top-0 bottom-0 z-[100] w-[460px] flex flex-col bg-[#F7F4EE] shadow-2xl border-l border-[#E0D5C8]"><div className="shrink-0 px-4 pt-4 pb-3 border-b border-[#E0D5C8] bg-[#F7F4EE]"><div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#B5563B] shrink-0" /><span className="font-semibold text-[#3D3530] text-[14px] flex-1">PACP Assistant</span><div className="flex items-center border border-[#E0D5C8] rounded-full overflow-hidden text-[11px] shrink-0"><button onClick={() => N("en")} className={`px-2.5 py-1 transition-colors ${n === "en" ? "bg-[#B5563B] text-white" : "text-[#888] hover:bg-[#EDE5DB]"}`}>EN</button><button onClick={() => N("es")} className={`px-2.5 py-1 transition-colors ${n === "es" ? "bg-[#B5563B] text-white" : "text-[#888] hover:bg-[#EDE5DB]"}`}>ES</button></div><ChatHeaderMenu onNewConversation={P} onViewAll={() => {
            h(!0), setShowAll(!0);
          }} onSettings={{
            lang: n,
            open: settingsPrompt
          }} onHelp={showHelp} /><button onClick={() => i(!1)} className="p-1.5 rounded-lg text-[#888] hover:text-[#3D3530] hover:bg-[#EDE5DB] transition-colors"><X className="w-4 h-4" /></button></div><p className="text-[11px] text-[#999] italic mt-0.5 ml-6">{localize(n, "Your ceramics research companion", "Tu asistente de investigación cerámica")}</p></div><div className="flex-1 overflow-y-auto px-4 py-4 space-y-4"><ChatMessage msg={s[0]} addMsg={_} key={s[0].id} />{u && <ChatWelcome lang={n} onPrompt={E => S(E)} conversations={conversations} onOpen={openConversation} showAll={showAll} />}{s.slice(1).map(E => <ChatMessage msg={E} addMsg={_} key={E.id} />)}{thinking && <ChatTyping />}<div ref={b} /></div><div className="shrink-0 border-t border-[#E0D5C8] bg-[#F7F4EE] px-4 pt-3 pb-2"><div className="flex flex-wrap gap-1.5 mb-2.5">{y.map((E, B) => <button onClick={() => S(E)} className="px-2.5 py-1 text-[11px] border border-[#E0D5C8] rounded-full bg-white text-[#5C4A3A] hover:border-[#B5563B]/50 hover:bg-[#EDE5DB] transition-colors" key={B}>{E}</button>)}</div><div className="flex gap-2"><button title={localize(n, "Upload a sherd or vessel photo", "Subir una foto de fragmento o vasija")} onClick={() => x.current?.click()} className="p-2.5 border border-[#E0D5C8] rounded-xl bg-white hover:bg-[#EDE5DB] transition-colors shrink-0"><Image className="w-4 h-4 text-[#AAA]" /></button><input ref={x} type="file" accept="image/*" className="hidden" onChange={E => {
          const file = E.target.files?.[0];
          h(!1), _({
            role: "user",
            // Name the file, so the transcript says which photo was discussed.
            text: file ? localize(n, `[Image: ${file.name}]`, `[Imagen: ${file.name}]`) : "[Image uploaded]"
          }), setThinking(!0), setTimeout(() => {
            setThinking(!1), _(assistantEngine("[image]", n, _));
          }, 380), E.target.value = "";
        }} /><input value={f} onChange={E => p(E.target.value)} onKeyDown={E => E.key === "Enter" && S()} placeholder={localize(n, "Ask anything about ceramics, your data, or PACP…", "Pregunta sobre cerámica, tus datos o PACP…")} className="flex-1 px-3 py-2.5 border border-[#E0D5C8] rounded-xl bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#B5563B]/30 placeholder:text-[#CCC]" /><button onClick={() => S()} className="p-2.5 bg-[#B5563B] text-white rounded-xl hover:bg-[#9E4A32] transition-colors shrink-0"><Send className="w-4 h-4" /></button></div><p className="text-[10px] text-[#BBB] text-center mt-2 leading-snug">{localize(n, "PACP Assistant uses your data to help — your conversations stay private.", "El Asistente PACP usa tus datos para ayudarte — tus conversaciones son privadas.")}{" "}<a href="#" className="underline hover:text-[#999] transition-colors">{localize(n, "Learn more →", "Saber más →")}</a></p></div></div>;
}

export default AssistantPanel;
