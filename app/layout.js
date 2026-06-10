import "./globals.css";

export const metadata = {
  title: "CavePrompt — LLM Token Compressor",
  description: "Strip LLM prompts to their semantic core. Reduce tokens by up to 75% while preserving 100% of technical intent.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
