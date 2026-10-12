"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderKanban,
  ExternalLink,
  Play,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Upload,
  AlertCircle,
  Terminal,
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import {
  NeuroBotIcon,
  TensorCubieIcon,
  KnowledgeAppleIcon,
  QuantumBulbIcon,
  TerminalDoodleIcon,
} from "@/components/ui/character-icons";

interface Project {
  id: string;
  title: string;
  track: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  description: string;
  tags: string[];
  status: "completed" | "in-progress" | "not-started";
  progress: number;
  icon: React.ReactNode;
  rubric: string[];
}

const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Autonomous Support Swarm with Tool Calling & Human-in-the-Loop",
    track: "Autonomous Agents",
    level: "Intermediate",
    estimatedHours: 12,
    description:
      "Design and deploy an asynchronous multi-agent support orchestrator with LangGraph, SQLite checkpointing, and tool execution guardrails.",
    tags: ["LangGraph", "FastAPI", "OpenAI Tools", "Docker"],
    status: "in-progress",
    progress: 75,
    icon: <NeuroBotIcon size="md" />,
    rubric: [
      "Deterministic state recovery across process crashes",
      "Strict schema validation on external tool arguments",
      "Average execution latency under 1.4 seconds",
    ],
  },
  {
    id: "proj-2",
    title: "Domain-Adapted Llama 3 8B Fine-Tuning with Unsloth & LoRA",
    track: "Neural Fine-Tuning",
    level: "Advanced",
    estimatedHours: 16,
    description:
      "Curate instruction datasets, calculate token perplexity, and train rank-16 parameter-efficient adapters on local GPUs with 4-bit quantization.",
    tags: ["PyTorch", "HuggingFace", "Weights & Biases", "CUDA"],
    status: "completed",
    progress: 100,
    icon: <TensorCubieIcon size="md" />,
    rubric: [
      "Loss convergence verified below 0.85 without catastrophic forgetting",
      "Adapter exported to GGUF format for Ollama runtime",
      "Benchmark evaluated on custom test split",
    ],
  },
  {
    id: "proj-3",
    title: "Multi-Modal Hybrid RAG Pipeline with Milvus & Cross-Encoder Reranking",
    track: "Vector RAG",
    level: "Intermediate",
    estimatedHours: 10,
    description:
      "Build a high-recall information retrieval system combining BM25 lexical search with dense vector embeddings and cross-encoder re-scoring.",
    tags: ["Milvus", "SentenceTransformers", "Claude 3.5", "Python"],
    status: "in-progress",
    progress: 45,
    icon: <QuantumBulbIcon size="md" />,
    rubric: [
      "Contextual chunking preserving table structure and equations",
      "Sub-50ms vector query execution at 100k embedding scale",
      "Automated evaluation with Ragas metrics (faithfulness > 0.92)",
    ],
  },
  {
    id: "proj-4",
    title: "Edge Vision Inspection with YOLOv10 & ONNX Runtime",
    track: "Computer Vision",
    level: "Beginner",
    estimatedHours: 8,
    description:
      "Export custom object detection weights to quantized ONNX format and run real-time browser inference via WebAssembly.",
    tags: ["ONNX", "OpenCV", "WebAssembly", "TypeScript"],
    status: "not-started",
    progress: 0,
    icon: <KnowledgeAppleIcon size="md" />,
    rubric: [
      "Zero server latency via client-side WebAssembly execution",
      "Bounding box IoU precision above 88% on validation data",
    ],
  },
];

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [sandboxLaunched, setSandboxLaunched] = useState<Record<string, boolean>>({});

  const tracks = ["All", "Autonomous Agents", "Neural Fine-Tuning", "Vector RAG", "Computer Vision"];

  const filteredProjects =
    selectedTrack === "All" ? projects : projects.filter((p) => p.track === selectedTrack);

  const handleLaunchSandbox = (id: string) => {
    setLaunchingId(id);
    setTimeout(() => {
      setLaunchingId(null);
      setSandboxLaunched((prev) => ({ ...prev, [id]: true }));
    }, 1200);
  };

  return (
    <div className="relative min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
            <TerminalDoodleIcon size="sm" />
            PROJECT WORKSPACE // PORTFOLIO LABS
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Hands-on AI Engineering Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Build, benchmark, and deploy production-grade AI systems. Each project is evaluated by automated test harnesses and verified for your portfolio.
          </p>
        </motion.section>

        {/* Quick Stats Bar */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Completed Projects", value: "1 / 4", sub: "25% Capstone Progress", color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Average Test Pass Rate", value: "98.2%", sub: "Automated PyTest Suite", color: "text-purple-600 dark:text-cyan-400" },
            { label: "GPU Hours Logged", value: "34.5 hrs", sub: "A100 Cloud Compute", color: "text-amber-600 dark:text-amber-400" },
            { label: "Portfolio Badges", value: "3 Earned", sub: "Verifiable On-Chain", color: "text-indigo-600 dark:text-indigo-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className={cn("mt-1 text-2xl font-black tracking-tight", stat.color)}>{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Navigation */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-black/[0.06] pb-4 dark:border-white/[0.06]">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition-all",
                selectedTrack === track
                  ? "bg-[#17131F] text-white shadow-md dark:bg-white dark:text-[#17131F]"
                  : "border border-black/[0.08] text-slate-600 hover:bg-black/[0.04] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
              )}
            >
              {track}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.02]"
            >
              <div>
                {/* Top card row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {project.icon}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                        {project.track}
                      </span>
                      <h3 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900 line-clamp-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase shrink-0",
                      project.level === "Advanced"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                        : project.level === "Intermediate"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    )}
                  >
                    {project.level}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>

                {/* Rubric criteria checklist */}
                <div className="mt-4 rounded-xl border border-black/[0.05] bg-slate-50/70 p-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                    Acceptance Criteria & Rubric:
                  </p>
                  <ul className="space-y-1 text-[10.5px] text-slate-500 dark:text-slate-400">
                    {project.rubric.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-black/[0.06] bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-6 border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{project.estimatedHours} hours
                  </span>

                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {project.progress}% Complete
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10 mb-4 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      project.progress === 100
                        ? "bg-emerald-500"
                        : project.progress > 0
                        ? "bg-purple-600 dark:bg-cyan-400"
                        : "bg-transparent"
                    )}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchSandbox(project.id)}
                    disabled={launchingId === project.id}
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm",
                      sandboxLaunched[project.id]
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.01]"
                    )}
                  >
                    {launchingId === project.id ? (
                      <>
                        <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Allocating GPU...
                      </>
                    ) : sandboxLaunched[project.id] ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Sandbox Active (Port 8080)
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Launch Cloud GPU Sandbox
                      </>
                    )}
                  </button>

                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/[0.08] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                    title="Open GitHub Template"
                  >
                    <Code2 className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
