"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { compress } from "../lib/compress";
import { Copy, Check, Zap, ChevronDown } from "lucide-react";
import ChatInput from "./ChatInput";
import { motion } from "framer-motion";

/* ─── Constants ─────────────────────────────────────────────── */
const VIDEO_SRC = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4";

const RULES = [
  { code: "R1", name: "Drop articles",        desc: "Remove a, an, the → zero semantic loss" },
  { code: "R2", name: "Drop politeness",       desc: "please, could you, I'd like → removed" },
  { code: "R3", name: "Drop scaffolding",      desc: "'In this task', 'For context' → removed" },
  { code: "R4", name: "Compress verb phrases", desc: "'provide me with a list of' → list:" },
  { code: "R5", name: "Abbreviate tech",       desc: "auth, config, docs, DB, JS, TS…" },
  { code: "R6", name: "Collapse redundancy",   desc: "Repeated constraints → stripped" },
  { code: "R7", name: "Flatten conditionals",  desc: "'if not too much trouble' → removed" },
  { code: "R8", name: "Preserve critical",     desc: "Negations, numbers, formats → kept" },
];

const STATS = [
  { value: "70%",  label: "Token reduction",   sub: "Average across sales prompts" },
  { value: "3×",   label: "Faster responses",  sub: "Shorter prompts, lower latency" },
  { value: "100%", label: "Intent preserved",  sub: "8 surgical rules, zero meaning lost" },
];

const FOOTER_LINKS = [
  {
    heading: "Tool",
    links: ["Prompt Optimizer", "Compression Rules", "Token Counter", "Batch Mode"],
  },
  {
    heading: "Company",
    links: ["About Akaike", "Research", "Newsroom", "Join the Team"],
  },
  {
    heading: "Support",
    links: ["Get in Touch", "Privacy Policy", "Terms of Use", "Report Issue"],
  },
];

const F = { fontFamily: "var(--font-inter)" };

/* ─── Message bubbles ───────────────────────────────────────── */
function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] rounded-2xl rounded-br-sm px-4 py-3 text-[13px] leading-[1.7] font-light"
           style={{ ...F, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.75)" }}>
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
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 px-0.5">
          <Zap size={10} strokeWidth={2} style={{ color: "rgba(255,255,255,0.25)" }} />
          <span className="text-[10px] uppercase tracking-[0.12em]" style={{ ...F, color: "rgba(255,255,255,0.28)" }}>Optimised</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ ...F, background: "rgba(134,239,172,0.1)", color: "rgba(134,239,172,0.75)" }}>
            {result.reduction}% saved
          </span>
          <span className="text-[10px]" style={{ ...F, color: "rgba(255,255,255,0.2)" }}>
            {result.inputTokens} → {result.outputTokens} tokens
          </span>
        </div>
        <div className="liquid-glass rounded-2xl rounded-bl-sm p-4" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-[13px] leading-[1.75] font-light mb-3" style={{ ...F, color: "rgba(255,255,255,0.82)" }}>
            {result.output || (
              <span style={{ color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>Nothing remains after optimisation.</span>
            )}
          </p>
          <div className="flex items-center gap-1.5 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={onCopy}
              className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-full transition-all duration-200"
              style={{ ...F, color: copied ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)", background: copied ? "rgba(255,255,255,0.08)" : "transparent" }}>
              {copied ? <Check size={10} strokeWidth={2.5}/> : <Copy size={10} strokeWidth={1.8}/>}
              {copied ? "Copied" : "Copy"}
            </button>
            {result.steps.length > 0 && (
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-full transition-colors"
                style={{ ...F, color: "rgba(255,255,255,0.22)" }}>
                <ChevronDown size={10} strokeWidth={2}
                  style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}/>
                {result.steps.length} rules
              </button>
            )}
          </div>
        </div>
        {open && (
          <div className="pl-3 space-y-3 mt-1" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            {result.steps.map((s, i) => (
              <div key={i}>
                <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ ...F, color: "rgba(255,255,255,0.28)" }}>{s.rule}</p>
                <p className="text-[12px] font-light mb-0.5" style={{ ...F, color: "rgba(255,255,255,0.22)", textDecoration: "line-through" }}>{s.before}</p>
                <p className="text-[12px] font-light" style={{ ...F, color: "rgba(255,255,255,0.58)" }}>{s.after}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Rules sidebar ─────────────────────────────────────────── */
function RulesSidebar() {
  return (
    <div className="liquid-glass rounded-2xl flex flex-col h-full" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-4 py-3.5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ ...F, color: "rgba(255,255,255,0.25)" }}>
          Compression rules
        </p>
      </div>
      <div className="overflow-y-auto flex-1 p-3 space-y-1.5" style={{ scrollbarWidth: "none" }}>
        {RULES.map(({ code, name, desc }) => (
          <div key={code} className="rounded-xl p-3 transition-all duration-200"
               style={{ border: "1px solid rgba(255,255,255,0.05)" }}
               onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
               onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] tabular-nums mt-0.5 shrink-0" style={{ ...F, color: "rgba(255,255,255,0.2)" }}>{code}</span>
              <div>
                <p className="text-[12px] font-medium mb-0.5" style={{ ...F, color: "rgba(255,255,255,0.6)" }}>{name}</p>
                <p className="text-[11px] leading-snug font-light" style={{ ...F, color: "rgba(255,255,255,0.25)" }}>{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function Home() {
  const [messages, setMessages]     = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [copiedIdx, setCopiedIdx]   = useState(null);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const handleSend = useCallback(({ input }) => {
    const text = input.trim();
    if (!text) return;
    const result = compress(text);
    setMessages(prev => [...prev, { type: "user", text }, { type: "ai", result }]);
  }, []);

  const handleCopy = async (result, idx) => {
    await navigator.clipboard.writeText(result.output);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const hasMessages = messages.length > 0;

  /* token counter */
  const aiMsgs   = messages.filter(m => m.type === "ai");
  const totalIn  = aiMsgs.reduce((s, m) => s + (m.result?.inputTokens  ?? 0), 0);
  const totalOut = aiMsgs.reduce((s, m) => s + (m.result?.outputTokens ?? 0), 0);
  const saved    = totalIn - totalOut;
  const pct      = totalIn > 0 ? Math.round((saved / totalIn) * 100) : 0;
  const active   = aiMsgs.length > 0;

  return (
    <main className="relative w-full min-h-screen text-white overflow-x-hidden" style={F}>

      {/* ── Fixed video background ── */}
      <video className="fixed inset-0 w-full h-full object-cover z-0"
             autoPlay muted loop playsInline src={VIDEO_SRC} />
      <div className="fixed inset-0 z-[1] bg-black/55" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 md:px-10 lg:px-16">

        {/* ── Top nav ── */}
        <header className="pt-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col leading-none select-none">
            <span className="text-[15px] font-semibold tracking-tight text-white" style={F}>
              Akaike
            </span>
            <span className="text-[11px] font-normal tracking-[0.1em] mt-0.5" style={{ ...F, color: "rgba(255,255,255,0.35)" }}>
              Prompt Token Saver
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.18em] hidden md:block"
                style={{ ...F, color: "rgba(255,255,255,0.25)" }}>
            8 compression rules · zero meaning lost
          </span>
        </header>

        {/* ── Hero headline ── */}
        <motion.div
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center pt-10 pb-8 shrink-0"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] mb-5"
             style={{ ...F, color: "rgba(255,255,255,0.4)" }}>
            Akaike · Prompt Token Saver
          </p>
          <h1 style={{ ...F, fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.08 }}
              className="text-white">
            Cut tokens by 70%.
          </h1>
          <h1 style={{ ...F, fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.08, color: "rgba(255,255,255,0.38)" }}>
            Keep every ounce of intent.
          </h1>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto w-full pb-6 shrink-0"
        >
          {STATS.map(({ value, label, sub }) => (
            <div key={label} className="text-center">
              <p style={{ ...F, fontSize: "clamp(22px, 4vw, 42px)", fontWeight: 300, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                {value}
              </p>
              <p className="text-[11px] font-medium mt-1" style={{ ...F, color: "rgba(255,255,255,0.5)" }}>{label}</p>
              <p className="text-[10px] mt-0.5 hidden md:block" style={{ ...F, color: "rgba(255,255,255,0.25)" }}>{sub}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Token counter ── */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto w-full pb-3 shrink-0"
        >
          <div className="flex items-center gap-4 rounded-xl px-5 py-3 flex-wrap liquid-glass"
               style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full"
                   style={{ background: active ? "rgba(134,239,172,0.7)" : "rgba(255,255,255,0.15)",
                            boxShadow: active ? "0 0 6px rgba(134,239,172,0.4)" : "none",
                            transition: "all .4s" }} />
              <span className="text-[10px] uppercase tracking-[0.16em]" style={{ ...F, color: "rgba(255,255,255,0.22)" }}>
                Session token counter
              </span>
            </div>
            <div className="flex items-center gap-5 ml-auto flex-wrap">
              {[
                { label: "Tokens in",  val: totalIn.toLocaleString(),                          color: "rgba(255,255,255,0.5)" },
                { label: "Tokens out", val: totalOut.toLocaleString(),                         color: "rgba(255,255,255,0.5)" },
                { label: "Saved",      val: saved > 0 ? saved.toLocaleString() : "—",          color: "rgba(134,239,172,0.85)" },
                { label: "Reduction",  val: active ? `${pct}%` : "—",                          color: "rgba(134,239,172,0.85)" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span className="text-[10px]" style={{ ...F, color: "rgba(255,255,255,0.18)" }}>{label}</span>
                  <span className="text-[13px] font-light tabular-nums" style={{ ...F, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Chat tool + Rules sidebar ── */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto w-full flex gap-3 pb-8 shrink-0"
          style={{ minHeight: "480px" }}
        >
          {/* Chat panel */}
          <div className="flex-1 flex flex-col min-w-0 liquid-glass rounded-2xl"
               style={{ border: "1px solid rgba(255,255,255,0.08)", height: "480px" }}>

            {/* Chat header */}
            <div className="px-5 py-3.5 flex items-center justify-between shrink-0 rounded-t-2xl"
                 style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                <span className="text-[12px] font-medium" style={{ ...F, color: "rgba(255,255,255,0.65)" }}>Prompt Optimizer</span>
                <span className="text-[11px]" style={{ ...F, color: "rgba(255,255,255,0.2)" }}>· Akaike</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(74,222,128,0.6)" }} />
                <span className="text-[10px] uppercase tracking-[0.1em]" style={{ ...F, color: "rgba(255,255,255,0.22)" }}>Active</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={msgsRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
                 style={{ scrollbarWidth: "none" }}>
              {!hasMessages ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center liquid-glass">
                    <Zap size={16} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.22)" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-light mb-1" style={{ ...F, color: "rgba(255,255,255,0.38)" }}>
                      Paste a sales prompt to optimise it
                    </p>
                    <p className="text-[11px]" style={{ ...F, color: "rgba(255,255,255,0.2)" }}>
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

            {/* Input footer */}
            <div className="shrink-0 px-6 pb-5 pt-3 rounded-b-2xl"
                 style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <ChatInput
                messages={messages}
                attachments={attachments}
                setAttachments={setAttachments}
                onSend={handleSend}
              />
            </div>
          </div>

          {/* Rules sidebar */}
          <div className="w-60 lg:w-64 shrink-0 hidden md:flex flex-col" style={{ height: "480px" }}>
            <RulesSidebar />
          </div>
        </motion.div>

        {/* ── Liquid glass footer ── */}
        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="liquid-glass rounded-3xl p-6 md:p-10 mt-auto mb-6 shrink-0"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">

            {/* Brand col */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                <span className="text-[15px] font-semibold text-white tracking-tight" style={F}>Akaike</span>
              </div>
              <p className="text-[13px] leading-relaxed max-w-xs" style={{ ...F, color: "rgba(255,255,255,0.45)" }}>
                Akaike's token engine strips every prompt down to its semantic core — slashing API costs and accelerating response time while keeping intent intact.
              </p>
            </div>

            {/* Links grid */}
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {FOOTER_LINKS.map(({ heading, links }) => (
                <div key={heading}>
                  <p className="text-[11px] uppercase tracking-wider font-medium text-white mb-4" style={F}>
                    {heading}
                  </p>
                  <ul className="space-y-2">
                    {links.map(link => (
                      <li key={link}>
                        <a href="#"
                           className="text-[12px] transition-colors duration-200 hover:text-white"
                           style={{ ...F, color: "rgba(255,255,255,0.4)" }}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
               style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ ...F, color: "rgba(255,255,255,0.3)" }}>
              © 2026 Akaike Technologies · All rights reserved
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest mr-2" style={{ ...F, color: "rgba(255,255,255,0.3)" }}>
                Built by Akaike
              </span>
              {["70%", "3×", "100%"].map((v, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ ...F, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        </motion.footer>

      </div>

      <style>{`
        ::-webkit-scrollbar { display: none; }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </main>
  );
}
