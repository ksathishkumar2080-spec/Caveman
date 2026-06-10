const F = { fontFamily: "var(--font-inter)" };

const STATS = [
  {
    value: "70%",
    label: "Token reduction",
    desc: "Average across sales prompts — cold outreach, follow-ups, objection handling.",
    color: "rgba(134,239,172,0.85)",
  },
  {
    value: "3×",
    label: "Faster responses",
    desc: "Shorter prompts mean lower latency from every LLM API you call.",
    color: "rgba(147,197,253,0.85)",
  },
  {
    value: "100%",
    label: "Intent preserved",
    desc: "8 surgical rules remove noise — never meaning. Negations and numbers are always kept.",
    color: "rgba(253,230,138,0.85)",
  },
];

const HOW = [
  {
    step: "01",
    title: "Paste your verbose prompt",
    body: "Drop in any sales prompt — cold email requests, objection responses, discovery call briefs. However long, however wordy.",
  },
  {
    step: "02",
    title: "8 rules strip the noise",
    body: "Articles, politeness markers, scaffolding phrases, redundant verb chains — all removed. Technical terms are abbreviated. Critical details are untouched.",
  },
  {
    step: "03",
    title: "Get a lean, ready prompt",
    body: "Copy the optimised version and paste it directly into your LLM tool. Same response quality — 70% fewer tokens billed.",
  },
];

export default function StatsSection() {
  return (
    <div className="bg-black px-4 md:px-10 lg:px-16">

      {/* ── Stats row ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto border-t border-b"
           style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
             style={{ "--tw-divide-opacity": 1, borderColor: "rgba(255,255,255,0.07)" }}>
          {STATS.map(({ value, label, desc, color }) => (
            <div key={label} className="py-10 px-8 flex flex-col gap-3"
                 style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p style={{ ...F, fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 300,
                           letterSpacing: "-0.04em", lineHeight: 1, color }}>
                {value}
              </p>
              <p className="text-[13px] font-medium"
                 style={{ ...F, color: "rgba(255,255,255,0.65)" }}>
                {label}
              </p>
              <p className="text-[12px] leading-[1.65] font-light"
                 style={{ ...F, color: "rgba(255,255,255,0.28)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto py-20">
        <p className="text-[10px] uppercase tracking-[0.22em] mb-10"
           style={{ ...F, color: "rgba(255,255,255,0.2)" }}>
          How it works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW.map(({ step, title, body }) => (
            <div key={step} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium tabular-nums"
                      style={{ ...F, color: "rgba(255,255,255,0.2)" }}>
                  {step}
                </span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>
              <h3 className="text-[16px] font-light leading-snug"
                  style={{ ...F, color: "rgba(255,255,255,0.75)" }}>
                {title}
              </h3>
              <p className="text-[12px] leading-[1.7] font-light"
                 style={{ ...F, color: "rgba(255,255,255,0.3)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cost callout banner ────────────────────────────── */}
      <div className="max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden"
           style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <div className="px-8 py-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.18em] mb-2"
               style={{ ...F, color: "rgba(255,255,255,0.25)" }}>
              Real cost impact
            </p>
            <p className="text-[18px] font-light leading-[1.5]"
               style={{ ...F, color: "rgba(255,255,255,0.75)" }}>
              If your team sends{" "}
              <span style={{ color: "rgba(253,230,138,0.9)" }}>1,000 prompts/day</span>{" "}
              at 200 tokens each, that's{" "}
              <span style={{ color: "rgba(253,230,138,0.9)" }}>200,000 tokens</span>.
              After Akaike compression, you're paying for{" "}
              <span style={{ color: "rgba(134,239,172,0.9)" }}>60,000</span> — saving
              {" "}<span style={{ color: "rgba(134,239,172,0.9)" }}>140,000 tokens every single day</span>.
            </p>
          </div>
          <div className="shrink-0 text-center md:text-right">
            <p style={{ ...F, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300,
                         letterSpacing: "-0.04em", color: "rgba(134,239,172,0.85)" }}>
              −70%
            </p>
            <p className="text-[11px]" style={{ ...F, color: "rgba(255,255,255,0.25)" }}>
              daily token spend
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
