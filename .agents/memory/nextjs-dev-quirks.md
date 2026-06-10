---
name: Next.js dev server quirks (this repl)
description: Transient dev-only errors in this Next.js 15 App Router project and how to clear them
---

# Next.js 15 dev quirks in this repl

- **`Invariant: Expected clientReferenceManifest to be defined` → page returns 500 / "Internal Server Error"**
  - This is a known transient Next.js dev-server bug, NOT a code error. It surfaces intermittently after many Fast Refresh cycles or right after edits to client components.
  - **Fix:** restart the `Start application` workflow. The page serves 200 again afterward.
  - **Do not** start rewriting code in response to this error alone — confirm it's transient by restarting first.

- **Local `npm run build` times out / OOMs** in the Replit sandbox (memory ceiling). This is expected; Vercel build machines handle it. The build compiles successfully before the sandbox kills it.

- **`allowedDevOrigins`** must stay in `next.config.js` for the Replit preview iframe to load `/_next/*` assets, but wrapped in `process.env.NODE_ENV === "development"` so production (Vercel) stays clean.
