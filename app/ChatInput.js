"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import equal from "fast-deep-equal";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 as LoaderIcon, X as XIcon, Paperclip, ArrowUp, Square } from "lucide-react";
import { twMerge } from "tailwind-merge";

const cn = (...args) => twMerge(args.filter(Boolean).join(" "));
const F = { fontFamily: "var(--font-inter)" };

/* ── Suggested actions ──────────────────────────────────────── */
const SUGGESTIONS = [
  {
    title: "Cold outreach email",
    label: "Enterprise SaaS client, pricing page visit",
    action: "Could you please help me write a cold outreach email to a potential enterprise client in the SaaS industry who recently visited our pricing page?",
  },
  {
    title: "Follow-up message",
    label: "Post-demo prospect, no reply in 7 days",
    action: "I would like you to create a follow-up message for a prospect who attended our product demo last week but hasn't responded to my previous two emails.",
  },
  {
    title: "Objection response",
    label: "Pricing objection vs. competitor",
    action: "Please help me draft a professional response to a pricing objection from a mid-market client who is comparing us against our main competitor.",
  },
  {
    title: "Discovery call prep",
    label: "CTO at fintech, data analytics platform",
    action: "In this task, I need you to summarize the key talking points for a discovery call with a CTO at a fintech company interested in our data analytics platform.",
  },
];

function PureSuggestedActions({ onSelectAction }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full pb-1">
      <AnimatePresence>
        {SUGGESTIONS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.05 * i, duration: 0.2 }}
            className={i > 1 ? "hidden sm:block" : "block"}
          >
            <button
              onClick={() => onSelectAction(s.action)}
              className="w-full text-left rounded-xl px-4 py-3 flex flex-col gap-1 transition-all duration-200"
              style={{
                ...F,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.03)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            >
              <span className="text-[12px] font-medium"
                    style={{ color: "rgba(255,255,255,0.6)" }}>
                {s.title}
              </span>
              <span className="text-[11px] font-light leading-snug"
                    style={{ color: "rgba(255,255,255,0.25)" }}>
                {s.label}
              </span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const SuggestedActions = memo(PureSuggestedActions);

/* ── Attachment preview ─────────────────────────────────────── */
const PreviewAttachment = memo(function PreviewAttachment({ attachment, isUploading = false }) {
  const { name, url, contentType } = attachment;
  return (
    <div className="flex flex-col gap-1">
      <div className="w-16 h-12 rounded-lg relative flex items-center justify-center overflow-hidden"
           style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
        {contentType?.startsWith("image/") && url ? (
          <img src={url} alt={name ?? "attachment"} className="size-full object-cover" />
        ) : (
          <span className="text-[9px] uppercase font-medium"
                style={{ color: "rgba(255,255,255,0.35)" }}>
            {name?.split(".").pop() || "file"}
          </span>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center"
               style={{ background: "rgba(0,0,0,0.5)" }}>
            <LoaderIcon className="animate-spin" size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
          </div>
        )}
      </div>
      <span className="text-[9px] max-w-[64px] truncate"
            style={{ ...F, color: "rgba(255,255,255,0.3)" }}>
        {name}
      </span>
    </div>
  );
});

/* ── Main ChatInput component ───────────────────────────────── */
export default function ChatInput({
  messages = [],
  attachments,
  setAttachments,
  onSend,
  isGenerating = false,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [input, setInput] = useState("");
  const [uploadQueue, setUploadQueue] = useState([]);

  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };

  const resetHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
  }, []);

  useEffect(() => { adjustHeight(); }, [input]);

  const handleInput = (e) => setInput(e.target.value);

  /* mock file upload — creates a local object URL */
  const uploadFile = useCallback(async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const url = URL.createObjectURL(file);
          resolve({ url, name: file.name, contentType: file.type || "application/octet-stream", size: file.size });
        } catch {
          resolve(undefined);
        } finally {
          setUploadQueue(q => q.filter(n => n !== file.name));
        }
      }, 600);
    });
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadQueue(q => [...q, ...files.map(f => f.name)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    const valid = files.filter(f => f.size <= 25 * 1024 * 1024);
    const results = await Promise.all(valid.map(uploadFile));
    setAttachments(cur => [...cur, ...results.filter(Boolean)]);
  }, [setAttachments, uploadFile]);

  const removeAttachment = useCallback((att) => {
    if (att.url.startsWith("blob:")) URL.revokeObjectURL(att.url);
    setAttachments(cur => cur.filter(a => a.url !== att.url));
    textareaRef.current?.focus();
  }, [setAttachments]);

  const submit = useCallback(() => {
    const text = input.trim();
    if (!text && !attachments.length) return;
    onSend({ input: text, attachments });
    setInput("");
    setAttachments([]);
    attachments.forEach(a => { if (a.url.startsWith("blob:")) URL.revokeObjectURL(a.url); });
    resetHeight();
    textareaRef.current?.focus();
  }, [input, attachments, onSend, setAttachments, resetHeight]);

  const canSubmit = !isGenerating && uploadQueue.length === 0 && (input.trim().length > 0 || attachments.length > 0);
  const showSuggestions = messages.length === 0 && !attachments.length && !uploadQueue.length;
  const tokenEstimate = input.trim() ? Math.ceil(input.trim().split(/\s+/).length * 1.3) : null;

  return (
    <div className="relative w-full flex flex-col gap-3">

      {/* Suggested actions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <SuggestedActions
              onSelectAction={(action) => {
                setInput(action);
                requestAnimationFrame(() => { adjustHeight(); textareaRef.current?.focus(); });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
        accept="image/*,video/*,audio/*,.pdf"
      />

      {/* Attachment previews */}
      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-auto items-end px-1">
          {attachments.map((att) => (
            <div key={att.url || att.name} className="relative group shrink-0">
              <PreviewAttachment attachment={att} />
              <button
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.15)" }}
                onClick={() => removeAttachment(att)}
              >
                <XIcon size={8} style={{ color: "rgba(255,255,255,0.8)" }} />
              </button>
            </div>
          ))}
          {uploadQueue.map((name, i) => (
            <PreviewAttachment
              key={`up-${name}-${i}`}
              attachment={{ url: "", name, contentType: "", size: 0 }}
              isUploading
            />
          ))}
        </div>
      )}

      {/* Token estimate row */}
      {tokenEstimate && (
        <div className="flex justify-end px-1">
          <span className="text-[9px]" style={{ ...F, color: "rgba(255,255,255,0.18)" }}>
            ~{tokenEstimate} tokens
          </span>
        </div>
      )}

      {/* Input row */}
      <div className="relative flex items-end gap-2 rounded-xl px-3 py-2.5"
           style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Attach button */}
        <button
          onClick={e => { e.preventDefault(); fileInputRef.current?.click(); }}
          disabled={isGenerating || uploadQueue.length > 0}
          className="shrink-0 mb-0.5 transition-opacity duration-200"
          style={{ opacity: (isGenerating || uploadQueue.length > 0) ? 0.3 : 1 }}
          title="Attach files"
        >
          <Paperclip size={13} strokeWidth={1.8} style={{ color: "rgba(255,255,255,0.28)", transform: "rotate(-45deg)" }} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Paste your sales prompt…"
          rows={1}
          disabled={isGenerating && uploadQueue.length > 0}
          className="flex-1 bg-transparent outline-none resize-none text-[13px] leading-[1.6] font-light"
          style={{ ...F, color: "rgba(255,255,255,0.78)", minHeight: "20px" }}
        />

        {/* Send / Stop */}
        {isGenerating ? (
          <button
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
            onClick={() => {}}
            title="Stop"
          >
            <Square size={9} strokeWidth={2} style={{ color: "rgba(255,255,255,0.7)" }} />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: canSubmit ? "#fff" : "rgba(255,255,255,0.07)",
              color: canSubmit ? "#000" : "rgba(255,255,255,0.18)",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
            title="Send (⌘↵)"
          >
            <ArrowUp size={11} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Hint */}
      <p className="text-right text-[9px] pr-1" style={{ ...F, color: "rgba(255,255,255,0.1)" }}>
        ⌘↵ to send · attach images, PDFs up to 25 MB
      </p>
    </div>
  );
}
