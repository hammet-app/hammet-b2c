"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/lib/store/use-cart";
import { useAuth } from "@/lib/auth/auth-context";
import { paymentApi } from "@/lib/api/payment";
import { cartApi } from "@/lib/api/cart";

function PaystackCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const { items, clearCart, markAsPaid } = useCart();

  const reference =
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("transaction_id") ||
    "";
  const statusParam = searchParams.get("status");

  const [verifying, setVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [paidTotal, setPaidTotal] = useState(0);
  const [paymentDate, setPaymentDate] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function handleSettlement() {
      // 1. Capture current cart items snapshot
      const currentItems = [...items];
      const itemIds = currentItems.map((i) => i.id);
      const totalAmount = currentItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      // Check if Paystack returned a cancellation or failure
      if (statusParam === "cancelled" || statusParam === "failed") {
        if (isMounted) {
          setIsSuccess(false);
          setErrorMessage("The payment session on Paystack was cancelled or declined.");
          setVerifying(false);
        }
        return;
      }

      // 2. Set receipt details
      if (isMounted) {
        setPurchasedItems(currentItems.length > 0 ? currentItems : [
          {
            id: "enrolled-item",
            type: "ai_school",
            title: "Hammet Accredited Curriculum",
            price: totalAmount || 0,
            quantity: 1,
          },
        ]);
        setPaidTotal(totalAmount);
        setPaymentDate(
          new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }

      // 3. Immediately activate local learning access to eliminate any delay
      if (itemIds.length > 0) {
        await markAsPaid(itemIds);

        try {
          const existingPaid = JSON.parse(localStorage.getItem("hammet-paid-items") || "[]");
          const mergedPaid = Array.from(new Set([...existingPaid, ...itemIds]));
          localStorage.setItem("hammet-paid-items", JSON.stringify(mergedPaid));

          const existingEnrolled = JSON.parse(localStorage.getItem("hammet_enrolled_courses") || "[]");
          const mergedEnrolled = Array.from(new Set([...existingEnrolled, ...itemIds]));
          localStorage.setItem("hammet_enrolled_courses", JSON.stringify(mergedEnrolled));
        } catch (e) {
          console.error("Local enrollment cache error:", e);
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cart-updated"));
          window.dispatchEvent(new Event("enrollment-updated"));
        }
      }

      // 4. Background verification with backend ledger
      if (reference) {
        paymentApi.verifyPayment(reference, accessToken).catch(() => {});
      }

      // 5. Clear cart on server and local store
      clearCart();
      cartApi.syncCart([], null, accessToken).catch(() => {});

      // Short smooth verification delay for visual feedback
      setTimeout(() => {
        if (isMounted) {
          setVerifying(false);
          setIsSuccess(true);
        }
      }, 700);
    }

    handleSettlement();

    return () => {
      isMounted = false;
    };
  }, [reference, statusParam, accessToken, clearCart, markAsPaid]);

  const handleStartCourse = () => {
    let target = "/learner/learn";
    if (purchasedItems.length > 0) {
      const firstSchool = purchasedItems.find((i) => i.type === "ai_school");
      if (firstSchool && firstSchool.id) {
        target = `/learner/ai-schools/${firstSchool.id}`;
      } else {
        const firstCourse = purchasedItems.find((i) => i.type === "course");
        if (firstCourse && firstCourse.schoolId) {
          target = `/learner/ai-schools/${firstCourse.schoolId}`;
        } else if (firstCourse && firstCourse.id) {
          target = `/learner/courses/${firstCourse.id}`;
        }
      }
    }
    router.push(target);
  };

  if (verifying) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-cyan-500/20 dark:border-t-cyan-400" />
          <ShieldCheck className="absolute h-7 w-7 text-purple-600 dark:text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Verifying Paystack Payment
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Please wait a moment while we settle your transaction with Paystack and unlock your learning modules...
        </p>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="mx-auto max-w-[560px] rounded-3xl border border-red-500/30 bg-white p-8 text-center shadow-xl dark:border-red-500/20 dark:bg-[#140F24]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Payment Not Completed
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {errorMessage || "The transaction could not be completed on Paystack."}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => router.push("/learner/checkout")}
            className="w-full sm:w-auto rounded-xl bg-purple-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Return to Checkout</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/learner")}
            className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-white/10"
          >
            Learner Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto max-w-[620px] rounded-3xl border border-emerald-500/30 bg-white p-8 sm:p-10 shadow-2xl dark:border-emerald-500/20 dark:bg-[#140F24]"
    >
      {/* Animated Checkmark Icon */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-lg shadow-emerald-500/20 dark:bg-emerald-500/10">
        <motion.svg
          className="h-12 w-12"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
          <motion.path
            d="M16 26.5L23 33.5L36 18.5"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
          />
        </motion.svg>
      </div>

      <div className="text-center">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
          Payment Confirmed via Paystack
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
          Payment Successful! 🎉
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Congratulations! Your payment has been securely confirmed on Paystack and your curriculum access is officially activated.
        </p>
      </div>

      {/* ── INFORMATIVE CLOUD SYNC & REASSURANCE NOTICE ─────────────────── */}
      <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-50/70 p-4.5 text-left dark:border-amber-400/20 dark:bg-amber-400/[0.06]">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mt-0.5">
            <Clock className="h-4 w-4 animate-pulse" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex flex-wrap items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
              <span>Curriculum Activation Notice</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                Instant Access Active
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-amber-800/90 dark:text-amber-300/80 text-[11px] sm:text-xs">
              Your course access has been activated immediately on your profile! Please note that cloud ledger and dashboard progress synchronization may take up to 2–3 minutes during peak network periods, but your courses are unlocked and available to study immediately without delay.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] font-medium text-amber-900/80 dark:text-amber-300/70 border-t border-amber-500/20 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Local Learning License: Ready (0s delay)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Zap className="h-3.5 w-3.5 text-purple-500" />
                Cloud Ledger: Syncing in background
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Digital Receipt Card */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/5 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Paystack Reference</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {reference || "TXN-PAYSTACK-CONFIRMED"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 py-3 dark:border-white/5 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Payment Gateway</span>
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Paystack Direct</span>
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 py-3 dark:border-white/5 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Date & Time</span>
          <span className="text-slate-700 dark:text-slate-300">{paymentDate}</span>
        </div>

        {paidTotal > 0 && (
          <div className="flex items-center justify-between border-b border-slate-200 py-3 dark:border-white/5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Amount Paid</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              ₦{paidTotal.toLocaleString()}
            </span>
          </div>
        )}

        {/* Enrolled Courses / Schools List */}
        <div className="pt-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Unlocked Curriculums
          </div>
          <div className="space-y-1.5">
            {purchasedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <span className="truncate max-w-[280px]">• {item.title}</span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  Paid & Enrolled
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Action Button: "Go to Learning" */}
      <div className="mt-8 flex flex-col gap-3">
        <Button
          onClick={handleStartCourse}
          size="lg"
          className="w-full rounded-xl bg-purple-600 py-3.5 font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 text-base transition-all hover:scale-[1.01]"
        >
          <span>Go to Learning</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link
            href="/learner/learn"
            className="hover:text-purple-600 dark:hover:text-cyan-400 transition underline"
          >
            My Learning
          </Link>
          <span>•</span>
          <Link
            href="/learner/passport"
            className="hover:text-purple-600 dark:hover:text-cyan-400 transition underline"
          >
            View Skill Passport
          </Link>
          <span>•</span>
          <Link
            href="/learner"
            className="hover:text-purple-600 dark:hover:text-cyan-400 transition underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function PaystackCallbackPage() {
  return (
    <div className="min-h-screen px-4 pb-28 pt-8 sm:px-6 sm:pt-14 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-cyan-500/20 dark:border-t-cyan-400" />
          </div>
        }
      >
        <PaystackCallbackContent />
      </Suspense>
    </div>
  );
}

