"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { compress } from "../lib/compress";
import HeroSection from "./HeroSection";
import { ArrowUp, Copy, Check, Zap, ChevronDown } from "lucide-react";
import StatsSection from "./StatsSection";

const EXAMPLES = [
  "Could you please help me write a cold outreach email to a potential enterprise client in the SaaS industry who recently visited our pricing page?",
  "I would like you to create a follow-up message for a prospect who attended our product demo last week but hasn't responded to my previous two emails.",
  "Please help me draft a professional response to a pricing objection from a mid-market client who is comparing us against our main competitor.",
  "In this task, I need you to summarize the key talking points for a discovery call with a CTO at a fintech company interested in our data analytics platform.",
];

const RULES = [
  { code: "R1", name: "Drop articles",        desc: "Remove a, an, the — zero semantic loss" },
  { code: "R2", name: "Drop politeness",       desc: "please, could you, I'd like → removed" },
  { code: "R3", name: "Drop scaffolding",      desc: "'In this task', 'For context' → removed" },
  { code: "R4", name: "Compress verb phrases", desc: "'provide me with a list of' → list:" },
  { code: "R5", name: "Abbreviate tech",       desc: "auth, config, docs, DB, JS, TS…" },
  { code: "R6", name: "Collapse redundancy",   desc: "Repeated constraints → stripped" },
  { code: "R7", name: "Flatten conditionals",  desc: "'if not too much trouble' → removed" },
  { code: "R8", name: "Preserve critical",     desc: "Negations, numbers, formats — kept" },
];

const F = { fontFamily: "var(--font-inter)" };

/* ─── Message bubbles ──────────────────────────────────────── */
function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[88%] rounded-2xl rounded-br-sm px-4 py-3
                   text-white/75 text-[13px] leading-[1.7] font-light"
        style={{ ...F, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
      >
        {text}
      </div>
    </div>
  );
}

function AiBubble({ result, onCopy, copied }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] space-y-1.5">
        {/* stat chips */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 px-0.5">
          <Zap size={10} strokeWidth={2} style={{ color: "rgba(255,255,255,0.25)" }} />
          <span className="text-[10px] uppercase tracking-[0.12em]"
                style={{ ...F, color: "rgba(255,255,255,0.28)" }}>Optimised</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ ...F, background: "rgba(134,239,172,0.1)", color: "rgba(134,239,172,0.75)" }}>
            {result.reduction}% saved
          </span>
          <span className="text-[10px]"
                style={{ ...F, color: "rgba(255,255,255,0.2)" }}>
            {result.inputTokens} → {result.outputTokens} tokens
          </span>
        </div>

        {/* bubble */}
        <div className="liquid-glass rounded-2xl rounded-bl-sm p-4"
             style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-[13px] leading-[1.75] font-light mb-3"
             style={{ ...F, color: "rgba(255,255,255,0.82)" }}>
            {result.output || (
              <span style={{ color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
                Nothing remains after optimisation.
              </span>
            )}
          </p>
          <div className="flex items-center gap-1.5 pt-2.5"
               style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={onCopy}
              className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-full
                         transition-all duration-200"
              style={{
                ...F,
                color: copied ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)",
                background: copied ? "rgba(255,255,255,0.08)" : "transparent",
              }}>
              {copied ? <Check size={10} strokeWidth={2.5}/> : <Copy size={10} strokeWidth={1.8}/>}
              {copied ? "Copied" : "Copy"}
            </button>
            {result.steps.length > 0 && (
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-full
                           transition-colors"
                style={{ ...F, color: "rgba(255,255,255,0.22)" }}>
                <ChevronDown size={10} strokeWidth={2}
                  style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}/>
                {result.steps.length} rules
              </button>
            )}
          </div>
        </div>

        {/* steps */}
        {open && (
          <div className="pl-3 space-y-3 mt-1"
               style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            {result.steps.map((s, i) => (
              <div key={i}>
                <p className="text-[10px] uppercase tracking-[0.1em] mb-1"
                   style={{ ...F, color: "rgba(255,255,255,0.28)" }}>{s.rule}</p>
                <p className="text-[12px] line-through font-light mb-0.5"
                   style={{ ...F, color: "rgba(255,255,255,0.22)", textDecoration: "line-through" }}>{s.before}</p>
                <p className="text-[12px] font-light"
                   style={{ ...F, color: "rgba(255,255,255,0.58)" }}>{s.after}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Rules sidebar ────────────────────────────────────────── */
function RulesSidebar() {
  return (
    <div className="liquid-glass rounded-2xl flex flex-col h-full overflow-hidden"
         style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-4 py-3.5 shrink-0"
           style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] uppercase tracking-[0.2em]"
           style={{ ...F, color: "rgba(255,255,255,0.25)" }}>
          Compression rules
        </p>
      </div>
      <div className="overflow-y-auto flex-1 p-3 space-y-1.5"
           style={{ scrollbarWidth: "none" }}>
        {RULES.map(({ code, name, desc }) => (
          <div key={code}
               className="rounded-xl p-3 transition-all duration-200"
               style={{ border: "1px solid rgba(255,255,255,0.05)" }}
               onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
               onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] tabular-nums mt-0.5 shrink-0"
                    style={{ ...F, color: "rgba(255,255,255,0.2)" }}>{code}</span>
              <div>
                <p className="text-[12px] font-medium mb-0.5"
                   style={{ ...F, color: "rgba(255,255,255,0.6)" }}>{name}</p>
                <p className="text-[11px] leading-snug font-light"
                   style={{ ...F, color: "rgba(255,255,255,0.25)" }}>{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────── */
export default function Home() {
  const [input, setInput]        = useState("");
  const [messages, setMessages]  = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const toolRef     = useRef(null);
  const msgsRef     = useRef(null);
  const textareaRef = useRef(null);

  const scrollToTool = () => toolRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (msgsRef.current)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const growTextarea = (ta) => {
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 150) + "px";
  };

  const handleInput = (e) => {
    growTextarea(e.target);
    setInput(e.target.value);
  };

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const result = compress(text);
    setMessages(prev => [...prev, { type: "user", text }, { type: "ai", result }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input]);

  const handleKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSend();
  };

  const handleCopy = async (result, idx) => {
    await navigator.clipboard.writeText(result.output);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const loadExample = (ex) => {
    setInput(ex);
    requestAnimationFrame(() => {
      if (textareaRef.current) { growTextarea(textareaRef.current); textareaRef.current.focus(); }
    });
  };

  const hasMessages = messages.length > 0;
  const PANEL_H = "560px";

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden" style={F}>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <HeroSection onScrollToTool={scrollToTool} />

      {/* ══ STATS / INFO ════════════════════════════════════════ */}
      <StatsSection />

      {/* ══ CHAT SECTION ════════════════════════════════════════ */}
      <section
        ref={toolRef}
        id="tool"
        className="bg-black px-4 md:px-10 lg:px-16 py-8"
      >
        {/* Section label */}
        <p className="text-center text-[10px] uppercase tracking-[0.22em] mb-8"
           style={{ ...F, color: "rgba(255,255,255,0.18)" }}>
          Akaike · Prompt Optimizer
        </p>

        {/* ── Two-column chat layout ─────────────────────────── */}
        <div className="max-w-5xl mx-auto flex gap-3" style={{ height: PANEL_H }}>

          {/* ── LEFT: Chat window ─────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 liquid-glass rounded-2xl overflow-hidden"
               style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

            {/* Chat header */}
            <div className="px-5 py-3.5 flex items-center justify-between shrink-0"
                 style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full"
                     style={{ background: "rgba(255,255,255,0.2)" }} />
                <span className="text-[12px] font-medium"
                      style={{ ...F, color: "rgba(255,255,255,0.65)" }}>Sales Support</span>
                <span className="text-[11px]"
                      style={{ ...F, color: "rgba(255,255,255,0.2)" }}>· Akaike</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full"
                     style={{ background: "rgba(74,222,128,0.6)" }} />
                <span className="text-[10px] uppercase tracking-[0.1em]"
                      style={{ ...F, color: "rgba(255,255,255,0.22)" }}>Active</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={msgsRef}
                 className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
                 style={{ scrollbarWidth: "none" }}>
              {!hasMessages ? (
                /* Empty state */
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center liquid-glass">
                    <Zap size={16} strokeWidth={1.5}
                         style={{ color: "rgba(255,255,255,0.22)" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-light mb-1"
                       style={{ ...F, color: "rgba(255,255,255,0.38)" }}>
                      Paste a sales prompt to optimise it
                    </p>
                    <p className="text-[11px]"
                       style={{ ...F, color: "rgba(255,255,255,0.2)" }}>
                      Cuts token count · preserves intent · ready to send
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) =>
                  msg.type === "user"
                    ? <UserBubble key={idx} text={msg.text} />
                    : <AiBubble  key={idx} result={msg.result}
                                 onCopy={() => handleCopy(msg.result, idx)}
                                 copied={copiedIdx === idx} />
                )
              )}
            </div>

            {/* ── Compact input footer ── */}
            <div className="shrink-0 px-3 pb-3 pt-2"
                 style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

              {/* chips + meta row */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[9px] uppercase tracking-[0.12em] shrink-0"
                      style={{ ...F, color: "rgba(255,255,255,0.16)" }}>Try:</span>
                {EXAMPLES.map((ex, i) => (
                  <button key={i} onClick={() => loadExample(ex)}
                    className="text-[9px] px-2 py-0.5 rounded-full transition-all duration-150 shrink-0"
                    style={{ ...F, color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                    {i + 1}
                  </button>
                ))}
                <span className="ml-auto text-[9px] shrink-0"
                      style={{ ...F, color: "rgba(255,255,255,0.12)" }}>
                  {input.trim() ? `~${Math.ceil(input.trim().split(/\s+/).length * 1.3)} tokens` : "⌘↵ to send"}
                </span>
              </div>

              {/* textarea + send */}
              <div className="flex items-end gap-2 rounded-xl px-3 py-2"
                   style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKey}
                  placeholder="Paste your sales prompt…"
                  rows={1}
                  className="flex-1 bg-transparent outline-none resize-none text-[13px] leading-[1.6] font-light"
                  style={{ ...F, color: "rgba(255,255,255,0.78)", minHeight: "20px", maxHeight: "100px" }}
                />
                <button onClick={handleSend} disabled={!input.trim()}
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: input.trim() ? "#fff" : "rgba(255,255,255,0.07)",
                    color: input.trim() ? "#000" : "rgba(255,255,255,0.18)",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                  }}>
                  <ArrowUp size={11} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Rules sidebar ──────────────────────────── */}
          <div className="w-60 lg:w-64 shrink-0 hidden md:block">
            <RulesSidebar />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black px-6 py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium" style={{ ...F, color: "rgba(255,255,255,0.45)" }}>
              Sales Support
            </p>
            <p className="text-[10px] mt-0.5" style={{ ...F, color: "rgba(255,255,255,0.18)" }}>
              by Akaike Technologies
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.14em]"
             style={{ ...F, color: "rgba(255,255,255,0.1)" }}>
            © 2026 Akaike
          </p>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar { display: none; }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </main>
  );
}
