"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Share2,
  CheckCircle2,
  Filter,
  Layers,
  ArrowRight,
  BookOpen,
  FolderKanban,
  Check,
  Info,
} from "lucide-react";
import { useLearnerStore, SkillBadge } from "@/lib/store/use-learner-store";
import { SkillBadgeComponent } from "@/components/ui/skill-badge";
import { BadgeCelebrationModal } from "@/components/ui/badge-celebration-modal";

const UPCOMING_BADGES = [
  {
    title: "DPO Alignment Specialist",
    category: "neural",
    desc: "Direct Preference Optimization loss, reference KL penalization, pairwise win rates",
    req: "Complete Generative AI Fundamentals capstone #4",
  },
  {
    title: "Autonomous Financial Swarm",
    category: "agents",
    desc: "4-agent SEC filing extractor with asyncio dispatch and markdown synthesis",
    req: "Complete Building with AI & Agents capstone #5",
  },
  {
    title: "GraphRAG & Neo4j Engineer",
    category: "rag",
    desc: "Multi-hop Cypher queries and hybrid vector traversal across entity knowledge graphs",
    req: "Complete AI Tools for Everyday Work capstone #2",
  },
];

export default function BadgesPage() {
  const badges = useLearnerStore((state) => state.badges);
  const triggerCelebration = useLearnerStore((state) => state.triggerCelebration);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Badges" },
    { id: "neural", label: "Neural & LLMs" },
    { id: "agents", label: "Agentic Swarms" },
    { id: "rag", label: "Vector RAG" },
    { id: "safety", label: "Safety & Guardrails" },
  ];

  const filteredBadges =
    selectedCategory === "all"
      ? badges
      : badges.filter((b) => b.category === selectedCategory);

  return (
    <div className="min-h-screen px-4 pb-28 pt-8 sm:px-6 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* ── TOP HERO HEADER ── */}
        <div className="relative overflow-hidden rounded-[2.8rem] border border-black/[0.08] dark:border-white/10 bg-white/90 dark:bg-[#120E1D]/90 p-8 sm:p-12 shadow-xl backdrop-blur-xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-400/30 px-3.5 py-1 text-xs font-mono font-bold text-purple-700 dark:text-cyan-300 mb-3">
                <Award className="h-4 w-4" />
                <span>CRYPTOGRAPHIC SKILL BADGES</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Verifiable Micro-Credentials
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Hammet AI badges represent proven, code-level competence. Each badge is minted after passing rigorous module tests and deploying functional production capstone projects.
              </p>
            </div>

            {/* Quick Stats Block */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="rounded-2xl border border-black/[0.06] dark:border-white/10 bg-slate-50 dark:bg-black/30 p-4 text-center min-w-[120px]">
                <span className="block text-3xl font-black text-purple-600 dark:text-cyan-400">
                  {badges.length}
                </span>
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  Earned Badges
                </span>
              </div>
              <div className="rounded-2xl border border-black/[0.06] dark:border-white/10 bg-slate-50 dark:bg-black/30 p-4 text-center min-w-[120px]">
                <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  100%
                </span>
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  Verified Proof
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW A USER EARNS BADGES (EXPLANATION BANNER) ── */}
        <div className="mt-8 rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white/70 dark:bg-[#120E1D]/70 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold uppercase text-purple-600 dark:text-cyan-400">
            <Info className="h-4 w-4" />
            <span>HOW DO LEARNERS EARN BADGES?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-black/[0.04] dark:border-white/5 bg-white/80 dark:bg-white/[0.02] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-xs mb-2">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Learn Modules
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Work through comprehensive AI lessons, video walkthroughs, and code repos.
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.04] dark:border-white/5 bg-white/80 dark:bg-white/[0.02] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold text-xs mb-2">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Pass Module Tests
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Score &ge; 75% on technical architecture, coding logic, and algorithmic questions.
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.04] dark:border-white/5 bg-white/80 dark:bg-white/[0.02] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 font-bold text-xs mb-2">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Build Attached Projects
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Each course has 5+ attached capstone projects. Submit your repo and live demo URL.
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.04] dark:border-white/5 bg-white/80 dark:bg-white/[0.02] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold text-xs mb-2">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Claim &amp; Share Badge
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Instant confetti celebration, Merkle DID proof, and one-click export to LinkedIn.
              </p>
            </div>
          </div>
        </div>

        {/* ── CATEGORY FILTER TABS ── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 dark:bg-cyan-500 dark:text-slate-950"
                    : "border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/learner/projects"
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <FolderKanban className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
              <span>Browse Projects</span>
            </Link>
          </div>
        </div>

        {/* ── EARNED BADGES GRID (CERTIFIER RIBBON MEDALLIONS) ── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <SkillBadgeComponent key={badge.id} badge={badge} />
          ))}
        </div>

        {/* ── LOCKED / NEXT BADGES YOU CAN EARN ── */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Upcoming Badges in Your Curriculum
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete the corresponding course projects to unlock these Certifier ribbons.
              </p>
            </div>
            <Link
              href="/learner/learn"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-cyan-400 hover:underline"
            >
              <span>View Enrolled Courses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {UPCOMING_BADGES.map((b, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-3xl border border-dashed border-black/15 dark:border-white/15 bg-white/40 dark:bg-white/[0.01] p-6 text-center opacity-85 hover:opacity-100 transition-opacity"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-200/60 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                  LOCKED
                </span>
                <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {b.desc}
                </p>
                <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/10 text-[11px] font-mono text-purple-600 dark:text-cyan-400 font-semibold">
                  {b.req}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Modal for claim triggers */}
      <BadgeCelebrationModal />
    </div>
  );
}

