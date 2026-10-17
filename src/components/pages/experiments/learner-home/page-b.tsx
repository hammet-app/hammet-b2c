"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FolderKanban,
  Brain,
  Sparkles,
  Cpu,
  GraduationCap,
  Play,
  Pause,
  Send,
  CheckCircle2,
  Bot,
  Terminal,
  Activity,
  Layers,
  Award,
  Zap,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import {
  NeuroBotIcon,
  TensorCubieIcon,
  MilestoneSignIcon,
  KnowledgeAppleIcon,
  QuantumBulbIcon,
  TerminalDoodleIcon,
} from "@/components/ui/character-icons";

export default function LearnerHomePage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  // State for interactive Bento components
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;
    setIsAnswering(true);
    setTimeout(() => {
      setAiAnswer(
        "Self-attention allows the model to weigh the relevance of all tokens dynamically: Attention(Q,K,V) = softmax(QKᵀ / √dₖ)V. In multi-head setups, this enables parallel representation subspaces."
      );
      setIsAnswering(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-200/80 bg-white/95 px-4 py-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.08)] dark:border-purple-500/30 dark:bg-purple-950/40 dark:shadow-[0_4px_20px_rgba(139,92,246,0.2)]">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            </div>
            <span className="font-poppins text-xs font-semibold tracking-tight text-purple-950 dark:text-purple-200">
              Cohort 2026
            </span>
            <span className="h-1 w-1 rounded-full bg-purple-300 dark:bg-cyan-400/60" />
            <span className="font-poppins text-xs font-medium text-purple-700 dark:text-cyan-300">
              Neural Intelligence Lab
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500/15 to-cyan-500/15 px-2.5 py-0.5 font-poppins text-[10.5px] font-semibold text-purple-800 dark:text-cyan-200 border border-purple-300/30 dark:border-cyan-400/30">
              <Sparkles className="h-3 w-3 text-purple-600 dark:text-cyan-300" />
              Active Lab
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Your personalized intelligence workspace is ready. Pick up right where you left off.
          </p>
        </motion.section>

        {/* Learning hero with AI sketched bot welcoming you - Flush with top border */}
        <div className="relative mb-14 mt-20 sm:mt-24">
          {/* Learning hero card */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative rounded-[28px] bg-[#160B30] p-7 text-white shadow-[0_24px_80px_rgba(76,29,149,0.28)] border border-purple-500/30 sm:p-9 lg:p-11"
          >
            {/* AI sketched bot hanging on top right border welcoming you - Mathematically flush on card top border */}
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.2 }}
              className="absolute top-0 right-6 sm:right-14 -translate-y-[calc(100%-1px)] z-20 pointer-events-none flex flex-col items-end"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mr-3 mb-1.5 rounded-full border border-purple-200/50 bg-white/95 px-3.5 py-1 text-[11px] font-semibold text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur dark:border-cyan-500/30 dark:bg-slate-900/95 dark:text-cyan-300"
              >
                Welcome! Let&apos;s build AI 🤖
              </motion.div>
              <img
                src="/ai-bot-welcome.png"
                alt="AI Assistant bot hanging and welcoming you"
                className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)] select-none pointer-events-none"
              />
            </motion.div>

            {/* Inner background container with overflow-hidden */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
              {/* Background image representing AI & neural networks */}
              <div
                className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-30 mix-blend-screen transition-opacity duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600')`,
                }}
              />

              {/* Neural glow & ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#160B30] via-[#160B30]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160B30]/90 via-transparent to-transparent" />
              <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />

              {/* Subtle glowing AI Neural Core icon at bottom-right corner */}
              <div className="absolute -right-8 -bottom-10 z-0 opacity-15 transition-transform duration-700 hover:scale-105">
                <svg
                  width="280"
                  height="280"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-400 drop-shadow-[0_0_16px_rgba(168,85,247,0.3)] animate-pulse"
                >
                  <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1.75" strokeDasharray="6 4" />
                  <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                  <circle cx="100" cy="40" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <circle cx="100" cy="160" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <circle cx="40" cy="100" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <circle cx="160" cy="100" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <path d="M100 48V76M100 124V152M48 100H76M124 100H152" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-sm">
                  <Brain className="h-3.5 w-3.5 text-cyan-300" />
                  Your first learning journey
                </div>

                <h2 className="max-w-xl text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  School of AI Foundations
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-purple-100/80 sm:text-base">
                  Build your foundation for understanding and working with AI,
                  from mathematical fundamentals to practical everyday autonomous systems.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    4 core courses
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    Beginner → Intermediate
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    Practical projects & labs
                  </span>
                </div>
              </div>

              <div className="flex lg:justify-end">
                <Link
                  href="/learner/ai-schools"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-cyan-200 shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-300/30 hover:scale-[1.02]"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
                  Explore School
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Available AI Schools Section with Glowing Huge Background Icon */}
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-cyan-400">
                Explore Academies
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Available AI Schools
              </h2>
            </div>
            <Link
              href="/learner/ai-schools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
            >
              Browse all schools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-white via-purple-50/20 to-purple-100/10 p-7 shadow-md sm:p-9 dark:border-purple-500/20 dark:from-white/[0.04] dark:via-purple-950/10 dark:to-transparent"
          >
            {/* Subtle Glowing Purple Graduation Cap & Open Book in Bottom Right Corner */}
            <div className="pointer-events-none absolute -right-6 -bottom-8 z-0 opacity-15 dark:opacity-10 transition-transform duration-700 group-hover:scale-105">
              <svg
                width="340"
                height="340"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-purple-600 dark:text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.25)]"
              >
                {/* Mortarboard Cap */}
                <path
                  d="M100 25L175 62L100 99L25 62L100 25Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M50 75V125C50 145 75 160 100 160C125 160 150 145 150 125V75"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M175 62V125C175 130 178 135 182 135C186 135 189 130 189 125V70"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Academic Open Book */}
                <path
                  d="M30 175C55 165 80 168 100 178C120 168 145 165 170 175V135C145 125 120 128 100 138C80 128 55 125 30 135V175Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    Full Diploma Track
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                    4 Core Courses
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    School of AI Foundations
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300 max-w-xl">
                  Comprehensive industry-recognized tracks designed to take you from foundational mathematics and prompt engineering to production autonomous agent architectures.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    60+ Hours of Content
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    44 Hands-on Projects
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Accredited Certificate
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
                <div className="text-left lg:text-right">
                  <p className="text-xs uppercase font-semibold text-slate-400">Complete Academy Tuition</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-950 dark:text-white">₦25,000</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Save 20% Bundle
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <Link
                    href="/learner/ai-schools/ai-foundations"
                    className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/25 transition-all hover:bg-purple-700 hover:scale-[1.02]"
                  >
                    View Curriculum
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── NEW BENTO GRID: AI where your learning happens (from Image 3) ── */}
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-cyan-400">
              Interactive Platform
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl dark:text-white">
              AI where your learning happens.
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base max-w-2xl">
              Turn lecture theories into working production code with intelligent agentic workspaces.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Card 1: AI Research & Lab Notebooks */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-cyan-400">AI Research & Labs</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      Bring models, datasets, and prompt runs into one system of record.
                    </h3>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-white/10 dark:text-slate-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* AI Research & Experiment Runs Table */}
                <div className="mt-6 rounded-2xl border border-black/[0.06] bg-slate-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2 border-b border-black/[0.05] pb-2.5 text-xs font-semibold text-slate-600 dark:border-white/[0.05] dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <TerminalDoodleIcon size="sm" />
                      Model Checkpoints
                    </span>
                    <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      LoRA weights
                    </span>
                    <span className="text-slate-400">• 3 active runs</span>
                  </div>

                  <div className="divide-y divide-black/[0.04] text-xs dark:divide-white/[0.04]">
                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <span>🧪</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Neural Fine-Tuning Lab (Llama-3 8B)
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          PyTorch
                        </span>
                        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                          LoRA
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Autonomous Agent Swarms & MCP Server Traces
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          LangGraph
                        </span>
                        <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-bold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                          Tools
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <span>📊</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          RAG Retrieval Benchmark: Contextual vs Chunking
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          Milvus
                        </span>
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Eval
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating audio lecture pill */}
              <div className="mt-5 flex items-center justify-between rounded-full border border-black/[0.08] bg-white px-4 py-2.5 shadow-sm dark:border-white/10 dark:bg-slate-900/90">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white transition hover:scale-105"
                  >
                    {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                  </button>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Lecture 04: Attention & KV-Cache Compression
                  </span>
                </div>

                {/* Animated waveform bars */}
                <div className="flex items-center gap-0.5 h-4">
                  {[4, 10, 6, 14, 8, 12, 16, 8, 6, 10].map((height, i) => (
                    <motion.span
                      key={i}
                      animate={isPlayingAudio ? { height: [4, 16, 6, 14, 4] } : { height }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
                      className="w-0.5 rounded-full bg-purple-500"
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 2: AI Diagnostics / Evaluation & Citations */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Model Diagnostics</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      Get answers, instantly—with citations.
                    </h3>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-white/10 dark:text-slate-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* AI Benchmark Dashboard Visual */}
                <div className="mt-6 rounded-2xl border border-black/[0.06] bg-slate-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between border-b border-black/[0.05] pb-2 text-xs font-semibold dark:border-white/[0.05]">
                    <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <TensorCubieIcon size="sm" />
                      <span>LLM Benchmark & Accuracy Diagnostics</span>
                    </div>
                    <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-around gap-4 py-2">
                    {/* Gauge */}
                    <div className="flex flex-col items-center">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-emerald-400/40 border-t-emerald-500">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">98.4%</span>
                      </div>
                      <span className="mt-1 text-[10px] font-semibold text-slate-400">GSM8K Eval</span>
                    </div>

                    {/* Bar Chart Visual */}
                    <div className="flex items-end gap-1.5 h-14">
                      <div className="w-2.5 h-8 bg-blue-500 rounded-t" />
                      <div className="w-2.5 h-12 bg-emerald-500 rounded-t" />
                      <div className="w-2.5 h-6 bg-amber-500 rounded-t" />
                      <div className="w-2.5 h-10 bg-purple-500 rounded-t" />
                      <div className="w-2.5 h-14 bg-cyan-400 rounded-t" />
                    </div>

                    {/* Line Sparkline */}
                    <div className="flex flex-col items-center">
                      <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="text-cyan-500">
                        <path d="M2 24L15 14L28 20L42 6L58 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <span className="mt-1 text-[10px] font-semibold text-slate-400">14ms P95 (-34%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Search / Chat Pill */}
              <div className="mt-5">
                <form
                  onSubmit={handleAskAi}
                  className="relative flex items-center rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900/90"
                >
                  <input
                    type="text"
                    value={searchPrompt}
                    onChange={(e) => setSearchPrompt(e.target.value)}
                    placeholder="Ask Hammet AI: 'Explain backpropagation in transformer feedforward layers...'"
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none dark:text-white pr-2"
                  />
                  <button
                    type="submit"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white transition hover:bg-purple-700 hover:scale-105"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </form>

                <AnimatePresence>
                  {aiAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 rounded-xl bg-purple-50 p-2.5 text-[11px] leading-relaxed text-purple-900 dark:bg-purple-950/40 dark:text-purple-200"
                    >
                      <span className="font-bold">AI Citation: </span>
                      {aiAnswer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Card 3: Automate busywork / 24/7 Coding Agents (Spanning full width or 2 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group relative md:col-span-2 overflow-hidden rounded-3xl border border-black/[0.06] bg-amber-50/40 p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Automate busywork</span>
                  <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    Keep work moving 24/7 with agents.
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-lg">
                    Autonomous agents review student code, run test harnesses, and scaffold full-stack applications in the background.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Mini Coding Agent Card */}
                  <div className="flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                    <NeuroBotIcon size="md" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Coding Agent</p>
                      <p className="text-[10px] text-slate-400">Generates AST & tests</p>
                    </div>
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Active
                    </span>
                  </div>

                  {/* Mini Tasks Pill */}
                  <div className="flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                    <QuantumBulbIcon size="sm" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Agent Swarm Traces
                    </span>
                    <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[10px] font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      3 running
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Supporting sections with Huge Glowing Line-Art Icons */}
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Work / Evidence */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Evidence
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                  Your work
                </h2>
              </div>

              <Link
                href="/learner/projects"
                className="hidden items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-800 dark:text-cyan-400 sm:flex"
              >
                View projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.03]">
              {/* Huge glowing Code Terminal & Quantum Flask Icon in Bottom Right */}
              <div className="pointer-events-none absolute -right-6 -bottom-8 z-0 opacity-25 dark:opacity-20 transition-transform duration-700 group-hover:scale-105">
                <svg
                  width="220"
                  height="220"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-600 dark:text-cyan-400 drop-shadow-[0_0_16px_rgba(168,85,247,0.3)] animate-pulse"
                >
                  <rect x="25" y="30" width="150" height="110" rx="14" stroke="currentColor" strokeWidth="3" />
                  <path d="M25 60H175" stroke="currentColor" strokeWidth="2" />
                  <circle cx="45" cy="45" r="3" fill="currentColor" />
                  <circle cx="58" cy="45" r="3" fill="currentColor" />
                  <circle cx="71" cy="45" r="3" fill="currentColor" />
                  <path d="M50 90L70 105L50 120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M85 120H125" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <div className="relative z-10 flex h-full min-h-[164px] flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                    <FolderKanban className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold tracking-[-0.025em]">
                    Nothing here yet.
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Projects you complete on Hammet will appear here as
                    verifiable evidence of what you can build and do.
                  </p>
                </div>

                <p className="mt-6 text-xs font-medium text-slate-400">
                  Your first projects will arrive with School of AI Foundations.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Passport */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
          >
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Identity
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                Digital Passport
              </h2>
            </div>

            <Link
              href="/learner/passport"
              className="group relative block min-h-[220px] overflow-hidden rounded-2xl bg-[#EDE9FE] p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-[#21183A]"
            >
              {/* Huge glowing Accreditation Shield Icon in Bottom Right */}
              <div className="pointer-events-none absolute -right-6 -bottom-8 z-0 opacity-30 dark:opacity-25 transition-transform duration-700 group-hover:scale-105">
                <svg
                  width="220"
                  height="220"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-700 dark:text-purple-300 drop-shadow-[0_0_16px_rgba(147,51,234,0.35)]"
                >
                  <path
                    d="M100 20L160 50V110C160 150 100 180 100 180C100 180 40 150 40 110V50L100 20Z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.05"
                  />
                  <path
                    d="M80 100L95 115L125 85"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="relative z-10 flex h-full min-h-[164px] flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-purple-700 dark:bg-white/[0.08] dark:text-purple-300">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold tracking-[-0.025em]">
                    Your professional record.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Your profile will bring together what you&apos;ve learned,
                    built, and demonstrated.
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold text-purple-700 dark:text-cyan-400">
                  View passport
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </motion.section>
        </div>
      </div>
    </div>
  );
}