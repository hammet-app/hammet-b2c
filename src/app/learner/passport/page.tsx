"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/lib/auth/auth-context";
import {
  NeuroBotIcon,
  TensorCubieIcon,
  MilestoneSignIcon,
  KnowledgeAppleIcon,
  QuantumBulbIcon,
  TerminalDoodleIcon,
} from "@/components/ui/character-icons";

// ── GUILLOCHE SECURITY BACKGROUND PATTERN (Official Passport Paper) ──────────
function GuillocheSecurityPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute inset-0 h-full w-full opacity-20", className)}
    >
      <defs>
        <linearGradient id="guillocheGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D77F" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Intricate concentric mathematical guilloche rosette curves */}
      <g stroke="url(#guillocheGold)" strokeWidth="0.75">
        {[20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((radius, i) => (
          <ellipse
            key={i}
            cx="300"
            cy="200"
            rx={radius * 1.5}
            ry={radius * 0.9}
            strokeDasharray={i % 2 === 0 ? "4 3" : "2 2"}
            transform={`rotate(${i * 18} 300 200)`}
          />
        ))}

        {/* Sinusoidal security waves */}
        <path d="M 0 50 Q 150 20 300 50 T 600 50" strokeOpacity="0.5" />
        <path d="M 0 100 Q 150 70 300 100 T 600 100" strokeOpacity="0.4" />
        <path d="M 0 150 Q 150 120 300 150 T 600 150" strokeOpacity="0.5" />
        <path d="M 0 200 Q 150 170 300 200 T 600 200" strokeOpacity="0.6" />
        <path d="M 0 250 Q 150 220 300 250 T 600 250" strokeOpacity="0.5" />
        <path d="M 0 300 Q 150 270 300 300 T 600 300" strokeOpacity="0.4" />
        <path d="M 0 350 Q 150 320 300 350 T 600 350" strokeOpacity="0.5" />

        {/* Fine crosshatch micro-grid */}
        <line x1="100" y1="0" x2="500" y2="400" strokeOpacity="0.25" strokeDasharray="3 3" />
        <line x1="500" y1="0" x2="100" y2="400" strokeOpacity="0.25" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

// ── GOLD EMBOSSED ACADEMY COAT OF ARMS ─────────────────────────────────────────
function GoldCrestSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="85%" stopColor="#AA771C" />
          <stop offset="100%" stopColor="#85580C" />
        </linearGradient>
      </defs>
      {/* Outer Star Ring */}
      <circle cx="50" cy="50" r="46" stroke="url(#crestGold)" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="41" stroke="url(#crestGold)" strokeWidth="2" />
      {/* Laurel Wreath */}
      <path
        d="M 22 55 C 20 40 28 26 40 22 M 78 55 C 80 40 72 26 60 22"
        stroke="url(#crestGold)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Central Neural Shield */}
      <path
        d="M 50 25 L 72 35 V 58 C 72 73 50 83 50 83 C 50 83 28 73 28 58 V 35 Z"
        stroke="url(#crestGold)"
        strokeWidth="2"
        fill="#140A26"
      />
      {/* Neural Core Star inside shield */}
      <circle cx="50" cy="52" r="5" fill="url(#crestGold)" />
      <line x1="50" y1="36" x2="50" y2="68" stroke="url(#crestGold)" strokeWidth="1.5" />
      <line x1="36" y1="52" x2="64" y2="52" stroke="url(#crestGold)" strokeWidth="1.5" />
      <circle cx="50" cy="36" r="2.5" fill="url(#crestGold)" />
      <circle cx="50" cy="68" r="2.5" fill="url(#crestGold)" />
      <circle cx="36" cy="52" r="2.5" fill="url(#crestGold)" />
      <circle cx="64" cy="52" r="2.5" fill="url(#crestGold)" />
    </svg>
  );
}

// ── OFFICIAL RUBBER VISA INK STAMPS (Physical Passport Entry Marks) ────────────
function VisaStampFoundations() {
  return (
    <div className="relative inline-block select-none rotate-[-6deg] transition-transform duration-300 hover:rotate-0 hover:scale-105">
      <div className="rounded-2xl border-2 border-purple-500/80 bg-purple-500/10 p-3.5 text-purple-700 shadow-sm backdrop-blur-sm dark:border-purple-400/80 dark:text-purple-300">
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
      <div className="rounded-2xl border-2 border-cyan-500/80 bg-cyan-500/10 p-3.5 text-cyan-700 shadow-sm backdrop-blur-sm dark:border-cyan-400/80 dark:text-cyan-300">
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
      <div className="rounded-2xl border-2 border-emerald-500/80 bg-emerald-500/10 p-3.5 text-emerald-700 shadow-sm backdrop-blur-sm dark:border-emerald-400/80 dark:text-emerald-300">
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
      <div className="rounded-2xl border-2 border-amber-500/80 bg-amber-500/10 p-3.5 text-amber-700 shadow-sm backdrop-blur-sm dark:border-amber-400/80 dark:text-amber-300">
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -5.5;
    const tiltY = ((x - centerX) / centerX) * 5.5;
    setTilt({
      x: tiltX,
      y: tiltY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const passportNumber = "HMT-8849206-X";
  const passportId = "did:hammet:ai-8f4b-2026";
  const verificationHash = "0x7F2A...4B9E";
  const signatureProof = "ed25519:3q9j9e...f4k21a";

  const handleCopyVerification = () => {
    navigator.clipboard.writeText(`https://hammet.ai/verify/${passportId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleDownload = () => {
    setDownloadingCert(true);
    setTimeout(() => {
      setDownloadingCert(false);
      alert(`Diploma PDF Certificate ${passportNumber} generated and downloaded.`);
    }, 1400);
  };

  const badges = [
    {
      id: "badge-1",
      title: "Neural Architect",
      desc: "4-bit LoRA adapter training, quantization & benchmark evaluation",
      icon: <TensorCubieIcon size="lg" />,
      issued: "Oct 2026",
      status: "Verified",
      grade: "Grade A+",
    },
    {
      id: "badge-2",
      title: "Agentic Swarm Engineer",
      desc: "Built multi-agent orchestrator with LangGraph, MCP tools & checkpoints",
      icon: <NeuroBotIcon size="lg" />,
      issued: "Oct 2026",
      status: "Verified",
      grade: "Grade A",
    },
    {
      id: "badge-3",
      title: "Hybrid RAG Specialist",
      desc: "Deployed Milvus contextual vector retrieval pipeline with 98% recall",
      icon: <QuantumBulbIcon size="lg" />,
      issued: "Oct 2026",
      status: "Verified",
      grade: "Grade A+",
    },
    {
      id: "badge-4",
      title: "AI Safety & Guardrails",
      desc: "Implemented defense-in-depth against prompt injections & data exfiltration",
      icon: <MilestoneSignIcon size="lg" />,
      issued: "Oct 2026",
      status: "Verified",
      grade: "Grade A",
    },
  ];

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
          <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
            <Fingerprint className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
            <span>OFFICIAL BIOMETRIC LEARNER PASSPORT // RECOGNISED CREDENTIAL</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            AI Skill Passport &amp; Credentials
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Your verifiable proof-of-work passport. Every course completion, benchmark evaluation, and code review is recorded into your verified decentralized credentials.
          </p>
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

        {/* ── TOP STAGE: THE PHYSICAL-DIGITAL HYBRID BIOMETRIC PASSPORT ── */}
        <div className="mb-14 grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          {/* 1. TACTILE 3D BIOMETRIC PASSPORT BOOKLET */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.15s ease-out",
            }}
            className="group relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[32px] border-2 border-[#D4AF37]/50 bg-gradient-to-br from-[#120824] via-[#0E061D] to-[#080312] p-7 text-white shadow-[0_32px_80px_rgba(76,29,149,0.38)]"
          >
            {/* Guilloche Fine-Line Security Paper Pattern */}
            <GuillocheSecurityPattern />

            {/* Dynamic Holographic Specular Rainbow Sheen */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-75"
              style={{
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4) 0%, rgba(6,182,212,0.3) 25%, rgba(236,72,153,0.2) 50%, rgba(245,215,127,0.2) 75%, transparent 100%)`,
              }}
            />

            {/* Micro-printed Security Border */}
            <div className="pointer-events-none absolute inset-2.5 rounded-[26px] border border-[#D4AF37]/30" />

            {/* ── TAB CONTENT: BIOMETRIC ID PAGE ── */}
            {activeTab === "id" && (
              <motion.div
                key="id"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col justify-between min-h-[380px]"
              >
                {/* Header: Republic / Academy Coat of Arms */}
                <div className="flex items-start justify-between border-b border-[#D4AF37]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <GoldCrestSeal className="h-12 w-12 shrink-0 filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" />
                    <div>
                      <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#F5D77F] uppercase">
                        HAMMET ACADEMY OF ADVANCED INTELLIGENCE
                      </p>
                      <h2 className="text-sm font-black tracking-widest text-white uppercase mt-0.5">
                        PASSEPORT DE COMPÉTENCE // AI SKILL PASSPORT
                      </h2>
                    </div>
                  </div>

                  {/* Golden Biometric Smart Chip Icon */}
                  <div className="flex flex-col items-end">
                    <div className="flex h-7 w-9 items-center justify-center rounded-md border border-[#D4AF37] bg-gradient-to-tr from-[#996515] via-[#D4AF37] to-[#F5D77F] p-1 shadow-md">
                      <div className="h-3 w-5 rounded-sm border border-black/60 bg-[#D4AF37]/90 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-black/80" />
                      </div>
                    </div>
                    <span className="text-[8px] font-mono tracking-widest text-[#F5D77F] mt-1">E-PASSPORT</span>
                  </div>
                </div>

                {/* Center: Learner Identity Grid */}
                <div className="my-5 grid grid-cols-[110px_1fr] gap-5 items-center">
                  {/* Holographic UV Biometric Learner Photo */}
                  <div className="relative">
                    <div className="relative h-32 w-28 overflow-hidden rounded-2xl border-2 border-[#D4AF37]/60 bg-gradient-to-b from-purple-900/60 to-slate-950 p-1 shadow-inner">
                      {/* Learner Portrait Simulation with UV Watermark */}
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 text-white text-base font-black shadow-md">
                          {firstName[0]}
                          {lastName[0]}
                        </div>
                        <p className="mt-2 text-[9px] font-mono font-bold text-cyan-300">FELLOW #849</p>
                      </div>

                      {/* Official Gold Seal Stamped Across Photo Corner */}
                      <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37] bg-[#120824]/90 text-[8px] font-bold text-[#F5D77F] shadow-md backdrop-blur">
                        HMT
                      </div>
                    </div>
                  </div>

                  {/* Formal Biometric Fields */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#F5D77F]/70">Type / Type</span>
                      <p className="font-mono font-bold text-white">P</p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#F5D77F]/70">Code / Code</span>
                      <p className="font-mono font-bold text-white">HMT</p>
                    </div>

                    <div className="col-span-2">
                      <span className="text-[9px] uppercase font-mono text-[#F5D77F]/70">Passport No. / No. du Passeport</span>
                      <p className="font-mono font-extrabold text-cyan-300 tracking-wider text-sm">{passportNumber}</p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#F5D77F]/70">Surname / Nom</span>
                      <p className="font-bold text-white tracking-wide">{lastName}</p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#F5D77F]/70">Given Names / Prénoms</span>
                      <p className="font-bold text-white tracking-wide">{firstName}</p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#F5D77F]/70">Accredited Track</span>
                      <p className="font-bold text-purple-200">AI Foundations</p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#F5D77F]/70">Cohort &amp; Status</span>
                      <p className="font-bold text-emerald-300 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        2026 // Active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Machine Readable Zone (MRZ) - OCR-B Standard */}
                <div className="border-t border-[#D4AF37]/30 pt-3">
                  <div className="rounded-xl bg-black/60 p-2.5 font-mono text-[11px] sm:text-[12px] leading-tight tracking-[0.22em] text-[#F5D77F] select-all shadow-inner overflow-x-auto">
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
                className="relative z-10 flex flex-col justify-between min-h-[380px]"
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
                className="relative z-10 flex flex-col justify-between min-h-[380px]"
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
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <span className="text-[10px] text-white/50 block">DECENTRALIZED IDENTIFIER (DID)</span>
                    <span className="text-cyan-300 font-bold select-all break-all">{passportId}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <span className="text-[10px] text-white/50 block">MERKLE TREE ROOT HASH</span>
                    <span className="text-[#F5D77F] font-bold select-all break-all">
                      0x7F2A9C114B9ED5672AEB9904128FCD8849206A1B
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <span className="text-[10px] text-white/50 block">SIGNATURE SCHEME</span>
                      <span className="text-white font-bold">Ed25519 Curve</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
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

        {/* ── MINTED SKILL BADGES (Micro-Credentials) ── */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Minted Skill Badges
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cryptographically verified micro-credentials issued upon passing capstone projects.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="group flex flex-col justify-between rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <div>
                  <div className="mb-4">{badge.icon}</div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
                    {badge.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-black/[0.05] dark:border-white/[0.05] text-[11px]">
                  <span className="text-slate-400 font-mono">{badge.issued}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-purple-600 dark:text-cyan-400 font-bold">{badge.grade}</span>
                    <span className="font-bold rounded px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      {badge.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
