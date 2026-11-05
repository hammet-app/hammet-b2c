"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Maximize2,
  Timer,
  Hash,
  Send,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useChatStore } from "@/lib/store/use-chat-store";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { channels, activeChannelId } = useChatStore();

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON (BOTTOM RIGHT) ─────────────────────────── */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open Community Chat"
          className="group relative flex h-15 w-15 items-center justify-center transition-all duration-300 select-none"
        >
          {/* Ambient Multi-Layer Glow */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 opacity-40 blur-xl group-hover:opacity-75 transition-opacity animate-pulse dark:opacity-20" />

          {isOpen ? (
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-white shadow-2xl backdrop-blur-xl dark:bg-white dark:text-slate-950">
              <X className="h-6 w-6" />
            </div>
          ) : (
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-purple-400/50 bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 shadow-xl shadow-purple-600/40 backdrop-blur-xl transition-transform group-hover:scale-105 dark:shadow-purple-900/25">
              {/* Floating 3D Bubble Image */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                className="relative h-11 w-11 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
              >
                <Image
                  src="/chat-3d-bubble.png"
                  alt="Community Chat"
                  fill
                  sizes="48px"
                  className="object-contain filter saturate-[1.2]"
                  priority
                />
              </motion.div>

              {/* Unread Message Counter Badge */}
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-black text-white shadow-lg ring-2 ring-white dark:ring-slate-950">
                3
              </span>

              {/* Online Pulse Dot */}
              <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 shadow-sm" />
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* ── EXPANDABLE FLOATING CHAT CARD ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-36 lg:bottom-24 right-3 sm:right-6 z-40 flex h-[520px] max-h-[calc(100vh-10rem)] w-[calc(100vw-1.5rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950"
          >
            {/* Widget Header */}
            <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 dark:border-white/10 dark:bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 shrink-0 drop-shadow">
                  <Image
                    src="/chat-3d-bubble.png"
                    alt="Hammet Chat"
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Hammet Community Chat
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      342 Builders Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/learner/chat"
                  onClick={() => setIsOpen(false)}
                  title="Expand to Fullscreen Page"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Content Area with Underlying Preview + Frosted Glass Blur Overlay */}
            <div className="relative flex-1 overflow-hidden">
              {/* Underlying Mock Chat Feed (Blurred) */}
              <div className="h-full p-4 space-y-3 filter blur-sm select-none pointer-events-none opacity-40">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-[11px] font-bold text-slate-400">
                  <Hash className="h-3 w-3" />
                  <span>general-ai</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      EL
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-2.5 max-w-[80%]">
                      <p className="font-bold text-[10px] text-slate-800 dark:text-slate-200">
                        Dr. Elena Rostova
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Welcome! Our community study sessions on autonomous agent swarms begin this week.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      AL
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/40 rounded-xl p-2.5 max-w-[80%] border border-purple-200/40">
                      <p className="font-bold text-[10px] text-purple-700 dark:text-purple-300">
                        Alex Chen
                      </p>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                        Just deployed the LoRA adapter fine-tuning notebook. Getting 98% recall!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 flex-1">
                    Message #general-ai...
                  </span>
                  <Send className="h-3.5 w-3.5 text-purple-600" />
                </div>
              </div>

              {/* ── FROSTED GLASS COMING SOON OVERLAY ───────────────────────── */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md backdrop-brightness-110">
                <div className="relative mb-3 flex h-14 w-14 items-center justify-center">
                  <div className="relative h-12 w-12 drop-shadow-[0_8px_16px_rgba(144,52,234,0.45)]">
                    <Image
                      src="/chat-3d-bubble.png"
                      alt="3D Chat"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border border-purple-400/50 text-purple-300 shadow">
                    <Timer className="h-3 w-3 animate-pulse" />
                  </span>
                </div>

                <span className="rounded-full bg-purple-500/20 border border-purple-400/30 px-3 py-0.5 text-[10px] font-mono font-bold tracking-widest text-purple-200 uppercase mb-2">
                  Coming Soon // In Development
                </span>

                <h4 className="text-base font-extrabold text-white">
                  Real-Time Community Chat
                </h4>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans max-w-xs">
                  Connect with fellow AI learners, share project repositories, ask code questions, and brainstorm in real-time study channels.
                </p>

                <div className="my-4 flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Encrypted Peer Protocol</span>
                </div>

                <Link
                  href="/learner/chat"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition-colors dark:bg-purple-800/80 dark:border dark:border-purple-500/30 dark:hover:bg-purple-700/80"
                >
                  <span>Explore Full Community Hub</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
