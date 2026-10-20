"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  useTicketStore,
  TicketCategory,
  TicketPriority,
  TicketAttachment,
  HAMMET_SUPPORT_EMAIL,
} from "@/lib/store/use-ticket-store";
import {
  X,
  Code2,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Award,
  UploadCloud,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Check,
  Mail,
  Copy,
  ExternalLink,
} from "lucide-react";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";
import { motion, AnimatePresence } from "motion/react";

export function CreateTicketModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, createTicket } = useTicketStore();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>("technical");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [copiedInfo, setCopiedInfo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isCreateModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCreateModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCreateModalOpen, setIsCreateModalOpen]);

  const categories: {
    id: TicketCategory;
    label: string;
    description: string;
    icon: typeof Code2;
  }[] = [
    {
      id: "courseware",
      label: "Course & Content",
      description: "Video playback, quiz errors, or module progress",
      icon: BookOpen,
    },
    {
      id: "billing",
      label: "Billing & Subscriptions",
      description: "Invoices, payments, receipts, or course purchases",
      icon: CreditCard,
    },
    {
      id: "account",
      label: "Account & Profile",
      description: "Login issues, email changes, or password resets",
      icon: ShieldCheck,
    },
    {
      id: "certification",
      label: "Certificates & Badges",
      description: "Name corrections, verified diploma, or credentials",
      icon: Award,
    },
    {
      id: "technical",
      label: "Technical Issue",
      description: "Broken pages, loading timeouts, or platform bugs",
      icon: Code2,
    },
  ];

  const priorities: {
    id: TicketPriority;
    label: string;
    sla: string;
  }[] = [
    {
      id: "low",
      label: "Low",
      sla: "Within 48 hours",
    },
    {
      id: "medium",
      label: "Normal",
      sla: "Within 24 hours",
    },
    {
      id: "high",
      label: "High",
      sla: "Within 4-12 hours",
    },
    {
      id: "critical",
      label: "Urgent",
      sla: "2-4 hours",
    },
  ];

  const handleAddSampleAttachment = (type: "image" | "log") => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const newAtt: TicketAttachment =
      type === "image"
        ? {
            id: `att-${Date.now()}`,
            name: `screenshot_${randomId}.png`,
            size: "1.4 MB",
            type: "image",
          }
        : {
            id: `att-${Date.now()}`,
            name: `diagnostic_log_${randomId}.log`,
            size: "88 KB",
            type: "log",
          };
    setAttachments([...attachments, newAtt]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newId = createTicket({
        title,
        description,
        category,
        priority,
        attachments,
      });

      setIsSubmitting(false);
      setCreatedTicketId(newId);
    }, 300);
  };

  const handleCloseSuccess = () => {
    setIsCreateModalOpen(false);
    setTimeout(() => {
      setCreatedTicketId(null);
      setTitle("");
      setDescription("");
      setAttachments([]);
      setCopiedInfo(false);
    }, 250);
  };

  const mailtoUrl = createdTicketId
    ? `mailto:${HAMMET_SUPPORT_EMAIL}?subject=${encodeURIComponent(
        `[${createdTicketId}] ${title}`
      )}&body=${encodeURIComponent(
        `Hello Hammet Support Team,\n\nI am submitting a support ticket [${createdTicketId}]:\n\nCategory: ${category}\nPriority: ${priority}\n\nDescription:\n${description}\n\nPlease reply to this email address.\n\nThank you,\nHammet Learner`
      )}`
    : "";

  const handleCopyTicketDetails = () => {
    const details = `Support Ticket Ref: ${createdTicketId}\nRecipient: ${HAMMET_SUPPORT_EMAIL}\nSubject: ${title}\nCategory: ${category}\nDetails:\n${description}`;
    navigator.clipboard.writeText(details);
    setCopiedInfo(true);
    setTimeout(() => setCopiedInfo(false), 2500);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden font-poppins">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[101] w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {createdTicketId ? (
              /* ── SUBMISSION SUCCESS / EMAIL DISPATCH VIEW ─────────── */
              <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center my-auto">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-950/50 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Support Ticket Logged</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Ticket #{createdTicketId}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
                  Your ticket has been recorded and addressed to <strong className="font-mono text-purple-700 dark:text-purple-300">{HAMMET_SUPPORT_EMAIL}</strong>. You can dispatch it now directly from your email app, or our team will review the logged ticket.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                  <a
                    href={mailtoUrl}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 transition"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Open in Email App</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>

                  <button
                    onClick={handleCopyTicketDetails}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    {copiedInfo ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied Details!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Email &amp; Ref</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleCloseSuccess}
                  className="mt-6 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white underline transition"
                >
                  Done, view ticket in portal
                </button>
              </div>
            ) : (
              /* ── CREATE FORM VIEW ─────────────────────────────────── */
              <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                {/* Pinned Header */}
                <div className="shrink-0 flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/[0.08] bg-slate-50/70 dark:bg-slate-900/90 z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>New Support Inquiry</span>
                        <GlowingMagicSparkle className="h-3.5 w-3.5 text-purple-600" />
                      </h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Direct to: <strong className="font-mono text-purple-700 dark:text-purple-300">{HAMMET_SUPPORT_EMAIL}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-white/10 dark:hover:bg-white/5 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      1. Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`p-2.5 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                              isSelected
                                ? "border-purple-600 bg-purple-50/70 dark:border-purple-500/50 dark:bg-purple-950/40 ring-1 ring-purple-500/20"
                                : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/40 hover:border-slate-300"
                            }`}
                          >
                            <div
                              className={`p-1.5 rounded-xl ${
                                isSelected
                                  ? "bg-purple-600 text-white"
                                  : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                                {cat.label}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                                {cat.description}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Priority Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      2. Priority &amp; Expected Response
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {priorities.map((p) => {
                        const isSelected = priority === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPriority(p.id)}
                            className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? "border-purple-600 bg-purple-50 dark:border-purple-500/50 dark:bg-purple-950/30 ring-1 ring-purple-500/20"
                                : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/40 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {p.label}
                              </span>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                              {p.sla}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        3. Subject / Problem Summary
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {title.length}/120
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={120}
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Cannot load Module 3 video lectures or quiz"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      4. Description &amp; Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please describe your question or issue in detail. Our support team will reply directly to your email address..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                    />
                  </div>

                  {/* Attachments */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        5. Attachments (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddSampleAttachment("image")}
                          className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ImageIcon className="h-3 w-3" />
                          + Screenshot
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSampleAttachment("log")}
                          className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="h-3 w-3" />
                          + Document
                        </button>
                      </div>
                    </div>

                    {attachments.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50/60 p-2 text-xs dark:border-purple-500/30 dark:bg-purple-950/30"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {att.type === "image" ? (
                                <ImageIcon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-amber-500" />
                              )}
                              <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                                {att.name}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">
                                ({att.size})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pinned Footer */}
                <div className="shrink-0 border-t border-slate-100 px-6 py-4 dark:border-white/[0.08] bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-end gap-3 z-10">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                  >
                    <span>{isSubmitting ? "Logging Ticket..." : "Submit to Support"}</span>
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
