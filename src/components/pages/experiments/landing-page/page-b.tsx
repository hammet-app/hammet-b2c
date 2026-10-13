"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Sparkles,
  Trophy,
  Globe,
  Users,
  Rocket,
  Building2,
  Bot,
  Calendar,
  Clock,
  Play,
  Pause,
  Video,
  ChevronDown,
  Laptop,
  Smartphone,
  Cpu,
  Flame,
  BarChart3,
  Terminal,
  Activity,
  ShieldCheck,
  Brain,
  GraduationCap,
  Layers,
  Star,
  Zap,
  Code2,
  Send,
  ExternalLink,
} from "lucide-react";

import { useTheme } from "@/lib/use-theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import {
  CharacterIconRow,
  NeuroBotIcon,
  TensorCubieIcon,
  MilestoneSignIcon,
  KnowledgeAppleIcon,
  QuantumBulbIcon,
  TerminalDoodleIcon,
} from "@/components/ui/character-icons";
import { Moving3DBackground } from "@/components/ui/moving-3d-background";
import {
  RagKnowledgeSketch,
  MilvusDatabaseSketch,
  McpProtocolSketch,
  ResearchBenchSketch,
  VllmEdgeChipSketch,
  AgentLoopSketch,
} from "@/components/ui/session-sketches";
import {
  DoodleReading,
  DoodleRunning,
  DoodleCoffee,
  DoodleFloat,
  DoodleDog,
  DoodleGroovy,
  DoodlePeekingCoder,
  DoodlePeekingGirl,
  DoodlePeekingBot,
} from "@/components/ui/open-doodles";
import { ExpandingCoursePanels } from "@/components/ui/expanding-course-panels";

const testimonials = [
  {
    brand: "CURSOR",
    quote:
      "Using the most AI-native tools like Hammet is an important competitive advantage for us to stay small while doing a lot.",
    name: "Michael Truell",
    title: "Co-founder & CEO",
    bgGradient: "from-red-950 via-red-900/90 to-red-600/70",
    borderColor: "border-red-500/30",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  },
  {
    brand: "FAIRE",
    quote:
      "Hammet's thoughtful design speeds up collaboration and decisions so we can deliver impact to our customers faster.",
    name: "Renee Solorzano",
    title: "Sr. Director of Product Design",
    bgGradient: "from-blue-950 via-blue-900/90 to-blue-600/70",
    borderColor: "border-blue-500/30",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
  },
  {
    brand: "ramp",
    quote:
      "Hammet Custom Agents help our team go beyond doing work with AI to building AI tools that do the work for them.",
    name: "Ben Levick",
    title: "Head of Operations & Internal AI",
    bgGradient: "from-amber-950 via-amber-900/90 to-amber-600/70",
    borderColor: "border-amber-500/30",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  },
];

const marqueeStats = [
  { icon: Globe, text: "100M+ queries in over 50 countries" },
  { icon: Rocket, text: "Over 50% of YC AI companies" },
  { icon: Users, text: "1.4M+ community members" },
  { icon: Building2, text: "62% of Fortune 100 use Hammet" },
  { icon: Trophy, text: "G2's #1 AI knowledge base for 3 consecutive years" },
  { icon: Bot, text: "500,000+ Autonomous Agents deployed" },
];

const courses = [
  {
    number: "01",
    title: "Introduction to AI",
    badge: "Foundations",
    level: "Beginner Friendly",
    duration: "7 modules • 4 hours",
    description: "What it is, what it isn't, and how to talk about it without bluffing. Build intuitive mental models of neural weights, training loops, and real capabilities.",
    topics: ["How AI learns", "Capabilities", "Limitations", "Neural weights", "Embeddings"],
    capstone: "Interactive LLM capability diagnostic matrix",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    gradient: "from-purple-600/20 via-indigo-600/10 to-transparent",
    icon: NeuroBotIcon,
  },
  {
    number: "02",
    title: "Generative AI Fundamentals",
    badge: "Core LLMs",
    level: "Hands-on",
    duration: "6 modules • 5 hours",
    description: "How transformer models produce text, code, and reasoning tokens—and where hallucination actually originates in latent space.",
    topics: ["Attention Math", "Token Probability", "Hallucination Audits", "Context Windows"],
    capstone: "Live hallucination detector & context guardrail",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    gradient: "from-blue-600/20 via-cyan-600/10 to-transparent",
    icon: TensorCubieIcon,
  },
  {
    number: "03",
    title: "AI Tools for Everyday Work",
    badge: "Productivity",
    level: "Practical",
    duration: "7 modules • 4.5 hours",
    description: "Faster research, cleaner writing, less administrative drudgery. The autonomous tools and Model Context Protocol workflows worth your time.",
    topics: ["Cursor AI", "LangGraph Swarms", "MCP Integrations", "Database RAG"],
    capstone: "Autonomous meeting & customer analysis agent swarm",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    gradient: "from-amber-600/20 via-orange-600/10 to-transparent",
    icon: QuantumBulbIcon,
  },
  {
    number: "04",
    title: "Prompt Engineering",
    badge: "Advanced",
    level: "Architect Level",
    duration: "6 modules • 5 hours",
    description: "Move beyond guesswork. Design structured system instructions, DSPy automated prompts, few-shot chains, and reliable JSON schema outputs.",
    topics: ["Few-Shot Chains", "DSPy Optimizers", "JSON Enforcement", "Red-Teaming"],
    capstone: "Production-grade customer support reasoning pipeline",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
    icon: TerminalDoodleIcon,
  },
];

const fellowshipPhases = [
  {
    phase: "Phase 01",
    duration: "Months 1–3",
    title: "Foundations & Autonomous Agent Architecture",
    tagline: "Master LLM orchestration from first principles",
    description: "Learn stateful reasoning loops, DSPy prompt compilation, vector index optimization, and the Model Context Protocol (MCP) in dedicated cloud GPU sandboxes.",
    deliverables: ["Custom autonomous multi-agent swarm", "High-throughput vector search pipeline", "Benchmarked red-team audit suite"],
    tech: ["PyTorch", "LangGraph", "DSPy", "Milvus", "CUDA"],
  },
  {
    phase: "Phase 02",
    duration: "Months 4–6",
    title: "Embedded Enterprise Apprenticeship",
    tagline: "Ship production AI features inside partner startups",
    description: "Work directly alongside senior engineers at leading AI companies (Cursor, Faire, Ramp). Solve actual latency, guardrail, and data-pipeline challenges.",
    deliverables: ["Production PRs merged into customer-facing repos", "Latency optimization under 50ms", "Live agent telemetry dashboard"],
    tech: ["Cursor", "FastAPI", "OpenTelemetry", "Pinecone", "vLLM"],
  },
  {
    phase: "Phase 03",
    duration: "Months 7–9",
    title: "Capstone & Enterprise Launch",
    tagline: "Build and deploy your proprietary intelligence system",
    description: "Architect a full-scale AI application or proprietary model fine-tuning pipeline. Present directly to venture capital partners and frontier lab founders.",
    deliverables: ["Full enterprise SaaS or open-source release", "Technical paper or benchmark report", "Direct employment or fellowship grant"],
    tech: ["DeepSpeed", "LoRA", "Next.js", "Docker", "Modal"],
  },
];

export default function HomePage() {
  const { theme, toggle } = useTheme();
  const [registeredSessions, setRegisteredSessions] = useState<Record<string, boolean>>({});
  const [onDemandFilter, setOnDemandFilter] = useState<string>("All");
  const [activeCourseTab, setActiveCourseTab] = useState<Record<string, "overview" | "curriculum" | "capstone">>({
    "01": "overview",
    "02": "overview",
    "03": "overview",
    "04": "overview",
  });
  const [activeFellowshipPhase, setActiveFellowshipPhase] = useState<number>(0);
  const [waitlistEmail, setWaitlistEmail] = useState<string>("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState<boolean>(false);

  const toggleRegisterSession = (sessionId: string) => {
    setRegisteredSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSubmitted(true);
  };

  /**
   * Smooth scroll animation with easeInOutCubic curve
   * Delivers a luxurious, fluid glide rather than an abrupt jumping snap
   */
  const handleNavScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (!element) return;

    const navOffset = 84;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 700;
    let start: number | null = null;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const ease =
        percentage < 0.5
          ? 4 * percentage * percentage * percentage
          : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        window.history.pushState(null, "", `#${targetId}`);
      }
    }

    window.requestAnimationFrame(step);
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F5F3FF] text-[#17131F] transition-colors duration-300 dark:bg-[#0D0A17] dark:text-white">
      {/* Moving 3D Background */}
      <Moving3DBackground />

      {/* Navigation - Sticky top-0 so it follows user on scroll */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F5F3FF]/85 dark:bg-[#0D0A17]/85 border-b border-black/[0.04] dark:border-white/[0.05] transition-all duration-200">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Hammet home"
          >
            <Image
              src="/icon-512x512.png"
              alt="Hammet"
              width={34}
              height={34}
              className="h-8 w-8 shrink-0 rounded-lg shadow-sm"
            />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-300 dark:via-violet-200 dark:to-cyan-300">
              Hammet
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <a
              href="#platform-preview"
              onClick={(e) => handleNavScroll(e, "platform-preview")}
              className="transition hover:text-purple-600 dark:hover:text-white"
            >
              Platform Tour
            </a>
            <a
              href="#courses"
              onClick={(e) => handleNavScroll(e, "courses")}
              className="transition hover:text-purple-600 dark:hover:text-white"
            >
              Courses
            </a>
            <a
              href="#fellowship"
              onClick={(e) => handleNavScroll(e, "fellowship")}
              className="transition hover:text-purple-600 dark:hover:text-white"
            >
              Fellowship
            </a>
            <Link
              href="/login?redirect=/learner"
              className="transition hover:text-purple-600 dark:hover:text-white"
            >
              Learner Portal
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-purple-700 dark:text-slate-300 dark:hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#17131F] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-950/15 transition hover:-translate-y-0.5 hover:bg-purple-800 dark:bg-white dark:text-[#17131F] dark:hover:bg-cyan-100"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with /hero-ai-robots.png in Background and Wordings On Top (Image 1) - FULL BLEED EDGE-TO-EDGE */}
      <section className="relative z-10 w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden pt-6 sm:pt-10 pb-12 border-b border-black/[0.06] dark:border-white/[0.06]">
        {/* Background Image: 3D AI Robots & Pearl Sphere on Liquid Wave covering the ENTIRE viewport */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-ai-robots.png"
            alt="3D AI Companion Robots flanking lavender pearl in ripple wave"
            fill
            priority
            className="object-cover object-bottom transition-transform duration-1000 ease-out"
          />
          {/* Subtle top and middle gradient masks for perfect text readability while keeping robots crystal clear */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F5F3FF]/90 via-[#F5F3FF]/45 to-transparent dark:from-[#0D0A17]/90 dark:via-[#0D0A17]/40 dark:to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F5F3FF] via-[#F5F3FF]/60 to-transparent dark:from-[#0D0A17] dark:via-[#0D0A17]/70 dark:to-transparent" />
        </div>

        {/* Foreground Content: Wordings Directly ON the Background */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 w-full pt-4 sm:pt-8">
          {/* Top Badge Row with Open Doodle Running Character */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Glowing HAMMET AI ACADEMY Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative inline-flex items-center group cursor-default select-none"
            >
              {/* Animated pulsating ambient halo glow */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 opacity-70 blur-md animate-pulse transition-opacity duration-500 group-hover:opacity-100" />

              {/* Outer iridescent glowing ring */}
              <div className="relative inline-flex items-center gap-2.5 rounded-full border border-purple-400/60 bg-white/95 px-5 py-2 shadow-[0_0_22px_rgba(147,51,234,0.38)] backdrop-blur-md dark:border-purple-400/40 dark:bg-slate-950/90 dark:shadow-[0_0_26px_rgba(168,85,247,0.45)]">
                {/* Live pulsing glowing status orb */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>

                <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-300 animate-spin" style={{ animationDuration: "9s" }} />

                {/* Badge typography */}
                <span className="font-poppins text-xs sm:text-[13px] font-black tracking-widest uppercase bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-800 bg-clip-text text-transparent dark:from-purple-200 dark:via-indigo-200 dark:to-cyan-200 drop-shadow-sm">
                  HAMMET AI ACADEMY
                </span>

                {/* Subtle verified shield / glow accent */}
                <span className="rounded-full bg-purple-100 px-2 py-0.5 font-poppins text-[10px] font-extrabold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-300/40 dark:border-purple-500/30">
                  OFFICIAL
                </span>
              </div>
            </motion.div>

            {/* Prominent Large AI Bot Runner Illustration (Reference Image 2) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:flex items-center gap-3.5 select-none"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-purple-300/70 bg-white/95 px-4 py-2 font-poppins text-xs sm:text-sm font-bold text-purple-950 shadow-md dark:border-purple-400/40 dark:bg-slate-900/95 dark:text-purple-200"
              >
                Sprint to Production AI! 🚀
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <Image
                  src="/ai-bot-runner.png"
                  alt="Hammet AI Sprint Bot"
                  width={140}
                  height={140}
                  priority
                  className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_10px_20px_rgba(139,92,246,0.25)] select-none pointer-events-none"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Two-Column Title & Subcopy directly overlaid on background */}
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* Left Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[clamp(2.8rem,5.8vw,5.5rem)] font-black leading-[1.03] tracking-[-0.045em] text-[#120D22] dark:text-white drop-shadow-sm">
                Turning Data and AI into{" "}
                <span className="relative inline-block bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-300 dark:via-violet-200 dark:to-cyan-300">
                  Real-World Impact
                </span>
              </h1>
            </motion.div>

            {/* Right Copy & Action Buttons in Clean Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-white/60 bg-white/95 p-6 sm:p-7 shadow-xl shadow-purple-950/5 dark:border-white/10 dark:bg-slate-950/90"
            >
              <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                Data alone has potential. AI unlocks it. We design intelligent solutions that convert information into strategy, automation into efficiency, and insights into real-world transformation—driving growth, resilience, and long-term value.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#7042F8] px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-purple-600/35 transition-all duration-300 hover:-translate-y-1 hover:bg-[#5E32DE] hover:shadow-purple-600/50"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#platform-preview"
                  onClick={(e) => handleNavScroll(e, "platform-preview")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-6 py-3.5 text-base font-bold text-slate-800 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/10 dark:text-white"
                >
                  Explore Platform
                  <ArrowUpRight className="h-4 w-4 opacity-70" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Spacer to ensure robots & lavender sphere stay prominently visible */}
        <div className="h-28 sm:h-44 lg:h-56 pointer-events-none" />

        {/* Partner Logos Strip (matching Image 1 bottom strip) */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 w-full pt-8 border-t border-black/[0.06] dark:border-white/[0.06]">
            <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Trusted by teams transforming software with AI
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-20 text-slate-700 dark:text-slate-300">
              {/* Coinbase */}
              <div className="flex items-center gap-2 font-black tracking-tighter text-xl text-slate-800 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0052FF] text-white text-xs font-bold">C</span>
                <span>coinbase</span>
              </div>

              {/* Spotify */}
              <div className="flex items-center gap-2 font-bold tracking-tight text-xl text-slate-800 dark:text-white">
                <svg className="h-6 w-6 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.308-1.76-8.792-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.809-.87 7.076-.505 9.721 1.113.294.18.386.563.207.857zm1.225-2.723c-.226.368-.71.482-1.078.256-2.69-1.653-6.79-2.134-9.97-1.168-.413.125-.85-.11-1.005-.523-.125-.413.11-.85.523-1.005 3.633-1.103 8.147-.564 11.274 1.362.368.226.482.71.256 1.078zm.105-2.835C14.692 8.95 8.085 8.73 4.244 9.897c-.495.15-1.02-.134-1.17-.63-.15-.494.135-1.02.63-1.17 4.412-1.338 11.706-1.082 15.421 1.124.444.263.59.84.327 1.284-.264.443-.84.59-1.285.326z"/>
                </svg>
                <span>Spotify</span>
              </div>

              {/* Slack */}
              <div className="flex items-center gap-2 font-black tracking-tight text-xl text-slate-800 dark:text-white">
                <span className="text-[#E01E5A] font-extrabold">#</span>
                <span>slack</span>
              </div>

              {/* Dropbox */}
              <div className="flex items-center gap-2 font-bold tracking-tight text-xl text-slate-800 dark:text-white">
                <svg className="h-5 w-5 text-[#0061FF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 10l6 4-6 4-6-4 6-4zm24 0l6 4-6 4-6-4 6-4zM6 14.5l6 4 6-4-6-4-6 4z"/>
                </svg>
                <span>Dropbox</span>
              </div>

              {/* Webflow */}
              <div className="flex items-center gap-2 font-black tracking-tight text-xl text-slate-800 dark:text-white">
                <span className="font-extrabold text-[#4353FF]">W</span>
                <span>Webflow</span>
              </div>

              {/* Zoom */}
              <div className="flex items-center gap-1.5 font-black tracking-tight text-xl text-[#0B5CFF] dark:text-[#2D8CFF]">
                <span>zoom</span>
              </div>
            </div>
          </div>
      </section>

      {/* ── SECTION: INSIDE THE PLATFORM / WHAT ACTUALLY GOES ON (Images 3 & 2) ── */}
      <section id="platform-preview" className="relative z-10 border-t border-black/[0.06] bg-gradient-to-b from-[#F7F6FF] via-white to-[#F7F6FF] py-24 sm:py-32 dark:border-white/[0.06] dark:from-[#0E0A1A] dark:via-[#0A0713] dark:to-[#0E0A1A] scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Section Header with bespoke AI badge (NO SPARKLES) */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-700 shadow-sm dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
              <Cpu className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
              <span className="tracking-wide uppercase font-mono text-[11px]">Live Learner Workspace Preview</span>
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-[#140F22] sm:text-5xl lg:text-6xl dark:text-white">
              What actually goes on after creating an account.
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              No endless theoretical videos. You get instant access to live cloud GPU sandboxes, hands-on neural model labs, and real-time skill passports across desktop and mobile.
            </p>
          </div>

          {/* Interactive Device Showcase Stage (Photorealistic Silver MacBook & iPhone matching Image 3) */}
          <div className="relative mx-auto mt-16 max-w-6xl">
            {/* Ambient Backlight Glow */}
            <div className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-purple-500/15 via-violet-500/15 to-cyan-500/15 blur-2xl dark:from-purple-600/20 dark:via-cyan-600/15 dark:to-violet-600/20" />

            {/* Devices & Floating Cards Container */}
            <div className="relative rounded-[2.5rem] border border-black/[0.08] bg-slate-100/50 p-4 sm:p-8 lg:p-12 dark:border-white/10 dark:bg-white/[0.02]">
              {/* Peeking Coder Doodle resting cleanly on the top border */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="absolute top-0 right-8 sm:right-20 -translate-y-[calc(100%-2px)] z-30 pointer-events-none flex flex-row items-end gap-3 select-none"
              >
                <div className="mb-4 rounded-2xl border border-purple-200/90 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900/95 dark:text-cyan-300">
                  Full GPU access in 20 seconds! ⚡
                </div>
                <DoodlePeekingCoder
                  className="h-20 sm:h-24 w-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] select-none pointer-events-none"
                  accentColor="#8B5CF6"
                />
              </motion.div>

              {/* Device Arrangement Grid: Laptop (Left/Center) + Phone (Right) */}
              <div className="grid items-end gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
                
                {/* 1. PHOTOREALISTIC SILVER MACBOOK PRO WITH ACTUAL USER LEARNER DASHBOARD */}
                <div className="relative flex flex-col items-center">
                  {/* Laptop Screen Lid */}
                  <div className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-400/50 bg-[#0B0813] shadow-2xl p-2 sm:p-2.5 shadow-purple-950/20">
                    {/* Top Notch & Camera Bar */}
                    <div className="relative flex h-8 sm:h-9 items-center justify-between border-b border-white/10 bg-[#120B22] px-4 rounded-t-xl text-xs">
                      {/* Window Dots */}
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F] shadow-sm" />
                      </div>
                      {/* Centered URL Badge */}
                      <Link
                        href="/login?redirect=/learner"
                        className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        hammet.ai/learner
                      </Link>
                      {/* User Profile */}
                      <Link
                        href="/login?redirect=/learner"
                        className="flex items-center gap-2 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        <span>Alex Morgan</span>
                        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      </Link>
                    </div>

                    {/* ACTUAL USER LEARNER DASHBOARD CONTENT (Matching learner-home/page-b.tsx) */}
                    <div className="relative bg-[#0F0A1F] p-4 sm:p-6 text-white rounded-b-xl overflow-hidden font-sans">
                      {/* Header Greeting & Cohort Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-950/60 px-3 py-1 font-poppins text-[10.5px] font-semibold text-purple-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                            <span>Cohort 2026</span>
                            <span className="h-1 w-1 rounded-full bg-purple-400/60" />
                            <span className="text-cyan-300 font-medium">Neural Intelligence Lab</span>
                          </div>
                          <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-white">
                            Welcome back, Alex.
                          </h3>
                        </div>
                        <Link
                          href="/login?redirect=/learner"
                          className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-white/20 transition-colors"
                        >
                          Active Session
                        </Link>
                      </div>

                      {/* Main Workspace Card with AI Bot Welcoming You */}
                      <Link
                        href="/register"
                        className="group relative block mt-4 rounded-2xl border border-purple-500/40 bg-[#160B30] p-5 sm:p-6 shadow-lg overflow-visible transition-all hover:border-purple-400/80 hover:shadow-purple-900/30"
                      >
                        {/* AI Bot Hanging and Welcoming You (Matching exact user learner dashboard) */}
                        <div className="absolute -top-10 right-4 z-20 pointer-events-none flex flex-col items-end">
                          <div className="mr-2 mb-1 rounded-full border border-purple-300/40 bg-white/95 px-2.5 py-0.5 text-[9px] font-bold text-slate-900 shadow-md">
                            Welcome! Let&apos;s build AI 🤖
                          </div>
                          <img
                            src="/ai-bot-welcome.png"
                            alt="AI Assistant bot hanging and welcoming you"
                            className="h-16 sm:h-20 w-auto object-contain drop-shadow-md select-none"
                          />
                        </div>

                        {/* Card Subtitle & Title */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                            <GraduationCap className="h-4 w-4 text-purple-400" />
                            <span>School of AI Foundations • AI Academy Workspace</span>
                          </div>
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 group-hover:translate-x-0.5 transition-transform">
                            Launch Lab →
                          </span>
                        </div>
                        <h4 className="mt-1 text-base sm:text-lg font-black text-white group-hover:text-cyan-200 transition-colors">
                          Module 04: Production Agent Orchestration &amp; DSPy
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-300 max-w-md">
                          Interactive workspace with GPU compute runtime. Chaining autonomous reasoning loops with live verification.
                        </p>

                        {/* Progress Bar & Checklist */}
                        <div className="mt-4 pt-3 border-t border-white/10 grid gap-3 sm:grid-cols-2 items-center">
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                              <span>Curriculum Progress</span>
                              <span className="text-cyan-300 font-bold">68% Complete</span>
                            </div>
                            <div className="mt-1.5 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />
                            </div>
                          </div>

                          {/* Mini Sandbox Terminal Output */}
                          <div className="rounded-xl border border-white/10 bg-black/60 p-2.5 font-mono text-[10px] text-slate-300">
                            <span className="text-emerald-400">&gt;&gt;&gt; swarm.evaluate(suite=&quot;eval_v2&quot;)</span>
                            <div className="text-cyan-300 font-bold">[PASS] 14/14 Reasoning steps verified</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* MacBook Metallic Silver Base Stand */}
                  <div className="relative h-3.5 sm:h-4 w-[98%] rounded-b-xl border-t border-slate-300 bg-gradient-to-b from-[#E2E1E6] via-[#CAC8D0] to-[#B0AEB8] shadow-xl">
                    <div className="mx-auto h-1 w-16 sm:w-24 rounded-b-md bg-[#8E8C94]" />
                  </div>
                </div>

                {/* 2. PHOTOREALISTIC IPHONE 15 PRO WITH MOBILE LEARNER EXPERIENCE */}
                <div className="relative mx-auto w-full max-w-[270px] rounded-[2.75rem] border-4 border-slate-600 bg-slate-950 p-2.5 shadow-2xl">
                  {/* Dynamic Island */}
                  <div className="mx-auto mt-0.5 h-4 w-24 rounded-full bg-black border border-white/15 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                  </div>

                  {/* Phone Screen Content */}
                  <div className="mt-2.5 rounded-[2rem] bg-[#120E22] p-4 text-white">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <Flame className="h-3 w-3 text-amber-400" />
                        <span className="font-bold text-amber-300">14-day streak</span>
                      </div>
                    </div>

                    {/* Mobile App Header */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Hammet Mobile</p>
                      <h4 className="text-sm font-extrabold text-white">School of AI Foundations</h4>
                    </div>

                    {/* Mobile Card: Quick Check Quiz */}
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-xs">
                      <span className="text-[10px] font-semibold text-cyan-300">Quick Check #3</span>
                      <p className="mt-1 font-medium text-slate-200 text-[11px] leading-snug">
                        Why does LoRA update low-rank matrices instead of full weights?
                      </p>
                      <div className="mt-2 space-y-1 text-[10px]">
                        <Link
                          href="/register"
                          className="block rounded-lg bg-purple-600/90 p-1.5 text-center font-bold text-white hover:bg-purple-500 transition-colors"
                        >
                          ✓ Drastically reduces VRAM footprint
                        </Link>
                        <Link
                          href="/register"
                          className="block rounded-lg bg-white/5 p-1.5 text-center text-slate-400 hover:bg-white/10 transition-colors"
                        >
                          Bypasses tokenizer
                        </Link>
                      </div>
                    </div>

                    {/* Skill Passport Badge */}
                    <Link
                      href="/register"
                      className="mt-3 block rounded-xl border border-purple-500/30 bg-purple-950/40 p-2.5 flex items-center gap-2 hover:border-purple-400/60 transition-colors"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">
                        AI
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white">Skill Passport</p>
                        <p className="text-[9px] text-purple-300">3 Verified Badges Earned →</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── FLOATING ACTIVITY WIDGETS (Matching Reference Image 2) ── */}
              {/* Widget 1: Timer Is On Card (Image 2) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -top-7 right-6 sm:right-12 hidden sm:block rounded-2xl border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-slate-900 max-w-[270px] z-20"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white tracking-wide">
                    TIMER IS ON ●
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Task: #78</span>
                </div>
                <h5 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                  Create project page with all tabs
                </h5>
                <div className="mt-2 text-2xl font-black font-mono tracking-tight text-purple-600 dark:text-cyan-400">
                  01:34:28
                </div>
                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                  <Link
                    href="/register"
                    className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                  >
                    <Pause className="h-3 w-3" />
                    Pause
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-600 transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    Complete
                  </Link>
                </div>
              </motion.div>

              {/* Widget 2: Cloud GPU Sandbox Session */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -bottom-6 left-6 sm:left-12 hidden sm:block z-20"
              >
                <Link
                  href="/register"
                  className="block rounded-2xl border border-black/10 bg-white p-4 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900 max-w-[260px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Cloud GPU Sandbox
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    NVIDIA A100 (80GB) Active
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-purple-600 dark:text-cyan-400">
                    <span>34.5 hrs compute remaining →</span>
                  </div>
                </Link>
              </motion.div>

              {/* Widget 3: Task Statistics Bar Chart (Image 2) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-8 right-12 hidden lg:block z-20"
              >
                <Link
                  href="/register"
                  className="block rounded-2xl border border-black/10 bg-white p-4 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900 w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-slate-900">
                      <BarChart3 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Tasks Statistics</p>
                      <p className="text-[10px] text-slate-400">By Days &amp; Status</p>
                    </div>
                  </div>

                  {/* Mini Bar Chart */}
                  <div className="mt-3 flex items-end justify-between h-14 gap-1.5 px-1 border-b border-slate-100 dark:border-white/10 pb-1">
                    <div className="w-3 rounded-t bg-cyan-400 h-[60%]" />
                    <div className="w-3 rounded-t bg-amber-400 h-[80%]" />
                    <div className="w-3 rounded-t bg-purple-500 h-[45%]" />
                    <div className="w-3 rounded-t bg-emerald-400 h-[95%]" />
                    <div className="w-3 rounded-t bg-cyan-400 h-[70%]" />
                    <div className="w-3 rounded-t bg-purple-500 h-[100%]" />
                  </div>
                  <p className="mt-2 text-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    +92% mastery rate this week →
                  </p>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: WHY HAMMET (Image 3 feedback - TasteSkill & Editorial Photography) ── */}
      <section id="why-hammet" className="relative z-10 border-y border-black/[0.06] bg-white/60 dark:border-white/[0.06] dark:bg-white/[0.02] py-24 sm:py-32 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-center">
            {/* Left Narrative Column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">
                <Brain className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                <span>WHY HAMMET // THE CLEAR PATH</span>
              </div>

              <h2 className="mt-6 text-2xl font-semibold leading-[1.35] tracking-[-0.025em] text-[#1E1929] dark:text-slate-100 sm:text-3xl lg:text-[2.65rem] lg:leading-[1.25]">
                You&apos;ve seen what people are doing with AI. Maybe
                you&apos;ve tried it yourself and got answers that felt
                flat. Maybe you&apos;re wondering if the person next to
                you is quietly pulling ahead.
              </h2>

              {/* Callout Quote */}
              <div className="relative mt-8 rounded-2xl border-l-4 border-purple-600 bg-purple-50/80 p-5 dark:border-cyan-400 dark:bg-purple-950/30">
                {/* Peeking Student Girl resting cleanly on the quote top edge */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="absolute top-0 right-4 sm:right-8 -translate-y-[calc(100%-2px)] z-20 pointer-events-none flex flex-row items-end gap-2.5 select-none"
                >
                  <div className="mb-3 rounded-2xl border border-purple-200/90 bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:border-cyan-500/30 dark:bg-slate-900/95 dark:text-cyan-300">
                    No boring theory — just build AI! 💡
                  </div>
                  <DoodlePeekingGirl
                    className="h-20 sm:h-24 w-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] select-none pointer-events-none"
                    accentColor="#8B5CF6"
                  />
                </motion.div>

                <p className="text-lg font-bold text-purple-950 dark:text-purple-200">
                  You don&apos;t need a computer science degree. You need
                  someone to show you properly.
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
                  <span className="text-xl">⚡</span>
                  <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Zero Jargon Walls</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">First-principles intuition without obscure math barriers.</p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
                  <span className="text-xl">🛠️</span>
                  <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Live Code &amp; GPU</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Interactive cloud sandboxes with PyTorch &amp; LangGraph.</p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
                  <span className="text-xl">🎓</span>
                  <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Proof-of-Work</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Verified skill passports backed by employer projects.</p>
                </div>
              </div>

              {/* Doodle Dog Illustration (Reference Image 5) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-6 flex items-center gap-4 rounded-2xl border border-purple-200/60 bg-white/95 p-3.5 shadow-sm dark:border-purple-500/20 dark:bg-slate-900/90"
              >
                <DoodleDog className="w-24 h-20 shrink-0" accentColor="#8B5CF6" />
                <div>
                  <span className="inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                    LEARN AT YOUR PACE 🐾
                  </span>
                  <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    No deadlines, no fake pressure. Master intuition first, then ship.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Relating Visual Photography Grid */}
            <div className="relative grid grid-cols-2 gap-4">
              {/* Photo 1: Dedicated AI Learner in Modern Studio */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl border border-purple-200/50 dark:border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=900"
                  alt="Student mastering AI engineering tools"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="rounded-full bg-purple-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Practical Mastery
                  </span>
                  <p className="mt-1 text-xs font-bold text-white">Hands-on from Day 1</p>
                </div>
              </div>

              {/* Photo 2: Collaborative Team AI Engineering */}
              <div className="relative aspect-[3/4] mt-8 overflow-hidden rounded-3xl shadow-xl border border-purple-200/50 dark:border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900"
                  alt="Team deploying autonomous agents together"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="rounded-full bg-cyan-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                    Verified Skills
                  </span>
                  <p className="mt-1 text-xs font-bold text-white">Direct Industry Impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses (Image 4 feedback - Upgraded Interactive Course Cards) */}
      <section id="courses" className="relative z-10 py-24 sm:py-32 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-700 dark:text-cyan-300">
              <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
              <span>THE FOUNDATION // PRODUCTION TRACKS</span>
            </div>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#17131F] dark:text-white sm:text-5xl lg:text-6xl">
              Four courses.
              <br />
              <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-purple-300 dark:via-violet-200 dark:to-cyan-300">
                One useful foundation.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              Each course is 6 to 7 hands-on modules. Small enough to finish over a weekend, deep enough to build real production AI systems.
            </p>
          </div>

          {/* Interactive Expanding Course Panels (Reference Image 3) */}
          <div className="relative mt-14">
            {/* Peeking AI Bot resting on top edge of expanding panels */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="absolute top-0 right-4 sm:right-12 -translate-y-[calc(100%-2px)] z-20 pointer-events-none flex flex-row items-end gap-3 select-none"
            >
              <div className="mb-3 rounded-2xl border border-purple-200/90 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900/95 dark:text-cyan-300">
                Hover any panel to expand track &amp; labs! ⚡
              </div>
              <DoodlePeekingBot
                className="h-20 sm:h-24 w-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] select-none pointer-events-none"
                accentColor="#06B6D4"
              />
            </motion.div>

            {/* Accordion Panels Component with Cursor Animation */}
            <ExpandingCoursePanels />
          </div>
        </div>
      </section>

      {/* Trusted by teams that ship (Image 4) */}
      <section className="relative z-10 py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-black tracking-[-0.045em] text-[#17131F] dark:text-white sm:text-5xl lg:text-6xl">
              Trusted by teams that ship.
            </h2>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl border ${item.borderColor} bg-slate-900 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-7 sm:p-8 shadow-xl transition-transform duration-500 hover:-translate-y-1.5`}
              >
                {/* Background Portrait Photo with Duotone Gradient Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${item.bgGradient} mix-blend-multiply opacity-90`} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Brand Logo Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-sm font-black tracking-widest text-white/90 uppercase">
                    {item.brand}
                  </span>
                </div>

                {/* Quote and Author Info */}
                <div className="relative z-10 mt-auto">
                  <p className="text-sm sm:text-base font-medium leading-relaxed text-white/95">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="mt-5 border-t border-white/15 pt-4">
                    <p className="text-xs font-bold text-white">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-white/60">
                      {item.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Infinite Moving Marquee Ticker */}
        <div className="relative mt-16 border-y border-black/[0.06] bg-black/[0.02] py-4.5 dark:border-white/[0.06] dark:bg-white/[0.01]">
          <div className="flex overflow-hidden select-none">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 28,
                ease: "linear",
                repeat: Infinity,
              }}
              className="flex shrink-0 items-center gap-12 whitespace-nowrap pr-12 text-xs font-semibold text-slate-500 dark:text-slate-400"
            >
              {[...marqueeStats, ...marqueeStats].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                    <span>{stat.text}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fellowship */}
      <section id="fellowship" className="relative z-10 scroll-mt-24 sm:scroll-mt-28">
        <div className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          {/* Peeking Coder Fellow resting cleanly on Fellowship card top border */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="absolute top-0 right-8 sm:right-20 -translate-y-[calc(100%-2px)] z-20 pointer-events-none flex flex-row items-end gap-3 select-none"
          >
            <div className="mb-3 rounded-2xl border border-cyan-400/30 bg-slate-900/95 px-3.5 py-1.5 text-xs font-bold text-cyan-200 shadow-[0_6px_24px_rgba(0,0,0,0.3)]">
              Admissions rolling for Cohort 2026! 🚀
            </div>
            <DoodlePeekingCoder
              className="h-20 sm:h-24 w-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] select-none pointer-events-none"
              accentColor="#38BDF8"
            />
          </motion.div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#140F22] px-7 py-12 shadow-2xl shadow-purple-950/25 dark:bg-[#0F0B1A] dark:shadow-black/60 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            {/* Ambient Background Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-32 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-[130px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-24 h-[520px] w-[520px] rounded-full bg-purple-600/25 blur-[130px]"
            />

            {/* Header Content */}
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                </span>
                Admissions Opening for Cohort 2026
              </div>

              <h2 className="mt-6 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                The Hammet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-300">AI Fellowship.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                Nine months, for ages 18 to 26, with real practice inside real AI companies. Zero simulated homework—only production models, multi-agent frameworks, and real users.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {["9 Months Intensive", "Ages 18–26", "Direct Company Placement", "Zero Tuition Upfront"].map(
                  (badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white/70"
                    >
                      <Check className="h-3.5 w-3.5 text-cyan-300" />
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* 3-Phase Interactive Curriculum Switcher */}
            <div className="relative z-10 mt-14">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Select Fellowship Phase
                </p>
                <span className="text-xs font-semibold text-cyan-300">
                  Click phase to explore curriculum
                </span>
              </div>

              {/* Phase Switcher Tabs */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {fellowshipPhases.map((phaseItem, idx) => {
                  const isActive = activeFellowshipPhase === idx;
                  return (
                    <button
                      key={phaseItem.phase}
                      onClick={() => setActiveFellowshipPhase(idx)}
                      className={cn(
                        "group relative rounded-2xl p-4 text-left transition-all duration-300 border",
                        isActive
                          ? "border-cyan-400/50 bg-gradient-to-br from-cyan-950/40 via-purple-950/30 to-black/60 shadow-lg shadow-cyan-950/40"
                          : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-xs font-extrabold uppercase tracking-wider",
                            isActive ? "text-cyan-300" : "text-white/40 group-hover:text-white/60"
                          )}
                        >
                          {phaseItem.phase}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                            isActive
                              ? "bg-cyan-400/20 text-cyan-200"
                              : "bg-white/5 text-white/40"
                          )}
                        >
                          {phaseItem.duration}
                        </span>
                      </div>
                      <h4
                        className={cn(
                          "mt-2 text-sm font-bold sm:text-base",
                          isActive ? "text-white" : "text-white/70 group-hover:text-white"
                        )}
                      >
                        {phaseItem.title}
                      </h4>
                      <p className="mt-1 line-clamp-1 text-xs text-white/40">
                        {phaseItem.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Active Phase Deep Dive Card */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0B0716]/95 p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFellowshipPhase}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-8 lg:grid-cols-2 lg:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                          {fellowshipPhases[activeFellowshipPhase].phase} • {fellowshipPhases[activeFellowshipPhase].duration}
                        </span>
                        <span className="text-xs font-medium text-white/40">
                          {fellowshipPhases[activeFellowshipPhase].tagline}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                        {fellowshipPhases[activeFellowshipPhase].title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/60">
                        {fellowshipPhases[activeFellowshipPhase].description}
                      </p>

                      <div className="mt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                          Verified Deliverables
                        </p>
                        <div className="space-y-2">
                          {fellowshipPhases[activeFellowshipPhase].deliverables.map((item) => (
                            <div key={item} className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300 mt-0.5" />
                              <span className="text-xs font-medium text-white/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                        Production Tooling & Stack
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {fellowshipPhases[activeFellowshipPhase].tech.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-3 py-1.5 text-xs font-mono font-semibold text-cyan-200"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-purple-300" />
                          <span className="text-xs font-bold text-purple-200">
                            Dedicated GPU Infrastructure
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-white/50 leading-relaxed">
                          Every fellow is provisioned with 8x NVIDIA H100 SXM5 compute access, self-hosted LangGraph clusters, and enterprise sandbox environments.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Partner Badges Strip */}
            <div className="relative z-10 mt-12 border-t border-white/10 pt-8">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
                Host Companies & AI Ecosystem Partners
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
                {["CURSOR", "FAIRE", "RAMP", "OPENAI ECOSYSTEM", "Y COMBINATOR", "ANTHROPIC"].map((partner) => (
                  <span key={partner} className="text-xs sm:text-sm font-black tracking-widest text-white/80">
                    {partner}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Waitlist Form with DoodleFloat Illustration (Reference Image 5) */}
            <div className="relative z-10 mt-12 rounded-2xl border border-white/10 bg-[#0B0716]/90 p-6 sm:p-8">
              {/* Floating DoodleFloat on top right */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex items-center gap-3 absolute -top-8 right-8 z-20 pointer-events-none select-none"
              >
                <div className="rounded-2xl border border-cyan-400/30 bg-slate-900/95 px-3 py-1 text-[11px] font-bold text-cyan-300 shadow-xl">
                  Deep flow state with frontier founders ✨
                </div>
                <DoodleFloat className="w-24 h-16" accentColor="#38BDF8" inkColor="#FFFFFF" />
              </motion.div>

              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h4 className="text-xl font-black text-white sm:text-2xl">
                    Ready to build production AI systems?
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-white/50">
                    Applications for Cohort 2026 are evaluated on rolling admission. Limited to 24 fellows per cohort.
                  </p>
                </div>

                {waitlistSubmitted ? (
                  <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-950/50 px-6 py-3.5 text-sm font-bold text-cyan-200 shadow-lg shadow-cyan-950/30">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                    <span>Application waitlisted! Check your inbox for interview prep.</span>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="Enter your engineer email..."
                      required
                      className="rounded-full border border-white/15 bg-black/40 px-5 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none sm:w-72"
                    />
                    <button
                      type="submit"
                      className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#140F22] transition hover:-translate-y-0.5 hover:bg-cyan-100"
                    >
                      <span>Join the waitlist</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: UPCOMING LIVE MASTERCLASSES & AI LABS (from Image 4) ── */}
      <section className="relative z-10 border-t border-black/[0.06] py-24 sm:py-32 dark:border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CharacterIconRow size="sm" />
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-cyan-400">
                  Live Masterclasses & AI Labs
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                Learn directly from engineers building frontier AI.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
              Interactive live training sessions, live red-teaming exercises, and production agent debugging.
            </p>
          </div>

          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06] border-y border-black/[0.06] dark:border-white/[0.06]">
            {/* Session 1 */}
            <div className="grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Wednesday, 4:00 PM GMT+1 • 5 upcoming cohorts
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[26px]">
                  LangGraph & Autonomous Agent Swarms: Multi-Agent Orchestration
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                  Build a production-grade autonomous agent swarm with LangGraph, Model Context Protocol (MCP), and guardrails. Learn to trace reasoning loops, inspect state checkpoints, and deploy agents that safely execute code and query databases.
                </p>
                <div className="mt-5">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-bold transition-all shadow-sm bg-[#EAF3FF] text-[#0066FF] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-cyan-300 dark:hover:bg-blue-900/60"
                  >
                    Register for Cohort →
                  </Link>
                </div>
              </div>

              {/* Right Side Card Illustration Banner */}
              <Link
                href="/register"
                className="group/card relative block overflow-hidden rounded-2xl border border-sky-200/80 bg-[#8EC5FC]/40 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-sky-500/20 dark:bg-sky-950/40"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Wednesdays at 4pm GMT+1
                  </span>
                  <NeuroBotIcon size="md" />
                </div>
                <h4 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-cyan-300 transition-colors">
                  LangGraph Swarms & Tools
                </h4>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE WORKSHOP
                  </span>
                  <span className="text-xs font-semibold text-slate-500">60 mins • Zoom →</span>
                </div>
              </Link>
            </div>

            {/* Session 2 */}
            <div className="grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Thursday, October 15, 7:00 PM GMT+1 • Live Interactive Workshop
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[26px]">
                  Self-Improving LLMs: Direct Preference Optimization (DPO) & RLHF
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                  Move beyond basic fine-tuning. Discover how alignment models evaluate candidate responses, compute pairwise preference losses, and improve answer quality autonomously over iterative feedback loops without complex reward models.
                </p>
                <div className="mt-5">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-bold transition-all shadow-sm bg-[#FFF4E5] text-[#D97706] hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60"
                  >
                    Register for Cohort →
                  </Link>
                </div>
              </div>

              {/* Right Side Card Illustration Banner */}
              <Link
                href="/register"
                className="group/card relative block overflow-hidden rounded-2xl border border-amber-200/80 bg-[#FFE29F]/40 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-amber-500/20 dark:bg-amber-950/40"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Self-improving models
                  </span>
                  <TensorCubieIcon size="md" />
                </div>
                <h4 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white group-hover/card:text-amber-600 dark:group-hover/card:text-amber-300 transition-colors">
                  Meet the models that get smarter over time
                </h4>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    ALIGNMENT LAB
                  </span>
                  <span className="text-xs font-semibold text-slate-500">75 mins • PyTorch →</span>
                </div>
              </Link>
            </div>

            {/* Session 3 */}
            <div className="grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Tuesday, 7:00 PM GMT+1 • 4 upcoming sessions
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[26px]">
                  Enterprise LLM Security: Red-Teaming, Prompt Injection & Guardrails
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                  Enterprise LLM security is more than system prompts. Implement defense-in-depth with semantic input sanitization, token output validation, and privilege escalation prevention to protect sensitive vector databases and internal APIs.
                </p>
                <div className="mt-5">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-bold transition-all shadow-sm bg-[#EAE8FF] text-[#4F46E5] hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                  >
                    Register for Cohort →
                  </Link>
                </div>
              </div>

              {/* Right Side Card Illustration Banner */}
              <Link
                href="/register"
                className="group/card relative block overflow-hidden rounded-2xl border border-indigo-200/80 bg-[#C7D2FE]/40 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-indigo-500/20 dark:bg-indigo-950/40"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Security & Guardrails
                  </span>
                  <QuantumBulbIcon size="md" />
                </div>
                <h4 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-300 transition-colors">
                  Red-Teaming Enterprise Agents
                </h4>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    DEFENSE LAB
                  </span>
                  <span className="text-xs font-semibold text-slate-500">60 mins • Live Q&A →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: ON-DEMAND SESSIONS & VIDEO BREAKDOWNS (from Image 5) ── */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12">
            <div className="flex items-center gap-4">
              <DoodleCoffee className="hidden md:block w-20 h-18 -my-2" accentColor="#8B5CF6" />
              <div>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                  On-demand sessions
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Stream practical AI architecture deep-dives and code breakdowns anytime.
                </p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setOnDemandFilter("All")}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  onDemandFilter === "All"
                    ? "bg-[#17131F] text-white dark:bg-white dark:text-[#17131F]"
                    : "border border-black/[0.08] text-slate-600 hover:bg-black/[0.04] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                )}
              >
                Reset
              </button>
              {["Prompting & RAG", "Autonomous Agents", "Model Fine-Tuning"].map((track) => (
                <button
                  key={track}
                  onClick={() => setOnDemandFilter(track)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5",
                    onDemandFilter === track
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
                      : "border border-black/[0.08] text-slate-600 hover:bg-black/[0.04] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                  )}
                >
                  {track}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* 6-Card Grid */}
          <div className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Peeking Student Illustration resting on top edge of on-demand sessions */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="absolute top-0 right-4 sm:right-12 -translate-y-[calc(100%-2px)] z-20 pointer-events-none flex flex-row items-end gap-3 select-none"
            >
              <div className="mb-3 rounded-2xl border border-purple-200/90 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900/95 dark:text-cyan-300">
                Stream practical deep-dives anytime! 🍿
              </div>
              <DoodlePeekingGirl
                className="h-20 sm:h-24 w-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] select-none pointer-events-none"
                accentColor="#EC4899"
              />
            </motion.div>
            {[
              {
                id: "od-1",
                badgeText: "Model Alignment",
                title: "The wiki that builds itself: Autonomous RAG with Contextual Retrieval",
                duration: "32 minutes",
                category: "Prompting & RAG",
                bannerBg: "bg-[#FFF2D6] dark:bg-amber-950/40",
                bannerBorder: "border-amber-200/80 dark:border-amber-500/20",
                icon: <TensorCubieIcon size="md" />,
                sketch: <RagKnowledgeSketch className="h-full w-full" />,
                tagColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
              },
              {
                id: "od-2",
                badgeText: "Vector Databases",
                title: "Your data migration playbook: Sync databases and workflows into Milvus",
                duration: "30 minutes",
                category: "Prompting & RAG",
                bannerBg: "bg-[#FFDFDF] dark:bg-rose-950/40",
                bannerBorder: "border-rose-200/80 dark:border-rose-500/20",
                icon: <MilestoneSignIcon size="md" />,
                sketch: <MilvusDatabaseSketch className="h-full w-full" />,
                tagColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
              },
              {
                id: "od-3",
                badgeText: "Tools & MCP",
                title: "Talk AI — Episode 29: Wait, the Model Context Protocol (MCP) can do that?",
                duration: "28 minutes",
                category: "Autonomous Agents",
                bannerBg: "bg-[#FFE7F0] dark:bg-pink-950/40",
                bannerBorder: "border-pink-200/80 dark:border-pink-500/20",
                icon: <QuantumBulbIcon size="md" />,
                sketch: <McpProtocolSketch className="h-full w-full" />,
                tagColor: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
              },
              {
                id: "od-4",
                badgeText: "Frontier Research",
                title: "Inside the research: The state of AI transformation and agentic benchmarks",
                duration: "45 minutes",
                category: "Autonomous Agents",
                bannerBg: "bg-[#DBEAFE] dark:bg-blue-950/40",
                bannerBorder: "border-blue-200/80 dark:border-blue-500/20",
                icon: <NeuroBotIcon size="md" />,
                sketch: <ResearchBenchSketch className="h-full w-full" />,
                tagColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
              },
              {
                id: "od-5",
                badgeText: "Edge Optimization",
                title: "Quantization & vLLM: Deploying Llama 3 on Edge Hardware without cost spikes",
                duration: "36 minutes",
                category: "Model Fine-Tuning",
                bannerBg: "bg-[#E0F2FE] dark:bg-cyan-950/40",
                bannerBorder: "border-cyan-200/80 dark:border-cyan-500/20",
                icon: <KnowledgeAppleIcon size="md" />,
                sketch: <VllmEdgeChipSketch className="h-full w-full" />,
                tagColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
              },
              {
                id: "od-6",
                badgeText: "Live Workshop",
                title: "Build your first production Agent: Stateful memory, tools, and execution loop",
                duration: "40 minutes",
                category: "Autonomous Agents",
                bannerBg: "bg-[#F3E8FF] dark:bg-purple-950/40",
                bannerBorder: "border-purple-200/80 dark:border-purple-500/20",
                icon: <TerminalDoodleIcon size="md" />,
                sketch: <AgentLoopSketch className="h-full w-full" />,
                tagColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
              },
            ]
              .filter((card) => onDemandFilter === "All" || card.category === onDemandFilter)
              .map((session) => (
                <Link
                  href="/register"
                  key={session.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]"
                >
                  <div>
                    {/* Illustrated Header Banner */}
                    <div
                      className={cn(
                        "relative flex h-48 w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-transform group-hover:scale-[1.01]",
                        session.bannerBg,
                        session.bannerBorder
                      )}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          {session.badgeText}
                        </span>
                        {session.icon}
                      </div>

                      {/* 2D Sketch Illustration in Center */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-4 pb-2 px-3">
                        {session.sketch}
                      </div>

                      <div className="relative z-10 flex items-end justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-slate-900 shadow-sm dark:bg-slate-900/95 dark:text-white group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Play className="h-4 w-4 ml-0.5 fill-current" />
                        </div>
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm dark:bg-slate-900/90 dark:text-slate-200">
                          {session.duration}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900 line-clamp-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
                      {session.title}
                    </h3>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold", session.tagColor)}>
                      {session.category}
                    </span>
                    <span className="text-xs font-semibold text-purple-600 dark:text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Watch session →
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 pb-28 pt-4 text-center sm:px-8 lg:px-10 lg:pb-36 flex flex-col items-center">
          <div className="mb-4">
            <DoodleGroovy className="w-24 h-24" accentColor="#8B5CF6" />
          </div>
          <p className="text-3xl font-black tracking-[-0.045em] text-[#17131F] dark:text-white sm:text-4xl lg:text-5xl">
            Your first course
            <span className="text-purple-600 dark:text-purple-400">
              {" "}
              is already waiting.
            </span>
          </p>

          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#17131F] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-purple-950/10 transition hover:-translate-y-0.5 hover:bg-purple-800 dark:bg-white dark:text-[#17131F] dark:hover:bg-cyan-100"
          >
            Create your account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-400 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span className="font-bold tracking-[-0.03em] text-slate-500 dark:text-slate-400">
            Hammet
          </span>

          <span>
            Learn AI properly. Build something useful.
          </span>
        </div>
      </footer>
    </main>
  );
}