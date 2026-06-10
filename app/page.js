"use client";

import { useState, useCallback, useRef } from "react";
import { compress } from "../lib/compress";
import HeroSection from "./HeroSection";

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
  { code: "R5", name: "abbreviate tech",       desc: "JS, TS, DB, auth, config, docs…" },
  { code: "R6", name: "collapse redundancy",   desc: "Remove repeated implied constraints" },
  { code: "R7", name: "flatten conditionals",  desc: "'if it's not too much trouble' → removed" },
  { code: "R8", name: "preserve critical",     desc: "Negations, numbers, formats — untouched" },
];

export default function Home() {
  const [input, setInput]         = useState("");
  const [result, setResult]       = useState(null);
  const [copied, setCopied]       = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const toolRef = useRef(null);

  const scrollToTool = () => toolRef.current?.scrollIntoView({ behavior: "smooth" });

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

  return (
    <main
      className="min-h-screen bg-black text-white overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <HeroSection onScrollToTool={scrollToTool} />

      {/* ══ TOOL ════════════════════════════════════════════════ */}
      <section
        ref={toolRef}
        id="tool"
        className="min-h-screen px-6 md:px-16 py-24 bg-black"
      >
        <div className="max-w-3xl mx-auto">

          {/* Section label */}
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-mono">
            compression tool
          </p>

          {/* Section heading */}
          <div className="mb-12">
            <h2
              className="text-white text-4xl md:text-6xl font-light mb-1"
              style={{
                fontFamily: "var(--font-instrument), Georgia, serif",
                fontStyle: "italic",
                letterSpacing: "-0.02em",
              }}
            >
              Paste.
            </h2>
            <h2
              className="text-white text-4xl md:text-6xl font-light mb-1"
              style={{
                fontFamily: "var(--font-instrument), Georgia, serif",
                fontStyle: "italic",
                letterSpacing: "-0.02em",
              }}
            >
              Compress.
            </h2>
            <h2
              className="text-white/40 text-4xl md:text-6xl font-light"
              style={{
                fontFamily: "var(--font-instrument), Georgia, serif",
                fontStyle: "italic",
                letterSpacing: "-0.02em",
              }}
            >
              Ship.
            </h2>
          </div>

          <div className="h-px w-full bg-white/10 mb-12" />

          {/* ── Input ── */}
          <div className="liquid-glass rounded-2xl overflow-hidden mb-4">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <span className="text-white/40 text-[11px] uppercase tracking-widest font-mono">
                verbose prompt
              </span>
              <span className="text-white/20 text-[11px] font-mono">
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
              className="w-full bg-transparent text-white text-[15px] leading-relaxed
                         p-5 resize-none outline-none placeholder:text-white/20
                         font-light"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            />
          </div>

          {/* Examples */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-white/30 text-[11px] uppercase tracking-widest font-mono self-center">
              try:
            </span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setInput(ex); setResult(null); setCopied(false); }}
                className="liquid-glass text-white/40 hover:text-white
                           text-[11px] px-3 py-1.5 rounded-full transition-colors font-mono"
              >
                example {i + 1}
              </button>
            ))}
          </div>

          {/* Compress button */}
          <button
            onClick={handleCompress}
            disabled={!input.trim()}
            className="w-full py-4 rounded-xl text-[13px] font-medium tracking-widest
                       uppercase transition-all mb-10 disabled:opacity-20 disabled:cursor-not-allowed
                       bg-white text-black hover:bg-white/90 hover:scale-[1.01]
                       active:scale-[0.99] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.12)]"
          >
            🗿 compress prompt
            <span className="ml-3 text-[11px] opacity-40 normal-case font-mono">⌘↵</span>
          </button>

          {/* ── Result ── */}
          {result && (
            <div
              className="liquid-glass rounded-2xl overflow-hidden mb-16"
              style={{ animation: "fadeUp 0.35s ease" }}
            >
              {/* Stats bar */}
              <div className="grid grid-cols-3 border-b border-white/10">
                {[
                  { label: "before", val: `~${result.inputTokens}`,  sub: "tokens",    color: "#f87171" },
                  { label: "after",  val: `~${result.outputTokens}`, sub: "tokens",    color: "#a3e635" },
                  { label: "saved",  val: `${result.reduction}%`,    sub: "reduction", color: "#fbbf24" },
                ].map(({ label, val, sub, color }) => (
                  <div key={label} className="py-5 text-center border-r border-white/10 last:border-r-0">
                    <p className="text-white/30 text-[11px] uppercase tracking-widest font-mono mb-1">
                      {label}
                    </p>
                    <p
                      className="text-3xl font-semibold"
                      style={{ color, fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {val}
                    </p>
                    <p className="text-white/30 text-[11px] mt-1 font-mono">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Output */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/30 text-[11px] uppercase tracking-widest font-mono">
                    caveman prompt
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="liquid-glass text-white/40 hover:text-white
                                 text-[11px] px-3 py-1.5 rounded-full transition-colors font-mono"
                    >
                      {showSteps ? "hide steps" : `steps (${result.steps.length})`}
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`text-[11px] px-3 py-1.5 rounded-full transition-colors font-mono
                        ${copied
                          ? "bg-white text-black"
                          : "liquid-glass text-white/40 hover:text-white"}`}
                    >
                      {copied ? "✓ copied" : "copy"}
                    </button>
                  </div>
                </div>

                <div
                  className="liquid-glass rounded-xl p-5 text-white text-[15px] leading-relaxed font-light"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {result.output || (
                    <span className="text-white/30 italic">
                      nothing left after compression
                    </span>
                  )}
                </div>
              </div>

              {/* Steps */}
              {showSteps && result.steps.length > 0 && (
                <div className="border-t border-white/10 p-5 space-y-4">
                  <p className="text-white/30 text-[11px] uppercase tracking-widest font-mono mb-4">
                    applied rules
                  </p>
                  {result.steps.map((step, i) => (
                    <div key={i} className="border-l-2 border-white/20 pl-4">
                      <p className="text-white/50 text-[11px] font-mono mb-1">{step.rule}</p>
                      <p className="text-red-400/60 text-sm italic mb-0.5 line-through font-mono">
                        {step.before}
                      </p>
                      <p className="text-white/80 text-sm font-mono">{step.after}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Rules grid ── */}
          <div id="rules">
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-mono mb-6">
              the 8 rules
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RULES.map(({ code, name, desc }) => (
                <div
                  key={code}
                  className="liquid-glass rounded-xl p-4 flex gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white/30 font-mono text-[11px] pt-0.5 shrink-0">{code}</span>
                  <div>
                    <p className="text-white text-sm font-mono font-medium mb-0.5">{name}</p>
                    <p className="text-white/30 text-[11px] leading-snug font-mono">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black border-t border-white/5 px-6 py-8 text-center
                         text-white/20 text-[11px] font-mono uppercase tracking-widest">
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
