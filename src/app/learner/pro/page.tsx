"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Check,
  Zap,
  ShieldCheck,
  Cpu,
  Briefcase,
  Code2,
  ArrowRight,
  ExternalLink,
  Layers,
  Flame,
  Award,
  Globe,
  Palette,
  Terminal,
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { SkillBadgeComponent } from "@/components/ui/skill-badge";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";

export default function HammetProPage() {
  const {
    isPro,
    togglePro,
    proPassportTheme,
    setProPassportTheme,
    badges,
  } = useLearnerStore();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [successToast, setSuccessToast] = useState(false);

  const sampleBadge = badges[0] || {
    id: "sample-pro-badge",
    title: "Autonomous Agent Architect",
    category: "agents" as const,
    desc: "Stateful multi-agent systems with LangGraph, SQLite checkpoints & tool execution",
    issued: "Oct 2026",
    status: "Verified" as const,
    grade: "Grade A+" as const,
    verificationHash: "0x7F2A...4B9E",
    skills: ["LangGraph", "Tool Calling", "MCP Protocol", "State Persistence"],
    projectTitle: "Autonomous Support Swarm with Tool Calling & Human-in-the-Loop",
    accentColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.45)",
    iconType: "agent" as const,
  };

  const handleTogglePro = () => {
    togglePro();
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 font-poppins bg-[#F5F3FF] dark:bg-[#0D0A17] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-[1140px]">
        {/* Floating Success Toast */}
        <AnimatePresence>
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 right-8 z-50 flex items-center gap-3 rounded-2xl border border-amber-400 bg-amber-500/95 px-5 py-3.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md"
            >
              <Crown className="h-5 w-5 shrink-0" />
              <span>
                {isPro
                  ? "🎉 Welcome to Hammet Pro! Your recruiter badge and custom themes are active."
                  : "Hammet Pro status toggled to Standard Learner."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-4 shadow-sm">
            <Crown className="h-3.5 w-3.5" />
            <span>Hammet Pro Fellowship & Career Accelerator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            Supercharge Your AI Credential & <span className="bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 bg-clip-text text-transparent">Career Radar</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Gain an edge in your AI learning journey. Unlock custom passport credential themes, verified recruiter badges, interactive hands-on coding sandboxes, and developer portfolio templates.
          </p>

          {/* Current Membership Status Badge */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white px-5 py-2.5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className={cn("h-3 w-3 rounded-full animate-pulse", isPro ? "bg-amber-500" : "bg-slate-400")} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Current Membership:{" "}
              <strong className={isPro ? "text-amber-600 dark:text-amber-400" : "text-slate-500"}>
                {isPro ? "Hammet Pro Active (Annual)" : "Standard Free Learner"}
              </strong>
            </span>
            <button
              onClick={handleTogglePro}
              className="ml-2 rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition"
            >
              {isPro ? "Deactivate (Simulate)" : "Simulate Instant Pro Upgrade ⚡"}
            </button>
          </div>
        </div>

        {/* Pricing Toggle Bar */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition",
              billingCycle === "monthly"
                ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            Billed Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition",
              billingCycle === "annually"
                ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <span>Billed Annually</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
              SAVE 20%
            </span>
          </button>
        </div>

        {/* Pricing Plan Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-16 max-w-4xl mx-auto">
          {/* Standard Free Card */}
          <div className="rounded-3xl border border-black/[0.08] bg-white p-8 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Standard Learner
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                  Active by Default
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₦0</span>
                <span className="text-xs text-slate-400">/ forever free</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Complete access to course curriculum, standard skill tests, and basic portfolio builder.
              </p>

              <div className="space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-600 dark:border-white/5 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Full Course Curriculum & Theory</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Module Knowledge Tests & Quizzes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>School Completion Certificate (when finished)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Standard Bento Portfolio Template</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <span className="text-slate-300 dark:text-slate-600">—</span>
                  <span>Recruiter Direct Radar Badge</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <span className="text-slate-300 dark:text-slate-600">—</span>
                  <span>Custom Holographic Passport Themes</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                disabled={!isPro}
                onClick={handleTogglePro}
                className="w-full rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white transition"
              >
                {!isPro ? "Current Plan" : "Downgrade to Standard"}
              </button>
            </div>
          </div>

          {/* Pro Membership Card */}
          <div className="relative rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/[0.04] to-transparent p-8 shadow-xl dark:border-amber-400/40 dark:bg-amber-950/[0.08] flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              RECOMMENDED FOR JOB SEEKERS
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Crown className="h-4 w-4" />
                  Hammet Pro Fellowship
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ₦{billingCycle === "annually" ? "1,600" : "2,000"}
                </span>
                <span className="text-xs text-slate-400">
                  / month {billingCycle === "annually" ? "(billed ₦19,200/yr)" : "(billed ₦2,000 monthly)"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Unlocks custom passport styling, recruiter search prominence, 4 developer portfolio themes, and interactive AI practice sandboxes.
              </p>

              <div className="space-y-3 border-t border-amber-500/20 pt-5 text-xs text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2.5 font-semibold text-amber-700 dark:text-amber-300">
                  <Crown className="h-4 w-4 shrink-0" />
                  <span>Gold Recruiter Search Radar & Talent Directory Badge</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold">
                  <Palette className="h-4 w-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                  <span>3 Custom Passport Themes (Gold, Holographic, Obsidian)</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold">
                  <Terminal className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>All 4 Developer Portfolio Templates (Terminal, Academic, etc.)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-4 w-4 text-cyan-500 shrink-0" />
                  <span>Interactive Hands-on AI Coding Sandboxes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>1-on-1 Capstone Architecture Reviews by Staff Engineers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Zero-Delay Cryptographic DID Stamping on Ledger</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleTogglePro}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700 transition"
              >
                {isPro ? "✓ Pro Active • Manage Membership" : "Upgrade to Hammet Pro ⚡"}
              </button>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE PASSPORT THEME CUSTOMIZER (PRO FEATURE) ────────────── */}
        <div className="rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-10 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                <Palette className="h-3.5 w-3.5" />
                Pro Customization Lab
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Interactive Skill Passport Theme Selector
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Pro members can personalize their credential aesthetic. Select a theme below to test drive its physical-digital medallion finish.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "gold", label: "Neural Gold", desc: "24k Bevel & Radial Guilloche" },
                { id: "holographic", label: "Cyber Holographic", desc: "Prism Rainbow Sheen" },
                { id: "obsidian", label: "Obsidian Stealth", desc: "Dark PVD & Circuit Traces" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setProPassportTheme(theme.id as typeof proPassportTheme)}
                  className={cn(
                    "flex flex-col items-start rounded-xl px-3.5 py-2 text-left text-xs font-bold transition-all",
                    proPassportTheme === theme.id
                      ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-950"
                      : "border border-black/[0.08] text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  )}
                >
                  <span>{theme.label}</span>
                  <span className="text-[10px] font-normal opacity-70">{theme.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="relative rounded-2xl border border-black/[0.06] bg-slate-50/70 p-6 sm:p-8 dark:border-white/[0.06] dark:bg-[#120E1F] flex flex-col items-center justify-center overflow-hidden">
            <div className="mb-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Live Theme Preview:{" "}
                <strong className="text-purple-600 dark:text-cyan-400 uppercase">
                  {proPassportTheme}
                </strong>
              </span>
            </div>

            <div className="relative max-w-xs w-full flex items-center justify-center">
              <div className="filter blur-md select-none pointer-events-none opacity-35 w-full flex justify-center">
                <SkillBadgeComponent badge={sampleBadge} />
              </div>

              {/* Frosted Glass Overlay with Coming Soon tag */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center bg-slate-950/80 dark:bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 shadow-lg shadow-purple-500/20 mb-2">
                  <GlowingMagicSparkle size="lg" className="animate-pulse" />
                </div>

                <span className="rounded-full bg-purple-600/30 border border-purple-400/40 px-3 py-1 text-[10px] font-poppins font-bold tracking-widest text-purple-200 uppercase mb-2 shadow-sm">
                  COMING SOON • UNDER ACCREDITATION
                </span>

                <h4 className="text-base font-black tracking-tight text-white font-poppins">
                  Skill Badges Coming Soon
                </h4>

                <p className="mt-1 text-[11px] text-slate-200 font-medium font-poppins max-w-xs leading-relaxed">
                  Pro-tier skill badge minting and dynamic credential themes are undergoing official accreditation.
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400 max-w-sm">
              All your minted skill badges in <Link href="/learner/passport" className="underline font-semibold text-purple-600 dark:text-cyan-400">Skill Passport</Link> and <Link href="/learner/portfolio" className="underline font-semibold text-purple-600 dark:text-cyan-400">Public Portfolio</Link> render with this finish.
            </p>
          </div>
        </div>

        {/* ── DETAILED RECRUITER BENEFIT BREAKDOWN ──────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          <div className="rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 mb-4">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Recruiter Direct Radar
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Leading AI startups and Fortune 500 engineering recruiters search the Hammet Talent Directory. Pro profiles appear at the top of candidate shortlists with verified skill scores.
            </p>
          </div>

          <div className="rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Interactive AI Practice Labs
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Learn by doing directly in your browser. No complex terminal setup, driver installations, or expensive hardware needed — start writing, testing, and running practical AI models instantly.
            </p>
          </div>

          <div className="rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Custom Domain Portfolio
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connect your own custom domain (e.g. <code className="font-mono text-purple-600 dark:text-cyan-400">alexchen.dev</code>) or use a custom vanity URL with 1-click SSL and instant PDF export.
            </p>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to Accelerate Your AI Engineering Career?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join hundreds of applied AI fellows building production-grade autonomous swarms and enterprise RAG systems.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleTogglePro}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700 transition"
            >
              {isPro ? "✓ Pro Active • View Portfolio" : "Join Hammet Pro Fellowship ⚡"}
            </button>
            <Link
              href="/learner/portfolio"
              className="rounded-xl border border-black/[0.1] bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/15 dark:hover:text-white transition shadow-xs"
            >
              View Your Portfolio →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

