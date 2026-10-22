"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  BookOpen,
  Cpu,
  Flame,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  FileBadge,
  Settings,
  Code2,
  Globe,
  Edit3,
  Save,
  Check,
  Camera,
  Upload,
  Trash2,
  Plus,
  X,
  ImageIcon,
  Crown,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { Button } from "@/components/ui/button";

const DEFAULT_SKILLS = [
  "PyTorch",
  "LangGraph",
  "DSPy",
  "Milvus Vector DB",
  "vLLM Serving",
  "Model Context Protocol (MCP)",
  "LoRA & QLoRA",
  "CUDA",
  "Python",
  "FastAPI",
];

const SUGGESTED_SKILLS = [
  "TensorRT",
  "Ollama",
  "Triton Inference",
  "Hugging Face",
  "DeepSpeed",
  "LangChain",
  "Vector Embeddings",
  "Kubernetes",
];

export default function LearnerProfilePage() {
  const { user } = useAuth();
  const isPro = useLearnerStore((state) => state.isPro);

  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "activity">("overview");
  const [isSaved, setIsSaved] = useState(false);

  // Profile image states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || "User_learner");
  const [username, setUsername] = useState("user_learner");
  const [email, setEmail] = useState(user?.email || "user_learner@gmail.com");
  const [bio, setBio] = useState(
    "AI Engineer & Systems Builder mastering autonomous agent swarms, vector retrieval with Milvus, and production DSPy compilation."
  );
  const [location, setLocation] = useState("San Francisco, CA");
  const [github, setGithub] = useState("https://github.com/hammet-ai-builder");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/hammet-learner");

  // Production skills stack state
  const [skills, setSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAvatar = localStorage.getItem("hammet_user_avatar");
    if (savedAvatar) setAvatarUrl(savedAvatar);

    const savedCover = localStorage.getItem("hammet_user_cover");
    if (savedCover) setCoverUrl(savedCover);

    const savedSkills = localStorage.getItem("hammet_user_skills");
    if (savedSkills) {
      try {
        const parsed = JSON.parse(savedSkills);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSkills(parsed);
        }
      } catch {
        // use default
      }
    }

    const savedName = localStorage.getItem("hammet_user_fullname");
    if (savedName) setFullName(savedName);

    const savedBio = localStorage.getItem("hammet_user_bio");
    if (savedBio) setBio(savedBio);

    const savedLocation = localStorage.getItem("hammet_user_location");
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const handleAvatarFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      localStorage.setItem("hammet_user_avatar", result);
      window.dispatchEvent(new Event("storage"));
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCoverUrl(result);
      localStorage.setItem("hammet_user_cover", result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    localStorage.removeItem("hammet_user_avatar");
    window.dispatchEvent(new Event("storage"));
  };

  const handleRemoveCover = () => {
    setCoverUrl(null);
    localStorage.removeItem("hammet_user_cover");
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    const updated = [...skills, trimmed];
    setSkills(updated);
    setNewSkillInput("");
    localStorage.setItem("hammet_user_skills", JSON.stringify(updated));
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    localStorage.setItem("hammet_user_skills", JSON.stringify(updated));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hammet_user_fullname", fullName);
    localStorage.setItem("hammet_user_bio", bio);
    localStorage.setItem("hammet_user_location", location);
    localStorage.setItem("hammet_user_skills", JSON.stringify(skills));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const initialLetter = fullName.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-28 pt-6 transition-colors duration-300 dark:bg-[#0B0813] sm:px-6 sm:pt-8 lg:px-10">
      {/* Hidden file inputs for avatar & cover */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAvatarFile(file);
        }}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCoverFile(file);
        }}
      />

      <div className="mx-auto max-w-6xl">
        {/* ── PROFILE HERO HEADER CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-black/[0.08] bg-white shadow-sm dark:border-white/10 dark:bg-[#140F22]"
        >
          {/* Header Ambient Cover Graphic with Upload Button */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-[#170E28] via-[#24143D] to-[#120B20] dark:from-[#0E071A] dark:via-[#190D2E] dark:to-[#0A0514]">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt="Profile Cover Background"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {/* Subtle, soft ambient glow */}
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
              </>
            )}

            {/* Change Cover Button */}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-xl bg-black/45 px-3 py-1.5 font-poppins text-xs font-bold text-white backdrop-blur-md border border-white/20 transition hover:bg-black/65 shadow-sm"
              title="Upload custom background banner"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Change Cover</span>
            </button>
          </div>

          {/* Profile Details Container */}
          <div className="relative px-6 pb-8 pt-0 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* User Avatar with Shifted-Down Text Block */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                {/* User Avatar Box with Click-to-Upload */}
                <div className="-mt-16 sm:-mt-20 group relative flex h-28 w-28 sm:h-32 sm:w-32 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-[#2D1B4E] to-[#160E29] font-poppins text-4xl sm:text-5xl font-black text-purple-200 shadow-xl overflow-hidden dark:border-[#140F22]">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initialLetter}</span>
                  )}

                  {/* Interactive Camera Hover Overlay */}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                    title="Upload profile photo"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="mt-1 font-poppins text-[10px] font-bold">Change</span>
                  </button>

                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-md dark:border-[#140F22]" />
                </div>

                {/* User Meta Information - cleanly sitting below the cover banner */}
                <div className="pt-1 sm:pt-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-poppins text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {fullName}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-300/40 bg-purple-50 px-2.5 py-0.5 font-poppins text-[11px] font-bold text-purple-700 dark:border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-300">
                      <ShieldCheck className="h-3 w-3 text-purple-600 dark:text-cyan-400" />
                      Verified Learner
                    </span>
                    {isPro && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-0.5 font-poppins text-[11px] font-black text-white shadow-sm tracking-wide ring-1 ring-amber-300/30">
                        <Crown className="h-3 w-3 fill-white" />
                        PRO Member
                      </span>
                    )}
                  </div>

                  {/* Shifted down with mt-2 and generous breathing room from banner line */}
                  <p className="mt-2 font-poppins text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                    @{username} • {email}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium font-poppins">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                      {location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                      Joined Cohort 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <button
                  onClick={() => setActiveTab(activeTab === "edit" ? "overview" : "edit")}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-2 font-poppins text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  {activeTab === "edit" ? "View Overview" : "Edit Profile"}
                </button>
                <Link
                  href="/learner/passport"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-poppins text-xs font-bold text-white shadow-sm transition hover:bg-purple-700"
                >
                  <FileBadge className="h-3.5 w-3.5" />
                  Skill Passport
                </Link>
              </div>
            </div>

            {/* Quick Cohort & Status Pill */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] pt-5 dark:border-white/10">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-400/40 bg-purple-50 px-3.5 py-1 text-xs font-poppins font-semibold text-purple-800 dark:border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>Cohort 2026</span>
                <span className="h-1 w-1 rounded-full bg-purple-400/60" />
                <span className="text-cyan-600 dark:text-cyan-300 font-bold">Neural Intelligence Lab</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 font-poppins">
                <span className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <strong className="text-slate-900 dark:text-white">14-Day Streak</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-cyan-500" />
                  <strong className="text-slate-900 dark:text-white">AI Practice Lab Active</strong>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── METRIC STATS STRIP ── */}
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-purple-200/50 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#140F22]">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Enrolled Tracks
            </p>
            <p className="mt-1 font-poppins text-2xl font-black text-slate-900 dark:text-white">
              4
            </p>
            <p className="mt-0.5 font-poppins text-[11px] font-medium text-purple-600 dark:text-cyan-400">
              Active Foundations
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200/50 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#140F22]">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Modules Completed
            </p>
            <p className="mt-1 font-poppins text-2xl font-black text-slate-900 dark:text-white">
              21 / 28
            </p>
            <p className="mt-0.5 font-poppins text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              75% Curriculum Done
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200/50 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#140F22]">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Badges
            </p>
            <p className="mt-1 font-poppins text-2xl font-black text-slate-900 dark:text-white">
              6
            </p>
            <p className="mt-0.5 font-poppins text-[11px] font-medium text-cyan-600 dark:text-cyan-300">
              Proof-of-Work Badges
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200/50 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#140F22]">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Compute Hours
            </p>
            <p className="mt-1 font-poppins text-2xl font-black text-slate-900 dark:text-white">
              134.5h
            </p>
            <p className="mt-0.5 font-poppins text-[11px] font-medium text-purple-600 dark:text-purple-300">
              45.5h Remaining
            </p>
          </div>
        </div>

        {/* ── TABS NAVIGATION ── */}
        <div className="mt-8 flex items-center gap-2 border-b border-black/[0.08] pb-3 dark:border-white/10">
          {(["overview", "edit", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 font-poppins text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/[0.05]"
              }`}
            >
              {tab === "overview" && "Profile Overview"}
              {tab === "edit" && "Edit Personal Details & Stack"}
              {tab === "activity" && "Recent Milestones"}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Left Column: Bio & Core Skills */}
            <div className="space-y-6">
              {/* Bio Card */}
              <div className="rounded-3xl border border-purple-200/60 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#140F22]">
                <h3 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                  About Me
                </h3>
                <p className="mt-3 font-poppins text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                  {bio}
                </p>

                {/* Technical Stack Tags in Poppins font */}
                <div className="mt-5 border-t border-black/[0.06] pt-4 dark:border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-poppins text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Production Stack &amp; Skills
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className="font-poppins text-[11px] font-semibold text-purple-600 hover:underline dark:text-cyan-400"
                    >
                      Edit Skills →
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-purple-200/80 bg-purple-50/80 px-3.5 py-1 font-poppins text-xs font-semibold text-purple-700 shadow-sm transition hover:scale-105 dark:border-purple-500/25 dark:bg-purple-950/40 dark:text-cyan-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Capstone Highlight */}
              <div className="rounded-3xl border border-purple-200/60 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#140F22]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-poppins text-xs font-bold text-purple-600 dark:text-cyan-400">
                    <FolderKanban className="h-4 w-4" />
                    <span>Featured Capstone Project</span>
                  </div>
                  <Link
                    href="/learner/projects"
                    className="font-poppins text-xs font-bold text-purple-600 hover:underline dark:text-cyan-300"
                  >
                    View All Projects →
                  </Link>
                </div>
                <h4 className="mt-2 font-poppins text-lg font-bold text-slate-900 dark:text-white">
                  Autonomous Multi-Agent Customer Support Swarm
                </h4>
                <p className="mt-1 font-poppins text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Built using LangGraph and Model Context Protocol (MCP) with live state checkpointing, automated red-teaming eval suites, and Milvus vector search.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-poppins text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    ✓ Evaluated &amp; Verified
                  </span>
                  <span className="font-poppins text-[11px] font-medium text-slate-400">
                    99.4% Latency SLA (&lt;48ms)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Passport Quick Card & Social Links */}
            <div className="space-y-6">
              {/* Hammet Pro Membership Status Card */}
              {isPro ? (
                <div className="rounded-3xl border border-amber-400/50 bg-gradient-to-br from-amber-500/15 via-[#1A1207] to-[#0E0B16] p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 font-poppins text-[10px] font-black tracking-wider text-white shadow-sm ring-1 ring-amber-400/40">
                      <Crown className="h-3 w-3 fill-white" />
                      HAMMET PRO
                    </span>
                    <span className="font-poppins text-xs font-bold text-amber-300">VIP Member</span>
                  </div>
                  <h4 className="mt-3 font-poppins text-lg font-black text-white">
                    Pro Privileges Active
                  </h4>
                  <p className="mt-1 font-poppins text-xs text-slate-300 leading-relaxed">
                    Custom passport themes, verified recruiter badges, interactive AI practice sandboxes, and portfolio themes unlocked.
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="font-poppins text-xs font-semibold text-amber-200/90">₦2,000 / month</span>
                    <Link
                      href="/learner/pro"
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 font-poppins text-xs font-bold text-white shadow-md transition hover:scale-105"
                    >
                      Manage Pro →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-black/[0.08] bg-slate-50 p-6 dark:border-white/10 dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 font-poppins text-[10px] font-bold text-purple-700 dark:text-purple-300">
                      <Crown className="h-3 w-3 text-purple-600 dark:text-cyan-400" />
                      MEMBERSHIP
                    </span>
                    <span className="font-poppins text-xs font-semibold text-slate-400">Standard</span>
                  </div>
                  <h4 className="mt-2.5 font-poppins text-base font-bold text-slate-900 dark:text-white">
                    Hammet Pro
                  </h4>
                  <p className="mt-1 font-poppins text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Unlock verified Pro badges, portfolio themes, and custom passport designs for just ₦2,000/mo.
                  </p>
                  <Link
                    href="/learner/pro"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 font-poppins text-xs font-bold text-white shadow-sm transition hover:bg-purple-700"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    Get Hammet Pro
                  </Link>
                </div>
              )}

              {/* Skill Passport Promo Card */}
              <div className="rounded-3xl border border-purple-400/40 bg-gradient-to-br from-purple-950/90 to-[#120B24] p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-purple-500/30 px-3 py-1 font-poppins text-[10px] font-bold tracking-wider text-purple-200 border border-purple-400/30">
                    PROOF-OF-WORK
                  </span>
                  <span className="font-poppins text-xs font-semibold text-cyan-300">#HMT-9942-8810</span>
                </div>
                <h4 className="mt-3 font-poppins text-lg font-black text-white">
                  Verified Skill Passport
                </h4>
                <p className="mt-1 font-poppins text-xs text-slate-300 leading-relaxed">
                  Cryptographically verified certificates of competency endorsed by top AI engineering partners.
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-poppins text-xs font-semibold text-slate-300">6 Verified Badges</span>
                  <Link
                    href="/learner/passport"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 font-poppins text-xs font-bold text-slate-900 shadow-md transition hover:bg-cyan-100"
                  >
                    Open Passport →
                  </Link>
                </div>
              </div>

              {/* Social Connections */}
              <div className="rounded-3xl border border-purple-200/60 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#140F22]">
                <h4 className="font-poppins text-sm font-bold text-slate-900 dark:text-white mb-3">
                  Connect &amp; Social
                </h4>
                <div className="space-y-2.5">
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 font-poppins text-xs font-semibold text-slate-700 transition hover:border-purple-400 dark:border-white/10 dark:text-slate-300"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                      GitHub Profile
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>

                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 font-poppins text-xs font-semibold text-slate-700 transition hover:border-purple-400 dark:border-white/10 dark:text-slate-300"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      LinkedIn / Portfolio
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: EDIT PROFILE FORM & SKILLS STACK ── */}
        {activeTab === "edit" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl border border-purple-200/60 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-[#140F22] max-w-3xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">
                  Edit Personal Details &amp; Skills
                </h3>
                <p className="font-poppins text-xs text-slate-500 dark:text-slate-400">
                  Update your public student profile, images, and technical skills stack.
                </p>
              </div>

              {isSaved && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-poppins text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <Check className="h-3.5 w-3.5" />
                  Changes Saved!
                </div>
              )}
            </div>

            {/* ── MEDIA ASSETS: PROFILE PICTURE & COVER IMAGE UPLOADERS ── */}
            <div className="mb-8 rounded-2xl border border-purple-200/60 bg-purple-50/40 p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <h4 className="font-poppins text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-cyan-300 mb-4">
                Profile Images &amp; Branding
              </h4>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* 1. Profile Avatar Uploader */}
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-600 to-cyan-400 font-poppins text-2xl font-black text-white overflow-hidden shadow-md">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar Preview" className="h-full w-full object-cover" />
                    ) : (
                      initialLetter
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="font-poppins text-xs font-bold text-slate-900 dark:text-white">
                      Profile Picture
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 font-poppins text-xs font-bold text-white transition hover:bg-purple-700"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload Photo</span>
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-poppins text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Cover Banner Uploader */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-24 shrink-0 rounded-xl border-2 border-purple-300 bg-gradient-to-r from-purple-700 to-indigo-600 overflow-hidden shadow-md">
                    {coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverUrl} alt="Cover Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/70">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="font-poppins text-xs font-bold text-slate-900 dark:text-white">
                      Cover Banner
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 font-poppins text-xs font-bold text-white transition hover:bg-purple-700"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload Cover</span>
                      </button>
                      {coverUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveCover}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-poppins text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PRODUCTION SKILLS STACK INTERACTIVE EDITOR ── */}
            <div className="mb-8 rounded-2xl border border-purple-200/60 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-poppins text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-cyan-300">
                    Production Stack &amp; Skills Editor
                  </h4>
                  <p className="font-poppins text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Add or remove the tools and frameworks visible on your public learner profile.
                  </p>
                </div>
                <span className="font-poppins text-xs font-semibold text-slate-400">
                  {skills.length} skills listed
                </span>
              </div>

              {/* Active Skills Tag List with Remove Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 font-poppins text-xs font-bold text-purple-700 shadow-sm dark:border-purple-500/40 dark:bg-purple-950/60 dark:text-cyan-300"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="rounded-full p-0.5 hover:bg-purple-200/80 dark:hover:bg-purple-800"
                      title={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Skill Input Row */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Type new skill (e.g. TensorRT, Triton, Ollama)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(newSkillInput);
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-300 bg-transparent px-3.5 py-2 font-poppins text-xs text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkillInput)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 font-poppins text-xs font-bold text-white transition hover:bg-purple-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Suggested Skills Pill Shortcuts */}
              <div>
                <p className="font-poppins text-[11px] font-semibold text-slate-400 mb-2">
                  Suggested AI Frameworks &amp; Tools:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleAddSkill(suggestion)}
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2.5 py-1 font-poppins text-[11px] font-medium text-slate-600 transition hover:border-purple-400 hover:text-purple-700 dark:border-white/20 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Standard Form Inputs */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 font-poppins text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 font-poppins text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 font-poppins text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 font-poppins text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Bio / Engineering Focus
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 font-poppins text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 font-poppins text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 font-poppins text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-poppins font-bold px-6 py-2.5 rounded-xl shadow-md shadow-purple-600/30"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("overview")}
                  className="rounded-xl border-slate-300 dark:border-white/10 font-poppins"
                >
                  View Profile
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── TAB 3: ACTIVITY & MILESTONES ── */}
        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl border border-purple-200/60 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-[#140F22] max-w-3xl"
          >
            <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white mb-6">
              Recent Milestones &amp; History
            </h3>

            <div className="relative pl-6 space-y-6 border-l-2 border-purple-200 dark:border-purple-900/60">
              {[
                {
                  title: "Completed Module 04: Production Agent Orchestration & DSPy",
                  date: "Today, 4:15 PM",
                  badge: "Module Verified",
                  desc: "Chained autonomous reasoning loops with live unit tests in cloud AI learning sandbox.",
                },
                {
                  title: "Earned Skill Passport Badge: RAG Architecture & Milvus",
                  date: "Yesterday",
                  badge: "Badge Earned",
                  desc: "Demonstrated contextual retrieval and vector indexing with sub-50ms latency.",
                },
                {
                  title: "Launched Interactive AI Practice Sandbox",
                  date: "3 days ago",
                  badge: "Practice Lab",
                  desc: "Ran hands-on code exercises for fine-tuning open weights with LoRA.",
                },
                {
                  title: "Joined Hammet AI Academy Cohort 2026",
                  date: "October 2026",
                  badge: "Onboarding",
                  desc: "Enrolled in School of AI Foundations.",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-purple-600 shadow-sm dark:border-[#140F22]" />
                  <div className="flex items-center gap-2">
                    <span className="font-poppins text-xs font-semibold text-purple-600 dark:text-cyan-400">
                      {item.date}
                    </span>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 font-poppins text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="mt-1 font-poppins text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 font-poppins text-xs text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
