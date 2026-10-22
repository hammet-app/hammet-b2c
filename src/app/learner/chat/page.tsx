"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Hash,
  Search,
  Users,
  Send,
  Paperclip,
  Code,
  Smile,
  Timer,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronDown,
  Pin,
  Bell,
  Rocket,
  ArrowRight,
  Crown,
  Laptop,
  Check,
  Copy,
  Terminal,
  Compass,
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useChatStore, MOCK_USERS, ChatMessage } from "@/lib/store/use-chat-store";
import { useLearnerStore } from "@/lib/store/use-learner-store";

export default function LearnerChatPage() {
  const { user } = useAuth();
  const isPro = useLearnerStore((state) => state.isPro);

  const {
    activeChannelId,
    setActiveChannelId,
    channels,
    messages,
    sendMessage,
    addReaction,
  } = useChatStore();

  const [inputContent, setInputContent] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMembersDrawer, setShowMembersDrawer] = useState(true);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const currentMessages = messages[activeChannelId] || [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;
    sendMessage(activeChannelId, inputContent.trim());
    setInputContent("");
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Group channels by category
  const generalChannels = channels.filter((c) => c.category === "General");
  const studyChannels = channels.filter((c) => c.category === "Study Tracks");
  const collabChannels = channels.filter((c) => c.category === "Collaboration");

  return (
    <div className="min-h-[calc(100vh-4rem)] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-[1520px]">
        {/* Page Sub-Header (Clean & Visible) */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 shrink-0 drop-shadow-[0_4px_12px_rgba(144,52,234,0.25)]">
                <Image
                  src="/chat-3d-bubble.png"
                  alt="Hammet Community Chat"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Hammet Community Chat
              </h1>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                ● 342 Builders Online
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time collaboration, neural study cohorts, project feedback &amp; peer code reviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              Cohort: Fall 2026
            </span>
            <span className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm dark:bg-purple-800/80 dark:border dark:border-purple-500/30 dark:text-purple-100">
              Global Relay: Connected
            </span>
          </div>
        </div>

        {/* Main Application Frame with Frosted Overlay */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950">
          {/* ── UNDERLYING RICH CHAT APPLICATION (BLURRED IN BACKGROUND) ────────── */}
          <div className="grid h-[780px] grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_260px] opacity-90 select-none pointer-events-none transition-all">
            {/* 1. LEFT SIDEBAR: CHANNELS & DIRECT MESSAGES */}
            <div className="hidden border-r border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/[0.08] dark:bg-slate-900/40 md:flex md:flex-col justify-between">
            <div className="space-y-5 overflow-y-auto">
              {/* Channel Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Find channel or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                />
              </div>

              {/* General Channels */}
              <div>
                <p className="px-2 mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  General Discussions
                </p>
                <div className="space-y-0.5">
                  {generalChannels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChannelId(c.id)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        activeChannelId === c.id
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{c.name}</span>
                      </div>
                      {c.unreadCount ? (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                            activeChannelId === c.id
                              ? "bg-white text-purple-700"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          )}
                        >
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Tracks */}
              <div>
                <p className="px-2 mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Study Tracks &amp; Labs
                </p>
                <div className="space-y-0.5">
                  {studyChannels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChannelId(c.id)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        activeChannelId === c.id
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{c.name}</span>
                      </div>
                      {c.unreadCount ? (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                            activeChannelId === c.id
                              ? "bg-white text-purple-700"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          )}
                        >
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collaboration Channels */}
              <div>
                <p className="px-2 mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Collaboration &amp; Demos
                </p>
                <div className="space-y-0.5">
                  {collabChannels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChannelId(c.id)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        activeChannelId === c.id
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{c.name}</span>
                      </div>
                      {c.unreadCount ? (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                            activeChannelId === c.id
                              ? "bg-white text-purple-700"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          )}
                        >
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Messages */}
              <div>
                <p className="px-2 mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Direct Messages
                </p>
                <div className="space-y-1">
                  {Object.values(MOCK_USERS).map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="relative">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-200">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white dark:border-slate-900",
                              u.status === "online"
                                ? "bg-emerald-500"
                                : u.status === "idle"
                                ? "bg-amber-400"
                                : "bg-slate-400"
                            )}
                          />
                        </div>
                        <span className="truncate">{u.name}</span>
                      </div>
                      {u.role === "PRO" ? (
                        <Crown className="h-3 w-3 text-amber-500" />
                      ) : u.role === "Mentor" ? (
                        <span className="rounded bg-purple-100 px-1 text-[9px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                          Mentor
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current User Quick Footer */}
            <div className="mt-4 border-t border-slate-200/80 pt-3 dark:border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-xs font-bold text-white shadow-sm">
                    {user?.fullName?.slice(0, 2).toUpperCase() || "AL"}
                  </div>
                  <div className="truncate">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {user?.fullName || "Alex Chen"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isPro ? "PRO AI Fellow" : "Learner"}
                    </p>
                  </div>
                </div>
                {isPro && (
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    PRO
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. CENTER: ACTIVE CHAT FEED & MESSAGE INPUT */}
          <div className="flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-950">
            {/* Channel Top Bar */}
            <div className="flex h-14 items-center justify-between border-b border-slate-200/80 px-4 dark:border-white/[0.08] dark:bg-slate-900/20 sm:px-6">
              <div className="flex items-center gap-2.5 truncate">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/[0.05] dark:text-slate-300">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {activeChannel.name}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                      {activeChannel.category}
                    </span>
                  </div>
                  <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {activeChannel.topic}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMembersDrawer(!showMembersDrawer)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Members</span>
                </button>
              </div>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              {/* Channel Welcome Banner */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-50/50 p-4 text-center dark:border-purple-500/20 dark:bg-purple-950/20">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                  <Hash className="h-5 w-5" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Welcome to #{activeChannel.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {activeChannel.topic}
                </p>
              </div>

              {/* Messages Feed */}
              {currentMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3 text-xs">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 font-bold text-white shadow-sm">
                    {msg.sender.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {msg.sender.name}
                      </span>
                      {msg.sender.role === "PRO" && (
                        <span className="flex items-center gap-0.5 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                          <Crown className="h-2.5 w-2.5" />
                          PRO
                        </span>
                      )}
                      {msg.sender.role === "Mentor" && (
                        <span className="rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.2 text-[9px] font-bold text-purple-600 dark:text-purple-300">
                          Mentor
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {msg.content}
                    </p>

                    {/* Optional Code Snippet Block */}
                    {msg.codeSnippet && (
                      <div className="my-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-[11px] text-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-1.5">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Terminal className="h-3 w-3 text-purple-400" />
                            <span>{msg.codeSnippet.title || "snippet.py"}</span>
                          </div>
                          <button
                            onClick={() =>
                              handleCopyCode(msg.id, msg.codeSnippet!.code)
                            }
                            className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white"
                          >
                            {copiedCodeId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 overflow-x-auto text-emerald-300">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Reactions Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => addReaction(msg.id, r.emoji)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => addReaction(msg.id, "❤️")}
                        className="rounded-lg border border-transparent px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="border-t border-slate-200/80 p-3 sm:p-4 dark:border-white/[0.08]">
              <form
                onSubmit={handleSend}
                className="relative rounded-2xl border border-slate-300/80 bg-slate-50/50 p-2 focus-within:border-purple-500 focus-within:bg-white focus-within:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:focus-within:border-purple-400 dark:focus-within:bg-slate-900"
              >
                <textarea
                  rows={2}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder={`Message #${activeChannel.name}... (Press Enter to send)`}
                  className="w-full resize-none bg-transparent px-2 text-xs text-slate-900 placeholder-slate-400 outline-none dark:text-white"
                />

                <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-white/[0.06]">
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/[0.06]"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/[0.06]"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/[0.06]"
                    >
                      <Smile className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputContent.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-transform hover:bg-purple-700 active:scale-95 disabled:opacity-40"
                  >
                    <span>Send</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR: MEMBERS & CHANNEL DETAILS */}
          {showMembersDrawer && (
            <div className="hidden border-l border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/[0.08] dark:bg-slate-900/40 lg:flex lg:flex-col justify-between">
              <div className="space-y-5 overflow-y-auto">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    About Channel
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {activeChannel.topic}
                  </p>
                </div>

                <div className="border-t border-slate-200/80 pt-3 dark:border-white/[0.08]">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Pinned Resources
                  </h3>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        📚 LangGraph State Persistence Spec
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Shared by Dr. Elena Rostova
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        ⚡ Unsloth Llama 3 Fine-Tuning Guide
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Colab + 4-bit LoRA config
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3 dark:border-white/[0.08]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Online Members
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      14 Active
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {Object.values(MOCK_USERS).map((u) => (
                      <div key={u.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              u.status === "online"
                                ? "bg-emerald-500"
                                : u.status === "idle"
                                ? "bg-amber-400"
                                : "bg-slate-400"
                            )}
                          />
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {u.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{u.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-purple-50 p-3 text-center dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Hammet Peer Code of Conduct
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Respectful, collaborative &amp; verifiable AI discussions.
                </p>
              </div>
            </div>
          )}
        </div>

        </div>
      </div>
    </div>
  );
}
