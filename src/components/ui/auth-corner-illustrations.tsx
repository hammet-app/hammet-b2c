"use client";

import React from "react";
import { motion } from "motion/react";
import { DoodlePeekingGirl, DoodlePeekingCoder } from "@/components/ui/open-doodles";
import { cn } from "@/lib/utils/utils";

interface AuthCornerIllustrationProps {
  mode: "register" | "login";
  className?: string;
}

/**
 * AuthCornerIllustration
 * Renders a large, crystal-clear, hand-drawn vector character anchored directly
 * on the bottom-right corner of the Sign In and Sign Up pages.
 *
 * Notes:
 * - The character artwork is drawn inside a 200x130 viewBox but its hands rest
 *   on y=110, so the last 20 units are empty. The wrapper crops to 200x110 and
 *   clips the empty strip, making the hands sit exactly on the viewport edge.
 * - The drawing also has empty side margins, so the artwork is pushed right by
 *   the same ratio to close the gap against the screen edge.
 * - Interactive spring hover micro-motion.
 */
export function AuthCornerIllustration({ mode, className }: AuthCornerIllustrationProps) {
  const isRegister = mode === "register";

  return (
    <motion.aside
      aria-label={isRegister ? "Welcome illustration" : "Welcome back illustration"}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.15 }}
      whileHover={{ y: -8 }}
      className={cn(
        "fixed bottom-0 right-0 z-30 pointer-events-auto select-none",
        "flex flex-col items-end group cursor-pointer",
        className
      )}
    >
      {/* ── SPEECH BUBBLE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 18 }}
        className={cn(
          "relative mb-2 px-3.5 py-1.5 rounded-2xl border text-xs sm:text-sm font-black tracking-wide shadow-xl mr-3",
          "transition-transform duration-300 group-hover:scale-105",
          isRegister
            ? "border-purple-300/80 bg-white/95 text-purple-950 dark:border-purple-400/40 dark:bg-slate-900/95 dark:text-purple-300 shadow-purple-950/10"
            : "border-cyan-300/80 bg-white/95 text-slate-950 dark:border-cyan-400/40 dark:bg-slate-900/95 dark:text-cyan-300 shadow-cyan-950/10"
        )}
      >
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          {isRegister ? (
            <>
              <span>WELCOME!</span>
              <span className="text-base">👋</span>
            </>
          ) : (
            <>
              <span>WELCOME BACK AGAIN!</span>
              <span className="text-base">🎉</span>
            </>
          )}
        </span>

        {/* Speech Bubble Downward Tail Pointer */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -bottom-1.5 right-8 sm:right-10 w-3 h-3 rotate-45 border-b border-r",
            isRegister
              ? "border-purple-300/80 bg-white/95 dark:border-purple-400/40 dark:bg-slate-900/95"
              : "border-cyan-300/80 bg-white/95 dark:border-cyan-400/40 dark:bg-slate-900/95"
          )}
        />
      </motion.div>

      {/* ── VECTOR CHARACTER RESTING ON THE VIEWPORT EDGE ── */}
      {/* Cropped to the y=110 baseline and pushed right by the artwork's empty margin. */}
      <div className="relative aspect-[200/110] w-32 overflow-hidden sm:w-36 lg:w-40 xl:w-44 2xl:w-52">
        {isRegister ? (
          /* Sign Up Character: Friendly Student Girl peeking over the edge */
          <DoodlePeekingGirl
            className="absolute left-0 top-0 h-auto w-full max-w-none translate-x-[22.375%] origin-bottom text-slate-900 transition-transform duration-300 group-hover:scale-[1.02]"
            accentColor="#8B5CF6"
            inkColor="#17131F"
          />
        ) : (
          /* Sign In Character: Welcoming Coder with headphones & glasses peeking over the edge */
          <DoodlePeekingCoder
            className="absolute left-0 top-0 h-auto w-full max-w-none translate-x-[22.375%] origin-bottom text-slate-900 transition-transform duration-300 group-hover:scale-[1.02]"
            accentColor="#06B6D4"
            inkColor="#17131F"
          />
        )}
      </div>
    </motion.aside>
  );
}