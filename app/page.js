"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { compress } from "../lib/compress";
import HeroSection from "./HeroSection";
import { Copy, Check, Zap, ChevronDown } from "lucide-react";
import ChatInput from "./ChatInput";

const F = { fontFamily: "var(--font-inter)" };

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4";

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

/* ─── Main page ────────────────────────────────────────────── */
export default function Home() {
  const [messages, setMessages]   = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const toolRef = useRef(null);
  const msgsRef = useRef(null);

  const scrollToTool = () => toolRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (msgsRef.current)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
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

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden" style={F}>

      {/* ══ FIXED VIDEO BACKGROUND ══════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={VIDEO_SRC}
          onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 1.2; }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      </div>

      {/* ══ PAGE CONTENT ════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header / wordmark ── */}
        <header className="px-6 md:px-10 py-7 flex items-center">
          <div className="flex flex-col leading-none select-none">
            <span className="text-white text-[15px] font-semibold tracking-tight">
              Sales Support
            </span>
            <span className="text-white/40 text-[11px] font-normal tracking-[0.1em] mt-0.5">
              by Akaike
            </span>
          </div>
        </header>

        {/* ── Hero ── */}
        <HeroSection onScrollToTool={scrollToTool} />

        {/* ── Chat tool ── */}
        <section
          ref={toolRef}
          id="tool"
          className="px-4 md:px-8 py-10 flex-1 flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-xl mx-auto flex flex-col min-w-0 liquid-glass rounded-2xl h-[440px]"
               style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

            {/* Chat header */}
            <div className="px-5 py-3.5 flex items-center justify-between shrink-0 rounded-t-2xl"
                 style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full"
                     style={{ background: "rgba(255,255,255,0.2)" }} />
                <span className="text-[12px] font-medium"
                      style={{ ...F, color: "rgba(255,255,255,0.65)" }}>Prompt Optimizer</span>
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
                <div className="py-10 flex flex-col items-center justify-center gap-4">
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

            {/* Multimodal input footer */}
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
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-7" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium" style={{ ...F, color: "rgba(255,255,255,0.5)" }}>
                Sales Support
              </p>
              <p className="text-[10px] mt-0.5" style={{ ...F, color: "rgba(255,255,255,0.22)" }}>
                by Akaike Technologies
              </p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.14em]"
               style={{ ...F, color: "rgba(255,255,255,0.18)" }}>
              © 2026 Akaike
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        ::-webkit-scrollbar { display: none; }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </main>
  );
}
