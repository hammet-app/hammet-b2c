"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  useTicketStore,
  TicketAttachment,
  TicketStatus,
} from "@/lib/store/use-ticket-store";
import {
  PriorityBadge,
  StatusBadge,
  CategoryBadge,
} from "./ticket-badges";
import {
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Send,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Code2,
  ShieldCheck,
  User,
  Star,
  Printer,
  ChevronLeft,
  X,
  FileCode,
  File,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function TicketDetailView() {
  const {
    tickets,
    selectedTicketId,
    setSelectedTicketId,
    addComment,
    updateTicketStatus,
    setSatisfactionRating,
  } = useTicketStore();

  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<TicketAttachment[]>([]);
  const [activePreview, setActivePreview] = useState<TicketAttachment | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ticket = tickets.find((t) => t.id === selectedTicketId);

  if (!ticket) {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-slate-900/40">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 mb-3">
          <FileText className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Ticket Selected
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          Select a ticket from the left list to view its full digital record, timeline, attachments, and assigned agent responses.
        </p>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSimulatedFile = (type: "image" | "log" | "code") => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const mockFiles: Record<"image" | "log" | "code", TicketAttachment> = {
      image: {
        id: `att-sim-${Date.now()}`,
        name: `screenshot_diagnostic_${randomId}.png`,
        size: "840 KB",
        type: "image",
      },
      log: {
        id: `att-sim-${Date.now()}`,
        name: `terminal_execution_log_${randomId}.log`,
        size: "112 KB",
        type: "log",
      },
      code: {
        id: `att-sim-${Date.now()}`,
        name: `repro_script_${randomId}.py`,
        size: "4.2 KB",
        type: "code",
      },
    };
    setPendingAttachments([...pendingAttachments, mockFiles[type]]);
  };

  const handleRemovePendingFile = (id: string) => {
    setPendingAttachments(pendingAttachments.filter((f) => f.id !== id));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && pendingAttachments.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addComment(ticket.id, replyText, pendingAttachments);
      setReplyText("");
      setPendingAttachments([]);
      setIsSubmitting(false);
    }, 400);
  };

  const getAttachmentIcon = (type: TicketAttachment["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-purple-500" />;
      case "log":
        return <FileText className="h-4 w-4 text-amber-500" />;
      case "code":
        return <FileCode className="h-4 w-4 text-cyan-500" />;
      case "document":
      default:
        return <File className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
      {/* ── TOP HEADER / ACTION BAR ───────────────────────────── */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200/70 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            {/* Ticket ID & Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedTicketId(null)}
                className="lg:hidden flex items-center gap-0.5 text-xs text-purple-600 font-bold hover:underline mr-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>

              <button
                onClick={handleCopyId}
                className="group flex items-center gap-1 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-100 bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition"
                title="Click to copy ticket reference ID"
              >
                <span>{ticket.id}</span>
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-300" />
                )}
              </button>

              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              <CategoryBadge category={ticket.category} />
            </div>

            {/* Title */}
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {ticket.title}
            </h2>

            {/* Created info */}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
              Opened by Godswill Chibueze on {formatDate(ticket.createdAt)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {ticket.status === "resolved" || ticket.status === "closed" ? (
              <button
                onClick={() => updateTicketStatus(ticket.id, "open")}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <RotateCcw className="h-3 w-3" />
                Reopen
              </button>
            ) : (
              <button
                onClick={() => updateTicketStatus(ticket.id, "resolved")}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <CheckCircle2 className="h-3 w-3" />
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN SCROLLABLE CONTENT BODY ───────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
        {/* ASSIGNED AGENT INFO STRIP */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600 dark:bg-purple-900/60 dark:text-purple-200 dark:border dark:border-purple-500/25 text-xs font-bold text-white shadow-xs">
              {ticket.assignedAgent.avatar ||
                ticket.assignedAgent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {ticket.assignedAgent.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  ({ticket.assignedAgent.role})
                </span>
                {ticket.assignedAgent.isOnline && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Assigned support specialist handling this ticket
              </p>
            </div>
          </div>
        </div>

        {/* SATISFACTION SURVEY IF RESOLVED */}
        {ticket.status === "resolved" && (
          <div className="rounded-2xl border border-emerald-300/60 bg-emerald-50/60 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/20 text-center">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              How would you rate the resolution of ticket #{ticket.id}?
            </h4>
            <div className="mt-2 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSatisfactionRating(ticket.id, star)}
                  className="p-1 text-slate-300 hover:text-amber-400 transition"
                >
                  <Star
                    className={`h-6 w-6 ${
                      (ticket.satisfactionRating || 0) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            {ticket.satisfactionRating && (
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                Thank you for your feedback! Rated {ticket.satisfactionRating}/5 stars.
              </p>
            )}
          </div>
        )}

        {/* CONVERSATION THREAD */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Activity &amp; Resolution Timeline
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          {ticket.comments.map((comment, idx) => {
            const isAgent = comment.author.role === "agent";
            const isSystem = comment.author.role === "system";

            if (isSystem) {
              return (
                <div
                  key={comment.id}
                  className="rounded-xl bg-slate-100 p-3 text-center text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400"
                >
                  {comment.content}
                </div>
              );
            }

            return (
              <div
                key={comment.id}
                className={`flex gap-3 sm:gap-4 ${
                  isAgent ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-white shadow-sm ${
                    isAgent
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 ring-2 ring-purple-400/30"
                      : "bg-gradient-to-tr from-cyan-600 to-blue-600"
                  }`}
                >
                  {isAgent ? (
                    comment.author.avatar || "SP"
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                  {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-3.5 shadow-xs ${
                    isAgent
                      ? "bg-slate-50 text-slate-800 border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/10 dark:text-slate-200"
                      : "bg-purple-600 text-white dark:bg-purple-900/40 dark:border dark:border-purple-500/25 dark:text-purple-100 dark:shadow-none"
                  }`}
                >
                  {/* Sender Header */}
                  <div
                    className={`flex items-center gap-1.5 mb-1.5 text-[11px] ${
                      isAgent
                        ? "text-slate-500 dark:text-slate-400"
                        : "text-purple-200 dark:text-purple-300"
                    }`}
                  >
                    <span className="font-bold">
                      {comment.author.name}
                    </span>
                    {comment.author.title && (
                      <span className="text-[10px] opacity-80">
                        • {comment.author.title}
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[9px]">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {comment.content}
                  </div>

                  {/* Comment Attachments */}
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 space-y-1.5">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider ${
                          isAgent ? "text-slate-500 dark:text-slate-400" : "text-purple-200 dark:text-purple-300"
                        }`}
                      >
                        Attached Files ({comment.attachments.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {comment.attachments.map((att) => (
                          <button
                            key={att.id}
                            type="button"
                            onClick={() => setActivePreview(att)}
                            className={`flex items-center gap-1.5 rounded-lg p-2 text-left transition text-[11px] border ${
                              isAgent
                                ? "bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-white/10 hover:border-purple-400"
                                : "bg-purple-700/80 border-purple-500/50 text-white hover:bg-purple-700 dark:bg-purple-950/60 dark:border-purple-500/30 dark:text-purple-200"
                            }`}
                          >
                            {getAttachmentIcon(att.type)}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{att.name}</p>
                              <span className="font-mono text-[9px] opacity-75">
                                {att.size}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── REPLY COMPOSER ───────────────────────────────────────── */}
      <div className="p-3 sm:p-3.5 border-t border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
        <form onSubmit={handleSendReply} className="space-y-2.5">
          {/* Pending attachments chip list */}
          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {pendingAttachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-1 rounded-lg border border-purple-300 bg-purple-50 px-2 py-0.5 text-[11px] text-purple-700 dark:border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-300"
                >
                  {getAttachmentIcon(file.type)}
                  <span className="font-medium max-w-[130px] truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePendingFile(file.id)}
                    className="ml-0.5 text-purple-400 hover:text-purple-700 dark:hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a follow-up comment, paste code errors, or ask a question..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 pr-24 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />

            {/* Quick Action Buttons inside Textarea */}
            <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAddSimulatedFile("image")}
                title="Attach Screenshot"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-purple-600 dark:hover:bg-white/10 dark:hover:text-purple-300 transition"
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddSimulatedFile("log")}
                title="Attach Error Log"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-white/10 dark:hover:text-amber-400 transition"
              >
                <FileText className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddSimulatedFile("code")}
                title="Attach Code File"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-purple-600 dark:hover:bg-white/10 dark:hover:text-purple-300 transition"
              >
                <Code2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Assigned staff automatically notified upon reply</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (!replyText.trim() && pendingAttachments.length === 0)}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-purple-800/80 dark:hover:bg-purple-750 dark:border dark:border-purple-500/30 dark:shadow-none disabled:opacity-50 disabled:pointer-events-none transition"
            >
              <span>{isSubmitting ? "Sending..." : "Send Reply"}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* ── ATTACHMENT PREVIEW LIGHTBOX ──────────────────────────── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {activePreview && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePreview(null)}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative z-[101] w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-white"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      {getAttachmentIcon(activePreview.type)}
                      <h4 className="text-sm font-bold truncate">
                        {activePreview.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => setActivePreview(null)}
                      className="rounded-lg p-1 text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs text-slate-300 max-h-60 overflow-y-auto">
                    {activePreview.type === "image" ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                        <ImageIcon className="h-12 w-12 text-purple-400 mb-2" />
                        <p className="text-xs font-bold text-white">Diagnostic Image Preview</p>
                        <p className="text-[11px] text-slate-500 mt-1">Resolution 1920x1080 • Verified PNG</p>
                      </div>
                    ) : activePreview.type === "code" ? (
                      <pre className="whitespace-pre-wrap leading-relaxed">
{`# Repro configuration
import torch
from transformers import AutoModelForCausalLM

model_id = "meta-llama/Meta-Llama-3-8B"
print(f"Allocating {model_id} on cluster node...")
# Verified configuration parameters`}
                      </pre>
                    ) : (
                      <pre className="whitespace-pre-wrap leading-relaxed text-amber-300/90">
{`[2026-10-17 07:14:22] [CUDA-INFO] Initializing PyTorch runtime v2.4.0+cu124
[2026-10-17 07:14:38] [ALLOC-WARN] VRAM consumption 15.82 GiB / 16.00 GiB
[2026-10-17 07:15:00] [TRACEBACK] RuntimeError: CUDA out of memory. Tried to allocate 512.00 MiB`}
                      </pre>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setActivePreview(null)}
                      className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

