"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Award,
  QrCode,
  Share2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Lock,
  Globe,
  CheckCircle2,
  Cpu,
  Layers,
  Fingerprint,
  Stamp,
  FileCheck,
  Key,
  BadgeCheck,
  RotateCw,
  Timer,
  GraduationCap,
} from "lucide-react";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";

import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useLearnerStore, INITIAL_BADGES } from "@/lib/store/use-learner-store";
import { SkillBadgeComponent } from "@/components/ui/skill-badge";
import { BadgeCelebrationModal } from "@/components/ui/badge-celebration-modal";

// ── GUILLOCHE SECURITY BACKGROUND PATTERN (Official Passport Paper) ──────────
function GuillocheSecurityPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 650 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute inset-0 h-full w-full select-none", className)}
    >
      <defs>
        <linearGradient id="guillocheGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D77F" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.4" />
          <stop offset="80%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.7" />
        </linearGradient>

        <linearGradient id="waveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Intricate concentric mathematical guilloche rosette curves radiating from Hammet Star */}
      <g stroke="url(#guillocheGold)" strokeWidth="0.8">
        {[25, 45, 65, 85, 105, 125, 145, 165, 185, 205, 225, 245].map((radius, i) => (
          <ellipse
            key={i}
            cx="440"
            cy="180"
            rx={radius * 1.4}
            ry={radius * 0.85}
            strokeDasharray={i % 2 === 0 ? "4 3" : "2 2"}
            transform={`rotate(${i * 15} 440 180)`}
            opacity="0.6"
          />
        ))}

        {/* Sinusoidal security waves across the passport body */}
        <path d="M 0 50 Q 160 15 320 50 T 650 50" stroke="url(#waveCyan)" strokeWidth="1" />
        <path d="M 0 95 Q 160 65 320 95 T 650 95" stroke="url(#waveCyan)" strokeWidth="0.8" />
        <path d="M 0 140 Q 160 110 320 140 T 650 140" stroke="url(#waveCyan)" strokeWidth="1" />
        <path d="M 0 185 Q 160 155 320 185 T 650 185" stroke="url(#waveCyan)" strokeWidth="0.8" />
        <path d="M 0 230 Q 160 200 320 230 T 650 230" stroke="url(#waveCyan)" strokeWidth="1" />
        <path d="M 0 275 Q 160 245 320 275 T 650 275" stroke="url(#waveCyan)" strokeWidth="0.8" />
        <path d="M 0 320 Q 160 290 320 320 T 650 320" stroke="url(#waveCyan)" strokeWidth="1" />
        <path d="M 0 365 Q 160 335 320 365 T 650 365" stroke="url(#waveCyan)" strokeWidth="0.8" />

        {/* Fine crosshatch micro-grid security lines */}
        <line x1="80" y1="0" x2="570" y2="440" strokeOpacity="0.2" strokeDasharray="3 3" />
        <line x1="570" y1="0" x2="80" y2="440" strokeOpacity="0.2" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

// ── OFFICIAL HAMMET EMBOSSED GOLD COAT OF ARMS ─────────────────────────────────
function HammetCrestSeal({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="35%" stopColor="#F5D77F" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
        </defs>

        {/* Outer Beaded Security Ring */}
        <circle cx="50" cy="50" r="46" stroke="url(#crestGold)" strokeWidth="1.5" strokeDasharray="2.5 2.5" />
        <circle cx="50" cy="50" r="42" stroke="url(#crestGold)" strokeWidth="2" />

        {/* Classical Laurel Wreaths */}
        <path
          d="M 20 54 C 18 38 26 24 38 20 M 80 54 C 82 38 74 24 62 20"
          stroke="url(#crestGold)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Heraldic Shield Body */}
        <path
          d="M 50 24 L 74 34 V 58 C 74 74 50 84 50 84 C 50 84 26 74 26 58 V 34 Z"
          stroke="url(#crestGold)"
          strokeWidth="2.2"
          fill="#130826"
        />

        {/* Micro Stars on Shield Rim */}
        <circle cx="50" cy="30" r="1.8" fill="url(#crestGold)" />
        <circle cx="36" cy="40" r="1.5" fill="url(#crestGold)" />
        <circle cx="64" cy="40" r="1.5" fill="url(#crestGold)" />
      </svg>

      {/* Embedded Hammet Logo Glyph in Center of Gold Shield */}
      <div className="absolute inset-0 flex items-center justify-center pt-2 pointer-events-none">
        <div className="relative h-7 w-7 filter drop-shadow-[0_1px_3px_rgba(255,215,0,0.6)]">
          <Image
            src="/icon-512x512.png"
            alt="Hammet Emblem"
            width={32}
            height={32}
            className="h-full w-full object-contain filter brightness-125"
          />
        </div>
      </div>
    </div>
  );
}

// ── REALISTIC BIOMETRIC OVI SMART CHIP (Optical Variable Ink) ──────────────────
function BiometricSmartChip() {
  return (
    <div className="relative flex flex-col items-end select-none">
      {/* 3D Gold Contact Pad */}
      <div className="relative flex h-8 w-11 items-center justify-center rounded-lg border border-[#F5D77F]/80 bg-gradient-to-br from-[#996515] via-[#D4AF37] to-[#F5D77F] p-1 shadow-lg shadow-black/40">
        {/* Silicon Die Contacts */}
        <div className="relative h-full w-full rounded border border-black/70 bg-[#B8860B]/90 flex items-center justify-center overflow-hidden">
          {/* Micro-Circuit Etched Traces */}
          <div className="absolute inset-0 grid grid-cols-3 gap-0.5 opacity-60">
            <div className="border-r border-black/50" />
            <div className="border-r border-black/50" />
            <div />
          </div>
          <div className="absolute inset-x-0 h-0.5 bg-black/60 top-1/2 -translate-y-1/2" />
          {/* Center Smart Dot */}
          <div className="relative z-10 h-2 w-2 rounded-full border border-black/80 bg-gradient-to-tr from-amber-200 to-amber-500 shadow-sm" />
        </div>
      </div>
      <span className="text-[8px] font-mono tracking-widest text-[#F5D77F] font-bold mt-1 shadow-sm">
        E-PASSPORT // CHIP
      </span>
    </div>
  );
}

// ── OFFICIAL RUBBER VISA INK STAMPS (Physical Passport Entry Marks) ────────────
function VisaStampFoundations() {
  return (
    <div className="relative inline-block select-none rotate-[-5deg] transition-transform duration-300 hover:rotate-0 hover:scale-105">
      <div className="rounded-2xl border-2 border-purple-500/80 bg-purple-500/10 p-3.5 text-purple-700 shadow-md backdrop-blur-sm dark:border-purple-400/80 dark:text-purple-300">
        <div className="flex items-center justify-between border-b border-purple-500/40 pb-1.5 text-[9px] font-mono font-black tracking-widest uppercase">
          <span>HAMMET ACADEMY</span>
          <span>ENTRY STAMP</span>
        </div>
        <div className="my-2 text-center">
          <p className="text-[10px] font-bold tracking-tight uppercase text-purple-600 dark:text-purple-200">
            SCHOOL OF AI FOUNDATIONS
          </p>
          <p className="text-sm font-black tracking-wider text-purple-800 dark:text-purple-100 font-mono mt-0.5">
            ACCREDITED // 12 OCT 2026
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-purple-500/40 pt-1 text-[8px] font-mono tracking-tight text-purple-600/80 dark:text-purple-300/80">
          <span>PORT: AI-01</span>
          <span>OFFICER #849</span>
          <span>★ VERIFIED ★</span>
        </div>
      </div>
    </div>
  );
}

function VisaStampAgents() {
  return (
    <div className="relative inline-block select-none rotate-[4deg] transition-transform duration-300 hover:rotate-0 hover:scale-105">
      <div className="rounded-2xl border-2 border-cyan-500/80 bg-cyan-500/10 p-3.5 text-cyan-700 shadow-md backdrop-blur-sm dark:border-cyan-400/80 dark:text-cyan-300">
        <div className="flex items-center justify-between border-b border-cyan-500/40 pb-1.5 text-[9px] font-mono font-black tracking-widest uppercase">
          <span>AUTONOMOUS SWARMS</span>
          <span>PORT: LANGGRAPH</span>
        </div>
        <div className="my-2 text-center">
          <p className="text-[10px] font-bold tracking-tight uppercase text-cyan-600 dark:text-cyan-200">
            MULTI-AGENT ORCHESTRATION
          </p>
          <p className="text-sm font-black tracking-wider text-cyan-800 dark:text-cyan-100 font-mono mt-0.5">
            PRODUCTION TIER // OCT 2026
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-cyan-500/40 pt-1 text-[8px] font-mono tracking-tight text-cyan-600/80 dark:text-cyan-300/80">
          <span>STATE: VERIFIED</span>
          <span>CAPSTONE: PASS</span>
          <span>✓ 100% BENCHMARK</span>
        </div>
      </div>
    </div>
  );
}

function VisaStampRag() {
  return (
    <div className="relative inline-block select-none rotate-[-3deg] transition-transform duration-300 hover:rotate-0 hover:scale-105">
      <div className="rounded-2xl border-2 border-emerald-500/80 bg-emerald-500/10 p-3.5 text-emerald-700 shadow-md backdrop-blur-sm dark:border-emerald-400/80 dark:text-emerald-300">
        <div className="flex items-center justify-between border-b border-emerald-500/40 pb-1.5 text-[9px] font-mono font-black tracking-widest uppercase">
          <span>CONTEXTUAL RETRIEVAL</span>
          <span>MILVUS DB</span>
        </div>
        <div className="my-2 text-center">
          <p className="text-[10px] font-bold tracking-tight uppercase text-emerald-600 dark:text-emerald-200">
            HYBRID VECTOR PIPELINE
          </p>
          <p className="text-sm font-black tracking-wider text-emerald-800 dark:text-emerald-100 font-mono mt-0.5">
            98.4% RECALL // MERIT
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-emerald-500/40 pt-1 text-[8px] font-mono tracking-tight text-emerald-600/80 dark:text-emerald-300/80">
          <span>LATENCY &lt; 15MS</span>
          <span>ZERO HALLUCINATION</span>
        </div>
      </div>
    </div>
  );
}

function VisaStampSecurity() {
  return (
    <div className="relative inline-block select-none rotate-[5deg] transition-transform duration-300 hover:rotate-0 hover:scale-105">
      <div className="rounded-2xl border-2 border-amber-500/80 bg-amber-500/10 p-3.5 text-amber-700 shadow-md backdrop-blur-sm dark:border-amber-400/80 dark:text-amber-300">
        <div className="flex items-center justify-between border-b border-amber-500/40 pb-1.5 text-[9px] font-mono font-black tracking-widest uppercase">
          <span>DEFENSE IN DEPTH</span>
          <span>RED-TEAM AUDIT</span>
        </div>
        <div className="my-2 text-center">
          <p className="text-[10px] font-bold tracking-tight uppercase text-amber-600 dark:text-amber-200">
            PROMPT INJECTION DEFENSE
          </p>
          <p className="text-sm font-black tracking-wider text-amber-800 dark:text-amber-100 font-mono mt-0.5">
            AIR-GAPPED // ACTIVE
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-amber-500/40 pt-1 text-[8px] font-mono tracking-tight text-amber-600/80 dark:text-amber-300/80">
          <span>SEMANTIC GUARDRAIL</span>
          <span>STATUS: PASS</span>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PASSPORT PAGE COMPONENT ──────────────────────────────────────────────
export default function PassportPage() {
  const { user } = useAuth();
  const fullName = user?.fullName ?? "Alex Chen";
  const firstName = fullName.split(" ")[0]?.toUpperCase() ?? "ALEX";
  const lastName = fullName.split(" ")[1]?.toUpperCase() ?? "CHEN";

  const [activeTab, setActiveTab] = useState<"id" | "stamps" | "ledger">("id");
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // 3D tilt tracking state for tactile physical passport feel
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isAutoTilting, setIsAutoTilting] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isAutoTilting) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -8;
    const tiltY = ((x - centerX) / centerX) * 8;
    setTilt({
      x: tiltX,
      y: tiltY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    if (!isAutoTilting) {
      setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
    }
  };

  const triggerInspect3D = () => {
    setIsAutoTilting(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const angle = (step * Math.PI) / 18;
      setTilt({
        x: Math.sin(angle) * 7,
        y: Math.cos(angle) * 9,
        glareX: 50 + Math.cos(angle) * 35,
        glareY: 50 + Math.sin(angle) * 35,
      });

      if (step >= 36) {
        clearInterval(interval);
        setIsAutoTilting(false);
        setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
      }
    }, 45);
  };

  const passportNumber = "HMT-8849206-X";
  const passportId = "did:hammet:ai-8f4b-2026";

  const handleCopyVerification = () => {
    navigator.clipboard.writeText(`https://hammet.ai/verify/${passportId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleDownload = () => {
    setDownloadingCert(true);
    setTimeout(() => {
      setDownloadingCert(false);
      window.print();
    }, 1200);
  };

  const badges = useLearnerStore((state) => state.badges);

  const competencies = [
    { name: "Model Fine-Tuning & LoRA Quantization", level: 96, percentile: "Top 3%" },
    { name: "Autonomous Agent Orchestration (LangGraph)", level: 91, percentile: "Top 5%" },
    { name: "Contextual Retrieval & Vector Indexing", level: 94, percentile: "Top 4%" },
    { name: "Prompt Architecture & Structured DSPy", level: 98, percentile: "Top 1%" },
    { name: "Edge Deployment & ONNX Runtime", level: 88, percentile: "Top 7%" },
  ];

  return (
    <div className="relative min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-10">
      <div className="mx-auto max-w-[1320px]">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-purple-300">
            <Fingerprint className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>OFFICIAL BIOMETRIC LEARNER PASSPORT &amp; CREDENTIALS</span>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                AI Skill Passport &amp; Credentials
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Your verifiable proof-of-work passport. Every course completion, benchmark evaluation, and code review is recorded into your verified decentralized credentials.
              </p>
            </div>

            {/* 3D Interactive Inspection Button */}
            <button
              onClick={triggerInspect3D}
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08] transition"
            >
              <RotateCw className={cn("h-3.5 w-3.5", isAutoTilting && "animate-spin")} />
              <span>Inspect 3D Card</span>
            </button>
          </div>
        </motion.section>

        {/* ── PASSPORT BOOKLET METAPHOR: TAB SWITCHER ── */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-black/[0.08] pb-4 dark:border-white/10">
          <button
            onClick={() => setActiveTab("id")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
              activeTab === "id"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "border border-black/[0.08] bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
            )}
          >
            <Fingerprint className="h-4 w-4" />
            <span>Pages 01–02: Biometric Identification</span>
          </button>

          <button
            onClick={() => setActiveTab("stamps")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
              activeTab === "stamps"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "border border-black/[0.08] bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
            )}
          >
            <Stamp className="h-4 w-4" />
            <span>Pages 03–04: Visa Endorsement Stamps (4)</span>
          </button>

          <button
            onClick={() => setActiveTab("ledger")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
              activeTab === "ledger"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "border border-black/[0.08] bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
            )}
          >
            <Key className="h-4 w-4" />
            <span>Pages 05–06: Cryptographic Proofs &amp; Merkle Ledger</span>
          </button>
        </div>

        {/* ── TOP STAGE: THE PHYSICAL-DIGITAL HYBRID 3D PASSPORT BOOKLET ── */}
        <div className="mb-14 grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          {/* 1. REALISTIC 3D BOUND BOOKLET WITH UNDERLYING STACKED PAGES */}
          <div className="relative mx-auto w-full max-w-[650px] py-4" style={{ perspective: "1500px" }}>
            {/* UNDERLYING PAGE LAYER 2 (Backing Page Shadow & Gilded Gold Edge) */}
            <div className="pointer-events-none absolute inset-x-3 -bottom-2 top-6 rounded-[36px] bg-[#090414] border border-[#D4AF37]/25 shadow-[0_35px_80px_rgba(0,0,0,0.85)]" />

            {/* UNDERLYING PAGE LAYER 1 (Middle Page Thickness Layer) */}
            <div className="pointer-events-none absolute inset-x-1.5 -bottom-0.5 top-5 rounded-[34px] bg-[#0E071F] border border-[#D4AF37]/35 shadow-lg" />

            {/* ── MAIN 3D TACTILE BIOMETRIC POLYCARBONATE DATA PAGE ── */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: "preserve-3d",
                transition: isAutoTilting ? "transform 0.08s ease-out" : "transform 0.15s ease-out",
              }}
              className="group relative w-full overflow-hidden rounded-[32px] border-2 border-[#D4AF37]/70 bg-gradient-to-br from-[#150A2E] via-[#0E061E] to-[#070213] p-6 sm:p-8 text-white shadow-[0_30px_70px_rgba(30,10,60,0.6),_inset_0_1px_1px_rgba(255,255,255,0.35),_inset_0_-1px_1px_rgba(0,0,0,0.8)]"
            >
              {/* ── REALISTIC LEFT BOOKLET SPINE & BINDING SEAM ── */}
              <div className="pointer-events-none absolute left-0 inset-y-0 w-6 border-r border-[#D4AF37]/30 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-around py-6 z-20">
                {/* 6 Realistic Thread Stitch Marks along the binding spine */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1 pl-1">
                    <div className="h-2.5 w-1 rounded-full bg-[#F5D77F] shadow-[0_0_4px_#F5D77F]" />
                    <div className="h-1 w-1 rounded-full bg-black/80" />
                  </div>
                ))}
              </div>

              {/* ── HAMMET LOGO WATERMARK IN THE BACKGROUND ── */}
              <div className="pointer-events-none absolute right-2 sm:right-6 top-8 h-64 w-64 sm:h-80 sm:w-80 select-none opacity-[0.14] dark:opacity-[0.18] mix-blend-screen filter drop-shadow-[0_0_35px_rgba(139,92,246,0.6)] z-0">
                <Image
                  src="/icon-512x512.png"
                  alt="Hammet Watermark"
                  width={320}
                  height={320}
                  className="h-full w-full object-contain filter brightness-125"
                  priority
                />
              </div>

              {/* Guilloche Fine-Line Security Paper Pattern */}
              <GuillocheSecurityPattern className="z-0" />

              {/* Dynamic Holographic Specular Rainbow Sheen */}
              <div
                className="pointer-events-none absolute inset-0 opacity-45 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-85 z-10"
                style={{
                  background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.5) 0%, rgba(6,182,212,0.35) 25%, rgba(236,72,153,0.3) 50%, rgba(245,215,127,0.3) 75%, transparent 100%)`,
                }}
              />

              {/* Micro-printed Security Border */}
              <div className="pointer-events-none absolute inset-2.5 rounded-[26px] border border-[#D4AF37]/35 z-10" />

              {/* ── ELEGANT FROSTED GLASS COMING SOON OVERLAY (PERMANENT BLUR) ── */}
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[30px] bg-slate-950/80 p-6 sm:p-8 text-center backdrop-blur-md border border-white/10 shadow-2xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-400/20 text-purple-400 mb-3 shadow-inner">
                  <Timer className="h-7 w-7 text-purple-300 animate-pulse" />
                </div>
                <span className="rounded-full bg-purple-500/20 border border-purple-400/30 px-3.5 py-1 text-[11px] font-mono font-bold tracking-widest text-purple-200 uppercase mb-2.5">
                  Accreditation In Progress
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white max-w-sm">
                  Official Passport &amp; Certification Coming Soon
                </h3>
                <p className="mt-2.5 max-w-md text-xs sm:text-sm text-slate-300 leading-relaxed">
                  The official biometric Hammet Passport &amp; Certification document design is currently being finalized. Your credentials, project milestones, and earned skill badges are verified and safely tracked in your account below.
                </p>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-3.5 py-1.5 text-xs text-slate-300 font-mono">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Verified Completion Records Safe</span>
                </div>
              </div>

              {/* ── TAB CONTENT: BIOMETRIC ID PAGE ── */}
              {activeTab === "id" && (
                <motion.div
                  key="id"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col justify-between min-h-[400px] pl-3"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {/* Header: Hammet Coat of Arms & Biometric Smart Chip */}
                  <div className="flex items-start justify-between border-b border-[#D4AF37]/30 pb-4">
                    <div className="flex items-center gap-3">
                      {/* Official Hammet Crest Seal with Embedded Logo */}
                      <HammetCrestSeal className="h-13 w-13 shrink-0 filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]" />
                      <div>
                        <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#F5D77F] uppercase flex items-center gap-1.5">
                          <span>HAMMET ACADEMY OF ADVANCED INTELLIGENCE</span>
                        </p>
                        <h2 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase mt-0.5">
                          PASSEPORT DE COMPÉTENCE // AI SKILL PASSPORT
                        </h2>
                      </div>
                    </div>

                    {/* 3D Realistic Biometric Smart Chip (OVI) */}
                    <BiometricSmartChip />
                  </div>

                  {/* Center: Learner Identity Grid */}
                  <div className="my-5 grid grid-cols-[115px_1fr] gap-5 items-center">
                    {/* Holographic UV Biometric Learner Photo with Kinegram Logo */}
                    <div className="relative">
                      <div className="relative h-34 w-28 overflow-hidden rounded-2xl border-2 border-[#D4AF37]/70 bg-gradient-to-b from-purple-900/70 to-slate-950 p-1 shadow-inner shadow-black">
                        {/* Learner Portrait Simulation */}
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 text-center relative overflow-hidden">
                          {/* Ghost Portrait Watermark */}
                          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 text-white text-base font-black shadow-lg">
                            {firstName[0]}
                            {lastName[0]}
                          </div>
                          <p className="mt-2 text-[9px] font-mono font-bold text-cyan-300">FELLOW #849</p>

                          {/* Optical Variable Kinegram Seal with Hammet Logo */}
                          <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37] bg-[#120824]/90 shadow-md backdrop-blur p-1">
                            <Image
                              src="/icon-512x512.png"
                              alt="Kinegram"
                              width={24}
                              height={24}
                              className="h-full w-full object-contain filter brightness-125"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Formal Biometric Fields with 3D Laser-Engraved Shadow */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#F5D77F]/75">Type / Type</span>
                        <p className="font-mono font-bold text-white">P</p>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#F5D77F]/75">Code / Code</span>
                        <p className="font-mono font-bold text-white">HMT</p>
                      </div>

                      <div className="col-span-2">
                        <span className="text-[9px] uppercase font-mono text-[#F5D77F]/75">
                          Passport No. / No. du Passeport
                        </span>
                        <p
                          className="font-mono font-extrabold text-cyan-300 tracking-wider text-sm sm:text-base"
                          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8), 0 0 10px rgba(6,182,212,0.4)" }}
                        >
                          {passportNumber}
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#F5D77F]/75">Surname / Nom</span>
                        <p className="font-bold text-white tracking-wide text-sm">{lastName}</p>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#F5D77F]/75">Given Names / Prénoms</span>
                        <p className="font-bold text-white tracking-wide text-sm">{firstName}</p>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#F5D77F]/75">Accredited Track</span>
                        <p className="font-bold text-purple-200">AI Foundations</p>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#F5D77F]/75">Cohort &amp; Status</span>
                        <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          2026 // Active
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Machine Readable Zone (MRZ) - ICAO Doc 9303 Standard */}
                  <div className="border-t border-[#D4AF37]/30 pt-3">
                    <div className="rounded-xl bg-black/75 p-2.5 font-mono text-[11px] sm:text-[12.5px] leading-tight tracking-[0.22em] text-[#F5D77F] select-all shadow-inner overflow-x-auto border border-black/40">
                      <p className="whitespace-nowrap font-bold">
                        P&lt;HMT{lastName}&lt;&lt;{firstName}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                      </p>
                      <p className="whitespace-nowrap font-bold mt-1 text-cyan-200">
                        HMT88492067HMT0409249M2610121&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TAB CONTENT: VISA ENDORSEMENT STAMPS ── */}
              {activeTab === "stamps" && (
                <motion.div
                  key="stamps"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col justify-between min-h-[400px] pl-3"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Stamp className="h-5 w-5 text-[#F5D77F]" />
                      <span className="text-xs font-mono font-bold tracking-widest text-[#F5D77F] uppercase">
                        VISAS // ENDORSEMENTS &amp; CAPSTONE STAMPS
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/60">PAGES 03–04</span>
                  </div>

                  {/* 4 Physical Ink Visa Stamps Laid Out Naturally */}
                  <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-items-center">
                    <VisaStampFoundations />
                    <VisaStampAgents />
                    <VisaStampRag />
                    <VisaStampSecurity />
                  </div>

                  <div className="border-t border-[#D4AF37]/30 pt-3 text-center">
                    <p className="text-[10px] font-mono text-[#F5D77F]/80">
                      ★ ALL STAMPS ELECTRONICALLY VERIFIED AGAINST DISTRIBUTED MERKLE ROOT ★
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── TAB CONTENT: CRYPTOGRAPHIC PROOFS & LEDGER ── */}
              {activeTab === "ledger" && (
                <motion.div
                  key="ledger"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col justify-between min-h-[400px] pl-3"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-cyan-400" />
                      <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                        CRYPTOGRAPHIC MERKLE RECORD // DECENTRALIZED PROOF
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                      STATUS: IMMUTABLE
                    </span>
                  </div>

                  {/* Proof Attributes */}
                  <div className="my-5 space-y-3 font-mono text-xs">
                    <div className="rounded-xl border border-white/10 bg-black/50 p-3">
                      <span className="text-[10px] text-white/50 block">DECENTRALIZED IDENTIFIER (DID)</span>
                      <span className="text-cyan-300 font-bold select-all break-all">{passportId}</span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/50 p-3">
                      <span className="text-[10px] text-white/50 block">MERKLE TREE ROOT HASH</span>
                      <span className="text-[#F5D77F] font-bold select-all break-all">
                        0x7F2A9C114B9ED5672AEB9904128FCD8849206A1B
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/10 bg-black/50 p-3">
                        <span className="text-[10px] text-white/50 block">SIGNATURE SCHEME</span>
                        <span className="text-white font-bold">Ed25519 Curve</span>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/50 p-3">
                        <span className="text-[10px] text-white/50 block">CONSENSUS ANCHOR</span>
                        <span className="text-emerald-300 font-bold">Arbitrum Block #263,941</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#D4AF37]/30 pt-3 flex items-center justify-between text-[10px] font-mono text-white/60">
                    <span>SHA-256 INTEGRITY VALID</span>
                    <span className="text-cyan-300">AUDITED BY ZERO-KNOWLEDGE PROOF</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* 2. OFFICIAL VERIFICATION & CERTIFICATE ACTIONS */}
          <div className="rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Verifiable Credential Actions
              </h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                <Check className="h-3 w-3" /> Authenticated
              </span>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Share your authenticated passport with hiring managers, recruiters, and AI teams worldwide.
            </p>

            <div className="mt-6 space-y-3">
              {/* Copy URL */}
              <button
                onClick={handleCopyVerification}
                className="w-full flex items-center justify-between rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  {copiedLink ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                  )}
                  {copiedLink ? "Link copied to clipboard!" : "Copy verification URL"}
                </span>
                <span className="text-[11px] text-slate-400">Shareable DID</span>
              </button>

              {/* Download Diploma PDF */}
              <button
                onClick={handleDownload}
                disabled={downloadingCert}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700"
              >
                {downloadingCert ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Generating Official PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Official Diploma PDF
                  </>
                )}
              </button>

              {/* View QR Code */}
              <button
                onClick={() => setQrModalOpen(!qrModalOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-black/[0.08] px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                  {qrModalOpen ? "Hide Verification QR" : "Show Verification QR"}
                </span>
                <span className="text-[11px] text-slate-400">Mobile Scanner</span>
              </button>

              {/* QR Modal Collapse */}
              <AnimatePresence>
                {qrModalOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-50/50 p-4 text-center dark:bg-purple-950/20"
                  >
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                      <QrCode className="h-24 w-24 text-slate-900" />
                    </div>
                    <p className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Scan to verify DID on hammet.ai/verify
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LinkedIn Share */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
              >
                <Share2 className="h-3.5 w-3.5" />
                Add Credential to LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* ── DEMONSTRATED TECHNICAL COMPETENCIES (Mastery Scores) ── */}
        <div className="mb-14 rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Demonstrated Technical Competencies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aggregated mastery scores calculated from automated test benchmarks, GPU labs, and code reviews.
              </p>
            </div>
            <span className="rounded-full bg-purple-100 px-3.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 w-fit">
              Top 3% Global Cohort Percentile
            </span>
          </div>

          <div className="space-y-4">
            {competencies.map((comp) => (
              <div key={comp.name}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-800 dark:text-slate-200">{comp.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {comp.percentile}
                    </span>
                    <span className="text-purple-600 dark:text-cyan-400 font-bold">{comp.level}% Mastery</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-700"
                    style={{ width: `${comp.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW CREDENTIALS & BADGES ARE EARNED ARCHITECTURE ── */}
        <div className="mb-14 rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-9 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div className="mb-8 border-b border-black/[0.06] pb-6 dark:border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-mono font-bold text-purple-700 dark:text-cyan-300">
                <Award className="h-3.5 w-3.5" />
                <span>CREDENTIAL ACCREDITATION ARCHITECTURE</span>
              </div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                How Badges &amp; Certificates Are Earned
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Hammet AI Academy utilizes a verifiable proof-of-work framework. Every micro-credential and the unified Passport Certificate require real architectural and theoretical proof.
              </p>
            </div>
          </div>

          {/* Two-Column Explainer Grid: 1. Skill Badges, 2. School Certificate / Passport */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Box 1: How Skill Badges Are Earned */}
            <div className="rounded-2xl border border-purple-500/20 bg-purple-50/40 p-6 dark:border-purple-500/15 dark:bg-purple-950/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                      1. How Skill Badges Are Earned
                    </h4>
                    <p className="text-[11px] font-mono text-purple-700 dark:text-cyan-400 font-semibold">
                      EARNED PER COURSE MODULE &amp; CAPSTONE
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200/70 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                      A
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Module Knowledge Tests:</strong> Each course module concludes with an automated test benchmark. Scoring <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">≥ 80%</span> satisfies the theoretical benchmark.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200/70 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                      B
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Attached Real-World Projects:</strong> Every course includes 5+ attached hands-on capstone projects. When you start a project, it automatically links to your Project Workspace.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200/70 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                      C
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Automated Code Rubric Approval:</strong> Submitting your repository URL and live sandbox demo validates architecture against automated test suites and rubric metrics.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200/70 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                      D
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Minting &amp; Social Sharing:</strong> Your heraldic certifier medallion is stamped with a unique hash (<code className="font-mono text-[11px] text-amber-500">0x...</code>), launching a celebratory claim modal with one-click export to LinkedIn &amp; socials.
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro-credential status note */}
              <div className="mt-5 pt-4 border-t border-purple-200/60 dark:border-white/10 flex items-center gap-2 text-[11px] font-mono text-purple-700 dark:text-cyan-400 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Earned upon completing module test benchmarks (≥80%) and capstone projects</span>
              </div>
            </div>

            {/* Box 2: How School Certificate / Passport Is Earned */}
            <div className="rounded-2xl border border-amber-500/25 bg-amber-50/40 p-6 dark:border-amber-500/20 dark:bg-amber-950/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-md">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                      2. How the Certificate &amp; Passport Are Earned
                    </h4>
                    <p className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
                      UNIFIED ACCREDITATION DIPLOMA
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 font-mono text-[10px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Unified Credential Concept:</strong> The Biometric Skill Passport acts as your official institution graduation certification — one unified verifiable proof document.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 font-mono text-[10px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Complete Full School Curriculum:</strong> Finish all 4 foundational tracks (Neural Networks, Autonomous Agents, Hybrid RAG, AI Safety).
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 font-mono text-[10px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Clear All Module Tests &amp; Projects:</strong> Complete all test questions across modules and ship required capstone repositories.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 font-mono text-[10px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                      4
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Accreditation Document Protected:</strong> The official biometric certificate design is being completed. Once your school requirements are verified and released, your diploma and Merkle anchor become downloadable.
                    </div>
                  </div>
                </div>
              </div>

              {/* Status footer without mock toggle buttons */}
              <div className="mt-5 pt-4 border-t border-amber-200/60 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-poppins font-bold text-amber-800 dark:text-amber-300">
                  Status: Accreditation in Progress ⏳
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 font-poppins text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-400/30">
                  <Timer className="h-3 w-3" /> Blurred Until Release
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MINTED SKILL BADGES (Certifier Ribbon Medallions) ── */}
        <div className="mb-14">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-poppins font-bold text-purple-700 dark:text-cyan-300">
                <GlowingMagicSparkle size="xs" />
                <span>CRYPTOGRAPHIC SKILL MEDALLIONS</span>
              </div>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white font-poppins">
                Minted Skill Badges
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-poppins">
                Cryptographically verified micro-credentials issued upon passing capstone projects &amp; benchmark tests.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-poppins font-bold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              <BadgeCheck className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
              <span>{badges.length} Badges Minted &amp; Anchored</span>
            </div>
          </div>

          <div className="relative min-h-[380px] rounded-3xl overflow-hidden p-4 sm:p-6 border border-purple-500/15 bg-white/40 dark:bg-slate-900/40">
            {/* Blurred Badges Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 filter blur-md select-none pointer-events-none opacity-35">
              {(badges.length > 0 ? badges : INITIAL_BADGES).map((badge) => (
                <SkillBadgeComponent key={badge.id} badge={badge} />
              ))}
            </div>

            {/* Frosted Glass Overlay with Coming Soon tag */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-slate-950/80 dark:bg-slate-950/85 backdrop-blur-md rounded-3xl border border-white/15">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500/20 border border-purple-400/40 text-purple-300 shadow-xl shadow-purple-500/20 mb-3">
                <GlowingMagicSparkle size="lg" className="animate-pulse" />
              </div>

              <span className="rounded-full bg-purple-600/30 border border-purple-400/40 px-4 py-1 text-xs font-poppins font-bold tracking-widest text-purple-200 uppercase mb-3 shadow-sm">
                COMING SOON • UNDER ACCREDITATION
              </span>

              <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-poppins">
                Skill Badges &amp; Medallions Coming Soon
              </h4>

              <p className="mt-2.5 max-w-lg text-xs sm:text-sm text-slate-100 font-medium font-poppins leading-relaxed">
                Cryptographically verified skill medallions and proof-of-work badges are being finalized. Complete course module benchmarks (≥80%) and capstone repositories to unlock and mint them upon release.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 px-3.5 py-2 text-xs font-poppins font-bold text-white shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Module Progress &amp; Scores Safe</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 px-3.5 py-2 text-xs font-poppins font-bold text-white shadow-sm">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" />
                  <span>Verified Rubric Criteria Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Badge Claiming Celebration Modal */}
        <BadgeCelebrationModal />
      </div>
    </div>
  );
}
