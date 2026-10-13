"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Sparkles, Clock, CheckCircle2, ChevronRight, Play, Terminal, Layers } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export interface CoursePanelData {
  id: string;
  number: string;
  badge: string;
  category: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  topics: string[];
  capstone: string;
  image: string;
  accentColor: string;
  gradient: string;
}

export const COURSE_PANELS: CoursePanelData[] = [
  {
    id: "01",
    number: "01",
    badge: "Foundations",
    category: "Neural Mental Models",
    title: "Introduction to AI",
    level: "Beginner Friendly",
    duration: "7 modules • 4 hours",
    description:
      "What it is, what it isn't, and how to talk about it without bluffing. Build intuitive mental models of neural weights, training loops, and real capabilities.",
    topics: ["How AI learns", "Neural weights", "Vector embeddings", "Token inference"],
    capstone: "Interactive LLM capability diagnostic matrix",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1400",
    accentColor: "#8B5CF6",
    gradient: "from-purple-900/95 via-purple-950/80 to-transparent",
  },
  {
    id: "02",
    number: "02",
    badge: "Core LLMs",
    category: "Generative Transformers",
    title: "Generative AI Fundamentals",
    level: "Hands-on Lab",
    duration: "6 modules • 5 hours",
    description:
      "How transformer models produce text, code, and reasoning tokens—and where hallucination actually originates in latent space.",
    topics: ["Attention math", "Token probabilities", "Hallucination audits", "Context compression"],
    capstone: "Live hallucination detector & context guardrail",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1400",
    accentColor: "#6366F1",
    gradient: "from-indigo-900/95 via-indigo-950/80 to-transparent",
  },
  {
    id: "03",
    number: "03",
    badge: "Productivity",
    category: "AI Agent Workflows",
    title: "AI Tools for Everyday Work",
    level: "Workflow Fast-track",
    duration: "5 modules • 3.5 hours",
    description:
      "Stop prompting like it's a search engine. Set up persistent project contexts, automated agent delegates, and high-velocity workflows.",
    topics: ["Context engineering", "System prompts", "Automated agents", "Tool integrations"],
    capstone: "Personal autonomous developer task orchestrator",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1400",
    accentColor: "#06B6D4",
    gradient: "from-cyan-950/95 via-slate-950/85 to-transparent",
  },
  {
    id: "04",
    number: "04",
    badge: "Production Agents",
    category: "Stateful Systems",
    title: "Building with AI & Agents",
    level: "Production Engineering",
    duration: "8 modules • 7 hours",
    description:
      "From API calls to multi-agent architectures. Build stateful AI applications using LangGraph, MCP protocol, and local model inference.",
    topics: ["LangGraph state machines", "MCP tool protocols", "Self-correcting loops", "vLLM local serving"],
    capstone: "Full-stack multi-agent autonomous support engine",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400",
    accentColor: "#10B981",
    gradient: "from-emerald-950/95 via-slate-950/85 to-transparent",
  },
];

export function ExpandingCoursePanels() {
  const [activeId, setActiveId] = useState<string>("01");
  const [activeSubTab, setActiveSubTab] = useState<Record<string, "overview" | "curriculum" | "capstone">>({
    "01": "overview",
    "02": "overview",
    "03": "overview",
    "04": "overview",
  });

  return (
    <div className="w-full">
      {/* ── PANELS CONTAINER: Horizontal Accordion with Smooth Springs ── */}
      <div className="flex flex-col lg:flex-row gap-3.5 sm:gap-4 w-full min-h-[580px] lg:h-[580px] rounded-[2.5rem] p-3 sm:p-4 bg-white/95 dark:bg-[#0E091E]/95 border border-purple-200/60 dark:border-white/10 shadow-2xl shadow-purple-950/5">
        {COURSE_PANELS.map((course) => {
          const isExpanded = activeId === course.id;
          const currentTab = activeSubTab[course.id] ?? "overview";

          return (
            <div
              key={course.id}
              role="button"
              tabIndex={0}
              data-testid={`course-panel-${course.id}`}
              aria-label={`Course ${course.number}: ${course.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveId(course.id);
                }
              }}
              onMouseEnter={() => setActiveId(course.id)}
              onClick={() => setActiveId(course.id)}
              className={cn(
                "relative overflow-hidden rounded-[2rem] cursor-pointer select-none border",
                isExpanded
                  ? "flex-[3.5] lg:flex-[3.8] border-purple-400/50 dark:border-cyan-400/40 shadow-xl"
                  : "flex-1 border-black/[0.06] dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-400/40"
              )}
              style={{
                transition: "flex 560ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, box-shadow 300ms ease",
                contain: "layout paint",
                transform: "translateZ(0)",
              }}
            >
              {/* Background Contextual Image - isolated in fixed clipping viewport */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: "strict" }}>
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ transform: "translateZ(0)" }}
                />
                {/* Dynamic Gradient Scrim Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    isExpanded
                      ? "bg-gradient-to-t from-black/95 via-black/75 to-black/30 opacity-95"
                      : "bg-black/60 hover:bg-black/45"
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r transition-opacity duration-300",
                    course.gradient,
                    isExpanded ? "opacity-45" : "opacity-25"
                  )}
                />
              </div>

              {/* ── CONDENSED / COLLAPSED STATE (Smooth horizontal Poppins wording alignment) ── */}
              <div
                className={cn(
                  "absolute inset-0 z-10 h-full w-full flex flex-col justify-between p-5 text-white transition-all",
                  isExpanded ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
                )}
                style={{
                  transitionDuration: "180ms",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: isExpanded ? "0ms" : "220ms",
                  transform: "translateZ(0)",
                }}
              >
                {/* Top Badge: Number + Accent Indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-2xl font-poppins text-sm font-black shadow-lg"
                    style={{ backgroundColor: `${course.accentColor}33`, color: "#FFFFFF", border: `1.5px solid ${course.accentColor}66` }}
                  >
                    {course.number}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: course.accentColor }} />
                </div>

                {/* Bottom Horizontal Wording Alignment (Readable & Modern, No Vertical Rotated Text) */}
                <div className="rounded-2xl border border-white/10 bg-black/60 p-3.5 shadow-xl">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="rounded-full px-2 py-0.5 font-poppins text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: `${course.accentColor}66` }}
                    >
                      {course.badge}
                    </span>
                    <span className="text-[10px] font-poppins font-medium text-slate-300">
                      {course.level}
                    </span>
                  </div>

                  <h4 className="mt-1.5 font-poppins text-sm sm:text-base font-extrabold text-white leading-snug line-clamp-2">
                    {course.title}
                  </h4>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-poppins font-medium text-slate-300 border-t border-white/10 pt-2">
                    <span>{course.duration.split("•")[0]}</span>
                    <span className="flex items-center gap-0.5 font-poppins text-xs font-bold text-white hover:text-cyan-300 transition-colors">
                      <span>Explore</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* ── EXPANDED / HOVERED FULL INFORMATION STATE (Stable layout without text squishing + smooth glide reveal) ── */}
              <div
                className={cn(
                  "absolute inset-0 z-10 h-full w-full overflow-hidden p-6 sm:p-8 text-white",
                  isExpanded ? "pointer-events-auto" : "pointer-events-none"
                )}
              >
                {/* Fixed-layout inner content wrapper: text never squishes or re-wraps while width animates */}
                <div
                  className={cn(
                    "h-full flex flex-col justify-between w-full min-w-0 lg:min-w-[480px] max-w-[620px] transition-all",
                    isExpanded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3 pointer-events-none"
                  )}
                  style={{
                    transitionDuration: "360ms",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: isExpanded ? "180ms" : "0ms",
                    transform: "translateZ(0)",
                  }}
                >
                {/* Top Row: Track Number, Badges & Hardware Acceleration */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-2xl font-poppins text-sm font-black shadow-lg"
                        style={{ backgroundColor: `${course.accentColor}44`, color: "#FFFFFF", border: `1.5px solid ${course.accentColor}` }}
                      >
                        {course.number}
                      </span>
                      <span
                        className="rounded-full px-3 py-1 font-poppins text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: `${course.accentColor}55`, border: `1px solid ${course.accentColor}88` }}
                      >
                        {course.badge}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-poppins text-xs font-medium text-slate-200 border border-white/10">
                        <Clock className="h-3 w-3 text-cyan-300" />
                        {course.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 font-poppins text-[11px] font-bold text-emerald-300">
                        {course.level}
                      </span>
                      <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2.5 py-0.5 font-poppins text-[11px] font-bold text-cyan-300">
                        GPU Active
                      </span>
                    </div>
                  </div>

                  {/* Course Title - Unfolds with prominent Poppins styling */}
                  <div className="mt-5">
                    <p className="font-poppins text-xs font-bold uppercase tracking-wider text-purple-300 dark:text-cyan-300">
                      {course.category} • Module Track {course.number}
                    </p>
                    <h3 className="mt-1 font-poppins text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                      {course.title}
                    </h3>
                  </div>

                  {/* Interactive Tab Switcher inside Panel */}
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/15 border border-white/10 p-1 max-w-sm">
                    {(["overview", "curriculum", "capstone"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSubTab((prev) => ({
                            ...prev,
                            [course.id]: tab,
                          }));
                        }}
                        className={cn(
                          "flex-1 rounded-lg py-1.5 font-poppins text-xs font-bold capitalize transition-colors duration-150",
                          currentTab === tab
                            ? "bg-white text-slate-900 shadow-md"
                            : "text-slate-300 hover:text-white"
                        )}
                      >
                        {tab === "curriculum" ? "Modules" : tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content Display */}
                  <div className="mt-4 min-h-[100px]">
                    {currentTab === "overview" && (
                      <p className="font-poppins text-sm sm:text-base leading-relaxed text-slate-200 max-w-xl font-normal">
                        {course.description}
                      </p>
                    )}

                    {currentTab === "curriculum" && (
                      <div className="grid grid-cols-2 gap-2 max-w-lg">
                        {course.topics.map((topic, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-2 font-poppins text-xs font-medium text-slate-200"
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: course.accentColor }} />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentTab === "capstone" && (
                      <div className="rounded-2xl border border-white/15 bg-white/15 p-3.5 max-w-xl">
                        <span className="font-poppins text-[10.5px] font-bold uppercase tracking-wider text-cyan-300">
                          Portfolio Capstone Project
                        </span>
                        <p className="mt-1 font-poppins text-sm font-bold text-white">{course.capstone}</p>
                        <p className="mt-1 font-poppins text-xs text-slate-300">Verified on employer skill passport with tamper-proof certificate.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action CTA & Learner Stats */}
                <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="h-7 w-7 rounded-full bg-purple-600 border border-white/40 flex items-center justify-center font-poppins text-[10px] font-bold">
                        AI
                      </div>
                      <div className="h-7 w-7 rounded-full bg-cyan-600 border border-white/40 flex items-center justify-center font-poppins text-[10px] font-bold">
                        GPU
                      </div>
                    </div>
                    <span className="font-poppins text-xs text-slate-300 font-medium">3,420 learners enrolled this month</span>
                  </div>

                  <Link
                    href="/register"
                    onClick={(e) => e.stopPropagation()}
                    className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-poppins text-xs sm:text-sm font-bold text-slate-950 transition hover:scale-105 shadow-lg"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    Start Track
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

