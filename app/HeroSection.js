"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export default function HeroSection({ onScrollToTool }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const show = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5";

  const headline = {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(34px, 5vw, 64px)",
    fontWeight: 300,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
  };

  return (
    <section className="relative w-full flex flex-col items-center text-center px-6 pt-24 pb-12 md:pt-28">
      <p
        className={`text-white/50 text-[11px] font-medium tracking-[0.2em] mb-6 uppercase
                    transition-all duration-1000 ${show}`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Akaike · Prompt Token Saver
      </p>

      <h1 className={`text-white transition-all duration-1000 ${show}`} style={headline}>
        Cut tokens by 70%.
      </h1>
      <h1
        className={`transition-all duration-1000 delay-100 ${show}`}
        style={{ ...headline, color: "rgba(255,255,255,0.45)" }}
      >
        Keep every ounce of intent.
      </h1>

      <button
        onClick={onScrollToTool}
        className={`bg-white text-black text-[14px] font-medium rounded-full px-8 py-3.5 mt-8
                    transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]
                    hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.18)] ${show}`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Start saving tokens
      </button>

      <div className={`flex items-center gap-2 mt-7 transition-all duration-1000 delay-300 ${show}`}>
        <Lock size={12} strokeWidth={1.5} className="text-white/50" />
        <span
          className="text-[10px] font-medium tracking-[0.16em] text-white/50"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ENTERPRISE GRADE · BUILT BY AKAIKE
        </span>
      </div>
    </section>
  );
}
