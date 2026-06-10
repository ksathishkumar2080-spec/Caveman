export default function NotFound() {
  return (
    <main style={{ fontFamily: "var(--font-inter)" }}
          className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p className="text-[11px] uppercase tracking-[0.2em]"
         style={{ color: "rgba(255,255,255,0.3)" }}>
        404
      </p>
      <h1 className="text-[32px] font-light" style={{ letterSpacing: "-0.03em" }}>
        Page not found
      </h1>
      <a href="/"
         className="text-[12px] mt-2"
         style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>
        Back to home
      </a>
    </main>
  );
}
