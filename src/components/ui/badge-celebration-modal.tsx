"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Sparkles,
  Award,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  X,
  ArrowRight,
} from "lucide-react";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { useAuth } from "@/lib/auth/auth-context";
import { SkillBadgeComponent } from "@/components/ui/skill-badge";

// Confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EC4899", "#3B82F6"];
  const color = colors[index % colors.length];
  const startX = (index * 4.5) % 100;
  const size = 6 + (index % 8);
  const duration = 2.5 + (index % 15) * 0.15;
  const delay = (index % 10) * 0.12;

  return (
    <motion.div
      initial={{
        top: "-5%",
        left: `${startX}%`,
        opacity: 1,
        rotate: 0,
        scale: 0.8,
      }}
      animate={{
        top: "105%",
        left: `${startX + (index % 2 === 0 ? 8 : -8)}%`,
        opacity: [1, 1, 0.8, 0],
        rotate: index % 2 === 0 ? 540 : -540,
        scale: [0.8, 1.2, 0.9],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundColor: color,
        width: `${size}px`,
        height: `${size * 1.5}px`,
        borderRadius: index % 3 === 0 ? "50%" : "2px",
      }}
      className="absolute pointer-events-none z-50"
    />
  );
}

export function BadgeCelebrationModal() {
  const { user } = useAuth();
  const learnerFirstName = user?.fullName?.split(" ")[0] || "Learner";
  const activeBadge = useLearnerStore((state) => state.activeCelebrationBadge);
  const closeCelebration = useLearnerStore((state) => state.closeCelebration);
  const [copied, setCopied] = useState(false);

  if (!activeBadge) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://hammet.ai/verify/badge/${activeBadge.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    `I just earned the verified ${activeBadge.title} credential from Hammet AI Academy! Validated with automated test benchmarks & capstone deployment.`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCelebration}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg"
        />

        {/* Confetti Rain Layer */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {Array.from({ length: 32 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[2.8rem] border border-white/20 bg-gradient-to-b from-white via-white to-purple-50/50 p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] dark:from-[#150D2E] dark:via-[#0F0A1F] dark:to-[#080512] dark:border-white/10 text-slate-900 dark:text-white z-50 text-center"
        >
          {/* Close button */}
          <button
            onClick={closeCelebration}
            className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Top Pill */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/10 px-4 py-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-300 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "6s" }} />
            <span>NEW SKILL CREDENTIAL MINTED!</span>
          </motion.div>

          {/* 3D Stamping Badge Animation */}
          <div className="relative mx-auto my-6 max-w-[260px]">
            {/* Ambient Pulse Shockwave */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-purple-500 blur-2xl"
            />

            {/* Stamp Down Motion */}
            <motion.div
              initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
            >
              <SkillBadgeComponent badge={activeBadge} size="lg" interactive={false} />
            </motion.div>
          </div>

          {/* Congratulatory Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-poppins text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Outstanding Work, {learnerFirstName}! 🎉
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              You&apos;ve proven verifiable production mastery in{" "}
              <strong className="text-purple-600 dark:text-cyan-300 font-extrabold">
                {activeBadge.title}
              </strong>{" "}
              with <span className="font-mono font-bold text-emerald-500">{activeBadge.grade}</span>.
            </p>
          </motion.div>

          {/* Blockchain & DID Proof Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-slate-100/70 dark:bg-black/40 p-3.5 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="truncate">PROOF: {activeBadge.verificationHash}</span>
            </div>
            <button
              onClick={handleCopy}
              className="ml-2 flex items-center gap-1 font-bold text-purple-600 dark:text-cyan-300 hover:underline shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy DID"}
            </button>
          </motion.div>

          {/* Action Buttons: Claim, LinkedIn, Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-col sm:flex-row items-center gap-3"
          >
            {/* Primary Action: Claim & View Passport */}
            <Link
              href="/learner/passport"
              onClick={closeCelebration}
              className="w-full flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 px-6 py-3.5 font-poppins text-sm font-bold text-white shadow-xl shadow-purple-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Claim Badge &amp; View Passport</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Social Sharing: LinkedIn */}
            <a
              href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                activeBadge.title + " - Hammet AI Academy"
              )}&organizationName=Hammet+AI&issueYear=2026&issueMonth=10&certUrl=https://hammet.ai/verify/badge/${activeBadge.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0A66C2] px-5 py-3.5 font-poppins text-sm font-bold text-white shadow-md hover:bg-[#084e96] transition"
            >
              <Share2 className="h-4 w-4" />
              <span>Share to LinkedIn</span>
            </a>
          </motion.div>

          {/* Sub-actions */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=https://hammet.ai/verify/badge/${activeBadge.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600 dark:hover:text-cyan-300 transition-colors"
            >
              Share on X (Twitter) ↗
            </a>
            <span>•</span>
            <Link
              href="/learner/portfolio"
              onClick={closeCelebration}
              className="hover:text-purple-600 dark:hover:text-cyan-300 transition-colors"
            >
              View in Evolving Portfolio ↗
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

