"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import {
  CalendarDays,
  Check,
  Clock3,
  Copy,
  AlertCircle,
  LoaderCircle,
  MessageCircle,
  Mail,
  Send,
  UserRound,
  X,
} from "lucide-react";

import type {
  HammetAdmin,
  SupportTicketConversationMessage,
  SupportTicketListItem,
  SupportTicketStatus,
} from "@/lib/api/types";
import { getInitials } from "@/lib/utils/roles";
import { CategoryBadge, PriorityBadge, StatusBadge } from "./ticket-badges";
import { useAuth } from "@/lib/auth/auth-context";
import {
  claimHammetSupportTicket,
  getHammetAdmins,
  getHammetSupportTicketMessages,
  replyToHammetSupportTicket,
  transferHammetSupportTicket,
} from "@/lib/api/hammet";

type AdminTicketDetailModalProps = {
  ticket: SupportTicketListItem | null;
  onClose: () => void;
  currentAdminId: string | null;
  currentAdminName: string | null;
  onRefreshTickets: () => void;
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Clipboard API can be unavailable (insecure context or denied
    // permission); fall back to the legacy selection-based copy.
    try {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "-1000px";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const succeeded = document.execCommand("copy");
      document.body.removeChild(field);
      return succeeded;
    } catch {
      return false;
    }
  }
}

export function AdminTicketDetailModal({
  ticket,
  onClose,
  currentAdminId,
  currentAdminName,
  onRefreshTickets,
}: AdminTicketDetailModalProps) {
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const { accessToken, refreshToken } = useAuth();
  const [messages, setMessages] = useState<SupportTicketConversationMessage[]>([]);
  const [messageCursor, setMessageCursor] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [reply, setReply] = useState("");
  const [supportAdmins, setSupportAdmins] = useState<HammetAdmin[]>([]);
  const [transferTargetId, setTransferTargetId] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [assignedAdminId, setAssignedAdminId] = useState<string | null>(
    ticket?.assignedAdmin?.id ?? null,
  );
  const [assignedAdminName, setAssignedAdminName] = useState<string | null>(
    ticket?.assignedAdmin?.fullName ?? null,
  );
  const [ticketStatus, setTicketStatus] = useState<SupportTicketStatus>(
    ticket?.status ?? "open",
  );
  const messageScrollRef = useRef<HTMLDivElement>(null);
  const prependScrollRef = useRef<{ height: number; top: number } | null>(null);
  const scrollToBottomRef = useRef(false);
  const activeTicketIdRef = useRef<string | null>(ticket?.id ?? null);
  activeTicketIdRef.current = ticket?.id ?? null;

  const open = ticket !== null;

  useEffect(() => {
    // Defer to the next frame so hydration completes before mounting the
    // portal; this avoids a synchronous state update inside the effect.
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ticket || !accessToken) {
      setMessages([]);
      return;
    }

    let active = true;
    setMessages([]);
    setMessageCursor(null);
    setHasMoreMessages(false);
    setMessageError("");
    setReply("");
    setTransferComplete(false);
    setTransferReason("");
    setIsSendingMessage(false);
    setIsClaiming(false);
    setAssignedAdminId(ticket.assignedAdmin?.id ?? null);
    setAssignedAdminName(ticket.assignedAdmin?.fullName ?? null);
    setTicketStatus(ticket.status);
    prependScrollRef.current = null;
    setIsLoadingMessages(true);

    void getHammetSupportTicketMessages(
      ticket.id,
      { limit: 10 },
      accessToken,
      refreshToken ?? (async () => null),
    )
      .then((page) => {
        if (!active) return;
        setMessages(page.messages);
        setHasMoreMessages(page.hasMore);
        setMessageCursor(page.nextCursor);
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

  useEffect(() => {
    const isAssignedActive = Boolean(
      ticket &&
        currentAdminId &&
        assignedAdminId === currentAdminId &&
        ticketStatus !== "resolved" &&
        ticketStatus !== "closed",
    );
    if (!ticket || !accessToken || !isAssignedActive) {
      setSupportAdmins([]);
      setTransferTargetId("");
      return;
    }

    let active = true;
    setIsLoadingAdmins(true);
    setMessageError("");

    const fetchAll = async (
      scope: "platform" | "b2c",
      access?: "support",
    ): Promise<HammetAdmin[]> => {
      const admins: HammetAdmin[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const response = await getHammetAdmins(
          { page, pageSize: 100, scope, access },
          accessToken,
          refreshToken ?? (async () => null),
        );
        admins.push(...response.admins);
        totalPages = response.pagination.totalPages;
        page += 1;
      } while (page <= totalPages);
      return admins;
    };

    void Promise.all([fetchAll("platform"), fetchAll("b2c", "support")])
      .then(([platformAdmins, supportAccessAdmins]) => {
        if (!active) return;
        const unique = new Map<string, HammetAdmin>();
        [...platformAdmins, ...supportAccessAdmins].forEach((admin) => {
          if (
            admin.status === "active" &&
            admin.id !== currentAdminId &&
            admin.id !== assignedAdminId
          ) {
            unique.set(admin.id, admin);
          }
        });
        const available = [...unique.values()];
        setSupportAdmins(available);
        setTransferTargetId(available[0]?.id ?? "");
      })
      .catch((error: unknown) => {
        if (active) {
          setMessageError(
            error instanceof Error ? error.message : "Could not load transfer targets.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingAdmins(false);
      });

    return () => {
      active = false;
    };
  }, [ticket?.id, accessToken, refreshToken, currentAdminId, assignedAdminId, ticketStatus]);

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
    if (!ticket || !accessToken || !hasMoreMessages || !messageCursor || isLoadingOlder) return;
    const container = messageScrollRef.current;
    if (container) {
      prependScrollRef.current = { height: container.scrollHeight, top: container.scrollTop };
    }
    setIsLoadingOlder(true);
    setMessageError("");
    try {
      const page = await getHammetSupportTicketMessages(
        ticket.id,
        { limit: 10, before: messageCursor },
        accessToken,
        refreshToken ?? (async () => null),
      );
      if (activeTicketIdRef.current !== ticket.id) return;
      setMessages((current) => {
        const existing = new Set(current.map((message) => message.id));
        return [...page.messages.filter((message) => !existing.has(message.id)), ...current];
      });
      setHasMoreMessages(page.hasMore);
      setMessageCursor(page.nextCursor);
    } catch (error) {
      if (activeTicketIdRef.current !== ticket.id) return;
      prependScrollRef.current = null;
      setMessageError(error instanceof Error ? error.message : "Could not load older messages.");
    } finally {
      setIsLoadingOlder(false);
    }
  }, [ticket, accessToken, refreshToken, hasMoreMessages, messageCursor, isLoadingOlder]);

  const handleClaim = async () => {
    if (!ticket || !accessToken || !currentAdminId || isClaiming) return;
    setIsClaiming(true);
    setMessageError("");
    try {
      await claimHammetSupportTicket(
        ticket.id,
        accessToken,
        refreshToken ?? (async () => null),
      );
      if (activeTicketIdRef.current !== ticket.id) return;
      setAssignedAdminId(currentAdminId);
      setAssignedAdminName(currentAdminName);
      setTicketStatus("in-progress");
      onRefreshTickets();
    } catch (error) {
      if (activeTicketIdRef.current !== ticket.id) return;
      setMessageError(error instanceof Error ? error.message : "Could not claim this ticket.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleSendMessage = async () => {
    const content = reply.trim();
    if (!ticket || !accessToken || !content || isSendingMessage || !canReply) return;
    setIsSendingMessage(true);
    setMessageError("");
    try {
      const message = await replyToHammetSupportTicket(
        ticket.id,
        content,
        accessToken,
        refreshToken ?? (async () => null),
      );
      if (activeTicketIdRef.current !== ticket.id) return;
      setMessages((current) => [...current, message]);
      setReply("");
      setTicketStatus("pending");
      scrollToBottomRef.current = true;
      onRefreshTickets();
    } catch (error) {
      if (activeTicketIdRef.current !== ticket.id) return;
      setMessageError(error instanceof Error ? error.message : "Could not send your reply.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleTransfer = async () => {
    const reason = transferReason.trim();
    if (
      !ticket ||
      !accessToken ||
      !transferTargetId ||
      !reason ||
      isTransferring ||
      assignedAdminId !== currentAdminId
    ) return;
    setIsTransferring(true);
    setMessageError("");
    try {
      await transferHammetSupportTicket(
        ticket.id,
        transferTargetId,
        reason,
        accessToken,
        refreshToken ?? (async () => null),
      );
      if (activeTicketIdRef.current !== ticket.id) return;
      setAssignedAdminId(transferTargetId);
      setAssignedAdminName(
        supportAdmins.find((admin) => admin.id === transferTargetId)?.fullName ?? null,
      );
      setTransferComplete(true);
      onRefreshTickets();
    } catch (error) {
      if (activeTicketIdRef.current !== ticket.id) return;
      setMessageError(error instanceof Error ? error.message : "Could not transfer this ticket.");
    } finally {
      setIsTransferring(false);
    }
  };

  const canReply = Boolean(
    ticket &&
      currentAdminId &&
      assignedAdminId === currentAdminId &&
      ticketStatus !== "resolved" &&
      ticketStatus !== "closed",
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Lenis owns scroll on the root element, so `overflow: hidden` alone does
    // not stop the page behind the dialog from scrolling.
    lenis?.stop();

    // The portal is already committed when this effect runs, so focus can move
    // straight to the close button without waiting for an animation frame.
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
  }, [open, onClose, lenis]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {ticket && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[120] flex items-end justify-center overflow-hidden sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-ticket-detail-title"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[121] flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-black/[0.06] bg-white shadow-2xl sm:max-h-[88vh] sm:max-w-2xl sm:rounded-3xl dark:border-white/[0.08] dark:bg-[#120D24]"
          >
            {/* Pinned header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/[0.06] bg-slate-50/70 px-5 py-4 sm:px-6 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#EDE9FE] px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-purple-700 dark:bg-[#21183A] dark:text-purple-300">
                    {ticket.id}
                  </span>
                  <StatusBadge status={ticketStatus} />
                </div>

                <h2
                  id="admin-ticket-detail-title"
                  className="mt-2 text-base font-semibold leading-6 tracking-[-0.01em] text-slate-950 sm:text-lg dark:text-white"
                >
                  {ticket.subject}
                </h2>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close ticket details"
                className="shrink-0 rounded-xl border border-black/[0.08] bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-cyan-400/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6"
            >
              <section
                aria-label="Learner"
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                    {getInitials(ticket.learner.fullName)}
                  </span>

                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-900 dark:text-white">
                      <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {ticket.learner.fullName}
                    </p>
                    <a
                      href={`mailto:${ticket.learner.email}`}
                      className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500 transition hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{ticket.learner.email}</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={ticket.category} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </section>

              <section
                aria-label="Ticket timeline"
                className="grid gap-2 sm:grid-cols-2"
              >
                <div className="rounded-2xl border border-black/[0.06] px-4 py-3 dark:border-white/[0.06]">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <CalendarDays className="h-3 w-3" />
                    Opened
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                    {formatDateTime(ticket.createdAt)}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] px-4 py-3 dark:border-white/[0.06]">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <Clock3 className="h-3 w-3" />
                    Last updated
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                    {formatDateTime(ticket.updatedAt)}
                  </p>
                </div>
              </section>

              <section
                aria-label="Ticket conversation"
                className="overflow-hidden rounded-2xl border border-black/[0.06] dark:border-white/[0.06]"
              >
                <div className="border-b border-black/[0.06] px-4 py-3 dark:border-white/[0.06]">
                  <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
                    <MessageCircle className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                    Conversation
                  </h3>
                </div>
                <div
                  ref={messageScrollRef}
                  data-lenis-prevent
                  onScroll={(event) => {
                    if (event.currentTarget.scrollTop <= 32) void loadOlderMessages();
                  }}
                  className="h-[320px] space-y-3 overflow-y-auto overscroll-contain bg-slate-50/60 px-3 py-3 dark:bg-white/[0.015] sm:px-4"
                  aria-label="Ticket messages"
                >
                  {(isLoadingOlder || hasMoreMessages) && (
                    <div className="flex justify-center pb-1">
                      {isLoadingOlder ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-purple-500" />
                      ) : (
                        <button
                          type="button"
                          onClick={() => void loadOlderMessages()}
                          className="text-[10px] font-medium text-purple-700 hover:underline dark:text-cyan-300"
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
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <MessageCircle className="h-5 w-5 text-purple-400" />
                      No messages yet.
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender.id === currentAdminId;
                      const senderLabel = message.senderRole === "learner"
                        ? ticket.learner.fullName
                        : message.sender.fullName;
                      const messageDate = new Date(message.createdAt);
                      return (
                        <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[88%] rounded-2xl px-3 py-2 shadow-sm sm:max-w-[78%] ${isOwnMessage ? "rounded-br-md bg-[#24134F] text-white dark:bg-cyan-400 dark:text-[#24134F]" : "rounded-bl-md border border-black/[0.06] bg-white text-slate-800 dark:border-white/[0.08] dark:bg-[#171127] dark:text-slate-200"}`}>
                            <div className={`mb-1 flex items-center justify-between gap-4 text-[10px] font-semibold ${isOwnMessage ? "text-purple-100 dark:text-[#24134F]/70" : "text-purple-700 dark:text-cyan-300"}`}>
                              <span>{isOwnMessage ? "You" : senderLabel}</span>
                              <time dateTime={message.createdAt} className="font-normal opacity-80">
                                {Number.isNaN(messageDate.getTime()) ? "" : messageDate.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                              </time>
                            </div>
                            <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">{message.content}</p>
                            {!!message.attachments?.length && (
                              <div className="mt-2 flex flex-col gap-1">
                                {message.attachments.map((attachment) => (
                                  <a key={attachment} href={attachment} target="_blank" rel="noreferrer" className="text-[11px] underline">View attachment</a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  {messageError && (
                    <div className="mx-auto flex max-w-md items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {messageError}
                    </div>
                  )}
                </div>

                {canReply ? (
                  <div className="border-t border-black/[0.06] bg-white p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-end gap-2 rounded-xl border border-black/[0.08] bg-slate-50 p-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/10 dark:border-white/[0.08] dark:bg-black/10">
                      <textarea
                        value={reply}
                        onChange={(event) => setReply(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            void handleSendMessage();
                          }
                        }}
                        maxLength={10_000}
                        rows={2}
                        placeholder="Write a reply…"
                        aria-label="Write a reply"
                        className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => void handleSendMessage()}
                        disabled={!reply.trim() || isSendingMessage}
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#24134F] px-3 text-xs font-semibold text-white transition hover:bg-[#2f1a63] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
                      >
                        {isSendingMessage ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                    <p className="mt-1 px-1 text-[10px] text-slate-400">Enter to send · Shift + Enter for a new line</p>
                  </div>
                ) : !assignedAdminId && currentAdminId && ticketStatus !== "resolved" && ticketStatus !== "closed" ? (
                  <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] bg-slate-50/70 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Claim this ticket to reply in the conversation.</p>
                    <button
                      type="button"
                      onClick={() => void handleClaim()}
                      disabled={isClaiming}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#24134F] px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F]"
                    >
                      {isClaiming && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                      Claim ticket
                    </button>
                  </div>
                ) : (
                  <p className="border-t border-black/[0.06] bg-slate-50/70 px-4 py-3 text-xs text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
                    {ticketStatus === "resolved" || ticketStatus === "closed"
                      ? `This ticket is ${ticketStatus} and can’t receive more replies.`
                      : `Assigned to ${assignedAdminName ?? "another support admin"}. Only the assigned admin can reply.`}
                  </p>
                )}
              </section>

              {(assignedAdminId === currentAdminId || transferComplete) &&
                currentAdminId &&
                ticketStatus !== "resolved" &&
                ticketStatus !== "closed" && (
                  <section className="rounded-2xl border border-black/[0.06] p-4 dark:border-white/[0.06]">
                    <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      Transfer ticket
                    </h3>
                    {transferComplete ? (
                      <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
                        Ticket transferred to {assignedAdminName ?? "the selected admin"}.
                      </p>
                    ) : (
                      <div className="mt-3 space-y-2.5">
                        <label className="block space-y-1">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Assign to</span>
                          <select
                            value={transferTargetId}
                            onChange={(event) => setTransferTargetId(event.target.value)}
                            disabled={isLoadingAdmins || supportAdmins.length === 0}
                            className="w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-purple-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-100"
                          >
                            {isLoadingAdmins ? (
                              <option value="">Loading support admins…</option>
                            ) : supportAdmins.length ? (
                              supportAdmins.map((admin) => (
                                <option key={admin.id} value={admin.id}>
                                  {admin.fullName} · {admin.scope === "platform" ? "Platform" : "B2C Support"}
                                </option>
                              ))
                            ) : (
                              <option value="">No eligible admins available</option>
                            )}
                          </select>
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Reason for transfer</span>
                          <textarea
                            value={transferReason}
                            onChange={(event) => setTransferReason(event.target.value)}
                            maxLength={2000}
                            rows={2}
                            placeholder="Add context for the receiving admin"
                            className="w-full resize-y rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-purple-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-100"
                          />
                        </label>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] text-slate-400">Eligible targets are active platform admins and B2C support admins.</p>
                          <button
                            type="button"
                            onClick={() => void handleTransfer()}
                            disabled={isLoadingAdmins || isTransferring || !transferTargetId || !transferReason.trim()}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-purple-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
                          >
                            {isTransferring && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                            Transfer
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                )}
            </div>

            {/* Pinned footer */}
            <div className="flex shrink-0 flex-col gap-2 border-t border-black/[0.06] bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <CopyTicketId ticketId={ticket.id} />

              <a
                href={`mailto:${ticket.learner.email}?subject=${encodeURIComponent(
                  `Re: ${ticket.id} — ${ticket.subject}`,
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24134F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2f1a63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
              >
                <Mail className="h-3.5 w-3.5" />
                Reply by email
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function CopyTicketId({ ticketId }: { ticketId: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    const copiedSuccessfully = await copyText(ticketId);

    if (!copiedSuccessfully) return;

    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [ticketId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06] dark:focus-visible:ring-cyan-400/40"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          Reference copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy reference
        </>
      )}
    </button>
  );
}
