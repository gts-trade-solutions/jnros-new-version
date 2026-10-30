"use client";

import { MessageCircle, SendHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { answer, type ChatLink, type ChatReply, greeting, quickReplies } from "@/lib/assistant";
import { site } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Message = ChatReply & { from: "bot" | "user"; id: number };

/**
 * Floating chat launcher and panel. The assistant is scripted (lib/assistant.ts): quick-reply chips
 * and typed questions are answered from the site's content, with links to the right page, and
 * anything else is handed to the team on WhatsApp. The conversation survives page changes (the
 * component lives in the root layout). Escape closes; focus moves to the input on open and back
 * to the launcher on close.
 */
export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const panelId = useId();
  const inputId = useId();
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const push = (message: Omit<Message, "id">) => setMessages((all) => [...all, { ...message, id: nextId.current++ }]);

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  // The greeting opens the first conversation.
  useEffect(() => {
    if (open && nextId.current === 0) push({ from: "bot", ...greeting });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || typing) return;
    push({ from: "user", text: q });
    setDraft("");
    setTyping(true);
    // A short pause reads as a reply rather than an instant swap.
    window.setTimeout(() => {
      push({ from: "bot", ...answer(q) });
      setTyping(false);
    }, 550);
  };

  return (
    <div className="pointer-events-auto relative">
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={`Chat with ${site.name}`}
            className="absolute bottom-[calc(100%+0.75rem)] right-0 flex h-[min(34rem,calc(100svh-7rem))] w-[min(23rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-sm border border-border bg-raised shadow-[0_24px_60px_-20px_var(--shadow-color)]"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div data-tone="dark" className="flex items-center gap-3 bg-bg px-5 py-4">
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-bg">
                <MessageCircle className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold leading-tight tracking-[0.04em]">{site.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  Ask about our solutions and services
                </p>
              </div>
              <button type="button" onClick={close} aria-label="Close chat" className="grid size-9 place-items-center rounded-xs text-muted transition-colors hover:text-text">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div ref={list} data-lenis-prevent aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5">
              {messages.map((m) => (
                <Bubble key={m.id} message={m} onNavigate={() => setOpen(false)} />
              ))}
              {typing && (
                <div className="flex w-fit gap-1 rounded-sm rounded-bl-none bg-surface px-4 py-3.5" aria-label="Typing">
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="size-1.5 rounded-full bg-muted motion-safe:animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              )}
            </div>

            <div data-lenis-prevent className="no-scrollbar flex gap-2 overflow-x-auto border-t border-border px-4 py-3">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text/80 transition-colors hover:border-accent hover:text-accent"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(draft);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <label htmlFor={inputId} className="sr-only">
                Your question
              </label>
              <input
                ref={input}
                id={inputId}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your question…"
                autoComplete="off"
                // 16px on phones: iOS zooms the page into any smaller field on focus.
                className="min-w-0 flex-1 rounded-xs border border-border bg-bg px-3 py-2.5 text-base outline-none transition-colors placeholder:text-muted focus:border-accent sm:text-sm"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim() || typing}
                className="grid size-10 shrink-0 place-items-center rounded-xs bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
              >
                <SendHorizontal aria-hidden="true" className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        aria-controls={panelId}
        className="relative grid size-14 place-items-center rounded-full bg-accent text-white shadow-[0_14px_32px_-10px_rgb(61_122_29/0.7)] transition-transform duration-300 hover:scale-105"
      >
        {/* Three slow pulses on first load draw the eye once, then it stays still. */}
        {!open && <span aria-hidden="true" className="absolute inset-0 rounded-full bg-accent motion-safe:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_3]" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            aria-hidden="true"
            className="relative"
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

function Bubble({ message, onNavigate }: { message: Message; onNavigate: () => void }) {
  const bot = message.from === "bot";
  return (
    <motion.div className={cn("flex", bot ? "justify-start" : "justify-end")} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <div className={cn("max-w-[88%] rounded-sm px-3.5 py-2.5 text-sm leading-6", bot ? "rounded-bl-none bg-surface text-text" : "rounded-br-none bg-accent text-white")}>
        <p>{message.text}</p>
        {message.links && (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {message.links.map((link) => (
              <li key={link.href}>
                <LinkChip link={link} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-raised px-3 py-1 text-xs font-medium text-accent transition-colors hover:border-accent hover:bg-accent hover:text-white";

function LinkChip({ link, onNavigate }: { link: ChatLink; onNavigate: () => void }) {
  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} onClick={onNavigate} className={chip}>
        {link.label}
      </Link>
    );
  }
  const external = link.href.startsWith("http");
  return (
    <a href={link.href} className={chip} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {link.href.includes("wa.me") && <SocialIcon name="whatsapp" className="size-3.5" />}
      {link.label}
    </a>
  );
}
