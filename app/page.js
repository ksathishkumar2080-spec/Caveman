"use client";

import { useState, useCallback, useRef } from "react";
import { compress } from "../lib/compress";

const EXAMPLES = [
  "Could you please write a Python function that takes a list of integers as input and returns only the even numbers from that list?",
  "I would like you to act as a senior data engineer and help me design a SQL query that retrieves the top 10 customers by total purchase value from the orders table.",
  "Please generate a comprehensive REST API documentation in markdown format for an authentication service that includes endpoints for login, logout, token refresh, and password reset.",
  "In this task, I need you to review the following code snippet and identify any potential security vulnerabilities, particularly focusing on SQL injection and XSS attack vectors.",
];

const RULES = [
  { code: "R1", name: "drop articles",        desc: "Remove all occurrences of a, an, the" },
  { code: "R2", name: "drop politeness",       desc: "Remove please, could you, I'd like…" },
  { code: "R3", name: "drop scaffolding",      desc: "Remove 'In this task', 'For context'…" },
  { code: "R4", name: "compress verb phrases", desc: "'provide me with a list of' → list" },
  { code: "R5", name: "abbreviate tech",       desc: "JavaScript → JS, database → DB" },
  { code: "R6", name: "collapse redundancy",   desc: "Remove repeated implied constraints" },
  { code: "R7", name: "flatten conditionals",  desc: "'if it's not too much trouble' → removed" },
  { code: "R8", name: "preserve critical",     desc: "Negations, numbers, formats — untouched" },
];

export default function Home() {
  const [input, setInput]       = useState("");
  const [result, setResult]     = useState(null);
  const [copied, setCopied]     = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const toolRef = useRef(null);

  const handleCompress = useCallback(() => {
    if (!input.trim()) return;
    setResult(compress(input));
    setShowSteps(false);
    setCopied(false);
  }, [input]);

  const handleCopy = async () => {
    if (!result?.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleCompress();
  };

  const scrollToTool = () =>
    toolRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="bg-background text-cream">

      {/* ══════════════════════════════════════════════
          HERO — Orbis.Nft style
      ══════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden rounded-b-[32px]">

        {/* BG video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4"
        />

        {/* Dark tint */}
        <div className="absolute inset-0 bg-background/40" />

        {/* ── Navbar ─────────────────────────────────── */}
        <div className="absolute z-20 top-0 left-0 right-0 px-6 lg:px-10 pt-6
                        flex items-center justify-between">

          {/* Logo */}
          <span className="font-grotesk text-cream uppercase text-[16px] tracking-tight">
            Cave.Prompt
          </span>

          {/* Center nav — liquid glass pill (desktop only) */}
          <nav className="hidden lg:block liquid-glass rounded-[28px] px-[52px] py-[24px]">
            <div className="flex items-center gap-8">
              {["tool", "research", "rules", "about"].map((link) => (
                <a
                  key={link}
                  href={link === "tool" ? "#tool" : "#"}
                  onClick={link === "tool"
                    ? (e) => { e.preventDefault(); scrollToTool(); }
                    : undefined}
                  className="font-grotesk text-[13px] uppercase text-cream
                             hover:text-neon transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </nav>

          {/* Social icons — desktop, stacked top-right */}
          <div className="hidden lg:flex flex-col gap-2">
            {[
              /* Mail */
              <svg key="mail" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
              /* Twitter/X */
              <svg key="x" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16M4 20 20 4"/></svg>,
              /* Github */
              <svg key="gh" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>,
            ].map((icon, i) => (
              <button key={i}
                className="liquid-glass rounded-[1rem] w-14 h-14 flex items-center justify-center
                           text-cream hover:bg-white/10 transition-colors">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Hero Content ───────────────────────────── */}
        <div className="relative h-full w-full flex flex-col justify-center
                        px-6 lg:px-10 pt-24 pb-12 max-w-[1831px] mx-auto">

          {/* Heading block */}
          <div className="relative lg:ml-32">
            <h1 className="font-grotesk uppercase leading-[1.05] lg:leading-[1]
                           text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px]
                           max-w-[780px] text-cream">
              Beyond verbose
              <br />
              and <span className="opacity-50">( its )</span> wasted
              <br />
              tokens
            </h1>

            {/* Condiment cursive accent */}
            <span className="font-condiment text-neon
                             text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px]
                             absolute -right-4 lg:right-[-80px] top-2
                             -rotate-1 opacity-90 mix-blend-exclusion
                             pointer-events-none">
              token compression
            </span>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-10 mt-12 lg:ml-32">
            {[
              { val: "75%",  label: "avg token reduction" },
              { val: "+500", label: "prompt pairs tested"  },
              { val: "8",    label: "compression rules"    },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="font-grotesk text-[36px] lg:text-[48px] leading-none text-cream">
                  {val}
                </p>
                <p className="font-mono text-[11px] uppercase text-cream/50 mt-1 tracking-widest">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Social icons — mobile (centered below heading) */}
          <div className="flex lg:hidden gap-3 mt-10">
            {["✉", "✕", "⌥"].map((icon, i) => (
              <button key={i}
                className="liquid-glass rounded-[1rem] w-14 h-14 flex items-center justify-center
                           text-cream hover:bg-white/10 transition-colors text-lg">
                {icon}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={scrollToTool}
            className="mt-12 lg:ml-32 self-start font-grotesk uppercase text-[13px]
                       tracking-widest text-cream/60 hover:text-neon transition-colors
                       flex items-center gap-3">
            <span className="inline-block w-12 h-px bg-cream/30" />
            compress now
          </button>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40
                        bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* ══════════════════════════════════════════════
          TOOL SECTION
      ══════════════════════════════════════════════ */}
      <section ref={toolRef} id="tool" className="min-h-screen px-6 md:px-16 py-24 bg-background">
        <div className="max-w-3xl mx-auto">

          <p className="font-mono text-cream/30 text-xs uppercase tracking-widest mb-4">
            compression tool
          </p>
          <h2 className="font-grotesk text-cream text-3xl md:text-5xl uppercase mb-2"
              style={{ letterSpacing: "-0.02em" }}>
            paste.
          </h2>
          <h2 className="font-grotesk text-cream text-3xl md:text-5xl uppercase mb-2"
              style={{ letterSpacing: "-0.02em" }}>
            compress.{" "}
            <span className="font-condiment text-neon normal-case text-[2em] -rotate-1 inline-block">
              ship.
            </span>
          </h2>
          <div className="h-px w-full bg-cream/10 mb-12 mt-8" />

          {/* Input card */}
          <div className="liquid-glass rounded-2xl overflow-hidden mb-4">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <span className="font-mono text-cream/40 text-xs uppercase tracking-widest">
                verbose prompt
              </span>
              <span className="font-mono text-cream/20 text-xs">
                {input.trim()
                  ? `~${Math.ceil(input.trim().split(/\s+/).length * 1.3)} tokens`
                  : "0 tokens"}
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setResult(null); }}
              onKeyDown={handleKeyDown}
              placeholder="paste your llm prompt here…"
              rows={6}
              className="w-full bg-transparent text-cream text-[15px] leading-relaxed
                         p-5 resize-none outline-none placeholder:text-cream/20
                         font-mono font-light"
            />
          </div>

          {/* Examples */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="font-mono text-cream/30 text-xs uppercase tracking-widest self-center">
              try:
            </span>
            {EXAMPLES.map((ex, i) => (
              <button key={i}
                onClick={() => { setInput(ex); setResult(null); setCopied(false); }}
                className="liquid-glass text-cream/40 hover:text-cream
                           text-xs px-3 py-1.5 rounded-full transition-colors
                           font-mono">
                example {i + 1}
              </button>
            ))}
          </div>

          {/* Compress button */}
          <button
            onClick={handleCompress}
            disabled={!input.trim()}
            className="w-full py-4 rounded-xl font-grotesk text-sm uppercase tracking-widest
                       transition-all mb-10 disabled:opacity-20 disabled:cursor-not-allowed
                       bg-neon text-background hover:bg-neon/90"
          >
            🗿 compress prompt
            <span className="ml-3 text-xs opacity-40 normal-case font-mono">⌘↵</span>
          </button>

          {/* Result */}
          {result && (
            <div className="liquid-glass rounded-2xl overflow-hidden mb-16"
                 style={{ animation: "fadeUp 0.35s ease" }}>

              {/* Token stats */}
              <div className="grid grid-cols-3 border-b border-white/10">
                {[
                  { label: "before", val: `~${result.inputTokens}`,  sub: "tokens",    color: "#ef4444" },
                  { label: "after",  val: `~${result.outputTokens}`, sub: "tokens",    color: "#6FFF00" },
                  { label: "saved",  val: `${result.reduction}%`,    sub: "reduction", color: "#f59e0b" },
                ].map(({ label, val, sub, color }) => (
                  <div key={label}
                       className="py-5 text-center border-r border-white/10 last:border-r-0">
                    <p className="font-mono text-cream/40 text-xs uppercase tracking-widest mb-1">
                      {label}
                    </p>
                    <p className="font-grotesk text-3xl" style={{ color }}>{val}</p>
                    <p className="font-mono text-cream/30 text-xs mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Output */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-cream/40 text-xs uppercase tracking-widest">
                    caveman prompt
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="liquid-glass text-cream/40 hover:text-cream
                                 text-xs px-3 py-1.5 rounded-full transition-colors font-mono">
                      {showSteps ? "hide steps" : `steps (${result.steps.length})`}
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors font-mono
                        ${copied
                          ? "bg-neon text-background"
                          : "liquid-glass text-cream/40 hover:text-cream"}`}>
                      {copied ? "✓ copied" : "copy"}
                    </button>
                  </div>
                </div>

                <div className="liquid-glass rounded-xl p-5 text-cream text-[15px]
                                leading-relaxed font-mono font-light">
                  {result.output || (
                    <span className="text-cream/30 italic">
                      nothing left after compression
                    </span>
                  )}
                </div>
              </div>

              {/* Steps */}
              {showSteps && result.steps.length > 0 && (
                <div className="border-t border-white/10 p-5 space-y-4">
                  <p className="font-mono text-cream/30 text-xs uppercase tracking-widest mb-4">
                    applied rules
                  </p>
                  {result.steps.map((step, i) => (
                    <div key={i} className="border-l-2 border-neon/50 pl-4">
                      <p className="text-neon text-xs font-mono mb-1">{step.rule}</p>
                      <p className="text-red-400/60 text-sm italic mb-0.5 line-through font-mono">
                        {step.before}
                      </p>
                      <p className="text-cream/80 text-sm font-mono">{step.after}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rules grid */}
          <div id="rules">
            <p className="font-mono text-cream/30 text-xs uppercase tracking-widest mb-6">
              the 8 rules
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RULES.map(({ code, name, desc }) => (
                <div key={code}
                     className="liquid-glass rounded-xl p-4 flex gap-4
                                hover:bg-white/5 transition-colors">
                  <span className="text-neon font-mono text-xs pt-0.5 shrink-0">{code}</span>
                  <div>
                    <p className="text-cream text-sm font-mono font-medium mb-0.5">{name}</p>
                    <p className="text-cream/40 text-xs leading-snug font-mono">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-white/5 px-6 py-8
                         text-center text-cream/20 text-xs font-mono uppercase tracking-widest">
        🗿 caveprompt — strip prompts to their semantic core
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
