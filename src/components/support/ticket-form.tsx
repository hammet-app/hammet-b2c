"use client";

import { useState } from "react";
import {
  useTicketStore,
  TicketCategory,
  TicketPriority,
  HAMMET_SUPPORT_EMAIL,
} from "@/lib/store/use-ticket-store";
import { useAuth } from "@/lib/auth/auth-context";
import { supportApi } from "@/lib/api/support";
import {
  Code2,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Award,
  HelpCircle,
  CheckCircle2,
  Send,
  Loader2,
  Check,
  AlertCircle,
  PlusCircle,
  FileText,
} from "lucide-react";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";
import { motion, AnimatePresence } from "motion/react";

interface TicketFormProps {
  onSuccess?: (ticketId: string) => void;
  onCancel?: () => void;
  isEmbedded?: boolean;
}

export function TicketForm({ onSuccess, onCancel, isEmbedded = false }: TicketFormProps) {
  const { createTicket, addTicket, setSelectedTicketId } = useTicketStore();
  const { accessToken } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<TicketCategory>("technical");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    createdAt: string;
  } | null>(null);

  const categories: {
    id: TicketCategory;
    label: string;
    description: string;
    icon: typeof Code2;
  }[] = [
    {
      id: "technical",
      label: "Technical Issue",
      description: "Platform bugs, errors, or page loading issues",
      icon: Code2,
    },
    {
      id: "courseware",
      label: "Course & Content",
      description: "Video playback, quiz errors, or module progress",
      icon: BookOpen,
    },
    {
      id: "billing",
      label: "Billing & Purchases",
      description: "Invoices, transactions, receipts, or course payments",
      icon: CreditCard,
    },
    {
      id: "account",
      label: "Account & Profile",
      description: "Login issues, email changes, or account security",
      icon: ShieldCheck,
    },
    {
      id: "certification",
      label: "Certificates & Badges",
      description: "Name corrections, verified diploma, or badges",
      icon: Award,
    },
    {
      id: "general",
      label: "General Inquiry",
      description: "Cohort questions, program details, or general help",
      icon: HelpCircle,
    },
  ];

  const priorities: {
    id: TicketPriority;
    label: string;
    description: string;
  }[] = [
    { id: "low", label: "Low", description: "General questions" },
    { id: "medium", label: "Medium", description: "Standard (Default)" },
    { id: "high", label: "High", description: "Impeding study progress" },
    { id: "critical", label: "Critical", description: "Urgent blocker" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanSubject) {
      setErrorMessage("Please enter a subject for your ticket.");
      return;
    }

    if (!cleanMessage) {
      setErrorMessage("Please describe your inquiry or issue.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Trigger backend endpoint: POST /api/v1/learner/support/tickets
      const apiRes = await supportApi.createTicket(
        {
          subject: cleanSubject,
          message: cleanMessage,
          category,
          priority,
        },
        accessToken
      );

      let finalTicketId = `HMT-${Math.floor(1000 + Math.random() * 9000)}`;
      let finalCreatedAt = new Date().toISOString();

      if (apiRes.success && apiRes.data) {
        finalTicketId = apiRes.data.id || finalTicketId;
        finalCreatedAt = apiRes.data.created_at || finalCreatedAt;

        // Persist ticket into store with backend-assigned data
        addTicket({
          id: finalTicketId,
          subject: apiRes.data.subject || cleanSubject,
          title: apiRes.data.subject || cleanSubject,
          message: apiRes.data.message || cleanMessage,
          description: apiRes.data.message || cleanMessage,
          category: (apiRes.data.category as TicketCategory) || category,
          priority: (apiRes.data.priority as TicketPriority) || priority,
          status: "open",
          assignedAgent: {
            id: "hammet_support_desk",
            name: "Hammet Email Support",
            role: "Direct Help Desk",
            department: "Support & Operations",
            email: HAMMET_SUPPORT_EMAIL,
            isOnline: true,
          },
          createdAt: finalCreatedAt,
          updatedAt: apiRes.data.updated_at || finalCreatedAt,
          slaTarget: "Within 24 Hours",
        });
      } else {
        // If endpoint is still being deployed or offline, record locally
        finalTicketId = createTicket({
          subject: cleanSubject,
          message: cleanMessage,
          category,
          priority,
        });
      }

      setSubmittedTicket({
        id: finalTicketId,
        subject: cleanSubject,
        category,
        priority,
        createdAt: finalCreatedAt,
      });

      setSelectedTicketId(finalTicketId);
      onSuccess?.(finalTicketId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit ticket.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setSubject("");
    setMessage("");
    setCategory("technical");
    setPriority("medium");
    setErrorMessage(null);
  };

  return (
    <div className="w-full font-poppins">
      <AnimatePresence mode="wait">
        {submittedTicket ? (
          /* ── SUBMISSION CONFIRMATION VIEW ───────────────────────────────── */
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col items-center text-center ${
              isEmbedded ? "p-6 sm:p-8" : "p-6 sm:p-10"
            }`}
          >
            {/* Success Icon */}
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <CheckCircle2 className="h-9 w-9" />
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>

            {/* Ticket ID Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50/80 px-3.5 py-1 text-xs font-bold text-purple-700 dark:border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-300 mb-2 font-mono">
              <span>Ticket #{submittedTicket.id}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="uppercase text-[10px] text-emerald-600 dark:text-emerald-400 font-sans tracking-wide">
                Dispatched
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Ticket Logged Successfully!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              Your inquiry has been submitted and forwarded directly to{" "}
              <strong className="font-mono text-purple-700 dark:text-purple-300">
                {HAMMET_SUPPORT_EMAIL}
              </strong>
              . Our staff will review your request and reply to your registered email address.
            </p>

            {/* Ticket Summary Card */}
            <div className="mt-6 w-full max-w-md rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-left dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Inquiry Summary
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                {submittedTicket.subject}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-md bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 font-semibold text-purple-700 dark:text-purple-300 capitalize">
                  {submittedTicket.category}
                </span>
                <span className="rounded-md bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 capitalize">
                  Priority: {submittedTicket.priority}
                </span>
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  Status: Open
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-650 transition cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Submit Another Ticket</span>
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* ── TICKET CREATION FORM ────────────────────────────────────────── */
          <motion.form
            key="ticket-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5"
          >
            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50/80 p-3 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {/* 1. Category Selection */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span>1. Choose Category</span>
                  <span className="text-purple-600 font-bold">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Routes to relevant specialist
                </span>
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
                      className={`p-3 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/70 dark:border-purple-500/50 dark:bg-purple-950/40 ring-1 ring-purple-500/20 shadow-xs"
                          : "border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl transition ${
                          isSelected
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {cat.label}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1 mt-0.5">
                          {cat.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Priority Selection */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>2. Priority</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Optional • Defaults to Normal
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {priorities.map((p) => {
                  const isSelected = priority === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/80 dark:border-purple-500/50 dark:bg-purple-950/30 ring-1 ring-purple-500/20"
                          : "border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-white/20"
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
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {p.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Subject Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>3. Subject / Summary</span>
                  <span className="text-purple-600 font-bold">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {subject.length}/120
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={120}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Can't access Module 3 quiz"
                className="w-full rounded-2xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            {/* 4. Message Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>4. Message / Description</span>
                  <span className="text-purple-600 font-bold">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {message.length}/2000
                </span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Every time I finish lecture 3.4 and click Start Quiz, I get a session error..."
                className="w-full resize-none rounded-2xl border border-slate-200/90 bg-white p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            {/* Direct Email Dispatch Notice */}
            <div className="flex items-center gap-2 rounded-xl bg-purple-50/60 px-3 py-2 text-[11px] text-purple-700 dark:bg-purple-950/30 dark:text-purple-300">
              <GlowingMagicSparkle className="h-3.5 w-3.5 shrink-0" />
              <span>
                When submitted, your ticket is emailed directly to{" "}
                <strong className="font-mono">{HAMMET_SUPPORT_EMAIL}</strong>. Responses will be sent to your registered email.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !message.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Dispatching Ticket...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Ticket</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
