"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save, Trash2 } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { deleteHammetCoupon, editHammetCoupon, getHammetCoupon } from "@/lib/api/hammet";
import type { Coupon } from "@/lib/api/types";
import { canManageCoupons } from "@/lib/utils/roles";
import { Alert } from "@/components/ui";
import { SessionExpiredNotice } from "@/components/hammet/admin-form";

const inputClassName =
  "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 disabled:opacity-60 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function EditCouponPage() {
  const params = useParams<{ couponId: string }>();
  const couponId = params.couponId;
  const router = useRouter();
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canManage = canManageCoupons(user);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [active, setActive] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCoupon = useCallback(async () => {
    if (!accessToken || !canManage || !couponId) return;
    setLoading(true);
    setError("");
    try {
      const response = await getHammetCoupon(couponId, accessToken, refreshToken ?? (async () => null));
      setCoupon(response);
      if (response) {
        setActive(response.status === "ACTIVE");
        setExpiresAt(toDateTimeLocal(response.expiresAt));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load this coupon.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, canManage, couponId, refreshToken]);

  useEffect(() => { void loadCoupon(); }, [loadCoupon]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !coupon) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await editHammetCoupon(coupon.id, {
        activate: active,
        ...(active ? { expiresAt: new Date(expiresAt).toISOString() } : {}),
      }, accessToken, refreshToken ?? (async () => null));
      setCoupon({ ...coupon, status: active ? "ACTIVE" : "INACTIVE", expiresAt: active ? new Date(expiresAt).toISOString() : coupon.expiresAt });
      setSuccess(active ? "Coupon activated." : "Coupon deactivated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update this coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!accessToken || !coupon || !window.confirm(`Delete coupon ${coupon.code}? This cannot be undone.`)) return;
    setDeleting(true);
    setError("");
    try {
      await deleteHammetCoupon(coupon.id, accessToken, refreshToken ?? (async () => null));
      router.push("/hammet/coupons");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this coupon.");
      setDeleting(false);
    }
  }

  if (!authLoading && !accessToken) return <SessionExpiredNotice />;
  if (!authLoading && !canManage) {
    return <div className="px-5 py-12 sm:px-7 lg:px-10"><div className="mx-auto max-w-3xl rounded-2xl border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]"><h1 className="text-2xl font-semibold">Coupon access required</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This page is available to Hammet administrators with coupon access.</p><Link href="/hammet" className="mt-5 inline-flex text-sm font-semibold text-purple-700 dark:text-cyan-400">Back to dashboard</Link></div></div>;
  }

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[900px]">
        <Link href="/hammet/coupons" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"><ArrowLeft className="h-4 w-4" />Back to coupons</Link>
        {error && <div className="mb-5"><Alert title="Coupon request failed" variant="error">{error}</Alert></div>}
        {loading ? <div className="flex min-h-64 items-center justify-center text-slate-400"><LoaderCircle className="h-6 w-6 animate-spin" /></div> : !coupon ? <div className="rounded-2xl border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]"><h1 className="text-2xl font-semibold">Coupon not found</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">It may have been deleted or is unavailable.</p></div> : <>
          <section className="mb-7"><p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">B2C management</p><h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Edit {coupon.code}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage this coupon’s active status and expiry date.</p></section>
          {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">{success}</div>}
          <form onSubmit={handleSave} className="rounded-[28px] border border-black/[0.06] bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium">Code</p><div className={`${inputClassName} font-semibold`}>{coupon.code}</div></div>
              <div><p className="mb-2 text-sm font-medium">Discount</p><div className={inputClassName}>{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `${coupon.currency ?? ""} ${coupon.discountValue}`}</div></div>
              <label className="flex items-center justify-between gap-4 rounded-xl border border-black/[0.08] p-4 dark:border-white/[0.08]"><span><span className="block text-sm font-medium">Active</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Inactive coupons cannot be redeemed.</span></span><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="h-5 w-5 accent-purple-700 dark:accent-cyan-400" /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium">Expiry date{active ? " *" : ""}</span><input type="datetime-local" required={active} value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className={inputClassName} /></label>
            </div>
            <div className="mt-7 flex flex-wrap justify-between gap-3"><button type="button" onClick={() => void handleDelete()} disabled={deleting || saving} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-50 dark:border-red-400/20 dark:text-red-300"><Trash2 className="h-4 w-4" />{deleting ? "Deleting..." : "Delete coupon"}</button><button type="submit" disabled={saving || deleting} className="inline-flex items-center gap-2 rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F]"><Save className="h-4 w-4" />{saving ? "Saving..." : "Save changes"}</button></div>
          </form>
        </>}
      </div>
    </div>
  );
}
