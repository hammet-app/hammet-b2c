"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Award,
  BookOpen,
  FolderKanban,
  CheckCircle2,
  Sparkles,
  Terminal,
  Grid,
  FileText,
  Building2,
  Cpu,
  Layers,
  ShieldCheck,
  Edit3,
  Crown,
  ChevronRight,
  Code2,
  Timer,
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { SkillBadgeComponent } from "@/components/ui/skill-badge";
import { SchoolCertificate } from "@/components/ui/school-certificate";

export default function PortfolioPage() {
  const { user } = useAuth();
  const store = useLearnerStore();
  const {
    projects,
    badges,
    moduleTestResults,
    schoolCompleted,
    isPro,
    portfolioTemplate,
    setPortfolioTemplate,
    portfolioBio,
    setPortfolioBio,
  } = store;

  const [copied, setCopied] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(portfolioBio);
  const [activeTab, setActiveTab] = useState<"bento" | "terminal" | "showcase" | "academic">(portfolioTemplate);

  const learnerName = user?.fullName || "Alex Chen";
  const learnerEmail = user?.email || "alex.chen@hammet.dev";

  const completedProjects = projects.filter((p) => p.status === "completed");
  const inProgressProjects = projects.filter((p) => p.status === "in-progress");
  const passedTestsCount = Object.values(moduleTestResults).filter((r) => r.passed).length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://hammet.ai/p/alex-chen");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveBio = () => {
    setPortfolioBio(bioInput);
    setIsEditingBio(false);
  };

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 font-poppins bg-[#F5F3FF] dark:bg-[#0D0A17] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-[1200px]">
        {/* Header & Controls Bar (Hidden during print) */}
        <div className="print:hidden mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-6 dark:border-white/[0.08]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                Evolving Learner Portfolio
              </span>
              <span className="rounded-full bg-purple-500/10 border border-purple-400/30 px-2.5 py-0.5 text-[11px] font-poppins font-bold text-purple-700 dark:text-cyan-300 flex items-center gap-1.5">
                <Timer className="h-3 w-3 animate-pulse text-purple-500" />
                Coming Soon // Dynamic Sync Ready
              </span>
              {isPro && (
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Hammet Pro Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {learnerName}&apos;s Public Portfolio
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Assigned on Day 1. Automatically updates as you complete modules, tests, capstones, and schools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 transition shadow-sm"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? "Link Copied!" : "Share Link"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download / Print PDF 📄</span>
            </button>

            {!isPro && (
              <Link
                href="/learner/pro"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>Unlock Pro Templates</span>
              </Link>
            )}
          </div>
        </div>

        {/* Template Switcher Bar (Hidden during print) */}
        <div className="print:hidden mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white/80 p-3 backdrop-blur-md dark:border-white/[0.06] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2">
              Portfolio Template Style:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "bento", label: "Bento Grid", icon: Grid, desc: "Linear / Modern Vercel" },
              { id: "terminal", label: "Terminal Hacker", icon: Terminal, desc: "Dev CLI / Monospace" },
              { id: "showcase", label: "Silicon Valley", icon: Building2, desc: "Clean Editorial" },
              { id: "academic", label: "Academic Lab", icon: FileText, desc: "NeurIPS Research Style" },
            ].map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = activeTab === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setActiveTab(tpl.id as typeof activeTab);
                    setPortfolioTemplate(tpl.id as typeof activeTab);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all",
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tpl.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PORTFOLIO DISPLAY STAGE (FROSTED BLUR OVERLAY APPLIED) ── */}
        <div className="relative rounded-[2.5rem] overflow-hidden">
          {/* ── UNDERLYING CONTENT (PERMANENTLY BLURRED) ── */}
          <div className="opacity-90 select-none pointer-events-none transition-all duration-500">
            {/* ── TEMPLATE 1: BENTO GRID (LINEAR / VERCEL STYLE) ──────────────── */}
            {activeTab === "bento" && (
          <div className="space-y-6">
            {/* Bento Hero Card */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Card */}
              <div className="md:col-span-2 rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-9 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-2xl font-black text-white shadow-lg shadow-purple-600/30">
                      {learnerName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          {learnerName}
                        </h2>
                        {isPro && (
                          <span title="Hammet Pro Verified" className="text-amber-500">
                            <Crown className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-purple-600 dark:text-cyan-400">
                        Applied AI Engineer & Autonomous Systems Architect
                      </p>
                      <p className="text-[11px] text-slate-400">
                        DID: did:hammet:0x7F2A...4B9E • Lagos & Remote
                      </p>
                    </div>
                  </div>

                  {isEditingBio ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        rows={3}
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-white outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveBio}
                          className="rounded-lg bg-purple-600 px-3 py-1 text-xs font-bold text-white hover:bg-purple-700"
                        >
                          Save Bio
                        </button>
                        <button
                          onClick={() => setIsEditingBio(false)}
                          className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {portfolioBio}
                      </p>
                      <button
                        onClick={() => setIsEditingBio(true)}
                        className="print:hidden mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:underline dark:text-cyan-400"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit Bio</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 dark:border-white/5">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-300"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>github.com/alexchen</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-300"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>linkedin.com/in/alexchen</span>
                  </a>
                  <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available for AI Engineering Roles
                  </span>
                </div>
              </div>

              {/* Verified Metrics Card */}
              <div className="rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                    Hammet Verified Metrics
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    Verified Competency
                  </h3>
                </div>

                <div className="my-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Knowledge Tests</span>
                    <span className="font-bold text-slate-900 dark:text-white">{passedTestsCount} Passed (100% avg)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Completed Capstones</span>
                    <span className="font-bold text-slate-900 dark:text-white">{completedProjects.length} Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Minted Medallions</span>
                    <span className="font-bold text-purple-600 dark:text-cyan-400">{badges.length} Credentials</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Lab Practice Hours</span>
                    <span className="font-bold text-amber-600">42.8 Hours</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-purple-50 p-3 text-center dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-500/20">
                  <p className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-300">
                    Cryptographic Proof Chain
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-purple-600 dark:text-cyan-400 truncate">
                    SHA256: 0x8F91A...33C9
                  </p>
                </div>
              </div>
            </div>

            {/* Minted Skill Badges Bento Section */}
            <div className="rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-9 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                    Physical-Digital Credentials
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Minted Skill Badges & Medallions ({badges.length})
                  </h3>
                </div>
                <Link
                  href="/learner/passport"
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-cyan-400 hover:underline"
                >
                  <span>View in Passport</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {badges.map((badge) => (
                  <SkillBadgeComponent key={badge.id} badge={badge} />
                ))}
              </div>
            </div>

            {/* Featured Verified Projects Section */}
            <div className="rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-9 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                    Verified Portfolio Projects
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Capstone Engineering Implementations ({completedProjects.length})
                  </h3>
                </div>
                <Link
                  href="/learner/projects"
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-cyan-400 hover:underline"
                >
                  <span>All Projects ({projects.length})</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {completedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-black/[0.06] bg-slate-50/50 p-5 dark:border-white/[0.06] dark:bg-white/[0.01] hover:border-purple-300 dark:hover:border-purple-500/40 transition"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                        {project.track}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                        Grade A+ Verified
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {project.title}
                    </h4>

                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300 border border-black/[0.04] dark:border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.submission && (
                      <div className="mt-4 flex items-center gap-4 text-xs font-bold pt-3 border-t border-slate-200/50 dark:border-white/5">
                        <a
                          href={project.submission.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-purple-600 hover:underline dark:text-cyan-400"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          <span>Code Repository</span>
                        </a>
                        <a
                          href={project.submission.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-purple-600 hover:underline dark:text-cyan-400"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Live Service</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* School Certificate Section */}
            <div className="mt-8">
              <SchoolCertificate />
            </div>
          </div>
        )}

        {/* ── TEMPLATE 2: TERMINAL HACKER (DEV CLI STYLE) ────────────────── */}
        {activeTab === "terminal" && (
          <div className="rounded-3xl border border-emerald-500/30 bg-[#090D10] p-6 sm:p-9 font-mono text-emerald-400 shadow-2xl shadow-emerald-950/40">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs text-emerald-500/80">bash — 80x24 — hammet@ai-core</span>
              </div>
              <span className="text-[10px] text-emerald-500/60 font-mono">STATUS: 200 OK</span>
            </div>

            {/* Command 1: whoami */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div>
                <p className="text-emerald-300 font-bold">
                  <span className="text-cyan-400">alex@hammet-node</span>:<span className="text-purple-400">~</span>$ whoami --verbose
                </p>
                <div className="mt-2 pl-4 border-l-2 border-emerald-500/30 text-emerald-300/90 text-xs space-y-1">
                  <p>USER: {learnerName} ({learnerEmail})</p>
                  <p>ROLE: Applied AI Engineer // Stateful Autonomous Agent Systems</p>
                  <p>CRYPTO_ID: did:hammet:0x7F2A...4B9E</p>
                  <p>TIER: {isPro ? "HAMMET_PRO_ACTIVE" : "FREE_TIER_GRADUATE"}</p>
                </div>
              </div>

              {/* Command 2: cat bio.txt */}
              <div className="pt-2">
                <p className="text-emerald-300 font-bold">
                  <span className="text-cyan-400">alex@hammet-node</span>:<span className="text-purple-400">~</span>$ cat bio.txt
                </p>
                <p className="mt-1 pl-4 text-xs text-slate-300">
                  {portfolioBio}
                </p>
              </div>

              {/* Command 3: ls -la credentials/badges/ */}
              <div className="pt-2">
                <p className="text-emerald-300 font-bold">
                  <span className="text-cyan-400">alex@hammet-node</span>:<span className="text-purple-400">~</span>$ ls -la credentials/badges/
                </p>
                <div className="mt-2 pl-4 space-y-2 text-xs">
                  {badges.map((b) => (
                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-emerald-500/10 pb-1.5">
                      <span className="text-cyan-300 font-bold">
                        -rwxr-xr-x 1 alex staff [VERIFIED] {b.title}.badge
                      </span>
                      <span className="text-emerald-400/70 font-mono text-[11px]">
                        HASH: {b.verificationHash} ({b.issued})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Command 4: ./run-audit-tests.sh */}
              <div className="pt-2">
                <p className="text-emerald-300 font-bold">
                  <span className="text-cyan-400">alex@hammet-node</span>:<span className="text-purple-400">~</span>$ ./run-capstone-audits.sh
                </p>
                <div className="mt-2 pl-4 text-xs space-y-1">
                  <p className="text-emerald-400">✓ PyTest Harness: 18/18 passed (0 failures)</p>
                  <p className="text-emerald-400">✓ LangGraph State Rollback: 100% Deterministic</p>
                  <p className="text-emerald-400">✓ Vector Latency: 32ms p99 at 100k scale</p>
                  <p className="text-cyan-300 mt-2 font-bold">[BUILD SUCCESSFUL: Capstone Verified for Production]</p>
                </div>
              </div>

              {/* Cursor Blinking */}
              <div className="pt-4 flex items-center gap-2 text-emerald-400 font-bold">
                <span className="text-cyan-400">alex@hammet-node</span>:<span className="text-purple-400">~</span>$
                <span className="h-4 w-2 bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* ── TEMPLATE 3: SILICON VALLEY SHOWCASE (CLEAN EDITORIAL) ────────── */}
        {activeTab === "showcase" && (
          <div className="rounded-3xl border border-black/[0.08] bg-white p-8 sm:p-12 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] space-y-10">
            {/* Editorial Header */}
            <div className="border-b border-slate-200 pb-8 dark:border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                ENGINEERING DOSSIER • OCTOBER 2026
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {learnerName}
              </h2>
              <p className="mt-3 text-lg font-medium text-purple-600 dark:text-cyan-400 max-w-2xl">
                Building robust, deterministic AI systems with multi-agent orchestration, contextual retrieval, and verifiable proof on ledger.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>📍 Lagos, Nigeria</span>
                <span>•</span>
                <span>🎓 Hammet AI Academy Fellowship</span>
                <span>•</span>
                <span>⚡ Available for Hire</span>
              </div>
            </div>

            {/* Editorial Case Studies */}
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                Featured Production Systems
              </h3>
              <div className="space-y-6">
                {completedProjects.map((p, idx) => (
                  <div key={p.id} className="border-l-2 border-purple-600 pl-6 dark:border-cyan-400">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <span>CASE STUDY 0{idx + 1}</span>
                      <span>—</span>
                      <span className="text-purple-600 dark:text-cyan-400">{p.track}</span>
                    </div>
                    <h4 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                      {p.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.rubric.map((r, rIdx) => (
                        <span key={rIdx} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-white/5 dark:text-slate-300">
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges Grid in Editorial Style */}
            <div className="border-t border-slate-200 pt-8 dark:border-white/10">
              <h3 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                Verified Cryptographic Credentials
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {badges.map((b) => (
                  <SkillBadgeComponent key={b.id} badge={b} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TEMPLATE 4: ACADEMIC LAB (NEURIPS & STANFORD STYLE) ─────────── */}
        {activeTab === "academic" && (
          <div className="rounded-3xl border border-black/[0.08] bg-white p-8 sm:p-14 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] font-serif space-y-8 text-slate-900 dark:text-slate-200">
            {/* Paper Header */}
            <div className="text-center border-b border-slate-200 pb-8 dark:border-white/10 font-sans">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Technical Capstone Portfolio & Benchmark Evaluations
              </h2>
              <div className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span>{learnerName}</span> • <span>Hammet Institute of Artificial Intelligence</span>
              </div>
              <p className="mt-1 font-mono text-xs text-slate-400">
                arXiv:2610.14920 [cs.AI] • Published Oct 2026 • Verified Non-Fungible Credential
              </p>
            </div>

            {/* Abstract */}
            <div className="rounded-2xl bg-slate-50 p-6 text-xs sm:text-sm leading-relaxed dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 font-sans">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                EXECUTIVE ABSTRACT:
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {portfolioBio} All empirical evaluations, parameter-efficient LoRA adapters, LangGraph checkpoints, and hybrid Milvus vector retrieval pipelines described herein have been audited against unit test harnesses and sealed with cryptographic proof hashes.
              </p>
            </div>

            {/* Verified Sections */}
            <div className="space-y-6 font-sans">
              <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b pb-2 dark:border-white/10">
                1. Empirical Research & Deployed Artifacts
              </h3>
              <div className="space-y-4">
                {completedProjects.map((p, idx) => (
                  <div key={p.id} className="text-xs sm:text-sm">
                    <p className="font-bold text-slate-900 dark:text-white">
                      [Paper {idx + 1}] {p.title} ({p.track})
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      {p.description}
                    </p>
                    <p className="font-mono text-[11px] text-purple-600 dark:text-cyan-400 mt-1">
                      DOI: 10.1016/hammet.{p.id}.2026 • Status: Accepted with Grade A+
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Credential Seals */}
            <div className="pt-6 font-sans border-t border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                2. Verifiable Institutional Credentials
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {badges.map((b) => (
                  <SkillBadgeComponent key={b.id} badge={b} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
      </div>
    </div>
  );
}
