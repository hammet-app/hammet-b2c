// Shared pieces for the Hammet admin AI school / course / module forms.
import Link from "next/link";

export const inputClassName =
  "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

export const primaryButtonClassName =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-[#24134F] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(76,29,149,0.16)] transition hover:bg-[#321b68] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300";

export const cardClassName =
  "rounded-[28px] border border-black/[0.06] bg-white p-7 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-8";

export function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[900px]">
        <div className="rounded-[28px] border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <h1 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{children}</p>
        </div>
      </div>
    </div>
  );
}

// Shown when auth has finished loading but there is no token (e.g. after a dev DB reset),
// instead of leaving the page stuck on its loading state.
export function SessionExpiredNotice() {
  return (
    <Notice title="Please log in again">
      Your session has ended, so nothing can be loaded.{" "}
      <Link href="/login" className="font-semibold text-purple-700 hover:underline dark:text-cyan-400">
        Log in
      </Link>{" "}
      and try again.
    </Notice>
  );
}

// null means "keep the current status". The admin GET routes don't return it,
// so editing pages usually can't show what it is today.
export function PublishSelect({
  value,
  onChange,
  noun,
}: {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  noun: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">Status</span>
      <select
        value={value === null ? "" : value ? "published" : "draft"}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : event.target.value === "published")
        }
        className={inputClassName}
      >
        <option value="">Keep current status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <span className="mt-2 block text-xs leading-5 text-slate-500 dark:text-slate-400">
        Learners can&apos;t see draft {noun}.
      </span>
    </label>
  );
}

export function parseWholeNumber(value: string): number | null {
  const parsed = Number(value);
  return value.trim() !== "" && Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}
