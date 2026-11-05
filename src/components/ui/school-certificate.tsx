"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Unlock,
  Award,
  Download,
  Share2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/lib/auth/auth-context";

interface SchoolCertificateProps {
  schoolId?: string;
  schoolTitle?: string;
  isUnlocked?: boolean;
  totalCourses?: number;
  completedCourses?: number;
  onSimulateUnlockToggle?: () => void;
}

// ─── GOLDEN PLEATED ROSETTE RIBBON BADGE (BOTTOM CENTER SEAL) ───
function GoldenRosetteSeal({ className }: { className?: string }) {
  // Generate 24 pleated rosette petals around the circle
  const pleats = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    return (
      <rect
        key={i}
        x="55"
        y="12"
        width="10"
        height="18"
        rx="2"
        fill={i % 2 === 0 ? "#FBBF24" : "#F59E0B"}
        transform={`rotate(${angle} 60 60)`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 120 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-20 h-auto drop-shadow-lg select-none", className)}
    >
      <defs>
        <linearGradient id="gold-disc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        <linearGradient id="gold-tail-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <filter id="seal-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Hanging Yellow-Gold Ribbon Tails */}
      <g filter="url(#seal-shadow)">
        {/* Left Ribbon Tail */}
        <polygon points="46,75 36,140 50,130 58,140 56,75" fill="url(#gold-tail-grad)" />
        {/* Right Ribbon Tail */}
        <polygon points="64,75 62,140 70,130 84,140 74,75" fill="url(#gold-tail-grad)" />
      </g>

      {/* Pleated Ruffled Rosette Edge (Outer) */}
      <g>{pleats}</g>

      {/* Inner Metallic Gold Rim & Coin Face */}
      <circle cx="60" cy="60" r="38" fill="#D97706" />
      <circle cx="60" cy="60" r="35" fill="url(#gold-disc-grad)" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="#FFFFFF" strokeDasharray="2.5 2.5" strokeWidth="1.2" strokeOpacity="0.7" />

      {/* Center Academy Emblem */}
      <polygon
        points="60,44 63,52 71,53 65,58 67,66 60,62 53,66 55,58 49,53 57,52"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <text
        x="60"
        y="75"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="900"
        letterSpacing="0.8"
        fill="#78350F"
        fontFamily="sans-serif"
      >
        HAMMET
      </text>
    </svg>
  );
}

// ─── MAIN SCHOOL DIPLOMA COMPONENT (NAVY & GOLD STYLE) ───
export function SchoolCertificate({
  schoolId = "school-01",
  schoolTitle = "School of AI Foundations & Autonomous Systems",
  isUnlocked = false,
  totalCourses = 3,
  completedCourses = 2,
  onSimulateUnlockToggle,
}: SchoolCertificateProps) {
  const { user } = useAuth();
  const studentName = user?.fullName || "Alex Chen";
  const certRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full rounded-[2.5rem] border border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-[#0E091E]/95 p-6 sm:p-10 shadow-2xl overflow-hidden">
      {/* Header bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-black/[0.06] dark:border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-0.5 text-xs font-mono font-bold text-purple-700 dark:text-cyan-300">
            <Award className="h-3.5 w-3.5" />
            <span>ACCREDITED ACADEMY DIPLOMA</span>
          </div>
          <h3 className="mt-1 font-poppins text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Official School Graduation Certificate
          </h3>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-500/10 border border-purple-400/30 px-3 py-1 text-xs font-mono font-bold text-purple-700 dark:text-cyan-300 flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5 animate-pulse text-purple-500" />
            ACCREDITATION DESIGN IN PROGRESS
          </span>
        </div>
      </div>

      {/* ── CERTIFICATE CONTAINER (EXACT NAVY & GOLD COMPOSITION) ── */}
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0C0F1D]">
        {/* ── TOP-LEFT CORNER: GEOMETRIC NAVY & GOLD ACCENT ── */}
        <svg
          className="pointer-events-none absolute top-0 left-0 h-28 w-36 sm:h-36 sm:w-48 z-10"
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Navy Polygon */}
          <polygon points="0,0 140,0 0,95" fill="#1B254B" />
          {/* Gold Trim Stripe */}
          <polygon points="0,95 140,0 152,0 0,105" fill="#D97706" />
          <polygon points="0,105 152,0 158,0 0,112" fill="#F59E0B" />
          {/* Inner Navy Triangle Notch */}
          <polygon points="0,0 70,0 0,48" fill="#0F172A" />
        </svg>

        {/* ── TOP-RIGHT CORNER: NAVY & GOLD GEOMETRIC NOTCH ── */}
        <svg
          className="pointer-events-none absolute top-0 right-0 h-20 w-24 sm:h-28 sm:w-32 z-10"
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="120,0 120,70 40,0" fill="#1B254B" />
          <polygon points="120,70 40,0 28,0 120,80" fill="#F59E0B" />
        </svg>

        {/* ── BOTTOM CORNERS: DUAL NAVY & GOLD CURVED WAVE RIBBONS ── */}
        <svg
          className="pointer-events-none absolute bottom-0 inset-x-0 h-28 sm:h-40 w-full z-10"
          viewBox="0 0 900 160"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left sweeping navy & gold wave */}
          <path
            d="M 0,160 L 0,60 C 120,60 220,120 340,160 Z"
            fill="#1B254B"
          />
          <path
            d="M 0,95 C 100,95 180,135 280,160 L 250,160 C 160,138 90,105 0,105 Z"
            fill="#D97706"
          />
          <path
            d="M 0,118 C 80,118 140,142 210,160 L 180,160 C 120,145 70,126 0,126 Z"
            fill="#FBBF24"
          />

          {/* Right sweeping navy & gold wave */}
          <path
            d="M 900,160 L 900,60 C 780,60 680,120 560,160 Z"
            fill="#1B254B"
          />
          <path
            d="M 900,95 C 800,95 720,135 620,160 L 650,160 C 740,138 810,105 900,105 Z"
            fill="#D97706"
          />
          <path
            d="M 900,118 C 820,118 760,142 690,160 L 720,160 C 780,145 830,126 900,126 Z"
            fill="#FBBF24"
          />
        </svg>

        {/* ── INNER THIN GOLD BORDER WITH BRACKET CORNERS ── */}
        <div className="pointer-events-none absolute inset-4 sm:inset-6 border border-[#D4AF37]/50 rounded-xl z-10" />

        {/* ── CERTIFICATE BODY (PERMANENTLY BLURRED) ── */}
        <div
          ref={certRef}
          className="relative z-10 p-8 sm:p-14 text-center transition-all duration-500 filter blur-md select-none pointer-events-none opacity-40 scale-[0.99]"
        >
          {/* Top Heading */}
          <h1 className="font-poppins text-3xl sm:text-5xl font-black uppercase tracking-[0.14em] text-[#1B254B] dark:text-white">
            CERTIFICATE
          </h1>
          <p className="mt-1 font-poppins text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#64748B] dark:text-slate-400">
            Of Achievement
          </p>

          <p className="mt-6 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide">
            This Certificate is Proudly Presented To
          </p>

          {/* Recipient Name in Elegant Calligraphy Cursive Style */}
          <div className="my-3 inline-block px-8 relative">
            <h2
              className="text-4xl sm:text-6xl font-normal text-[#1B254B] dark:text-[#E2E8F0] tracking-wide"
              style={{
                fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
              }}
            >
              {studentName}
            </h2>
            {/* Elegant Name Underline */}
            <div className="mx-auto mt-2 h-0.5 w-48 sm:w-64 bg-gradient-to-r from-transparent via-[#1B254B]/40 to-transparent dark:via-white/40" />
          </div>

          {/* Body Description */}
          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-sans px-4">
            For successfully fulfilling all curriculum benchmarks, automated test suites, and capstone code evaluations for the complete program of{" "}
            <span className="font-bold text-[#1B254B] dark:text-white">{schoolTitle}</span>.
          </p>

          {/* ── SIGNATURES & GOLDEN ROSETTE SEALS ── */}
          <div className="mt-12 sm:mt-16 pt-4 grid grid-cols-3 items-end max-w-2xl mx-auto">
            {/* Left Signature */}
            <div className="text-center sm:text-left">
              <div
                className="text-lg sm:text-2xl text-[#1B254B] dark:text-slate-200"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                Samira Hadid
              </div>
              <div className="mt-1 w-28 sm:w-36 h-0.5 bg-slate-900/30 dark:bg-white/30 mx-auto sm:mx-0" />
              <p className="mt-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Samira Hadid
              </p>
              <p className="text-[9px] text-slate-400">Head of Curriculum</p>
            </div>

            {/* Center Golden Pleated Rosette Ribbon Seal */}
            <div className="flex flex-col items-center justify-center -mb-2 sm:-mb-4">
              <GoldenRosetteSeal />
              <div className="mt-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[8.5px] font-mono font-bold text-white shadow-sm">
                hammet.ai/verify
              </div>
            </div>

            {/* Right Signature */}
            <div className="text-center sm:text-right">
              <div
                className="text-lg sm:text-2xl text-[#1B254B] dark:text-slate-200"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                Benjamin Shah
              </div>
              <div className="mt-1 w-28 sm:w-36 h-0.5 bg-slate-900/30 dark:bg-white/30 mx-auto sm:ml-auto sm:mr-0" />
              <p className="mt-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Benjamin Shah
              </p>
              <p className="text-[9px] text-slate-400">Chief Architect</p>
            </div>
          </div>
        </div>

        {/* ── FROSTED GLASS COMING SOON OVERLAY (PERMANENT BLUR) ── */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/75 backdrop-blur-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500/20 border border-purple-400/40 text-purple-400 shadow-xl shadow-purple-500/20">
            <Timer className="h-8 w-8 text-purple-300 animate-pulse" />
          </div>

          <span className="mt-4 rounded-full bg-purple-500/20 border border-purple-400/30 px-3.5 py-1 text-[11px] font-mono font-bold tracking-widest text-purple-200 uppercase">
            Official Accreditation In Progress
          </span>

          <h4 className="mt-3 font-poppins text-xl sm:text-2xl font-black text-white">
            Official Diploma Coming Soon
          </h4>

          <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            The official accredited diploma and credential layout for <strong className="text-white">{schoolTitle}</strong> is currently being finalized. Your enrolled courses, benchmark scores, and projects are securely tracked.
          </p>

          {/* Live Progress Bar */}
          <div className="mt-5 w-full max-w-sm rounded-2xl border border-white/10 bg-black/50 p-4">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-2">
              <span>Program Progress</span>
              <span className="text-amber-400 font-bold">
                {completedCourses} of {totalCourses} Courses Completed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${(completedCourses / totalCourses) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
