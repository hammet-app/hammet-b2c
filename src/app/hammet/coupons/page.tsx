"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, TicketPercent } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { createHammetCoupon, getHammetCoupons } from "@/lib/api/hammet";
import type { Coupon, CouponsResponse } from "@/lib/api/types";
import { canManageCoupons } from "@/lib/utils/roles";
import { Alert } from "@/components/ui";
import { SessionExpiredNotice } from "@/components/hammet/admin-form";

const PAGE_SIZE = 20;
const inputClassName =
  "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

export default function CouponsPage() {
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canManage = canManageCoupons(user);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CouponsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [usageLimitPerUser, setUsageLimitPerUser] = useState("1");

  const loadCoupons = useCallback(async () => {
    if (!accessToken || !canManage) return;
    setLoading(true);
    setError("");
    try {
      setResult(await getHammetCoupons(page, PAGE_SIZE, accessToken, refreshToken ?? (async () => null)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load coupons.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, canManage, page, refreshToken]);

  useEffect(() => { void loadCoupons(); }, [loadCoupons]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const coupon = await createHammetCoupon({
        code: code.trim(), description: description.trim() || null,
        discountType, discountValue: discountValue.trim(),
        currency: discountType === "FIXED" ? currency : null,
        maxDiscountAmount: maxDiscountAmount.trim() || null,
        minPurchaseAmount: minPurchaseAmount.trim() || null,
        startsAt: startsAt ? new Date(startsAt).toISOString() : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        usageLimitPerUser: Number(usageLimitPerUser),
      }, accessToken, refreshToken ?? (async () => null));
      setSuccess(`Coupon ${coupon.code} created.`);
      setCode(""); setDescription(""); setDiscountValue(""); setMaxDiscountAmount("");
      setMinPurchaseAmount(""); setStartsAt(""); setExpiresAt(""); setUsageLimit("");
      setUsageLimitPerUser("1");
      setShowForm(false);
      setPage(1);
      if (page === 1) await loadCoupons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create coupon.");
    } finally {
      setCreating(false);
    }
  }

  if (!authLoading && !accessToken) return <SessionExpiredNotice />;
  if (!authLoading && !canManage) {
    return <div className="px-5 py-12 sm:px-7 lg:px-10"><div className="mx-auto max-w-3xl rounded-2xl border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]"><h1 className="text-2xl font-semibold">Coupon access required</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This page is available to Hammet administrators with coupon access.</p><Link href="/hammet" className="mt-5 inline-flex text-sm font-semibold text-purple-700 dark:text-cyan-400">Back to dashboard</Link></div></div>;
  }

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1100px]">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/hammet" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
            <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">B2C management</p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Coupons</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create and manage discount coupons.</p>
          </div>
          <button type="button" onClick={() => setShowForm((value) => !value)} className="flex items-center gap-2 rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F]"><Plus className="h-4 w-4" />Create coupon</button>
        </section>

        {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">{success}</div>}
        {error && <div className="mb-5"><Alert title="Coupon request failed" variant="error">{error}</Alert></div>}

        {showForm && <form onSubmit={handleCreate} className="mb-8 rounded-[28px] border border-black/[0.06] bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-8">
          <div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300"><TicketPercent className="h-5 w-5" /></div><div><h2 className="text-xl font-semibold">New coupon</h2><p className="text-sm text-slate-500 dark:text-slate-400">This coupon will apply to all products.</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-medium">Code *</span><input required minLength={3} maxLength={50} value={code} onChange={(event) => setCode(event.target.value)} className={inputClassName} placeholder="WELCOME20" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Discount type *</span><select value={discountType} onChange={(event) => setDiscountType(event.target.value as "FIXED" | "PERCENTAGE")} className={inputClassName}><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed amount</option></select></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Discount value *</span><input required type="number" min="0.01" max={discountType === "PERCENTAGE" ? 100 : undefined} step="0.01" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} className={inputClassName} /></label>
            {discountType === "FIXED" && <label className="block"><span className="mb-2 block text-sm font-medium">Currency *</span><input required minLength={3} maxLength={3} value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} className={inputClassName} /></label>}
            <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-medium">Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} className={inputClassName} /></label>
            {discountType === "PERCENTAGE" && <label className="block"><span className="mb-2 block text-sm font-medium">Maximum discount amount</span><input type="number" min="0.01" step="0.01" value={maxDiscountAmount} onChange={(event) => setMaxDiscountAmount(event.target.value)} className={inputClassName} /></label>}
            <label className="block"><span className="mb-2 block text-sm font-medium">Minimum purchase amount</span><input type="number" min="0" step="0.01" value={minPurchaseAmount} onChange={(event) => setMinPurchaseAmount(event.target.value)} className={inputClassName} /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Starts at</span><input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={inputClassName} /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Expires at</span><input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className={inputClassName} /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Total usage limit</span><input type="number" min="1" step="1" value={usageLimit} onChange={(event) => setUsageLimit(event.target.value)} className={inputClassName} /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Usage limit per user *</span><input required type="number" min="1" step="1" value={usageLimitPerUser} onChange={(event) => setUsageLimitPerUser(event.target.value)} className={inputClassName} /></label>
          </div>
          <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold dark:border-white/[0.08]">Cancel</button><button disabled={creating} type="submit" className="rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F]">{creating ? "Creating..." : "Create coupon"}</button></div>
        </form>}

        {loading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]" />)}</div> : result?.coupons.length ? <>
          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-white/[0.03]"><div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">{result.coupons.map((coupon) => <CouponRow key={coupon.id} coupon={coupon} />)}</div></div>
          <div className="mt-5 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400"><span>{result.pagination.total} coupons · Page {result.pagination.page} of {Math.max(1, result.pagination.totalPages)}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-black/[0.08] p-2 disabled:opacity-40 dark:border-white/[0.08]" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><button type="button" disabled={page >= result.pagination.totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-black/[0.08] p-2 disabled:opacity-40 dark:border-white/[0.08]" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>
        </> : <div className="rounded-[28px] border border-black/[0.06] bg-white p-12 text-center dark:border-white/[0.06] dark:bg-white/[0.03]"><TicketPercent className="mx-auto h-9 w-9 text-slate-400" /><h2 className="mt-4 text-lg font-semibold">No coupons yet</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a coupon to offer a discount to learners.</p></div>}
      </div>
    </div>
  );
}

function CouponRow({ coupon }: { coupon: Coupon }) {
  const discount = coupon.discountType === "PERCENTAGE"
    ? `${coupon.discountValue}%`
    : `${coupon.currency ?? ""} ${coupon.discountValue.toLocaleString()}`;
  return <Link href={`/hammet/coupons/${encodeURIComponent(coupon.id)}`} aria-label={`Edit coupon ${coupon.code}`} className="block transition hover:bg-purple-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-500 dark:hover:bg-white/[0.04]"><article className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold tracking-wide">{coupon.code}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${coupon.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300"}`}>{coupon.status}</span></div><p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{coupon.description || "All products"}</p></div><div className="flex items-center gap-6 text-right"><div><p className="font-semibold">{discount}</p><p className="text-xs text-slate-500 dark:text-slate-400">{coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""} uses</p></div><div className="min-w-24"><p className="text-sm">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "No expiry"}</p><p className="text-xs text-slate-500 dark:text-slate-400">Expiry</p></div></div></article></Link>;
}
