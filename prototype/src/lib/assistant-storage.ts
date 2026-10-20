'use client';

import { useSyncExternalStore } from 'react';

/**
 * Assistant conversations, persisted to localStorage.
 *
 * The panel listed three "recent conversations" that were a fixed array with
 * no click handler: nothing you said was ever kept, and nothing in the list
 * could be opened. Conversations are now real — saved as you talk, listed
 * newest first, and reopened where you left them.
 *
 * Stored per browser, like the prototype's other state. There is no backend to
 * sync to yet, and this is the seam where that would go.
 */
export const PACP_CHATS_KEY = 'pacp_assistant_chats';

/** Same-tab change signal; the native `storage` event only fires cross-tab. */
export const PACP_CHATS_EVENT = 'pacp:assistant-chats-changed';

/**
 * Payloads that survive a round trip. Pickers and inline inputs are left out:
 * they carry callbacks, and a reopened conversation should show the answer
 * rather than re-offer a choice already made.
 */
export interface StoredPayload {
  kind: 'button' | 'results';
  button?: { label: string; href: string };
  title?: string;
  results?: { name: string; ware: string; match: string; color: string }[];
}

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  payload?: StoredPayload;
}

export interface StoredConversation {
  id: string;
  title: string;
  /** ISO timestamp of the last message. */
  updated_at: string;
  lang: 'en' | 'es';
  messages: StoredMessage[];
}

/* ── Seeds ──────────────────────────────────────────────────────────────── */

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const link = (label: string, href: string): StoredPayload => ({ kind: 'button', button: { label, href } });

const msg = (role: 'user' | 'assistant', text: string, payload?: StoredPayload): StoredMessage => ({
  id: `${role}-${Math.random().toString(36).slice(2, 10)}`,
  role,
  text,
  payload,
});

/**
 * The three conversations the panel has always listed.
 *
 * Kept so a first-time visitor sees exactly what they saw before — the
 * difference is that these now open, with the transcript that produced them.
 */
export function seedConversations(): StoredConversation[] {
  return [
    {
      id: 'seed-compare',
      title: 'Comparing Panama Plain and Cubita Polychrome',
      updated_at: hoursAgo(2),
      lang: 'en',
      messages: [
        msg('user', 'Comparing Panama Plain and Cubita Polychrome'),
        msg(
          'assistant',
          'Both Panama Plain and Cubita Polychrome are Coclé-region ceramic types from Panama, dating to roughly 700–900 CE — but they sit in quite different places in the typology. Panama Plain is a utilitarian buff-ware type with minimal decoration, while Cubita Polychrome is a prestige ware with characteristic painted motifs. Want me to open a side-by-side comparison?',
          link('Open in Compare Assemblages →', '/compare'),
        ),
      ],
    },
    {
      id: 'seed-identify',
      title: 'Identifying a red-slipped bowl',
      updated_at: hoursAgo(26),
      lang: 'en',
      messages: [
        msg('user', 'Identifying a red-slipped bowl'),
        msg(
          'assistant',
          'Guided Identification walks you through a structured reasoning process — describing the sherd, comparing it to PACP records, refining matches, and documenting your reasoning. It is designed to help you narrow possibilities defensibly rather than jump to a label. Want me to open it?',
          link('Start Guided Identification →', '/identify'),
        ),
      ],
    },
    {
      id: 'seed-cocle',
      title: "What's a Coclé-region polychrome?",
      updated_at: hoursAgo(72),
      lang: 'en',
      messages: [
        msg('user', "What's a Coclé-region polychrome?"),
        msg(
          'assistant',
          'Coclé is a region on the Pacific side of central Panama, and its polychrome tradition covers painted types such as Conte, Macaracas and Cubita — typically buff pastes carrying red, black and purple designs. PACP holds Coclé material from Sitio Conte.',
          link('Browse Coclé records →', '/browse'),
        ),
      ],
    },
  ];
}

/* ── Read and write ─────────────────────────────────────────────────────── */

function parse(raw: string | null): StoredConversation[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return (parsed as StoredConversation[]).filter(
      (c) => c && typeof c.id === 'string' && Array.isArray(c.messages),
    );
  } catch {
    // Corrupt storage should never break the panel.
    return null;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(PACP_CHATS_KEY);
  } catch {
    // Private browsing and blocked site data are survivable.
    return null;
  }
}

export function readConversations(): StoredConversation[] {
  if (typeof window === 'undefined') return [];
  const stored = parse(readRaw());
  const all = stored ?? seedConversations();
  return [...all].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

function write(conversations: StoredConversation[]): void {
  try {
    window.localStorage.setItem(PACP_CHATS_KEY, JSON.stringify(conversations.slice(0, 50)));
  } catch {
    // The conversation still works; it just will not be there next visit.
  }
  window.dispatchEvent(new Event(PACP_CHATS_EVENT));
}

/** Insert or update one conversation, keeping the newest first. */
export function saveConversation(conversation: StoredConversation): void {
  if (typeof window === 'undefined') return;
  const rest = readConversations().filter((c) => c.id !== conversation.id);
  write([conversation, ...rest].sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
}

export function deleteConversation(id: string): void {
  if (typeof window === 'undefined') return;
  write(readConversations().filter((c) => c.id !== id));
}

/** Empty the list, including the seeded examples. */
export function clearConversations(): void {
  if (typeof window === 'undefined') return;
  write([]);
}

/* ── React binding ──────────────────────────────────────────────────────── */

function subscribe(onChange: () => void): () => void {
  window.addEventListener(PACP_CHATS_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(PACP_CHATS_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const serverSnapshot = () => null;

export function useConversations(): StoredConversation[] {
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  // Parsing on every render is cheap here and keeps the snapshot a plain string,
  // which is what useSyncExternalStore needs to compare correctly.
  const stored = parse(raw);
  const all = stored ?? seedConversations();
  return [...all].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

/* ── Formatting ─────────────────────────────────────────────────────────── */

/** "2h ago" / "Yesterday" / "3 days ago", in the panel's language. */
export function relativeTime(iso: string, lang: 'en' | 'es' = 'en'): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (minutes < 1) return lang === 'en' ? 'Just now' : 'Ahora';
  if (minutes < 60) return lang === 'en' ? `${minutes}m ago` : `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return lang === 'en' ? `${hours}h ago` : `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return lang === 'en' ? 'Yesterday' : 'Ayer';
  if (days < 7) return lang === 'en' ? `${days} days ago` : `hace ${days} días`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return lang === 'en' ? `${weeks}w ago` : `hace ${weeks} sem`;
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es');
}

/** First user message, trimmed to something that fits the list. */
export function titleFor(messages: StoredMessage[], lang: 'en' | 'es' = 'en'): string {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return lang === 'en' ? 'New conversation' : 'Nueva conversación';
  const text = first.text.trim().replace(/\s+/g, ' ');
  return text.length <= 60 ? text : `${text.slice(0, 57)}…`;
}
