"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen,
  Cpu,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  Check,
  Search,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/store/use-cart";
import { learnerApi } from "@/lib/api/learner";
import { AiSchool } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { QuantumBulbIcon } from "@/components/ui/character-icons";

export default function AiSchoolsPage() {
  const router = useRouter();
  const { addItem, hasItem, hasPaidItem } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  const { accessToken, refreshToken } = useAuth();

  const [schools, setSchools] = useState<AiSchool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchools() {
      try {
        setLoading(true);
        const data = await learnerApi.getAiSchools(accessToken ?? "", refreshToken);
        setSchools(data.aiSchools);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load AI Schools");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, [accessToken, refreshToken]);

  return (
    <div className="relative min-h-screen overflow-hidden px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10 bg-[#F8F7FF] dark:bg-[#0B0813] transition-colors duration-500">
      {/* Subtle Purple Theme Ambient Aura */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[550px] w-[550px] rounded-full bg-purple-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 max-w-2xl"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-purple-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            <GraduationCap className="h-4 w-4" />
            AI Academy Tracks
          </div>

          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Available AI Schools
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
            Explore comprehensive AI diploma tracks designed to build end-to-end mastery in machine learning, neural networks, and generative architectures.
          </p>
        </motion.header>

        {loading ? (
          <div className="h-[360px] animate-pulse rounded-3xl bg-slate-100 dark:bg-white/[0.03]" />
        ) : error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-500/10 dark:bg-red-500/[0.05]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{error}</p>
          </div>
        ) : schools.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-12 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <BookOpen className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h3 className="text-lg font-semibold tracking-[-0.025em]">No AI Schools available</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Check back later for new offerings.</p>
          </div>
        ) : (
          <>
            {/* School Search Toolbar */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search AI Schools by name or description..."
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
              {searchQuery && (
                <span className="text-xs font-semibold text-purple-600 dark:text-cyan-400">
                  Showing {schools.filter((s) => !searchQuery.trim() || s.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) || s.description?.toLowerCase().includes(searchQuery.toLowerCase().trim())).length} of {schools.length} schools
                </span>
              )}
            </div>

            {schools.filter((s) => !searchQuery.trim() || s.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) || s.description?.toLowerCase().includes(searchQuery.toLowerCase().trim())).length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No schools match &quot;{searchQuery}&quot;</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try searching with a different term or clear your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {schools
                  .filter((s) => !searchQuery.trim() || s.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) || s.description?.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                  .map((school, index) => {
                    const isPaid = mounted && hasPaidItem(school.id);
                    const inCart = mounted && hasItem(school.id);

              return (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-white/80 p-7 sm:p-10 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl dark:border-purple-500/20 dark:bg-[#130E24]/90"
                >
                  {/* Elegant Hand-drawn Graduation Cap & Academic Book background illustration with PURPLE lines */}
                  <div className="pointer-events-none absolute -right-6 -bottom-8 z-0 opacity-15 dark:opacity-10 transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1">
                    <svg
                      width="380"
                      height="380"
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-purple-600 dark:text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                    >
                      {/* Graduation Mortarboard Cap */}
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
                      {/* Academic Open Book at bottom */}
                      <path
                        d="M30 175C55 165 80 168 100 178C120 168 145 165 170 175V135C145 125 120 128 100 138C80 128 55 125 30 135V175Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                    {/* Left: Comprehensive School Info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          Complete Diploma Program
                        </span>
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                          4 Core Courses Included
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 mb-3">
                        <QuantumBulbIcon size="lg" />
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                          {school.name}
                        </h2>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                        A rigorous, production-grade curriculum designed to take you from foundational mathematics, prompt engineering, and deep learning architectures all the way to deploying autonomous agentic workflows and computer vision pipelines in production.
                      </p>

                      {/* Curriculum Highlights */}
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          "Introduction to AI & Modern LLMs",
                          "Neural Networks & Deep Learning Architectures",
                          "Generative AI Systems: Prompt Engineering & RAG",
                          "Autonomous AI Agents & Multi-Tool Execution",
                        ].map((courseName, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 rounded-xl border border-black/[0.04] bg-white/60 p-2.5 text-xs font-semibold text-slate-800 backdrop-blur-sm dark:border-white/[0.04] dark:bg-white/[0.03] dark:text-slate-200"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                              0{i + 1}
                            </span>
                            <span className="truncate">{courseName}</span>
                          </div>
                        ))}
                      </div>

                      {/* Key details tags */}
                      <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                          <span>Accredited AI Certificate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                          <span>60+ Hours of Curriculum</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                          <span>44 Practical Labs & Projects</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing & Enrollment Action Card */}
                    <div className="flex flex-col justify-between rounded-2xl border border-purple-500/15 bg-gradient-to-b from-purple-50/50 to-white/70 p-6 sm:p-7 backdrop-blur-md dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.01]">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-cyan-400">
                            Full School Enrollment
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                            Bundle & Save 20%
                          </span>
                        </div>

                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                            {isPaid
                              ? "Paid"
                              : (school.price || 0) === 0
                              ? "Free"
                              : `₦${(school.price || 0).toLocaleString()}`}
                          </span>
                          {!isPaid && (
                            <span className="text-sm text-slate-400 line-through">
                              ₦31,250
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {isPaid
                            ? "You hold full lifetime access to all 4 courses, projects, and future curriculum updates."
                            : "Includes all 4 courses, module exercises, downloadable source code, and verified certification."}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col gap-3">
                        <Button
                          size="lg"
                          onClick={() => {
                            router.push(`/learner/ai-schools/${school.id}`);
                          }}
                          className="w-full rounded-xl bg-purple-600 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                        >
                          <span>Explore School Curriculum</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        {!mounted ? null : isPaid ? (
                          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" />
                            Enrolled in School
                          </div>
                        ) : inCart ? (
                          <Button
                            variant="outline"
                            onClick={() => router.push("/learner/checkout")}
                            className="w-full rounded-xl font-bold border-purple-300 text-purple-700 bg-white hover:bg-purple-600 hover:text-white hover:border-purple-600 dark:border-cyan-400/60 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-white dark:hover:text-slate-950 dark:hover:border-white transition-all shadow-sm"
                          >
                            Proceed to Checkout →
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => {
                              addItem({
                                id: school.id,
                                type: "school",
                                title: school.name,
                                price: school.price || 0,
                              });
                            }}
                            className="w-full rounded-xl font-bold border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                          >
                            Add School to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
