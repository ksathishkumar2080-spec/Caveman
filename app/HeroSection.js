"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import gsap from "gsap";

const NAV_LINKS = ["TOOL", "FEATURES", "RESEARCH", "CONTACT"];

export default function HeroSection({ onScrollToTool }) {
  const videoRef   = useRef(null);
  const wrapperRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  /* ── mount fade-in ── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* ── GSAP mouse parallax ── */
  useEffect(() => {
    let curX = 0, curY = 0, tgtX = 0, tgtY = 0, raf;
    const onMove = (e) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      tgtX = ((e.clientX - cx) / cx) * 20;
      tgtY = ((e.clientY - cy) / cy) * 20;
    };
    const tick = () => {
      curX += (tgtX - curX) * 0.06;
      curY += (tgtY - curY) * 0.06;
      if (wrapperRef.current) gsap.set(wrapperRef.current, { x: curX, y: curY });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const handleMeta = () => { if (videoRef.current) videoRef.current.playbackRate = 1.25; };

  const show = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* ── Video ─────────────────────────────────────────────── */}
      <div ref={wrapperRef} className="absolute inset-0 scale-[1.08] origin-center" style={{ willChange: "transform" }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          onLoadedMetadata={handleMeta}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-50 px-10 py-8 flex items-center justify-between">

        {/* Wordmark */}
        <div className="flex flex-col leading-none select-none">
          <span className="text-white text-[15px] font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-inter)" }}>
            Sales Support
          </span>
          <span className="text-white/40 text-[11px] font-normal tracking-[0.1em] mt-0.5"
                style={{ fontFamily: "var(--font-inter)" }}>
            by Akaike
          </span>
        </div>

        {/* Nav pill */}
        <nav className="hidden md:flex liquid-glass rounded-full px-2 py-2 items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={link === "TOOL" ? (e) => { e.preventDefault(); onScrollToTool?.(); } : undefined}
              className="text-[11px] font-medium tracking-[0.12em] text-white/80 hover:text-white
                         px-5 py-1.5 rounded-full transition-colors duration-200"
              style={{ fontFamily: "var(--font-inter)" }}
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
                     tracking-[0.12em] text-white/80 hover:text-white transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          GET STARTED
        </a>
      </header>

      {/* ── Hero headline ─────────────────────────────────────── */}
      <div
        className={`absolute left-0 right-0 z-20 flex flex-col items-center text-center
                    px-6 transition-all duration-1000 ${show}`}
        style={{ top: "120px" }}
      >
        <p className="text-white/50 text-[11px] font-medium tracking-[0.2em] mb-6 uppercase"
           style={{ fontFamily: "var(--font-inter)" }}>
          Akaike · Sales Intelligence
        </p>

        <h1
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(38px, 5.4vw, 70px)",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
          className="text-white"
        >
          Sell smarter. Reply faster.
        </h1>
        <h1
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(38px, 5.4vw, 70px)",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Close more, say less.
        </h1>
      </div>

      {/* ── Bottom block ──────────────────────────────────────── */}
      <div
        className={`absolute bottom-14 left-0 right-0 z-20 flex flex-col items-center
                    gap-5 px-6 transition-all duration-1000 delay-300 ${show}`}
      >
        <p
          className="max-w-[560px] text-[14px] leading-[1.7] text-center font-light"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <span className="text-white">
            Akaike's sales engine strips every prompt to its precise intent —
            cutting response time, reducing cost, and keeping your reps in flow.
          </span>{" "}
          <span className="text-white/45">
            Every message optimised. Every conversation ready to close.
          </span>
        </p>

        <button
          onClick={onScrollToTool}
          className="bg-white text-black text-[14px] font-medium rounded-full px-8 py-3.5
                     transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]
                     hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.18)]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Try the tool
        </button>

        <div className="flex items-center gap-2">
          <Lock size={12} strokeWidth={1.5} className="text-white/50" />
          <span
            className="text-[10px] font-medium tracking-[0.16em] text-white/50"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ENTERPRISE GRADE · BUILT BY AKAIKE
          </span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40
                      bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
