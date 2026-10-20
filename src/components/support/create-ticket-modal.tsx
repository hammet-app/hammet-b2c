"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  useTicketStore,
  TicketCategory,
  TicketPriority,
  TicketAttachment,
  SUPPORT_AGENTS,
} from "@/lib/store/use-ticket-store";
import {
  X,
  Code2,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Award,
  HelpCircle,
  UploadCloud,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Check,
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
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

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
      description: "Invoices, Hammet Pro, payments, or receipts",
      icon: CreditCard,
    },
    {
      id: "account",
      label: "Account & Profile",
      description: "Login issues, email change, or password reset",
      icon: ShieldCheck,
    },
    {
      id: "certification",
      label: "Certificates",
      description: "Name corrections, verified diploma, or badges",
      icon: Award,
    },
    {
      id: "technical",
      label: "Technical Issue",
      description: "Upload timeouts, broken pages, or portal bugs",
      icon: Code2,
    },
    {
      id: "general",
      label: "General Help",
      description: "General questions and support inquiries",
      icon: HelpCircle,
    },
  ];

  const priorities: {
    id: TicketPriority;
    label: string;
    sla: string;
    color: string;
  }[] = [
    {
      id: "low",
      label: "Low",
      sla: "Within 48 hours",
      color: "border-slate-300 dark:border-white/10",
    },
    {
      id: "medium",
      label: "Medium",
      sla: "Within 24 hours",
      color: "border-cyan-400 dark:border-cyan-500",
    },
    {
      id: "high",
      label: "High",
      sla: "Within 4 hours",
      color: "border-amber-400 dark:border-amber-500",
    },
    {
      id: "critical",
      label: "Urgent",
      sla: "Immediate attention",
      color: "border-rose-500 dark:border-rose-500",
    },
  ];

  const handleAddSampleAttachment = (type: "image" | "log") => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const newAtt: TicketAttachment =
      type === "image"
        ? {
            id: `att-${Date.now()}`,
            name: `error_screen_${randomId}.png`,
            size: "1.4 MB",
            type: "image",
          }
        : {
            id: `att-${Date.now()}`,
            name: `console_traceback_${randomId}.log`,
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
      setSuccessTicketId(newId);

      setTimeout(() => {
        setIsCreateModalOpen(false);
        setTimeout(() => {
          setSuccessTicketId(null);
          setTitle("");
          setDescription("");
          setAttachments([]);
        }, 250);
      }, 1100);
    }, 400);
  };

  const assignedLead = SUPPORT_AGENTS[category];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
          {/* Full viewport backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[100]"
          />

          {/* Modal Container with max-height & pinned header/footer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[101] w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-modal-title"
          >
            {successTicketId ? (
              <div className="p-8 sm:p-12 text-center space-y-4 my-auto">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8 animate-bounce" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Support Ticket Submitted!
                </h3>
                <p className="text-sm font-mono text-purple-600 dark:text-purple-400 font-bold">
                  Reference ID: {successTicketId}
                </p>
                <p className="max-w-md mx-auto text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Assigned to <span className="font-semibold text-slate-800 dark:text-slate-200">{assignedLead.name}</span> ({assignedLead.role}). Your ticket has been logged and an update will appear shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
                {/* Modal Title & Header (Pinned at top) */}
                <div className="relative shrink-0 border-b border-slate-100 px-6 py-5 dark:border-white/[0.08] bg-white dark:bg-slate-900 z-10">
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 mb-2 border border-purple-200/60 dark:border-purple-500/30">
                    <GlowingMagicSparkle size="xs" />
                    Hammet Learner Help Desk
                  </div>
                  <h3 id="ticket-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Submit a Support Ticket
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Describe your issue or question. Our student support team will review and reply.
                  </p>
                </div>

                {/* Modal Form Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 min-h-0">
                  {/* 1. Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      1. Select Issue Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex flex-col items-start p-3 rounded-2xl border text-left transition cursor-pointer ${
                              isSelected
                                ? "border-purple-600 bg-purple-50/70 dark:border-purple-500/50 dark:bg-purple-950/30 shadow-xs ring-1 ring-purple-500/20"
                                : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-white/20"
                            }`}
                          >
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-lg mb-1.5 ${
                                isSelected
                                  ? "bg-purple-600 text-white dark:bg-purple-800/90 dark:text-purple-100 dark:border dark:border-purple-500/40"
                                  : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {cat.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Priority Selection */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        2. Priority Level &amp; Response SLA
                      </label>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Assigned Lead: {assignedLead.name}
                      </span>
                    </div>
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
                                : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-white/20"
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

                  {/* 3. Title Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        3. Problem Title / Subject
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
                      placeholder="e.g., Can't access Module 3 quiz after finishing the lecture"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                    />
                  </div>

                  {/* 4. Detailed Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      4. Problem Description
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please describe what happened, which course or page you were on, and any error message displayed..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                    />
                  </div>

                  {/* 5. Attachments Dropper */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        5. Attachments (Screenshots or Files)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddSampleAttachment("image")}
                          className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ImageIcon className="h-3 w-3" />
                          + Add Screenshot
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSampleAttachment("log")}
                          className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="h-3 w-3" />
                          + Add Document
                        </button>
                      </div>
                    </div>

                    {attachments.length > 0 ? (
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
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-white/10 dark:bg-white/[0.01] text-center">
                        <UploadCloud className="h-5 w-5 text-slate-400 mb-1" />
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Use quick buttons above to attach screenshots or files.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer (Pinned at bottom) */}
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
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-purple-800/90 dark:hover:bg-purple-750 dark:border dark:border-purple-500/30 dark:shadow-none disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Submit Support Request"}</span>
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
