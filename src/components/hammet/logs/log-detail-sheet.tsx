"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/api-client";
import { getHammetLog } from "@/lib/api/hammet";
import type { LogDetail, LogSummary } from "@/lib/api/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui";
import { LogLevelBadge } from "@/components/hammet/logs/log-level-badge";
import { formatLogTime } from "@/components/hammet/logs/log-list";

const SENSITIVE_KEY_PATTERN =
  /pass(word|wd)?|secret|token|authori[sz]ation|cookie|api[-_]?key|credential|private[-_]?key/i;

function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitive);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? "[redacted]" : redactSensitive(item),
      ]),
    );
  }
  return value;
}

type DetailResult = {
  logId: string;
  detail: LogDetail | null;
  error: string;
};

type LogDetailSheetProps = {
  log: LogSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LogDetailSheet({ log, open, onOpenChange }: LogDetailSheetProps) {
  const { accessToken, refreshToken } = useAuth();
  const [result, setResult] = useState<DetailResult | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const logId = log?.id ?? null;

  useEffect(() => {
    if (!open || !logId || !accessToken) return;

    const token = accessToken;
    let active = true;
    async function loadDetail(id: string) {
      try {
        const detail = await getHammetLog(id, token, refreshToken ?? (async () => null));
        if (active) setResult({ logId: id, detail, error: "" });
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof ApiError && err.notFound
            ? "Details for this log entry aren't available."
            : err instanceof ApiError
              ? err.message
              : "Couldn't reach the server. Check your connection and try again.";
        setResult({ logId: id, detail: null, error: message });
      }
    }

    void loadDetail(logId);
    return () => {
      active = false;
    };
  }, [open, logId, accessToken, refreshToken, retryKey]);

  const current = result?.logId === logId ? result : null;
  const isLoading = open && Boolean(logId) && current === null;
  const detail = current?.detail ?? null;

  function retry() {
    setResult(null);
    setRetryKey((key) => key + 1);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 border-black/[0.06] bg-white p-0 text-slate-950 data-[side=right]:w-full data-[side=right]:sm:max-w-xl dark:border-white/[0.06] dark:bg-[#120E1D] dark:text-white"
      >
        {log && (
          <>
            <header className="flex items-start gap-3 border-b border-black/[0.06] px-6 py-5 dark:border-white/[0.06]">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <LogLevelBadge level={log.level} />
                  <time dateTime={log.timestamp} className="text-xs text-slate-500 dark:text-slate-400">
                    {formatLogTime(log.timestamp)}
                  </time>
                </div>
                <SheetTitle className="mt-2 break-words text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                  {log.event}
                </SheetTitle>
                <SheetDescription className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {log.message}
                </SheetDescription>
              </div>
              <SheetClose
                aria-label="Close log details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </SheetClose>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <DetailSection title="Event">
                <DetailRow label="Time (UTC)" value={log.timestamp} />
                <DetailRow label="Domain" value={log.domain} />
                <DetailRow label="User ID" value={log.userId} copyable />
                <DetailRow label="Request ID" value={log.requestId} copyable />
              </DetailSection>

              <DetailSection title="Request">
                <DetailRow label="Method" value={log.method} />
                <DetailRow label="Path" value={log.path} />
                <DetailRow label="Status" value={log.statusCode} />
                {detail && (
                  <>
                    <DetailRow
                      label="Duration"
                      value={detail.durationMs === null ? null : `${detail.durationMs.toLocaleString()} ms`}
                    />
                    <DetailRow label="User agent" value={detail.userAgent} />
                  </>
                )}
              </DetailSection>

              {isLoading ? (
                <div className="space-y-3" aria-label="Loading log details">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-20 animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]" />
                  ))}
                </div>
              ) : current?.error ? (
                <div className="rounded-2xl border border-black/[0.06] p-5 text-sm dark:border-white/[0.06]">
                  <p className="text-slate-600 dark:text-slate-300">{current.error}</p>
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-3 text-sm font-semibold text-purple-700 hover:underline dark:text-cyan-400"
                  >
                    Try again
                  </button>
                </div>
              ) : detail ? (
                <>
                  <DetailSection title="Error">
                    <DetailRow label="Type" value={detail.errorType} />
                    <DetailRow label="Message" value={detail.errorMessage} />
                  </DetailSection>

                  <CodeBlock title="Stack trace" value={detail.stackTrace} emptyText="No stack trace recorded." />

                  <CodeBlock
                    title="Metadata"
                    value={detail.metadata ? JSON.stringify(redactSensitive(detail.metadata), null, 2) : null}
                    emptyText="No metadata recorded."
                  />
                </>
              ) : null}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</h3>
      <dl className="divide-y divide-black/[0.06] rounded-2xl border border-black/[0.06] dark:divide-white/[0.06] dark:border-white/[0.06]">
        {children}
      </dl>
    </section>
  );
}

function DetailRow({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string | number | null;
  copyable?: boolean;
}) {
  const hasValue = value !== null && value !== "";

  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-3 px-4 py-3 text-sm">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="flex min-w-0 items-start gap-2">
        <span className={`min-w-0 flex-1 whitespace-pre-wrap break-words ${hasValue ? "" : "text-slate-400"}`}>
          {hasValue ? value : "—"}
        </span>
        {copyable && hasValue && <CopyButton value={String(value)} label={label} />}
      </dd>
    </div>
  );
}

function CodeBlock({ title, value, emptyText }: { title: string; value: string | null; emptyText: string }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</h3>
        {value && <CopyButton value={value} label={title} />}
      </div>
      {value ? (
        <pre className="max-h-80 overflow-auto rounded-2xl bg-slate-50 p-4 font-mono text-xs leading-5 text-slate-700 dark:bg-white/[0.04] dark:text-slate-300">
          {value}
        </pre>
      ) : (
        <p className="rounded-2xl border border-black/[0.06] px-4 py-3 text-sm text-slate-400 dark:border-white/[0.06]">
          {emptyText}
        </p>
      )}
    </section>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timeout = setTimeout(() => setState("idle"), 1500);
    return () => clearTimeout(timeout);
  }, [state]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={`Copy ${label.toLowerCase()}`}
      title={state === "failed" ? "Copy failed" : `Copy ${label.toLowerCase()}`}
      className="flex h-7 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
    >
      {state === "copied" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {state === "copied" ? "Copied" : state === "failed" ? "Failed" : "Copy"}
    </button>
  );
}
