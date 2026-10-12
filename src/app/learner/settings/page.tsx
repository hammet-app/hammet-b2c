"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Check,
  Key,
  Smartphone,
  ExternalLink,
  Download,
  Sparkles,
  Lock,
  Globe,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils/utils";

type SettingsTab = "profile" | "notifications" | "security" | "billing";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || "Godswill Nwafor");
  const [headline, setHeadline] = useState("AI Systems Engineer & Full-Stack Architect");
  const [bio, setBio] = useState("Exploring deep learning architectures, LLM fine-tuning, and production multi-agent systems.");
  const [learningMode, setLearningMode] = useState<"guided" | "autonomous">("guided");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [courseAnnouncements, setCourseAnnouncements] = useState(true);
  const [projectReviews, setProjectReviews] = useState(true);

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-[1000px]">
        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <Settings className="h-4 w-4" />
            <span>Preferences & Account</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Customize your learning profile, notification preferences, security credentials, and billing records.
          </p>
        </motion.header>

        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Sidebar Tabs */}
          <nav className="space-y-1.5">
            {[
              { id: "profile", label: "Profile Details", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security & 2FA", icon: Shield },
              { id: "billing", label: "Billing & Invoices", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition text-left",
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 dark:bg-cyan-500 dark:text-slate-950"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]"
          >
            {/* ── TAB 1: PROFILE ────────────────────────────────────────────── */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Public Profile Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This information appears on your verifiable Skill Passport and project showcase.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Bio & Goals
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Learning Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLearningMode("guided")}
                        className={cn(
                          "p-3 rounded-xl border text-left text-xs transition",
                          learningMode === "guided"
                            ? "border-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-950/30 dark:border-cyan-400 dark:text-cyan-300"
                            : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-400"
                        )}
                      >
                        <div className="font-bold mb-0.5">Guided Learning</div>
                        <div className="text-[11px] opacity-80">Structured step-by-step milestones</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLearningMode("autonomous")}
                        className={cn(
                          "p-3 rounded-xl border text-left text-xs transition",
                          learningMode === "autonomous"
                            ? "border-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-950/30 dark:border-cyan-400 dark:text-cyan-300"
                            : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-400"
                        )}
                      >
                        <div className="font-bold mb-0.5">Self-Directed Focus</div>
                        <div className="text-[11px] opacity-80">Explore modules in any order</div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  {savedSuccess ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      Profile changes saved successfully!
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">All changes reflect in real-time</span>
                  )}

                  <Button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-6 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {/* ── TAB 2: NOTIFICATIONS ───────────────────────────────────────── */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Notification Channels & Alerts
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Choose what updates you want to receive across email and browser channels.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "email",
                      title: "Email Course Summaries",
                      desc: "Weekly digests and milestone achievements sent to your registered email.",
                      state: emailAlerts,
                      toggle: () => setEmailAlerts(!emailAlerts),
                    },
                    {
                      id: "streak",
                      title: "Daily Study Habit Reminders",
                      desc: "Gentle nudge 30 minutes before your scheduled learning time.",
                      state: streakReminders,
                      toggle: () => setStreakReminders(!streakReminders),
                    },
                    {
                      id: "courses",
                      title: "New School & Course Drops",
                      desc: "Instant notifications when new curriculum or capstone labs release.",
                      state: courseAnnouncements,
                      toggle: () => setCourseAnnouncements(!courseAnnouncements),
                    },
                    {
                      id: "reviews",
                      title: "Project Grading & Feedback",
                      desc: "Automated test runner results when you submit capstone repositories.",
                      state: projectReviews,
                      toggle: () => setProjectReviews(!projectReviews),
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={item.toggle}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          item.state ? "bg-purple-600 dark:bg-cyan-500" : "bg-slate-300 dark:bg-slate-700"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                            item.state ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: SECURITY ────────────────────────────────────────────── */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Security Credentials & Sessions
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your account password, multi-factor authentication, and connected devices.
                  </p>
                </div>

                {/* 2FA Card */}
                <div className="rounded-2xl bg-purple-50/70 p-5 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-cyan-300">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Secure your account with TOTP authenticator app verification.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className="rounded-xl font-semibold border-purple-200 dark:border-white/10"
                  >
                    {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                </div>

                {/* Active Session Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Active Devices
                  </h4>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Current Web Session • Windows (Chrome)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Active right now • IP Verified
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Current Device
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: BILLING ─────────────────────────────────────────────── */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Billing Records & Invoices
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    View your lifetime school subscriptions and downloadable VAT receipts.
                  </p>
                </div>

                {/* Subscription Tier Card */}
                <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 text-white shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-bold text-cyan-300">
                      Pro AI Learner Tier
                    </span>
                    <span className="text-xs font-medium text-slate-300">Lifetime License</span>
                  </div>
                  <h3 className="text-xl font-bold">School of AI Foundation</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Unlimited lab sandboxes, multi-agent capstones, and verified skill passport badges.
                  </p>
                </div>

                {/* Invoices List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Recent Transactions
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        ref: "TXN-HMT-894102",
                        item: "School of AI Foundation (Full Bundle)",
                        amount: "₦25,000",
                        date: "Oct 12, 2026",
                        status: "Paid",
                      },
                      {
                        ref: "TXN-HMT-782109",
                        item: "Introduction to AI & Vector Latent Spaces",
                        amount: "Free",
                        date: "Sep 28, 2026",
                        status: "Enrolled",
                      },
                    ].map((tx) => (
                      <div
                        key={tx.ref}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {tx.item}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {tx.ref} • {tx.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {tx.amount}
                          </span>
                          <button
                            type="button"
                            onClick={() => alert(`Downloading receipt for ${tx.ref}`)}
                            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-purple-600 border border-slate-200 shadow-sm hover:bg-slate-50 dark:bg-white/10 dark:border-white/10 dark:text-cyan-300"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
