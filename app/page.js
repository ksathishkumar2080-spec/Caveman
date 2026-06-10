"use client";

import { useState, useCallback } from "react";
import { compress } from "../lib/compress";

const EXAMPLES = [
  "Could you please write a Python function that takes a list of integers as input and returns only the even numbers from that list?",
  "I would like you to act as a senior data engineer and help me design a SQL query that retrieves the top 10 customers by total purchase value from the orders table.",
  "Please generate a comprehensive REST API documentation in markdown format for an authentication service that includes endpoints for login, logout, token refresh, and password reset.",
  "In this task, I need you to review the following code snippet and identify any potential security vulnerabilities, particularly focusing on SQL injection and XSS attack vectors.",
];

const RULES = [
  { code: "R1", name: "DROP ARTICLES", desc: "Remove all occurrences of a, an, the" },
  { code: "R2", name: "DROP POLITENESS", desc: "Remove please, could you, I'd like, feel free…" },
  { code: "R3", name: "DROP INTRO SCAFFOLDING", desc: "Remove preambles like 'In this task', 'For context'" },
  { code: "R4", name: "COMPRESS VERB PHRASES", desc: "'provide me with a list of' → list" },
  { code: "R5", name: "ABBREVIATE KNOWN TECH", desc: "JavaScript → JS, database → DB (unambiguous only)" },
  { code: "R6", name: "COLLAPSE REDUNDANT CLAUSES", desc: "Remove repeated constraints already implied" },
  { code: "R7", name: "FLATTEN POLITE CONDITIONALS", desc: "'if it's not too much trouble' → removed" },
  { code: "R8", name: "PRESERVE CRITICAL TOKENS", desc: "Negations, numbers, formats, tech names — untouched" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const handleCompress = useCallback(() => {
    if (!input.trim()) return;
    const res = compress(input);
    setResult(res);
    setShowSteps(false);
    setCopied(false);
  }, [input]);

  const handleExample = (ex) => {
    setInput(ex);
    setResult(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result?.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleCompress();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #2D2D3F",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#1A1A2E",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "28px" }}>🗿</span>
          <div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#F4F2EF", letterSpacing: "0.03em" }}>
              CAVEPROMPT
            </div>
            <div style={{ fontSize: "12px", color: "#8888AA", letterSpacing: "0.05em" }}>
              LLM TOKEN COMPRESSOR
            </div>
          </div>
        </div>
        <div style={{
          fontSize: "12px",
          color: "#8888AA",
          background: "#2D2D3F",
          padding: "6px 14px",
          borderRadius: "20px",
          border: "1px solid #4A4A6A",
        }}>
          75% fewer tokens · 100% intent preserved
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: "960px", width: "100%", margin: "0 auto", padding: "40px 24px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: "900",
            color: "#F4F2EF",
            lineHeight: 1.15,
            marginBottom: "16px",
          }}>
            Strip your prompts to their{" "}
            <span style={{ color: "#0F7173" }}>semantic core.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "#8888AA", maxWidth: "560px", margin: "0 auto" }}>
            Remove grammar, politeness, and scaffolding that LLMs ignore anyway.
            Keep every token that carries real meaning.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "40px",
        }}>
          {[
            { val: "75%", label: "Avg token reduction" },
            { val: "~100%", label: "Task accuracy maintained" },
            { val: "8 Rules", label: "Compression system" },
          ].map(({ val, label }) => (
            <div key={label} style={{
              background: "#2D2D3F",
              border: "1px solid #4A4A6A",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#E8A838", marginBottom: "4px" }}>{val}</div>
              <div style={{ fontSize: "12px", color: "#8888AA", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Compressor */}
        <div style={{
          background: "#2D2D3F",
          border: "1px solid #4A4A6A",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "32px",
        }}>
          {/* Input */}
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}>
              <label style={{ fontSize: "12px", color: "#8888AA", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Verbose Prompt
              </label>
              <span style={{ fontSize: "12px", color: "#4A4A6A" }}>
                {input.trim() ? `~${Math.ceil(input.trim().split(/\s+/).length * 1.3)} tokens` : "0 tokens"}
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setResult(null); }}
              onKeyDown={handleKeyDown}
              placeholder="Paste your LLM prompt here…"
              rows={6}
              style={{
                width: "100%",
                background: "#1A1A2E",
                border: "1px solid #4A4A6A",
                borderRadius: "10px",
                color: "#F4F2EF",
                fontSize: "15px",
                lineHeight: "1.7",
                padding: "16px",
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#0F7173"}
              onBlur={(e) => e.target.style.borderColor = "#4A4A6A"}
            />
          </div>

          {/* Examples */}
          <div style={{ padding: "12px 24px" }}>
            <span style={{ fontSize: "11px", color: "#4A4A6A", marginRight: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Try:</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExample(ex)}
                style={{
                  background: "transparent",
                  border: "1px solid #4A4A6A",
                  borderRadius: "6px",
                  color: "#8888AA",
                  fontSize: "11px",
                  padding: "3px 10px",
                  marginRight: "6px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.target.style.borderColor = "#0F7173"; e.target.style.color = "#0F7173"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#4A4A6A"; e.target.style.color = "#8888AA"; }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          {/* Compress button */}
          <div style={{ padding: "16px 24px 24px" }}>
            <button
              onClick={handleCompress}
              disabled={!input.trim()}
              style={{
                width: "100%",
                padding: "16px",
                background: input.trim() ? "#0F7173" : "#2D2D3F",
                border: `1px solid ${input.trim() ? "#0F7173" : "#4A4A6A"}`,
                borderRadius: "10px",
                color: input.trim() ? "#fff" : "#4A4A6A",
                fontSize: "15px",
                fontWeight: "700",
                cursor: input.trim() ? "pointer" : "not-allowed",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (input.trim()) e.target.style.background = "#0a5557"; }}
              onMouseLeave={(e) => { if (input.trim()) e.target.style.background = "#0F7173"; }}
            >
              🗿 COMPRESS PROMPT
              <span style={{ fontSize: "12px", fontWeight: "400", marginLeft: "10px", opacity: 0.7 }}>⌘↵</span>
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div style={{
            background: "#2D2D3F",
            border: "1px solid #0F7173",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "32px",
            animation: "fadeIn 0.3s ease",
          }}>
            {/* Token stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderBottom: "1px solid #4A4A6A",
            }}>
              {[
                { label: "Before", val: `~${result.inputTokens}`, sub: "tokens", color: "#C0392B" },
                { label: "After", val: `~${result.outputTokens}`, sub: "tokens", color: "#0F7173" },
                { label: "Saved", val: `${result.reduction}%`, sub: "reduction", color: "#E8A838" },
              ].map(({ label, val, sub, color }) => (
                <div key={label} style={{
                  padding: "18px 20px",
                  textAlign: "center",
                  borderRight: "1px solid #4A4A6A",
                  "&:last-child": { borderRight: "none" },
                }}>
                  <div style={{ fontSize: "11px", color: "#8888AA", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  <div style={{ fontSize: "26px", fontWeight: "800", color }}>{val}</div>
                  <div style={{ fontSize: "11px", color: "#4A4A6A" }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Output */}
            <div style={{ padding: "24px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}>
                <span style={{ fontSize: "12px", color: "#8888AA", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Caveman Prompt
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    style={{
                      background: "transparent",
                      border: "1px solid #4A4A6A",
                      borderRadius: "6px",
                      color: "#8888AA",
                      fontSize: "12px",
                      padding: "4px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {showSteps ? "Hide steps" : `Show steps (${result.steps.length})`}
                  </button>
                  <button
                    onClick={handleCopy}
                    style={{
                      background: copied ? "#0F7173" : "transparent",
                      border: `1px solid ${copied ? "#0F7173" : "#4A4A6A"}`,
                      borderRadius: "6px",
                      color: copied ? "#fff" : "#8888AA",
                      fontSize: "12px",
                      padding: "4px 12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div style={{
                background: "#1A1A2E",
                border: "1px solid #0F7173",
                borderRadius: "10px",
                padding: "18px",
                fontSize: "15px",
                color: "#F4F2EF",
                lineHeight: "1.7",
                fontWeight: "500",
              }}>
                {result.output || <span style={{ color: "#4A4A6A", fontStyle: "italic" }}>Nothing left after compression</span>}
              </div>
            </div>

            {/* Steps breakdown */}
            {showSteps && result.steps.length > 0 && (
              <div style={{ padding: "0 24px 24px" }}>
                <div style={{ fontSize: "11px", color: "#4A4A6A", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                  Applied rules
                </div>
                {result.steps.map((step, i) => (
                  <div key={i} style={{
                    background: "#1A1A2E",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    marginBottom: "8px",
                    borderLeft: "3px solid #E8A838",
                  }}>
                    <div style={{ fontSize: "11px", color: "#E8A838", fontWeight: "700", marginBottom: "6px", fontFamily: "Courier New, monospace" }}>
                      {step.rule}
                    </div>
                    <div style={{ fontSize: "13px", color: "#C0392B", marginBottom: "4px", fontStyle: "italic" }}>
                      — {step.before}
                    </div>
                    <div style={{ fontSize: "13px", color: "#0F7173", fontWeight: "600" }}>
                      + {step.after}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rules Reference */}
        <div style={{
          background: "#2D2D3F",
          border: "1px solid #4A4A6A",
          borderRadius: "16px",
          padding: "28px",
        }}>
          <div style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#E8A838",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "20px",
            fontFamily: "Courier New, monospace",
          }}>
            THE 8 CAVEMAN COMPRESSION RULES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
            {RULES.map(({ code, name, desc }) => (
              <div key={code} style={{
                background: "#1A1A2E",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}>
                <span style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: "12px",
                  color: "#E8A838",
                  fontWeight: "700",
                  minWidth: "24px",
                  paddingTop: "1px",
                }}>
                  {code}
                </span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#F4F2EF", marginBottom: "2px" }}>{name}</div>
                  <div style={{ fontSize: "11px", color: "#8888AA" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #2D2D3F",
        padding: "20px 32px",
        textAlign: "center",
        fontSize: "12px",
        color: "#4A4A6A",
      }}>
        🗿 CavePrompt — Reduce LLM token usage by 75% while preserving 100% of technical intent
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
