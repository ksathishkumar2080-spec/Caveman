"use client";

import { useState, useCallback, useRef } from "react";
import { compress } from "../lib/compress";
import HeroSection from "./HeroSection";

const EXAMPLES = [
  "Could you please help me write a cold outreach email to a potential enterprise client in the SaaS industry who recently visited our pricing page?",
  "I would like you to create a follow-up message for a prospect who attended our product demo last week but hasn't responded to my previous two emails.",
  "Please help me draft a professional response to a pricing objection from a mid-market client who is comparing us against our main competitor.",
  "In this task, I need you to summarize the key talking points for a discovery call with a CTO at a fintech company interested in our data analytics platform.",
];

const RULES = [
  { code: "R1", name: "Drop articles",         desc: "Remove a, an, the — zero semantic loss" },
  { code: "R2", name: "Drop politeness",        desc: "please, could you, I'd like → removed" },
  { code: "R3", name: "Drop scaffolding",       desc: "'In this task', 'For context' → removed" },
  { code: "R4", name: "Compress verb phrases",  desc: "'provide me with a list of' → list:" },
  { code: "R5", name: "Abbreviate tech",        desc: "auth, config, docs, DB, JS, TS…" },
  { code: "R6", name: "Collapse redundancy",    desc: "Repeated constraints → stripped" },
  { code: "R7", name: "Flatten conditionals",   desc: "'if not too much trouble' → removed" },
  { code: "R8", name: "Preserve critical",      desc: "Negations, numbers, formats — kept" },
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

  /* shared font style */
  const F = { fontFamily: "var(--font-inter)" };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden" style={F}>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <HeroSection onScrollToTool={scrollToTool} />

      {/* ══ TOOL SECTION ════════════════════════════════════════ */}
      <section ref={toolRef} id="tool" className="min-h-screen bg-black px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-2xl mx-auto">

          {/* ── Section heading ── */}
          <div className="mb-16">
            <p className="text-white/25 text-[10px] uppercase tracking-[0.22em] mb-5" style={F}>
              Akaike · Prompt Optimizer
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,1)",
            }}>
              Paste.
            </h2>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,1)",
            }}>
              Optimise.
            </h2>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.28)",
            }}>
              Send.
            </h2>
          </div>

          <div className="h-px bg-white/8 mb-12" />

          {/* ── Input ── */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/30 text-[10px] uppercase tracking-[0.18em]" style={F}>
                Your prompt
              </span>
              <span className="text-white/20 text-[10px] tabular-nums" style={F}>
                {input.trim()
                  ? `~${Math.ceil(input.trim().split(/\s+/).length * 1.3)} tokens`
                  : "—"}
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setResult(null); }}
              onKeyDown={handleKeyDown}
              placeholder="Paste your sales prompt here…"
              rows={6}
              className="w-full liquid-glass rounded-xl text-white text-[14px] leading-[1.75]
                         p-5 resize-none outline-none placeholder:text-white/18 font-light"
              style={F}
            />
          </div>

          {/* Examples row */}
          <div className="flex flex-wrap gap-1.5 mb-8">
            <span className="text-white/20 text-[10px] uppercase tracking-[0.15em] self-center mr-1" style={F}>
              Try:
            </span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setInput(ex); setResult(null); setCopied(false); }}
                className="liquid-glass text-white/35 hover:text-white/70
                           text-[10px] px-3 py-1.5 rounded-full transition-colors"
                style={F}
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          {/* Compress button */}
          <button
            onClick={handleCompress}
            disabled={!input.trim()}
            className="w-full py-4 rounded-xl text-[12px] font-medium tracking-[0.14em]
                       uppercase transition-all duration-200 mb-12
                       disabled:opacity-15 disabled:cursor-not-allowed
                       bg-white text-black hover:bg-white/92
                       hover:scale-[1.01] active:scale-[0.99]
                       hover:shadow-[0_0_28px_2px_rgba(255,255,255,0.10)]"
            style={F}
          >
            Optimise prompt
            <span className="ml-3 text-[10px] opacity-35 normal-case font-normal">⌘↵</span>
          </button>

          {/* ── Result ── */}
          {result && (
            <div className="liquid-glass rounded-2xl overflow-hidden mb-20"
                 style={{ animation: "fadeUp 0.3s ease" }}>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-white/8">
                {[
                  { label: "Before", val: `~${result.inputTokens}`,  sub: "tokens",    color: "#f87171" },
                  { label: "After",  val: `~${result.outputTokens}`, sub: "tokens",    color: "#86efac" },
                  { label: "Saved",  val: `${result.reduction}%`,    sub: "reduction", color: "#fde68a" },
                ].map(({ label, val, sub, color }) => (
                  <div key={label} className="py-6 text-center">
                    <p className="text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1" style={F}>{label}</p>
                    <p className="text-[28px] font-semibold leading-none mb-1" style={{ color, ...F }}>{val}</p>
                    <p className="text-white/25 text-[10px]" style={F}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Output */}
              <div className="border-t border-white/8 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/30 text-[10px] uppercase tracking-[0.15em]" style={F}>
                    Optimised prompt
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="liquid-glass text-white/30 hover:text-white/70
                                 text-[10px] px-3 py-1.5 rounded-full transition-colors"
                      style={F}
                    >
                      {showSteps ? "Hide steps" : `${result.steps.length} steps`}
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`text-[10px] px-3 py-1.5 rounded-full transition-all duration-200
                        ${copied ? "bg-white text-black scale-95" : "liquid-glass text-white/30 hover:text-white/70"}`}
                      style={F}
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="bg-white/3 border border-white/6 rounded-xl p-5
                                text-white text-[14px] leading-[1.75] font-light"
                     style={F}>
                  {result.output || (
                    <span className="text-white/25 italic">Nothing remains after optimisation.</span>
                  )}
                </div>
              </div>

              {/* Steps */}
              {showSteps && result.steps.length > 0 && (
                <div className="border-t border-white/8 p-5 space-y-4">
                  <p className="text-white/25 text-[10px] uppercase tracking-[0.15em] mb-5" style={F}>
                    Optimisation steps
                  </p>
                  {result.steps.map((step, i) => (
                    <div key={i} className="pl-4 border-l border-white/10">
                      <p className="text-white/40 text-[10px] uppercase tracking-[0.1em] mb-1.5" style={F}>
                        {step.rule}
                      </p>
                      <p className="text-white/30 text-[13px] line-through mb-1 font-light" style={F}>
                        {step.before}
                      </p>
                      <p className="text-white/75 text-[13px] font-light" style={F}>
                        {step.after}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Rules ── */}
          <div id="rules" className="mb-20">
            <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] mb-6" style={F}>
              Compression rules
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RULES.map(({ code, name, desc }) => (
                <div key={code}
                     className="flex gap-4 p-4 rounded-xl border border-white/6
                                hover:border-white/12 hover:bg-white/2 transition-all duration-200">
                  <span className="text-white/20 text-[10px] pt-0.5 shrink-0 tabular-nums" style={F}>
                    {code}
                  </span>
                  <div>
                    <p className="text-white/70 text-[12px] font-medium mb-0.5" style={F}>{name}</p>
                    <p className="text-white/25 text-[11px] leading-snug font-light" style={F}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black border-t border-white/6 px-6 py-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/60 text-[13px] font-medium" style={F}>Sales Support</p>
            <p className="text-white/25 text-[11px] mt-0.5" style={F}>by Akaike Technologies</p>
          </div>
          <p className="text-white/15 text-[10px] uppercase tracking-[0.16em]" style={F}>
            © 2026 Akaike
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .text-white\/18 { color: rgba(255,255,255,0.18); }
        .bg-white\/3 { background: rgba(255,255,255,0.03); }
        .bg-white\/2 { background: rgba(255,255,255,0.02); }
        .border-white\/8 { border-color: rgba(255,255,255,0.08); }
        .divide-white\/8 > * + * { border-color: rgba(255,255,255,0.08); }
        .bg-white\/92 { background: rgba(255,255,255,0.92); }
      `}</style>
    </main>
  );
}
