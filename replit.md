# CavePrompt — LLM Token Compressor

A web tool that strips verbose LLM prompts down to their semantic core using the 8 Caveman Compression Rules. Reduces token usage by up to 75% while preserving 100% of technical intent.

## Running the app

```bash
npm run dev       # Start dev server on port 5000
npm run build     # Production build
npm run generate  # Generate the original .docx research document
```

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (React)
- **Styling**: Inline styles with cave-themed color palette
- **Compression**: Rule-based engine in `lib/compress.js`

## Project structure

```
app/
  layout.js       # Root layout with metadata
  page.js         # Main UI — compressor tool
  globals.css     # Base styles and CSS variables
lib/
  compress.js     # The 8 Caveman Compression Rules engine
scripts/
  generate_doc.js # Original .docx document generator
vercel.json       # Vercel deployment config
```

## Deploying to Vercel

This project is Vercel-ready. Just connect your GitHub repo at vercel.com — Next.js is auto-detected.

No environment variables required.

## User preferences

- Deploy to Vercel (not Replit hosting)
