"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import gsap from "gsap";

export default function HeroSection({ onScrollToTool }) {
  const videoRef   = useRef(null);
  const wrapperRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  /* ── mount fade-in ── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* ── GSAP mouse parallax ── */
  useEffect(() => {
    let currentX = 0, currentY = 0;
    let targetX  = 0, targetY  = 0;
    let rafId;

    const onMove = (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 20;
      targetY = ((e.clientY - cy) / cy) * 20;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      if (wrapperRef.current) {
        gsap.set(wrapperRef.current, { x: currentX, y: currentY });
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── playback rate ── */
  const handleMeta = () => {
    if (videoRef.current) videoRef.current.playbackRate = 1.25;
  };

  const fadeBase = "transition-all duration-1000";
  const fadeIn   = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";
  const fadeInDelayed = mounted ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-6";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* ── Video background ── */}
      <div
        ref={wrapperRef}
        className="absolute inset-0 scale-[1.08] origin-center"
        style={{ willChange: "transform" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          onLoadedMetadata={handleMeta}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4"
        />
        {/* tint */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* ── Header ── */}
      <header
        className="absolute top-0 left-0 right-0 z-50 px-10 py-8 flex justify-between items-center"
      >
        {/* Wordmark */}
        <span
          className="text-white text-[17px] font-semibold tracking-tight select-none"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          CavePrompt<sup className="text-[10px] ml-0.5 opacity-70">™</sup>
        </span>

        {/* Nav */}
        <nav className="hidden md:flex liquid-glass rounded-full px-2 py-2 items-center gap-1">
          {["TOOL", "RESEARCH", "RULES", "ABOUT"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={link === "TOOL" ? (e) => { e.preventDefault(); onScrollToTool?.(); } : undefined}
              className="text-[11px] font-medium tracking-[0.12em] text-white/90
                         hover:text-white px-4 py-1.5 rounded-full transition-colors duration-200"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#tool"
          onClick={(e) => { e.preventDefault(); onScrollToTool?.(); }}
          className="liquid-glass rounded-full px-5 py-2.5 text-[11px] font-medium
                     tracking-[0.12em] text-white/90 hover:text-white transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          START COMPRESSING
        </a>
      </header>

      {/* ── Hero headline ── */}
      <div
        className={`absolute left-0 right-0 z-20 flex flex-col items-center text-center px-6
                    ${fadeBase} ${fadeIn}`}
        style={{ top: "120px", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <h1
          style={{
            fontSize: "clamp(40px, 5.4vw, 72px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}
          className="text-white"
        >
          Compress without mercy.
        </h1>
        <h1
          style={{
            fontSize: "clamp(40px, 5.4vw, 72px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Preserve with perfect intent.
        </h1>
      </div>

      {/* ── Bottom block ── */}
      <div
        className={`absolute bottom-14 left-0 right-0 z-20 flex flex-col items-center gap-6 px-6
                    ${fadeBase} ${fadeInDelayed}`}
      >
        {/* Description */}
        <p
          className="max-w-[620px] text-[15px] leading-relaxed text-center"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          <span className="text-white">
            Our compression engine strips prompts to their semantic core — your intent,
            your constraints, your technical precision.
          </span>{" "}
          <span className="text-white/55">
            Each token saved is a cost reduced, latency cut, and context freed.
          </span>
        </p>

        {/* CTA button */}
        <button
          onClick={onScrollToTool}
          className="bg-white text-black text-[15px] font-medium rounded-full px-8 py-3.5
                     transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]
                     hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Compress my first prompt
        </button>

        {/* Trust line */}
        <div className="flex items-center gap-2">
          <Lock size={13} strokeWidth={1.5} className="text-white/70" />
          <span
            className="text-[11px] font-medium tracking-[0.14em] text-white/70"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            LOSSLESS BY DESIGN. ZERO INTENT LEAKED.
          </span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32
                      bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
