"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Lock,
  PlayCircle,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  Code2,
  Check,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  X,
  Search,
  Terminal,
  FolderKanban,
  FileQuestion,
  CheckCheck,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { AiSchoolCourse } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/use-cart";
import { cn } from "@/lib/utils/utils";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { ModuleTestModal } from "@/components/ui/module-test-modal";

interface ModuleData {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  codeSample: string;
  notes: string;
}

const COURSE_MODULES: ModuleData[] = [
  {
    id: "m1",
    number: "01",
    title: "Introduction to AI & Vector Latent Spaces",
    description: "Learn the core foundations of modern Artificial Intelligence, token embeddings, and how latent vector spaces represent human knowledge.",
    duration: "45 mins",
    topics: ["Tokens & Vocabulary", "Embedding Geometries", "Cosine Similarity", "Vector Indexing"],
    codeSample: `# Token vector similarity calculation in PyTorch
import torch
import torch.nn.functional as F

vec_a = torch.tensor([0.45, 0.88, -0.12])
vec_b = torch.tensor([0.42, 0.85, -0.09])

similarity = F.cosine_similarity(vec_a.unsqueeze(0), vec_b.unsqueeze(0))
print(f"Latent Semantic Alignment: {similarity.item():.4f}")
# Output: Latent Semantic Alignment: 0.9982`,
    notes: "Neural representations compress high-dimensional tokens into continuous geometric vectors. The closer two thoughts align in cosine distance, the stronger their semantic association.",
  },
  {
    id: "m2",
    number: "02",
    title: "Transformer Architectures & Self-Attention Math",
    description: "Deconstruct Multi-Head Self-Attention, Query-Key-Value matrices, Positional Encoding, and Feed-Forward layer dynamics.",
    duration: "1h 15m",
    topics: ["Scaled Dot-Product", "Q, K, V Projections", "Causal Masking", "Layer Normalization"],
    codeSample: `# Scaled Dot-Product Attention in Python
import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    attention_weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)
    return np.matmul(attention_weights, V), attention_weights

print("Multi-head attention weights computed across sequence context.")`,
    notes: "Self-attention enables tokens to dynamically weigh relevance across the entire sequence context simultaneously without recurrent state bottlenecks.",
  },
  {
    id: "m3",
    number: "03",
    title: "Generative Systems & Retrieval-Augmented Generation (RAG)",
    description: "Architect production retrieval pipelines using chunking algorithms, hybrid keyword-vector search, re-ranking models, and hallucination audits.",
    duration: "2h 30m",
    topics: ["Document Chunking", "Hybrid Retrieval", "Cross-Encoder Re-Ranking", "Context Guardrails"],
    codeSample: `# Production Hybrid RAG Pipeline Orchestrator
async def retrieve_and_synthesize(query: str, top_k: int = 5):
    dense_hits = await vector_store.similarity_search(query, k=top_k)
    sparse_hits = await bm25_index.search(query, k=top_k)
    merged_contexts = reciprocal_rank_fusion(dense_hits, sparse_hits)
    return await llm_generate_with_citations(query, contexts=merged_contexts)

print("Synthesized verified grounding with zero-hallucination guardrail.")`,
    notes: "RAG grounds probabilistic generation onto deterministic external knowledge bases, transforming LLMs from isolated calculators into factual enterprise advisors.",
  },
  {
    id: "m4",
    number: "04",
    title: "Autonomous Agents & Multi-Tool Execution",
    description: "Design stateful AI agent loops with LangGraph, deterministic checkpointing, external API execution, and human-in-the-loop safety switches.",
    duration: "1h 45m",
    topics: ["Agent State Graphs", "Tool Schema Reflection", "Error Recovery Cycles", "Subagent Delegations"],
    codeSample: `# Autonomous Multi-Tool Agent Execution Loop
while agent_state.is_active and iteration < MAX_TURNS:
    next_action = model.decide_next_step(agent_state.history)
    if next_action.is_terminal:
        break
    result = execute_sandboxed_tool(next_action.tool_name, next_action.args)
    agent_state.append_observation(result)

print("Agent loop concluded successfully with deterministic checkpoints.")`,
    notes: "Agents elevate LLMs from conversational chatbots into autonomous actors capable of inspecting codebases, executing tests, and safely verifying real-world tasks.",
  },
];

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { accessToken, refreshToken } = useAuth();
  const { addItem, hasItem, hasPaidItem } = useCart();
  
  const [course, setCourse] = useState<AiSchoolCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Completed modules tracking
  const [completedModules, setCompletedModules] = useState<string[]>(["m1"]);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");
  
  // Interactive Module Studio Modal
  const [activeModule, setActiveModule] = useState<ModuleData | null>(null);
  const [studioTab, setStudioTab] = useState<"video" | "code" | "notes">("video");
  const [isPlaying, setIsPlaying] = useState(false);

  // Locked Course Prompt Modal
  const [showLockedModal, setShowLockedModal] = useState(false);

  // Module Test Questions Modal
  const [activeTestModule, setActiveTestModule] = useState<ModuleData | null>(null);
  const [projectActionNotice, setProjectActionNotice] = useState<string | null>(null);

  // Learner Store
  const storeProjects = useLearnerStore((state) => state.projects);
  const startProject = useLearnerStore((state) => state.startProject);
  const moduleTestResults = useLearnerStore((state) => state.moduleTestResults);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || !courseId) return;

    async function fetchCourse() {
      try {
        setLoading(true);
        if (accessToken) {
          const schoolsData = await learnerApi.getAiSchools(accessToken, refreshToken);
          let foundCourse: AiSchoolCourse | null = null;
          
          for (const school of schoolsData.aiSchools) {
            const courseData = await learnerApi.getAiSchoolCourses(school.id, accessToken, refreshToken);
            const match = courseData.courses.find((c) => c.id === courseId);
            if (match) {
              foundCourse = match;
              break;
            }
          }

          if (foundCourse) {
            setCourse(foundCourse);
            setError(null);
            return;
          }
        }

        setCourse({
          id: courseId,
          title: "Introduction to Artificial Intelligence & Modern LLMs",
          description: "A comprehensive deep dive into attention mechanisms, stateful multi-agent systems, and production engineering with modern LLMs.",
          price: 25000,
          aiSchoolId: "school-ai-foundations",
          slug: "advanced-ai",
          position: 1,
        });
        setError(null);
      } catch {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, accessToken, refreshToken, mounted]);

  if (!mounted) return null;

  // Strict payment gating: Free or Paid
  const isFree = course ? (course.price || 0) === 0 : false;
  const isPaid = course ? (hasPaidItem(course.id) || hasPaidItem(course.aiSchoolId)) : false;
  const isEnrolled = isFree || isPaid;
  const inCart = course ? hasItem(course.id) : false;

  const handleStartOrModuleClick = (mod?: ModuleData) => {
    if (!isEnrolled) {
      setShowLockedModal(true);
      return;
    }
    setActiveModule(mod || COURSE_MODULES[0]);
    setIsPlaying(true);
  };

  const handleCompleteCurrentModule = () => {
    if (!activeModule) return;
    if (!completedModules.includes(activeModule.id)) {
      setCompletedModules((prev) => [...prev, activeModule.id]);
    }
    const currentIndex = COURSE_MODULES.findIndex((m) => m.id === activeModule.id);
    if (currentIndex < COURSE_MODULES.length - 1) {
      setActiveModule(COURSE_MODULES[currentIndex + 1]);
    } else {
      setActiveModule(null);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-[1080px]">
        {/* Back Link */}
        <button 
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Curriculum</span>
        </button>

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-48 rounded-3xl bg-white/[0.6] dark:bg-white/[0.03]" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-white/[0.6] dark:bg-white/[0.03]" />)}
            </div>
          </div>
        ) : error || !course ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-500/20 dark:bg-red-500/[0.05]">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-200">Unable to load course</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error || "Course details not found."}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Main Course Content */}
            <div>
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl border border-black/[0.06] bg-white p-7 sm:p-9 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] mb-8"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    AI Specialized Course
                  </span>
                  {isEnrolled ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Enrolled & Ready
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Enrollment Required
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {course.title}
                </h1>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {course.description}
                </p>

                {/* Key Metrics Chips */}
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-5 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                    <span>6h 15m Total Duration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                    <span>4 Intensive Modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                    <span>Verified Skill Credential</span>
                  </div>
                </div>
              </motion.div>

              {/* Modules List */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Course Curriculum &amp; Modules
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {completedModules.length} of {COURSE_MODULES.length} Completed
                  </span>
                </div>

                {/* ── COURSE MODULE SEARCH BAR ───────────────────────── */}
                <div className="relative mb-4">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search module titles, lecture topics, or code concepts..."
                    value={moduleSearchQuery}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-black/[0.08] bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500"
                  />
                  {moduleSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setModuleSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {COURSE_MODULES.filter((mod) => {
                  if (!moduleSearchQuery.trim()) return true;
                  const query = moduleSearchQuery.toLowerCase();
                  return (
                    mod.title.toLowerCase().includes(query) ||
                    mod.description.toLowerCase().includes(query) ||
                    mod.topics.some((t) => t.toLowerCase().includes(query))
                  );
                }).length === 0 ? (
                  <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <Search className="mx-auto mb-3 h-7 w-7 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No modules matched &ldquo;{moduleSearchQuery}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => setModuleSearchQuery("")}
                      className="mt-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  COURSE_MODULES.filter((mod) => {
                    if (!moduleSearchQuery.trim()) return true;
                    const query = moduleSearchQuery.toLowerCase();
                    return (
                      mod.title.toLowerCase().includes(query) ||
                      mod.description.toLowerCase().includes(query) ||
                      mod.topics.some((t) => t.toLowerCase().includes(query))
                    );
                  }).map((mod, i) => {
                  const isCompleted = completedModules.includes(mod.id);
                  const testResult = moduleTestResults[mod.id];

                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-200",
                        isEnrolled
                          ? "border-black/[0.06] bg-white hover:border-purple-300 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-purple-500/40"
                          : "border-black/[0.05] bg-slate-50/60 opacity-85 hover:opacity-100 dark:border-white/[0.04] dark:bg-white/[0.01]"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          onClick={() => handleStartOrModuleClick(mod)}
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-sm transition cursor-pointer",
                            isCompleted
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                              : isEnrolled
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 group-hover:scale-105"
                              : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : isEnrolled ? (
                            <PlayCircle className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                                MODULE {mod.number}
                              </span>
                              {isCompleted && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                  Completed
                                </span>
                              )}
                              {testResult?.passed && (
                                <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300 flex items-center gap-1">
                                  <CheckCheck className="h-3 w-3" />
                                  Test Passed ({testResult.score}/{testResult.totalQuestions})
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-slate-400">
                              {mod.duration}
                            </span>
                          </div>

                          <h3 
                            onClick={() => handleStartOrModuleClick(mod)}
                            className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors cursor-pointer"
                          >
                            {mod.title}
                          </h3>

                          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {mod.description}
                          </p>

                          {/* Topic tags */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {mod.topics.map((t, idx) => (
                              <span
                                key={idx}
                                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Interactive Action Pills */}
                          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-black/[0.04] dark:border-white/[0.05]">
                            <button
                              type="button"
                              onClick={() => handleStartOrModuleClick(mod)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-300 transition"
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              <span>Lecture & Sandbox</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (!isEnrolled) {
                                  setShowLockedModal(true);
                                  return;
                                }
                                setActiveTestModule(mod);
                              }}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition",
                                testResult?.passed
                                  ? "border border-emerald-500/30 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300 hover:bg-emerald-100"
                                  : "border border-purple-200 bg-white text-purple-700 hover:bg-purple-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-cyan-300 dark:hover:bg-white/[0.06]"
                              )}
                            >
                              <FileQuestion className="h-3.5 w-3.5" />
                              <span>
                                {testResult?.passed
                                  ? `Retake Knowledge Test (${testResult.score}/${testResult.totalQuestions})`
                                  : "Take Knowledge Test 📝"}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div 
                          onClick={() => handleStartOrModuleClick(mod)}
                          className="hidden sm:flex items-center self-center text-slate-300 group-hover:text-purple-600 dark:text-slate-600 dark:group-hover:text-cyan-400 transition cursor-pointer"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

              {/* ── ATTACHED COURSE PROJECTS & PORTFOLIO LABS ───────────────────── */}
              <div className="mt-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      <FolderKanban className="h-3.5 w-3.5" />
                      Course Projects ({storeProjects.length >= 5 ? 5 : storeProjects.length} Available)
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Attached Hands-On Projects
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                      Each course includes 5+ projects that test your mastery. Starting a project automatically adds it to your <Link href="/learner/projects" className="underline font-semibold text-purple-600 dark:text-cyan-400 hover:opacity-80">Projects Workspace</Link> where you can launch cloud GPU sandboxes and submit for verifiable badges.
                    </p>
                  </div>

                  <Link
                    href="/learner/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-cyan-400 transition shrink-0"
                  >
                    <span>View All in Projects Workspace</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {projectActionNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{projectActionNotice}</span>
                    </div>
                    <Link
                      href="/learner/projects"
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                    >
                      Open Workspace →
                    </Link>
                  </motion.div>
                )}

                <div className="grid gap-4 sm:grid-cols-1">
                  {storeProjects.slice(0, 5).map((project, idx) => {
                    const isStarted = project.status !== "not-started";
                    const isDone = project.status === "completed";

                    return (
                      <div
                        key={project.id}
                        className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition hover:border-purple-300 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-purple-500/40"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                                Project #{idx + 1} • {project.track}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                                  project.level === "Production"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                                    : project.level === "Advanced"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                                    : project.level === "Intermediate"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                )}
                              >
                                {project.level}
                              </span>
                              {isDone ? (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Completed & Verified
                                </span>
                              ) : isStarted ? (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                                  In Progress ({project.progress}%)
                                </span>
                              ) : (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                                  Ready to Start
                                </span>
                              )}
                            </div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              {project.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {project.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-black/[0.04]">
                            <span className="text-[11px] font-semibold text-slate-400">
                              ~{project.estimatedHours} hrs build time
                            </span>

                            {isDone ? (
                              <Link
                                href="/learner/projects"
                                className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 transition"
                              >
                                View Badge ✓
                              </Link>
                            ) : isStarted ? (
                              <Link
                                href="/learner/projects"
                                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shadow-sm transition"
                              >
                                Continue in Workspace →
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!isEnrolled) {
                                    setShowLockedModal(true);
                                    return;
                                  }
                                  startProject(project.id);
                                  setProjectActionNotice(`"${project.title}" has been started and added to your Projects Workspace at /learner/projects!`);
                                }}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-purple-600 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-300 shadow-sm transition"
                              >
                                Start Project ⚡
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Enrollment / Action Card */}
            <div>
              <div className="sticky top-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="mb-6">
                  {isEnrolled ? (
                    <div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Enrolled in Course</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Lifetime license active. Start or resume any module.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                        Enrollment Investment
                      </span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          ₦{(course.price || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₦35,000
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Full access to all 4 modules, coding labs, and certified badge.
                      </p>
                    </div>
                  )}
                </div>

                {isEnrolled ? (
                  <Button
                    onClick={() => handleStartOrModuleClick()}
                    size="lg"
                    className="w-full rounded-xl bg-purple-600 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    <span>Start Course</span>
                  </Button>
                ) : inCart ? (
                  <Button
                    onClick={() => router.push("/learner/checkout")}
                    size="lg"
                    className="w-full rounded-xl bg-slate-900 font-bold text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    <span>Proceed to Checkout →</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      addItem({
                        id: course.id,
                        type: "course",
                        title: course.title,
                        price: course.price || 0,
                        schoolId: course.aiSchoolId,
                      });
                      router.push("/learner/checkout");
                    }}
                    size="lg"
                    className="w-full rounded-xl bg-purple-600 font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  >
                    <span>Unlock Course • Pay ₦{(course.price || 0).toLocaleString()}</span>
                  </Button>
                )}

                {/* Features List */}
                <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-600 dark:border-white/5 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>4 Hands-on Interactive Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Runnable Python & PyTorch Code Labs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Verifiable Skill Passport Credential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>14-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── LOCKED COURSE PROMPT MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {showLockedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLockedModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-black/[0.08] bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#151026]"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 shadow-sm">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white">
                Course Enrollment Required
              </h3>
              <p className="mt-2 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                You cannot start this course until payment is completed. Enroll to unlock all 4 modules, runnable PyTorch sandboxes, and your official credential.
              </p>
              
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  onClick={() => {
                    if (course) {
                      addItem({
                        id: course.id,
                        type: "course",
                        title: course.title,
                        price: course.price || 0,
                        schoolId: course.aiSchoolId,
                      });
                    }
                    setShowLockedModal(false);
                    router.push("/learner/checkout");
                  }}
                  className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                >
                  Proceed to Checkout • ₦{(course?.price || 0).toLocaleString()}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLockedModal(false)}
                  className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── INTERACTIVE MODULE LEARNING STUDIO MODAL ──────────────────────────── */}
      <AnimatePresence>
        {activeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModule(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative flex flex-col h-[90vh] w-full max-w-4xl rounded-3xl border border-black/[0.08] bg-white shadow-2xl dark:border-white/10 dark:bg-[#120E1F] overflow-hidden"
            >
              {/* Studio Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-mono font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                    MODULE {activeModule.number}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {activeModule.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModule(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Studio Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/70 px-6 dark:border-white/5 dark:bg-white/[0.02]">
                <button
                  onClick={() => setStudioTab("video")}
                  className={cn(
                    "flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition",
                    studioTab === "video"
                      ? "border-purple-600 text-purple-700 dark:border-cyan-400 dark:text-cyan-300"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Video Lecture</span>
                </button>
                <button
                  onClick={() => setStudioTab("code")}
                  className={cn(
                    "flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition",
                    studioTab === "code"
                      ? "border-purple-600 text-purple-700 dark:border-cyan-400 dark:text-cyan-300"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  <span>Code Lab Sandbox</span>
                </button>
                <button
                  onClick={() => setStudioTab("notes")}
                  className={cn(
                    "flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition",
                    studioTab === "notes"
                      ? "border-purple-600 text-purple-700 dark:border-cyan-400 dark:text-cyan-300"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Lesson Notes & Theory</span>
                </button>
              </div>

              {/* Studio Body Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {studioTab === "video" && (
                  <div className="space-y-4">
                    {/* Simulated High-Res Video Player */}
                    <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden shadow-xl flex items-center justify-center border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/90 text-white shadow-2xl hover:scale-105 transition hover:bg-purple-500"
                      >
                        {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
                      </button>

                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                        <span className="font-mono">14:28 / {activeModule.duration}</span>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold">1080p 60fps</span>
                          <span className="rounded bg-purple-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">Speed: 1.0x</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{activeModule.title}</h4>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activeModule.description}</p>
                    </div>
                  </div>
                )}

                {studioTab === "code" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-purple-600 dark:text-cyan-400">
                        Interactive Python Sandbox
                      </span>
                      <span className="text-xs text-slate-400">Python 3.11 • PyTorch 2.3</span>
                    </div>
                    <pre className="overflow-x-auto rounded-2xl bg-[#0B0813] p-5 font-mono text-xs leading-relaxed text-emerald-400 border border-white/10 shadow-inner">
                      <code>{activeModule.codeSample}</code>
                    </pre>
                  </div>
                )}

                {studioTab === "notes" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-purple-50 p-5 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-500/20">
                      <h4 className="font-bold text-sm text-purple-900 dark:text-purple-200 mb-1">
                        Mathematical & Conceptual Insights
                      </h4>
                      <p className="text-xs sm:text-sm text-purple-950 dark:text-purple-300 leading-relaxed">
                        {activeModule.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Studio Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
                <Button
                  variant="outline"
                  onClick={() => setActiveModule(null)}
                  className="rounded-xl"
                >
                  Close Studio
                </Button>
                <Button
                  onClick={handleCompleteCurrentModule}
                  className="rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span>Mark Completed & Next</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODULE KNOWLEDGE TEST MODAL ─────────────────────────────────────── */}
      {activeTestModule && (
        <ModuleTestModal
          moduleId={activeTestModule.id}
          moduleNumber={activeTestModule.number}
          moduleTitle={activeTestModule.title}
          isOpen={!!activeTestModule}
          onClose={() => setActiveTestModule(null)}
        />
      )}
    </div>
  );
}
