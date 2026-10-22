"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Lock,
  ArrowUpRight,
  ChevronRight,
  Upload,
  AlertCircle,
  Terminal,
  Check,
  X,
  Send,
  ShieldCheck,
  FileCode,
  Award,
  BookOpen,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import {
  NeuroBotIcon,
  TensorCubieIcon,
  KnowledgeAppleIcon,
  QuantumBulbIcon,
  TerminalDoodleIcon,
} from "@/components/ui/character-icons";
import { useLearnerStore, LearnerProject } from "@/lib/store/use-learner-store";
//import { useCart } from "@/lib/store/use-cart";
import { BadgeCelebrationModal } from "@/components/ui/badge-celebration-modal";

export default function ProjectsPage() {
  const projects = useLearnerStore((state) => state.projects);
  const startProject = useLearnerStore((state) => state.startProject);
  const updateProjectProgress = useLearnerStore(
    (state) => state.updateProjectProgress,
  );
  const submitProject = useLearnerStore((state) => state.submitProject);
  const activeCelebrationBadge = useLearnerStore(
    (state) => state.activeCelebrationBadge,
  );
  const triggerCelebration = useLearnerStore(
    (state) => state.triggerCelebration,
  );
  const closeCelebration = useLearnerStore((state) => state.closeCelebration);
  const badges = useLearnerStore((state) => state.badges);

  //const { hasPaidItem, paidItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "in-progress" | "completed" | "not-started"
  >("all");
  const [selectedTrack, setSelectedTrack] = useState<string>("All Tracks");
  const [searchQuery, setSearchQuery] = useState("");
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [sandboxLaunched, setSandboxLaunched] = useState<
    Record<string, boolean>
  >({});

  // Project Submission Modal
  const [submittingProject, setSubmittingProject] =
    useState<LearnerProject | null>(null);
  const [submissionRepo, setSubmissionRepo] = useState("");
  const [submissionDemo, setSubmissionDemo] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [rubricChecked, setRubricChecked] = useState<Record<number, boolean>>(
    {},
  );
  const [evaluating, setEvaluating] = useState(false);
  const [evalStep, setEvalStep] = useState<string>("");

  const tracks = [
    "All Tracks",
    "Neural Foundations",
    "Transformer Latent Space",
    "Neural Fine-Tuning",
    "Vector RAG",
    "Agent Workflows",
    "Stateful Systems",
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;
    const matchesTrack =
      selectedTrack === "All Tracks" ? true : p.track === selectedTrack;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.track.toLowerCase().includes(q) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(q));
    return matchesStatus && matchesTrack && matchesSearch;
  });

  const completedCount = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const inProgressCount = projects.filter(
    (p) => p.status === "in-progress",
  ).length;

  const handleLaunchSandbox = (id: string) => {
    setLaunchingId(id);
    setTimeout(() => {
      setLaunchingId(null);
      setSandboxLaunched((prev) => ({ ...prev, [id]: true }));
    }, 1200);
  };

  const handleOpenSubmitModal = (project: LearnerProject) => {
    setSubmittingProject(project);
    setSubmissionRepo(`https://github.com/learner/${project.id}-solution`);
    setSubmissionDemo(`https://${project.id}.hammet.dev`);
    setSubmissionNotes(
      "Implemented full stateful recovery with async dispatch and Pydantic validation.",
    );
    // Pre-check rubric
    const initialChecked: Record<number, boolean> = {};
    project.rubric.forEach((_, idx) => {
      initialChecked[idx] = true;
    });
    setRubricChecked(initialChecked);
  };

  const handleExecuteSubmission = () => {
    if (!submittingProject) return;
    setEvaluating(true);
    setEvalStep("Spinning up evaluation container & PyTest harness...");

    setTimeout(() => {
      setEvalStep(
        "Running 18 automated rubric tests & performance benchmarks...",
      );
    }, 900);

    setTimeout(() => {
      setEvalStep("Cryptographically compiling Skill Badge proof on ledger...");
    }, 1800);

    setTimeout(() => {
      setEvaluating(false);
      const minted = submitProject(submittingProject.id, {
        repoUrl: submissionRepo,
        demoUrl: submissionDemo,
        notes: submissionNotes,
      });
      setSubmittingProject(null);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10 font-poppins">
      <div className="mx-auto max-w-[1280px]">
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
            <TerminalDoodleIcon size="sm" />
            PROJECT WORKSPACE // CAPSTONE LABS
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Hands-on AI Engineering Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Build, benchmark, and deploy production-grade AI systems. Each
            project is attached to course modules, verified by automated test
            harnesses, and mints an authentic credential badge for your
            portfolio.
          </p>
        </motion.section>

        {/* Quick Stats Bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Completed Projects",
              value: `${completedCount} / ${projects.length}`,
              sub: `${Math.round((completedCount / (projects.length || 1)) * 100)}% Capstones Completed`,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "In Progress Labs",
              value: `${inProgressCount} Active`,
              sub: "Interactive Coding Sandboxes",
              color: "text-purple-600 dark:text-cyan-400",
            },
            {
              label: "Lab Practice Time",
              value: "42.8 hrs",
              sub: "Cloud Practice Environment",
              color: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Minted Skill Badges",
              value: `${badges.length} Verifiable`,
              sub: "Cryptographic On-Chain Proofs",
              color: "text-indigo-600 dark:text-indigo-400",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-black tracking-tight",
                  stat.color,
                )}
              >
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Track Filter Toolbar */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, track, or skill tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-black/[0.08] bg-white py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Results count & Track Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {searchQuery && (
              <span className="text-xs font-semibold text-purple-600 dark:text-cyan-400">
                Found {filteredProjects.length} of {projects.length} projects
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Track:
              </span>
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="rounded-xl border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-[#151026] dark:text-slate-200 outline-none"
              >
                {tracks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filters Bar: Status Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-black/[0.06] pb-4 dark:border-white/[0.06]">
          {[
            { id: "all", label: `All Projects (${projects.length})` },
            { id: "in-progress", label: `In Progress (${inProgressCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
            {
              id: "not-started",
              label: `Not Started (${projects.length - completedCount - inProgressCount})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                statusFilter === tab.id
                  ? "bg-[#17131F] text-white shadow-md dark:bg-white dark:text-[#17131F]"
                  : "border border-black/[0.08] text-slate-600 hover:bg-black/[0.04] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
            <FolderKanban className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              No projects found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {searchQuery
                ? `No projects matching "${searchQuery}". Try a different keyword or clear your search.`
                : "Try adjusting your filters or start a project from any course curriculum."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project, index) => {
              const isDone = project.status === "completed";
              const isInProgress = project.status === "in-progress";
              const isUnlocked = !mounted || isDone || isInProgress;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.02]"
                >
                  <div>
                    {/* Top card row */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10.5px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                            {project.track}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • {project.courseTitle}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                            project.level === "Production"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                              : project.level === "Advanced"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                                : project.level === "Intermediate"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
                          )}
                        >
                          {project.level}
                        </span>

                        {isDone ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        ) : isInProgress ? (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            In Progress
                          </span>
                        ) : isUnlocked ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                            Not Started
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 border border-amber-500/20">
                            <Lock className="h-3 w-3" />
                            Prerequisite
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {project.description}
                    </p>

                    {/* Rubric criteria checklist */}
                    <div className="mt-4 rounded-xl border border-black/[0.05] bg-slate-50/70 p-3.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                        Automated Acceptance Rubric:
                      </p>
                      <ul className="space-y-1.5 text-[10.5px] text-slate-500 dark:text-slate-400">
                        {project.rubric.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span
                              className={cn(
                                "mt-0.5 h-3 w-3 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0",
                                isDone
                                  ? "bg-emerald-500 text-white"
                                  : "border border-slate-300 dark:border-white/20 text-slate-400",
                              )}
                            >
                              {isDone ? "✓" : idx + 1}
                            </span>
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

                    {/* Verified Submission Metadata if Completed */}
                    {isDone && project.submission && (
                      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-3 text-xs dark:bg-emerald-500/[0.05]">
                        <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                          <span className="flex items-center gap-1">
                            <Award className="h-3.5 w-3.5" />
                            {project.submission.grade} Evaluation Passed
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {project.submission.submittedAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <a
                            href={project.submission.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-600 hover:underline dark:text-cyan-400"
                          >
                            <Code2 className="h-3 w-3" />
                            GitHub Repo
                          </a>
                          <a
                            href={project.submission.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-600 hover:underline dark:text-cyan-400"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Live Demo
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Card Actions */}
                  <div className="mt-6 border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />~{project.estimatedHours}{" "}
                        hours estimated
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
                              : "bg-transparent",
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    {!isUnlocked ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <Lock className="h-4 w-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                          <span>
                            Complete <strong>{project.courseTitle}</strong> to
                            unlock this capstone workspace
                          </span>
                        </div>
                        <Link
                          href="/learner/ai-schools"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shrink-0 shadow-sm transition"
                        >
                          <span>Enroll to Unlock</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {!isInProgress && !isDone && (
                          <button
                            onClick={() => startProject(project.id)}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-600 transition dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-300"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>Start Project & Allocate Workspace</span>
                          </button>
                        )}

                        {isInProgress && (
                          <>
                            <button
                              onClick={() => handleLaunchSandbox(project.id)}
                              disabled={launchingId === project.id}
                              className={cn(
                                "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm",
                                sandboxLaunched[project.id]
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.01]",
                              )}
                            >
                              {launchingId === project.id ? (
                                <>
                                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                  Launching Practice Lab...
                                </>
                              ) : sandboxLaunched[project.id] ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Practice Lab Active (Port 8080)
                                </>
                              ) : (
                                <>
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                  Launch Practice Lab
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleOpenSubmitModal(project)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shadow-sm transition"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Submit Project 🚀</span>
                            </button>
                          </>
                        )}

                        {isDone && (
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <Link
                              href="/learner/passport"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-cyan-400 hover:underline"
                            >
                              <Award className="h-4 w-4" />
                              <span>View Minted Skill Badge in Passport →</span>
                            </Link>

                            <button
                              onClick={() => {
                                const b =
                                  badges.find(
                                    (badge) =>
                                      badge.id === project.earnedBadgeId,
                                  ) || badges[0];
                                if (b) triggerCelebration(b);
                              }}
                              className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-cyan-300 transition"
                            >
                              Re-play Celebration 🎉
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PROJECT SUBMISSION & EVALUATION MODAL ────────────────────────────── */}
      <AnimatePresence>
        {submittingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !evaluating && setSubmittingProject(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl rounded-3xl border border-black/[0.08] bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#120E1F] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                    Capstone Verification Harness
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Submit Project for Evaluation
                  </h3>
                </div>
                {!evaluating && (
                  <button
                    onClick={() => setSubmittingProject(null)}
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Project Title
                  </label>
                  <p className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-900 dark:bg-white/[0.03] dark:text-white border border-slate-200 dark:border-white/10">
                    {submittingProject.title}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    GitHub Solution Repository
                  </label>
                  <input
                    type="url"
                    value={submissionRepo}
                    onChange={(e) => setSubmissionRepo(e.target.value)}
                    placeholder="https://github.com/username/project-repo"
                    disabled={evaluating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-white outline-none focus:border-purple-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Live Demo / Service Endpoint
                  </label>
                  <input
                    type="url"
                    value={submissionDemo}
                    onChange={(e) => setSubmissionDemo(e.target.value)}
                    placeholder="https://my-service.hammet.dev or FastAPI Swagger URL"
                    disabled={evaluating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-white outline-none focus:border-purple-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Engineering Notes & Architectural Trade-offs
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Describe how you handled state persistence, latency constraints, and tool errors..."
                    disabled={evaluating}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-white outline-none focus:border-purple-600 dark:focus:border-cyan-400"
                  />
                </div>

                {/* Rubric Verification Checklist */}
                <div className="rounded-2xl border border-purple-200/60 bg-purple-50/50 p-4 dark:border-purple-500/20 dark:bg-purple-950/20">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200 block mb-2">
                    Self-Verification Acceptance Rubric:
                  </span>
                  <div className="space-y-2">
                    {submittingProject.rubric.map((criteria, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={!!rubricChecked[idx]}
                          onChange={(e) =>
                            setRubricChecked((prev) => ({
                              ...prev,
                              [idx]: e.target.checked,
                            }))
                          }
                          disabled={evaluating}
                          className="mt-0.5 h-4 w-4 rounded accent-purple-600"
                        />
                        <span>{criteria}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Evaluation Progress State */}
                {evaluating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-cyan-400/30 bg-cyan-50/70 p-4 text-center dark:bg-cyan-950/30"
                  >
                    <div className="mx-auto mb-2 h-7 w-7 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                    <p className="text-xs font-bold text-cyan-900 dark:text-cyan-200">
                      {evalStep}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Do not close this window while cryptographic proofs are
                      compiled.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
                {!evaluating && (
                  <button
                    onClick={() => setSubmittingProject(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleExecuteSubmission}
                  disabled={evaluating}
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:bg-purple-700 disabled:opacity-50 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition"
                >
                  {evaluating
                    ? "Evaluating Project..."
                    : "Run Evaluation & Mint Skill Badge ⚡"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CELEBRATORY BADGE ACHIEVEMENT MODAL ──────────────────────────────── */}
      <BadgeCelebrationModal />
    </div>
  );
}
