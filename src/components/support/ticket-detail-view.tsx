"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { useTicketStore, HAMMET_SUPPORT_EMAIL } from "@/lib/store/use-ticket-store";
import type { LearnerSupportTicketMessage } from "@/lib/api/types/learner/response";
import { PriorityBadge, StatusBadge, CategoryBadge } from "./ticket-badges";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Clock,
  Copy,
  LoaderCircle,
  Mail,
  MessageCircle,
  Plus,
  Send,
} from "lucide-react";

const MESSAGE_PAGE_SIZE = 10;

export function TicketDetailView() {
  const {
    tickets,
    selectedTicketId,
    setSelectedTicketId,
    setIsCreateModalOpen,
    reloadTickets,
  } = useTicketStore();
  const { accessToken, refreshToken } = useAuth();
  const ticket = tickets.find((item) => item.id === selectedTicketId);

  const [messages, setMessages] = useState<LearnerSupportTicketMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const messageScrollRef = useRef<HTMLDivElement>(null);
  const prependScrollRef = useRef<{ height: number; top: number } | null>(null);
  const scrollToBottomRef = useRef(false);
  const activeTicketIdRef = useRef<string | null>(ticket?.id ?? null);
  activeTicketIdRef.current = ticket?.id ?? null;

  useEffect(() => {
    if (!ticket || !accessToken) {
      setMessages([]);
      return;
    }

    let active = true;
    setMessages([]);
    prependScrollRef.current = null;
    setNextCursor(null);
    setHasMore(false);
    setMessageError(null);
    setIsLoadingMessages(true);

    void learnerApi
      .getSupportTicketMessages(
        ticket.id,
        { limit: MESSAGE_PAGE_SIZE },
        accessToken,
        refreshToken,
      )
      .then((page) => {
        if (!active) return;
        setMessages(page.messages);
        setHasMore(page.hasMore);
        setNextCursor(page.nextCursor);
        scrollToBottomRef.current = true;
      })
      .catch((error: unknown) => {
        if (active) {
          setMessageError(
            error instanceof Error ? error.message : "Could not load this conversation.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingMessages(false);
      });

    return () => {
      active = false;
    };
  }, [ticket?.id, accessToken, refreshToken]);

  useLayoutEffect(() => {
    const container = messageScrollRef.current;
    if (!container) return;

    if (prependScrollRef.current) {
      const previous = prependScrollRef.current;
      container.scrollTop = previous.top + container.scrollHeight - previous.height;
      prependScrollRef.current = null;
    } else if (scrollToBottomRef.current) {
      container.scrollTop = container.scrollHeight;
      scrollToBottomRef.current = false;
    }
  }, [messages]);

  const loadOlderMessages = useCallback(async () => {
    if (!ticket || !accessToken || !hasMore || !nextCursor || isLoadingOlder) return;
    const container = messageScrollRef.current;
    if (container) {
      prependScrollRef.current = {
        height: container.scrollHeight,
        top: container.scrollTop,
      };
    }
    setIsLoadingOlder(true);
    setMessageError(null);
    try {
      const page = await learnerApi.getSupportTicketMessages(
        ticket.id,
        { limit: MESSAGE_PAGE_SIZE, before: nextCursor },
        accessToken,
        refreshToken,
      );
      if (activeTicketIdRef.current !== ticket.id) return;
      setMessages((current) => {
        const knownIds = new Set(current.map((message) => message.id));
        return [...page.messages.filter((message) => !knownIds.has(message.id)), ...current];
      });
      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    } catch (error) {
      if (activeTicketIdRef.current !== ticket.id) return;
      prependScrollRef.current = null;
      setMessageError(
        error instanceof Error ? error.message : "Could not load older messages.",
      );
    } finally {
      setIsLoadingOlder(false);
    }
  }, [ticket, accessToken, refreshToken, hasMore, nextCursor, isLoadingOlder]);

  if (!ticket) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center font-poppins dark:border-white/10 dark:bg-slate-900/40 sm:p-8">
        <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
          <MessageCircle className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Ticket Selected</h3>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Select a ticket to open its conversation, or create a new ticket.
        </p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-3.5 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-purple-700"
        >
          <Plus className="h-3.5 w-3.5" /> Create Ticket
        </button>
      </div>
    );
  }

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const canReply = ticket.status !== "resolved" && ticket.status !== "closed";

  const handleSendReply = async () => {
    const content = reply.trim();
    if (!content || !accessToken || isSending || !canReply) return;

    setIsSending(true);
    setMessageError(null);
    try {
      const sent = await learnerApi.replyToSupportTicket(
        ticket.id,
        content,
        accessToken,
        refreshToken,
      );
      if (activeTicketIdRef.current !== ticket.id) return;
      setMessages((current) => [...current, sent]);
      setReply("");
      scrollToBottomRef.current = true;
      reloadTickets();
    } catch (error) {
      setMessageError(
        error instanceof Error ? error.message : "Could not send your reply.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyId = () => {
    void navigator.clipboard.writeText(ticket.id);
    setCopiedId(true);
    window.setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyEmail = () => {
    void navigator.clipboard.writeText(HAMMET_SUPPORT_EMAIL);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/60 font-poppins">
      <div className="border-b border-slate-200/70 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <button
              onClick={() => setSelectedTicketId(null)}
              className="mt-0.5 cursor-pointer rounded-xl border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 lg:hidden"
              title="Back to Ticket List"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300">{ticket.id}</span>
                <button
                  onClick={handleCopyId}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
                  title="Copy Ticket ID"
                >
                  {copiedId ? <Check className="h-2.5 w-2.5 text-emerald-500" /> : <Copy className="h-2.5 w-2.5" />}
                  {copiedId ? "Copied" : "Copy ID"}
                </button>
                <CategoryBadge category={ticket.category} />
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
              <h2 className="mt-1.5 text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                {ticket.subject}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3 text-purple-500" /> Started {formattedDate}
              </p>
            </div>
          </div>
          <a
            href={`mailto:${HAMMET_SUPPORT_EMAIL}?subject=${encodeURIComponent(`Re: ${ticket.id} — ${ticket.subject}`)}`}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-500/20 dark:text-purple-300 sm:self-center"
          >
            <Mail className="h-3.5 w-3.5" /> Email support
          </a>
        </div>
      </div>

      <div className="flex flex-col">
        <div
          ref={messageScrollRef}
          onScroll={(event) => {
            if (event.currentTarget.scrollTop <= 36) void loadOlderMessages();
          }}
          className="h-[420px] space-y-4 overflow-y-auto bg-slate-50/50 px-3 py-4 dark:bg-slate-950/20 sm:px-5"
          aria-label="Ticket conversation"
        >
          {(isLoadingOlder || hasMore) && (
            <div className="flex justify-center pb-1">
              {isLoadingOlder ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-purple-500" />
              ) : (
                <button
                  type="button"
                  onClick={() => void loadOlderMessages()}
                  className="cursor-pointer text-[10px] font-medium text-purple-600 hover:underline dark:text-purple-300"
                >
                  Load earlier messages
                </button>
              )}
            </div>
          )}
          {isLoadingMessages ? (
            <div className="flex h-full items-center justify-center gap-2 text-xs text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin text-purple-500" /> Loading conversation…
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
              <MessageCircle className="h-6 w-6 text-purple-400" />
              <span>No messages in this conversation yet.</span>
            </div>
          ) : (
            messages.map((message) => {
              const isLearner = message.senderRole === "learner";
              const time = new Date(message.createdAt);
              return (
                <div key={message.id} className={`flex ${isLearner ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[75%] ${isLearner ? "rounded-br-md bg-purple-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"}`}>
                    <div className={`mb-1 flex items-center justify-between gap-5 text-[10px] font-semibold ${isLearner ? "text-purple-100" : "text-purple-700 dark:text-purple-300"}`}>
                      <span>{isLearner ? "You" : "Support"}</span>
                      <time dateTime={message.createdAt} className="font-normal opacity-80">
                        {Number.isNaN(time.getTime()) ? "" : time.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-xs leading-relaxed sm:text-sm">{message.content}</p>
                    {!!message.attachments?.length && (
                      <div className="mt-2 flex flex-col gap-1">
                        {message.attachments.map((attachment) => (
                          <a key={attachment} href={attachment} target="_blank" rel="noreferrer" className={`text-[11px] underline ${isLearner ? "text-purple-100" : "text-purple-700 dark:text-purple-300"}`}>
                            View attachment
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {messageError && (
            <div className="mx-auto flex max-w-lg items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {messageError}
            </div>
          )}
        </div>

        {canReply ? (
          <div className="border-t border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-slate-900/70 sm:p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/10 dark:border-white/10 dark:bg-slate-950/50">
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSendReply();
                  }
                }}
                maxLength={10_000}
                rows={2}
                placeholder="Write a message…"
                aria-label="Write a message"
                className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-2 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white sm:text-sm"
              />
              <button
                type="button"
                onClick={() => void handleSendReply()}
                disabled={!reply.trim() || isSending}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-3 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[10px] text-slate-400">Enter to send · Shift + Enter for a new line</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 border-t border-slate-200/70 bg-slate-50 px-4 py-4 text-xs text-slate-500 dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-400">
            <AlertCircle className="h-4 w-4" /> This ticket is {ticket.status} and can’t receive more replies.
            <button
              onClick={handleCopyEmail}
              className="font-semibold text-purple-700 underline dark:text-purple-300"
            >
              {copiedEmail ? "Email copied" : "Copy support email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
