"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  Flame,
  PlayCircle,
  MoreVertical,
  CheckCircle2,
  Plus,
  Bookmark,
  Brain,
  Trash2,
  ExternalLink,
  Bell,
  Award,
  Search,
  Share2,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Archive,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/use-cart";
import { cn } from "@/lib/utils/utils";

// Exclusively AI Courses from School of AI Foundations
const MOCK_AI_LEARNING_COURSES = [
  {
    id: "ai-course-1",
    title: "Introduction to Artificial Intelligence & Modern LLMs",
    school: "School of AI Foundations",
    author: "Hammet AI Faculty • Dr. Sophia Vance",
    progress: 35,
    modulesCompleted: 4,
    totalModules: 12,
    lastAccessed: "2 hours ago",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ai-course-2",
    title: "Neural Networks & Deep Learning Architectures",
    school: "School of AI Foundations",
    author: "Dr. Michael Zhang, AI Research Fellow",
    progress: 15,
    modulesCompleted: 2,
    totalModules: 14,
    lastAccessed: "Yesterday",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ai-course-3",
    title: "Generative AI Systems: Prompt Engineering & RAG",
    school: "School of AI Foundations",
    author: "Alex Rivera, Principal AI Architect",
    progress: 60,
    modulesCompleted: 6,
    totalModules: 10,
    lastAccessed: "3 days ago",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ai-course-4",
    title: "Autonomous AI Agents & Tool-Use Execution",
    school: "School of AI Foundations",
    author: "Elena Rostova, Autonomous Systems Lead",
    progress: 0,
    modulesCompleted: 0,
    totalModules: 8,
    lastAccessed: "Not started",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800",
  },
];

const INITIAL_WISHLIST = [
  {
    id: "wishlist-1",
    title: "Computer Vision & Multimodal Transformer Networks",
    school: "School of AI Foundations",
    author: "Dr. Kenji Sato",
    price: 15000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "wishlist-2",
    title: "AI Safety, Alignment & RLHF Fundamentals",
    school: "School of AI Foundations",
    author: "Dr. Aris Thorne",
    price: 12000,
    rating: 4.85,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
  },
];

const INITIAL_LISTS = [
  {
    id: "list-1",
    name: "Core AI Foundations Track",
    description: "Curated progression to master fundamental machine learning and modern LLMs.",
    coursesCount: 2,
    progress: 25,
  },
  {
    id: "list-2",
    name: "Weekend Deep Dives: Agentic Systems",
    description: "Hands-on projects with autonomous function-calling and tool orchestration.",
    coursesCount: 1,
    progress: 0,
  },
];

const ARCHIVED_COURSES = [
  {
    id: "archived-1",
    title: "AI Readiness & Python for Data Science Pre-requisites",
    school: "School of AI Foundations",
    author: "Hammet Preparatory Lab",
    completedDate: "Completed on Oct 4, 2026",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
    certificateUrl: "#",
  },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MyLearningPage() {
  const [activeTab, setActiveTab] = useState<"all" | "lists" | "wishlist" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Schedule state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [scheduleTime, setScheduleTime] = useState("19:00");
  const [durationMins, setDurationMins] = useState("30");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [savedSchedule, setSavedSchedule] = useState<{
    days: string[];
    time: string;
    duration: string;
    active: boolean;
  } | null>(null);

  // Lists state
  const [userLists, setUserLists] = useState(INITIAL_LISTS);
  const [isNewListOpen, setIsNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");

  // Wishlist state
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);

  // Cart store integration
  const { addItem, hasItem } = useCart();
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const handleAddToCart = (course: (typeof INITIAL_WISHLIST)[0]) => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      type: "course",
    });
    setAddedItemIds((prev) => [...prev, course.id]);
  };

  const handleSaveSchedule = () => {
    setSavedSchedule({
      days: selectedDays,
      time: scheduleTime,
      duration: durationMins,
      active: true,
    });
    setIsScheduleOpen(false);
  };

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    setUserLists((prev) => [
      ...prev,
      {
        id: `list-${Date.now()}`,
        name: newListName,
        description: newListDesc || "Custom curated AI learning path.",
        coursesCount: 0,
        progress: 0,
      },
    ]);
    setNewListName("");
    setNewListDesc("");
    setIsNewListOpen(false);
  };

  const filteredAiCourses = MOCK_AI_LEARNING_COURSES.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10 bg-[#F8F7FF] dark:bg-[#0B0813] transition-colors duration-500">
      {/* Background Animated Gradient Mesh / Dynamic Theme Aura */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-cyan-400/15 via-purple-600/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[550px] w-[550px] rounded-full bg-gradient-to-t from-violet-600/10 via-pink-500/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Header with Unique Styling and Notion Peeking Human Illustration */}
        <div className="relative mb-10 mt-20 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col justify-between rounded-3xl border border-black/[0.05] bg-white/70 p-7 sm:p-9 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02]"
          >
            {/* Peeking Human Illustration: Notion-style girl grasping the card border and peeking out */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.2 }}
              className="absolute top-0 right-8 sm:right-16 -translate-y-[calc(100%-1px)] z-20 pointer-events-none flex flex-row items-end gap-3.5 select-none"
            >
              <div className="mb-4 rounded-2xl border border-purple-200/90 bg-white/95 px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.1)] backdrop-blur dark:border-white/10 dark:bg-slate-900/95 dark:text-cyan-300">
                Ready to learn AI! 💡
              </div>
              <img
                src="/peeking-human.png"
                alt="Peeking learner illustration"
                className="h-24 sm:h-28 w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] select-none pointer-events-none"
              />
            </motion.div>

            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
                <Brain className="h-3.5 w-3.5" />
                AI Learner Portal
              </div>

              <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                My learning
              </h1>

              <p className="mt-2.5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
                Continue your journey through the School of AI Foundations. Master neural networks, generative AI, and real-world autonomous systems.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Widgets: Extended to 2 equal columns to cover full width smoothly */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
          {/* Card 1: Start a new streak */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl group-hover:bg-amber-400/20 transition-all duration-500" />
            
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
                  <Flame className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Start a new streak</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                      0 days active
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">• Goal: 10 mins/day</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Build a daily learning habit. Learn for 5–10 minutes today in <strong className="text-purple-700 dark:text-cyan-300">Introduction to AI</strong> to ignite your streak!
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Next milestone: 3-Day Spark
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("all")}
                className="rounded-full border-amber-300/40 text-amber-800 hover:bg-amber-500/10 dark:border-amber-400/30 dark:text-amber-300"
              >
                Learn Now
              </Button>
            </div>
          </motion.div>

          {/* Card 2: Schedule learning time */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl group-hover:bg-cyan-400/20 transition-all duration-500" />

            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/20">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule learning time</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {savedSchedule?.active
                      ? `Active: ${savedSchedule.days.join(", ")} at ${savedSchedule.time}`
                      : "No events scheduled yet"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {savedSchedule?.active ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Scheduled for {savedSchedule.duration} mins per session. Browser reminders are enabled.
                  </span>
                ) : (
                  "Learners who set a consistent schedule are 3.5× more likely to finish their AI certifications."
                )}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
              <Button
                variant="outline"
                className="w-full justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white border-0 shadow-sm transition-all"
                onClick={() => setIsScheduleOpen(true)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {savedSchedule?.active ? "Adjust Learning Schedule" : "Schedule time"}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Courses Navigation Tabs with Animated Layout Pill */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/[0.06] pb-3 dark:border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm font-semibold">
            {[
              { id: "all", label: "All courses", count: MOCK_AI_LEARNING_COURSES.length },
              { id: "lists", label: "My Lists", count: userLists.length },
              { id: "wishlist", label: "Wishlist", count: wishlist.length },
              { id: "archived", label: "Archived", count: ARCHIVED_COURSES.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "relative pb-2.5 pt-1 px-1 transition-colors flex items-center gap-2",
                    isActive
                      ? "text-slate-950 dark:text-white font-bold"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "text-[11px] px-1.5 py-0.2 rounded-full",
                      isActive
                        ? "bg-purple-100 text-purple-700 dark:bg-cyan-500/20 dark:text-cyan-300 font-bold"
                        : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400"
                    )}
                  >
                    {tab.count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search bar inside courses tab */}
          {activeTab === "all" && (
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search your AI courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-black/[0.08] bg-white py-1.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
              />
            </div>
          )}
        </div>

        {/* TAB 1: ALL AI COURSES */}
        {activeTab === "all" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filteredAiCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 * i }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/[0.06] dark:bg-[#151221]"
              >
                {/* Course Banner Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category tag */}
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                    {course.school}
                  </div>

                  <Link
                    href={`/learner/ai-schools/school-1`}
                    className="absolute inset-0 flex items-center justify-center bg-purple-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-purple-700 shadow-2xl transition-transform duration-300 group-hover:scale-110">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                  </Link>
                </div>

                {/* Course Details */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-cyan-400">
                    {course.title}
                  </h3>

                  <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                    {course.author}
                  </p>

                  <div className="mt-auto">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {course.progress}% complete
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {course.modulesCompleted}/{course.totalModules} modules
                      </span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-700"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                      <span className="text-[11px] text-slate-400">
                        {course.lastAccessed}
                      </span>
                      <Link
                        href={`/learner/ai-schools/school-1`}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300 inline-flex items-center gap-1"
                      >
                        Continue
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* TAB 2: MY LISTS */}
        {activeTab === "lists" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Curated AI Learning Lists</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Organize and group AI courses to achieve specialized goals.</p>
              </div>
              <Button
                onClick={() => setIsNewListOpen(true)}
                className="rounded-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-black dark:hover:bg-cyan-400"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Create New List
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userLists.map((list) => (
                <div
                  key={list.id}
                  className="flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-[#151221]"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                        <Layers className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {list.coursesCount} courses
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {list.name}
                    </h4>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {list.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span>Progress</span>
                      <span>{list.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-purple-600 dark:bg-cyan-400"
                        style={{ width: `${list.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === "wishlist" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your AI Course Wishlist</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Courses you&apos;ve saved for future AI mastery.</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                <Bookmark className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Your wishlist is currently empty.</p>
                <Link href="/learner/ai-schools" className="mt-4 inline-block text-xs font-semibold text-purple-600 dark:text-cyan-400">
                  Browse School of AI Foundation courses →
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.map((item) => {
                  const inCart = hasItem(item.id) || addedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-[#151221]"
                    >
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        <div className="absolute top-2.5 right-2.5">
                          <button
                            onClick={() => setWishlist((prev) => prev.filter((w) => w.id !== item.id))}
                            className="rounded-full bg-black/60 p-1.5 text-white/80 hover:text-white backdrop-blur transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                          {item.school}
                        </span>
                        <h4 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.author}
                        </p>

                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.04]">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            ₦{item.price.toLocaleString()}
                          </span>

                          <Button
                            size="sm"
                            disabled={inCart}
                            onClick={() => handleAddToCart(item)}
                            className={cn(
                              "rounded-full text-xs font-semibold",
                              inCart
                                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                                : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-black"
                            )}
                          >
                            {inCart ? "In Cart ✓" : "Add to Cart"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: ARCHIVED */}
        {activeTab === "archived" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Archived & Completed Courses</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed training milestones and verified certificates.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ARCHIVED_COURSES.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-[#151221]"
                >
                  <div className="flex items-start gap-4">
                    <img src={item.image} alt={item.title} className="h-16 w-20 rounded-xl object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        100% Completed
                      </div>
                      <h4 className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">{item.completedDate}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
                    <Button variant="ghost" size="xs" className="text-purple-600 dark:text-cyan-400 text-xs gap-1">
                      <Award className="h-3.5 w-3.5" /> Certificate
                    </Button>
                    <span className="text-[11px] text-slate-400">Archived</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* INTERACTIVE MODAL: SCHEDULE LEARNING TIME */}
      <AnimatePresence>
        {isScheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduleOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#161226]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Learning Time</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Build a steady daily habit with custom reminders</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsScheduleOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {/* 1. Day of the week selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Learning Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedDays(selectedDays.filter((d) => d !== day));
                            } else {
                              setSelectedDays([...selectedDays, day]);
                            }
                          }}
                          className={cn(
                            "flex-1 min-w-[48px] py-2 rounded-xl text-xs font-bold transition-all text-center",
                            isSelected
                              ? "bg-purple-600 text-white shadow-sm dark:bg-cyan-400 dark:text-black"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Target Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Time of Day
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Session Length
                    </label>
                    <select
                      value={durationMins}
                      onChange={(e) => setDurationMins(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                </div>

                {/* 3. Notification Reminders */}
                <div className="flex items-center justify-between rounded-2xl bg-purple-50/70 p-4 dark:bg-purple-500/10 border border-purple-200/50 dark:border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-purple-600 dark:text-cyan-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Push Notifications</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Remind me 10 minutes prior</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={remindersEnabled}
                    onChange={(e) => setRemindersEnabled(e.target.checked)}
                    className="h-4 w-4 rounded accent-purple-600"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsScheduleOpen(false)}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSchedule}
                  className="flex-1 rounded-xl bg-purple-600 text-white hover:bg-purple-700 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 font-bold"
                >
                  Save Schedule
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW LIST MODAL */}
      <AnimatePresence>
        {isNewListOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewListOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#161226]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New List</h3>
                <button onClick={() => setIsNewListOpen(false)} className="rounded-full p-2 text-slate-400">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    List Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LLM Prompt Architecture"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Description (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of this custom track..."
                    value={newListDesc}
                    onChange={(e) => setNewListDesc(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setIsNewListOpen(false)} className="flex-1 rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleCreateList} className="flex-1 rounded-xl bg-purple-600 text-white dark:bg-cyan-400 dark:text-black">
                  Create List
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}