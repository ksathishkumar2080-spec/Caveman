"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { compress } from "../lib/compress";
import HeroSection from "./HeroSection";
import { ArrowUp, Copy, Check, Zap, ChevronDown } from "lucide-react";

const EXAMPLES = [
  "Could you please help me write a cold outreach email to a potential enterprise client in the SaaS industry who recently visited our pricing page?",
  "I would like you to create a follow-up message for a prospect who attended our product demo last week but hasn't responded to my previous two emails.",
  "Please help me draft a professional response to a pricing objection from a mid-market client who is comparing us against our main competitor.",
  "In this task, I need you to summarize the key talking points for a discovery call with a CTO at a fintech company interested in our data analytics platform.",
];

const F = { fontFamily: "var(--font-inter)" };

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[85%] rounded-2xl rounded-br-sm px-4 py-3
                   bg-white/8 border border-white/10 text-white/80
                   text-[13px] leading-[1.7] font-light"
        style={F}
      >
        {text}
      </div>
    </div>
  );
}

function AiBubble({ result, onCopy, copied }) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-2">
        {/* Stats row */}
        <div className="flex items-center gap-2 px-1">
          <Zap size={11} className="text-white/30" strokeWidth={2} />
          <span className="text-white/30 text-[10px] uppercase tracking-[0.14em]" style={F}>
            Optimised
          </span>
          <span className="text-[10px] text-white/20 mx-1" style={F}>·</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ ...F, background: "rgba(134,239,172,0.12)", color: "rgba(134,239,172,0.8)" }}
          >
            {result.reduction}% saved
          </span>
          <span className="text-white/20 text-[10px]" style={F}>
            {result.inputTokens} → {result.outputTokens} tokens
          </span>
        </div>

        {/* Response bubble */}
        <div className="liquid-glass rounded-2xl rounded-bl-sm p-4 border border-white/8">
          <p className="text-white/85 text-[13px] leading-[1.75] font-light mb-3" style={F}>
            {result.output || (
              <span className="text-white/30 italic">Nothing remains after optimisation.</span>
            )}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/8">
            <button
              onClick={onCopy}
              className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-full
                          transition-all duration-200 font-medium
                          ${copied
                            ? "bg-white/10 text-white/70"
                            : "text-white/30 hover:text-white/60 hover:bg-white/6"}`}
              style={F}
            >
              {copied ? <Check size={10} strokeWidth={2.5} /> : <Copy size={10} strokeWidth={2} />}
              {copied ? "Copied" : "Copy"}
            </button>

            {result.steps.length > 0 && (
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="flex items-center gap-1 text-[10px] text-white/25
                           hover:text-white/50 transition-colors px-2 py-1.5 rounded-full
                           hover:bg-white/5"
                style={F}
              >
                <ChevronDown
                  size={10}
                  strokeWidth={2}
                  className={`transition-transform duration-200 ${showSteps ? "rotate-180" : ""}`}
                />
                {result.steps.length} rules applied
              </button>
            )}
          </div>
        </div>

        {/* Steps (expandable) */}
        {showSteps && (
          <div className="pl-2 space-y-2.5 mt-1">
            {result.steps.map((step, i) => (
              <div key={i} className="pl-3 border-l border-white/10">
                <p className="text-white/30 text-[10px] uppercase tracking-[0.1em] mb-1" style={F}>
                  {step.rule}
                </p>
                <p className="text-white/25 text-[12px] line-through font-light mb-0.5" style={F}>
                  {step.before}
                </p>
                <p className="text-white/60 text-[12px] font-light" style={F}>
                  {step.after}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const toolRef    = useRef(null);
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToTool = () => toolRef.current?.scrollIntoView({ behavior: "smooth" });

  /* auto-scroll to bottom of messages */
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  /* auto-grow textarea */
  const handleInput = (e) => {
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    setInput(ta.value);
  };

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const result = compress(text);
    setMessages((prev) => [...prev, { type: "user", text }, { type: "ai", result }]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSend();
  };

  const handleCopy = async (result, idx) => {
    if (!result?.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const loadExample = (ex) => {
    setInput(ex);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
    textareaRef.current?.focus();
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden" style={F}>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <HeroSection onScrollToTool={scrollToTool} />

      {/* ══ CHAT SECTION ════════════════════════════════════════ */}
      <section
        ref={toolRef}
        id="tool"
        className="min-h-screen bg-black px-4 md:px-8 py-20 flex flex-col items-center"
      >
        {/* Section label */}
        <p className="text-white/20 text-[10px] uppercase tracking-[0.22em] mb-8" style={F}>
          Akaike · Prompt Optimizer
        </p>

        {/* ── Chat window ─────────────────────────────────────── */}
        <div className="w-full max-w-2xl flex flex-col" style={{ height: "78vh", minHeight: 520 }}>

          {/* Chat header */}
          <div className="liquid-glass rounded-t-2xl px-5 py-4 flex items-center
                          justify-between border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-white/70 text-[12px] font-medium tracking-[0.06em]" style={F}>
                Sales Support
              </span>
              <span className="text-white/20 text-[10px]" style={F}>· Akaike</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
              <span className="text-white/25 text-[10px] uppercase tracking-[0.1em]" style={F}>
                Active
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={messagesRef}
            className="flex-1 liquid-glass overflow-y-auto px-5 py-5 space-y-5
                       scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {!hasMessages ? (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center gap-5 py-10">
                <div className="w-12 h-12 rounded-full liquid-glass flex items-center
                                justify-center text-white/20">
                  <Zap size={18} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-white/40 text-[13px] font-light mb-1" style={F}>
                    Paste a sales prompt to optimise it
                  </p>
                  <p className="text-white/20 text-[11px]" style={F}>
                    Cuts token count · preserves intent · ready to send
                  </p>
                </div>

                {/* Example chips in empty state */}
                <div className="flex flex-wrap gap-2 justify-center max-w-sm mt-2">
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => loadExample(ex)}
                      className="liquid-glass text-white/30 hover:text-white/60
                                 text-[10px] px-3 py-1.5 rounded-full transition-all
                                 hover:bg-white/5 border border-white/8 hover:border-white/15"
                      style={F}
                    >
                      Example {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message list */
              <>
                {messages.map((msg, idx) =>
                  msg.type === "user" ? (
                    <UserBubble key={idx} text={msg.text} />
                  ) : (
                    <AiBubble
                      key={idx}
                      result={msg.result}
                      onCopy={() => handleCopy(msg.result, idx)}
                      copied={copiedIdx === idx}
                    />
                  )
                )}
              </>
            )}
          </div>

          {/* Input area */}
          <div className="liquid-glass rounded-b-2xl border-t border-white/8">
            {/* Example chips (when there are messages) */}
            {hasMessages && (
              <div className="px-4 pt-3 pb-0 flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => loadExample(ex)}
                    className="text-white/20 hover:text-white/50 text-[10px] px-2.5 py-1
                               rounded-full transition-colors border border-white/8
                               hover:border-white/20 hover:bg-white/5"
                    style={F}
                  >
                    Example {i + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="px-4 py-3 flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Paste your sales prompt…"
                rows={1}
                className="flex-1 bg-transparent text-white/80 text-[13px] leading-[1.65]
                           font-light placeholder:text-white/18 outline-none resize-none
                           min-h-[22px] max-h-[160px] py-0.5"
                style={F}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                            transition-all duration-200
                            ${input.trim()
                              ? "bg-white text-black hover:scale-105 active:scale-95"
                              : "bg-white/8 text-white/20 cursor-not-allowed"}`}
              >
                <ArrowUp size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className="px-4 pb-3 flex items-center justify-between">
              <span className="text-white/15 text-[10px]" style={F}>
                {input.trim()
                  ? `~${Math.ceil(input.trim().split(/\s+/).length * 1.3)} tokens`
                  : ""}
              </span>
              <span className="text-white/12 text-[10px]" style={F}>
                ⌘↵ to send
              </span>
            </div>
          </div>
        </div>

        {/* ── Rules grid (below chat) ── */}
        <div id="rules" className="w-full max-w-2xl mt-16">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mb-5" style={F}>
            Compression rules
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { code: "R1", name: "Articles",     desc: "a, an, the removed" },
              { code: "R2", name: "Politeness",   desc: "please, could you gone" },
              { code: "R3", name: "Scaffolding",  desc: "In this task stripped" },
              { code: "R4", name: "Verb phrases", desc: "'list of' → list" },
              { code: "R5", name: "Tech abbrev.", desc: "auth, DB, TS, JS…" },
              { code: "R6", name: "Redundancy",   desc: "Repeat constraints cut" },
              { code: "R7", name: "Conditionals", desc: "Qualifiers removed" },
              { code: "R8", name: "Critical",     desc: "Negations preserved" },
            ].map(({ code, name, desc }) => (
              <div
                key={code}
                className="border border-white/6 rounded-xl p-3.5
                           hover:border-white/12 hover:bg-white/2 transition-all duration-200"
              >
                <p className="text-white/20 text-[10px] mb-1" style={F}>{code}</p>
                <p className="text-white/55 text-[11px] font-medium mb-0.5" style={F}>{name}</p>
                <p className="text-white/22 text-[10px] leading-snug" style={F}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black border-t border-white/6 px-6 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[12px] font-medium" style={F}>Sales Support</p>
            <p className="text-white/20 text-[10px] mt-0.5" style={F}>by Akaike Technologies</p>
          </div>
          <p className="text-white/12 text-[10px] uppercase tracking-[0.14em]" style={F}>
            © 2026 Akaike
          </p>
        </div>
      </footer>

      <style>{`
        .text-white\/12  { color: rgba(255,255,255,0.12); }
        .text-white\/18  { color: rgba(255,255,255,0.18); }
        .text-white\/22  { color: rgba(255,255,255,0.22); }
        .bg-white\/2     { background: rgba(255,255,255,0.02); }
        .bg-white\/6     { background: rgba(255,255,255,0.06); }
        .bg-white\/8     { background: rgba(255,255,255,0.08); }
        .border-white\/8 { border-color: rgba(255,255,255,0.08); }
        [style*="scrollbarWidth"] { scrollbar-width: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
