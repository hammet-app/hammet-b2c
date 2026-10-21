"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTicketStore, HAMMET_SUPPORT_EMAIL } from "@/lib/store/use-ticket-store";
import { TicketForm } from "./ticket-form";
import { X, Mail } from "lucide-react";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";
import { motion, AnimatePresence } from "motion/react";

export function CreateTicketModal() {
  const { isCreateModalOpen, setIsCreateModalOpen } = useTicketStore();
  const [mounted, setMounted] = useState(false);

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
            {/* Pinned Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/[0.08] bg-slate-50/70 dark:bg-slate-900/90 z-10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>New Support Ticket</span>
                    <GlowingMagicSparkle className="h-3.5 w-3.5 text-purple-600" />
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatched to: <strong className="font-mono text-purple-700 dark:text-purple-300">{HAMMET_SUPPORT_EMAIL}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-white/10 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <TicketForm
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                  // Keep open so learner sees the dispatched ticket confirmation!
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
