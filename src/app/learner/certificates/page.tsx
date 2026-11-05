"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  ArrowRight,
  School,
} from "lucide-react";
import { SchoolCertificate } from "@/components/ui/school-certificate";

const OTHER_ACADEMY_SCHOOLS = [
  {
    title: "School of Autonomous Agent Swarms",
    coursesCount: 4,
    status: "Upcoming",
    desc: "Multi-agent coordination, LangGraph state recovery, and MCP tool runtime integration.",
  },
  {
    title: "School of AI Safety, Alignment & Red-Teaming",
    coursesCount: 3,
    status: "Upcoming",
    desc: "Adversarial prompt injection defense, DPO alignment, and enterprise semantic firewalls.",
  },
  {
    title: "School of Enterprise Multimodal Intelligence",
    coursesCount: 5,
    status: "Upcoming",
    desc: "Vision-language models, audio streaming pipelines, and high-throughput vLLM serving.",
  },
];

export default function CertificatesPage() {
  return (
    <div className="min-h-screen px-4 pb-28 pt-8 sm:px-6 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* ── TOP HERO HEADER ── */}
        <div className="relative overflow-hidden rounded-[2.8rem] border border-black/[0.08] dark:border-white/10 bg-white/90 dark:bg-[#120E1D]/90 p-8 sm:p-12 shadow-xl backdrop-blur-xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/30 px-3.5 py-1 text-xs font-mono font-bold text-amber-700 dark:text-amber-300 mb-3">
                <GraduationCap className="h-4 w-4" />
                <span>OFFICIAL ACADEMY CERTIFICATIONS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                School Graduation Diplomas
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Graduation certificates are granted when you finish all courses, pass technical module evaluations, and complete required capstone projects for an entire AI School.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="rounded-2xl border border-black/[0.06] dark:border-white/10 bg-slate-50 dark:bg-black/30 p-4 text-center min-w-[150px]">
                <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
                  IN PROGRESS
                </span>
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  School of AI Foundations
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTIVE SCHOOL CERTIFICATE DISPLAY ── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                School of AI Foundations Diploma
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official credential verified by Hammet Academic Review Board.
              </p>
            </div>

            <Link
              href="/learner/ai-schools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-cyan-400 hover:underline"
            >
              <School className="h-4 w-4" />
              <span>School Curriculum</span>
            </Link>
          </div>

          {/* School Certificate Card */}
          <SchoolCertificate
            schoolId="school-01"
            schoolTitle="School of AI Foundations & Autonomous Systems"
            totalCourses={4}
            completedCourses={2}
          />
        </div>

        {/* ── REQUIREMENTS CHECKLIST ── */}
        <div className="mt-10 rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white/70 dark:bg-[#120E1D]/70 p-6 sm:p-8 backdrop-blur-md">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Graduation Requirements for School of AI Foundations:
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Complete each course, pass the module test threshold, and deliver production-grade code.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    Introduction to AI &amp; Neural Models
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    Completed • Score: 100% on Module Evaluation
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                PASSED
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    Generative AI Fundamentals
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    Completed • Score: 92% on Module Evaluation
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                PASSED
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-amber-500" />
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    Building with AI &amp; Agents (Final Capstone)
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Requires Capstone Submission &amp; Official Program Reveal
                  </span>
                </div>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                PENDING CAPSTONE
              </span>
            </div>
          </div>
        </div>

        {/* ── OTHER ACADEMY SCHOOLS ── */}
        <div className="mt-12">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Other Diplomas in the Hammet Ecosystem
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Advance into specialized engineering schools to unlock higher-tier diplomas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {OTHER_ACADEMY_SCHOOLS.map((school, i) => (
              <div
                key={i}
                className="rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white/60 dark:bg-white/[0.02] p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-slate-200/60 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                    {school.status}
                  </span>
                  <span className="text-[11px] font-mono text-purple-600 dark:text-cyan-400">
                    {school.coursesCount} Courses
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {school.title}
                </h4>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {school.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

