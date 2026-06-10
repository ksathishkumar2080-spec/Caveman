const F = { fontFamily: "var(--font-inter)" };

const STATS = [
  {
    value: "70%",
    label: "Token reduction",
    desc: "Average across sales prompts: cold outreach, follow-ups, and objection handling.",
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
    desc: "8 surgical rules remove the noise, never the meaning. Negations and numbers are always kept.",
    color: "rgba(253,230,138,0.85)",
  },
];

const HOW = [
  {
    step: "01",
    title: "Paste your verbose prompt",
    body: "Drop in any sales prompt: cold email requests, objection responses, or discovery call briefs. However long, however wordy.",
  },
  {
    step: "02",
    title: "8 rules strip the noise",
    body: "Articles, politeness markers, scaffolding phrases, and redundant verb chains are all removed. Technical terms get abbreviated. Critical details stay untouched.",
  },
  {
    step: "03",
    title: "Get a lean, ready prompt",
    body: "Copy the optimised version and paste it straight into your LLM tool. Same response quality, with 70% fewer tokens billed.",
  },
];

export default function StatsSection() {
  return (
    <div className="bg-black px-5 md:px-10 lg:px-16 pt-16 md:pt-24">

      {/* ── Stats row ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto border-y border-white/[0.07]">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {STATS.map(({ value, label, desc, color }) => (
            <div key={label}
                 className="py-12 px-8 md:px-10 flex flex-col gap-4 border-white/[0.07]
                            border-t first:border-t-0
                            md:border-t-0 md:border-l md:first:border-l-0">
              <p style={{ ...F, fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 300,
                           letterSpacing: "-0.04em", lineHeight: 1, color }}>
                {value}
              </p>
              <p className="text-[13px] font-medium"
                 style={{ ...F, color: "rgba(255,255,255,0.65)" }}>
                {label}
              </p>
              <p className="text-[12.5px] leading-[1.7] font-light max-w-[34ch]"
                 style={{ ...F, color: "rgba(255,255,255,0.3)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
