"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/lib/store/use-cart";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Sparkles,
  Clock,
  Award,
  Zap,
  Tag,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

type CheckoutStep = "review" | "payment" | "processing" | "success";
type PaymentMethod = "card" | "transfer";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    removeItem,
    getTotal,
    clearCart,
    markAsPaid,
    couponCode,
    discountPercentage,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getFinalTotal,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("review");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // Keep track of what was purchased so the success page has full details even after cart is cleared
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [paidTotal, setPaidTotal] = useState(0);
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  // Coupon code logic
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(user?.fullName || "GODSWILL NWAFOR");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Bank Transfer State
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(1795); // ~30 mins

  // Processing stage messages
  const [processingStage, setProcessingStage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (user?.fullName) {
        setCardName(user.fullName.toUpperCase());
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  // Bank transfer countdown timer
  useEffect(() => {
    if (step !== "payment" || paymentMethod !== "transfer") return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, paymentMethod]);

  const rawTotal = getTotal();
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalTotal();
  const couponApplied = !!couponCode;

  // Card brand detection
  const cardBrand = useMemo(() => {
    const clean = cardNumber.replace(/\s+/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "MASTERCARD";
    if (clean.startsWith("506") || clean.startsWith("6500")) return "VERVE";
    return "CARD";
  }, [cardNumber]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({ success: res.success, message: res.message });
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput("");
    setCouponFeedback(null);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCardCvv(value);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("9048831290");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2200);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText("HMT-8942-AI");
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2200);
  };

  const formatTimer = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Execute payment simulation
  const handleExecutePayment = () => {
    setPurchasedItems([...items]);
    setPaidTotal(finalTotal);
    setStep("processing");
    setProcessingStage(0);

    const t1 = setTimeout(() => setProcessingStage(1), 600);
    const t2 = setTimeout(() => setProcessingStage(2), 1200);
    const t3 = setTimeout(() => {
      // Mark as paid in global store
      markAsPaid();
      setTransactionRef(`TXN-HMT-${Math.floor(100000 + Math.random() * 900000)}`);
      setPaymentDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }));
      setStep("success");
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // Redirect to school or courses with guaranteed fresh state
  const handleStartCourse = () => {
    let target = "/learner/ai-schools";
    if (purchasedItems.length > 0) {
      const firstSchool = purchasedItems.find((i) => i.type === "school");
      if (firstSchool) {
        target = `/learner/ai-schools/${firstSchool.id}`;
      } else {
        const firstCourse = purchasedItems.find((i) => i.type === "course");
        if (firstCourse && firstCourse.schoolId) {
          target = `/learner/ai-schools/${firstCourse.schoolId}`;
        } else if (firstCourse) {
          target = `/learner/courses/${firstCourse.id}`;
        }
      }
    }
    window.location.href = target;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-6 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-[960px]">
        {/* Navigation Breadcrumb & Security Indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <ShieldCheck className="h-4 w-4" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>

          {step === "payment" && (
            <button
              onClick={() => setStep("review")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Cart</span>
            </button>
          )}
        </div>

        {/* ── STEP 1: REVIEW CART ────────────────────────────────────────────── */}
        {step === "review" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Review Your Learning Cart
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Confirm your selected curriculum tracks and proceed to secure checkout.
              </p>
            </div>

            {items.length === 0 ? (
              <div className="rounded-3xl border border-black/[0.06] bg-white p-12 text-center shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-cyan-400">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your cart is currently empty
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                  Explore our industry-grade AI Schools and specialized curriculum tracks to accelerate your technical skills.
                </p>
                <Button
                  className="mt-6 rounded-xl bg-purple-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  onClick={() => router.push("/learner/ai-schools")}
                >
                  Browse AI Schools
                </Button>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                {/* Left: Cart Items */}
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02] sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                          {item.type === "school" ? (
                            <GraduationCap className="h-6 w-6" />
                          ) : (
                            <BookOpen className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                              {item.type === "school" ? "Diploma School" : "Specialized Course"}
                            </span>
                            <span className="text-[11px] text-slate-400">• Lifetime Access</span>
                          </div>
                          <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              Interactive Labs
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3.5 w-3.5 text-purple-500" />
                              Verified Certificate
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5 sm:border-0 sm:pt-0 sm:justify-end sm:gap-6">
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.price === 0 ? "Free" : `₦${item.price.toLocaleString()}`}
                          </div>
                          <div className="text-[11px] text-slate-400">One-time enrollment</div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                          title="Remove from cart"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Coupon Box */}
                  <div className="rounded-2xl border border-black/[0.06] bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      <Tag className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                      Promotional Discount Code
                    </div>
                    {couponApplied ? (
                      <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          <span>Coupon <strong>{couponCode}</strong> applied ({discountPercentage}% OFF discount)</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-xs text-red-500 underline hover:no-underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="e.g. HAMMET20, HAMMET50, or EARLYBIRD"
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm uppercase text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          className="rounded-xl font-semibold border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-white/15 dark:text-cyan-300 dark:hover:bg-white/5"
                        >
                          Apply
                        </Button>
                      </form>
                    )}
                    {couponFeedback && !couponFeedback.success && (
                      <p className="mt-2 text-xs text-red-500">{couponFeedback.message}</p>
                    )}
                    {couponFeedback && couponFeedback.success && (
                      <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{couponFeedback.message}</p>
                    )}
                  </div>

                  {/* Guarantee Banner */}
                  <div className="flex items-center gap-3.5 rounded-2xl bg-purple-50/60 p-4 text-xs text-purple-950 dark:bg-purple-950/20 dark:text-purple-200 border border-purple-200/50 dark:border-purple-500/20">
                    <Sparkles className="h-5 w-5 shrink-0 text-purple-600 dark:text-cyan-400" />
                    <p>
                      <strong>14-Day Full Satisfaction Guarantee:</strong> If the curriculum doesn&apos;t elevate your engineering capabilities, request a full refund with no questions asked.
                    </p>
                  </div>
                </div>

                {/* Right: Sticky Summary Box */}
                <div>
                  <div className="sticky top-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Order Summary
                    </h3>

                    <div className="space-y-3 border-b border-slate-100 pb-4 text-sm dark:border-white/5">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Items ({items.length})</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          ₦{rawTotal.toLocaleString()}
                        </span>
                      </div>

                      {couponApplied && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                          <span>Discount ({couponCode} - {discountPercentage}%)</span>
                          <span>-₦{discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Platform / Lab Provisioning</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ₦0 (Waived)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between py-4">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        Total Due
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-purple-600 dark:text-cyan-400">
                          {finalTotal === 0 ? "Free" : `₦${finalTotal.toLocaleString()}`}
                        </span>
                        <div className="text-[11px] text-slate-400">Taxes & certificate fee included</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep("payment")}
                      className="mt-2 w-full rounded-xl bg-purple-600 py-3 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                      size="lg"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="mt-5 space-y-2 text-center text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-center gap-1.5 text-[11px]">
                        <Lock className="h-3 w-3 text-slate-400" />
                        <span>Encrypted 256-Bit Financial Checkout</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Supported: Mastercard • Visa • Verve • Bank Transfer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2: PAYMENT METHOD & FORM ─────────────────────────────────── */}
        {step === "payment" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Complete Your Payment
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Choose your preferred payment method to activate your lifetime course enrollment.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              {/* Payment Methods & Input Forms */}
              <div className="space-y-6">
                {/* Tabs: Card vs Bank Transfer */}
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-200/60 p-1.5 dark:bg-white/[0.04]">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition",
                      paymentMethod === "card"
                        ? "bg-white text-purple-700 shadow-sm dark:bg-white/10 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pay with Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition",
                      paymentMethod === "transfer"
                        ? "bg-white text-purple-700 shadow-sm dark:bg-white/10 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </button>
                </div>

                {/* ── CARD PAYMENT VIEW ────────────────────────────────────── */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* Live Virtual Card Preview */}
                    <div
                      className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-transform duration-300 hover:scale-[1.01]"
                      style={{
                        background:
                          "linear-gradient(135deg, #1E1035 0%, #3B1270 50%, #0F172A 100%)",
                        boxShadow:
                          "0 12px 30px rgba(59,18,112,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        {/* EMV Chip & Contactless */}
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-inner flex items-center justify-center">
                            <div className="h-4 w-6 rounded border border-amber-600/40" />
                          </div>
                          <span className="text-[10px] font-mono tracking-widest text-slate-300">
                            DEBIT
                          </span>
                        </div>

                        <div className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-extrabold tracking-widest text-cyan-300 backdrop-blur-sm">
                          {cardBrand}
                        </div>
                      </div>

                      {/* Card Number */}
                      <div className="mb-6 font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-100">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400">
                            Cardholder
                          </div>
                          <div className="text-sm font-semibold tracking-wide text-slate-100 uppercase truncate max-w-[200px]">
                            {cardName || "YOUR NAME"}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400">
                            Expires
                          </div>
                          <div className="font-mono text-sm font-bold text-slate-100">
                            {cardExpiry || "MM/YY"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Input Form */}
                    <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="4532 8921 3456 7890"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                          />
                          <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                            {cardBrand}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Godswill Nwafor"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            maxLength={3}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 pt-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span>Remember this card for fast 1-click renewals</span>
                      </label>

                      <Button
                        onClick={handleExecutePayment}
                        className="w-full mt-4 rounded-xl bg-purple-600 py-3.5 font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 text-base"
                        size="lg"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Pay ₦{finalTotal.toLocaleString()} Securely</span>
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ── BANK TRANSFER VIEW ──────────────────────────────────── */}
                {paymentMethod === "transfer" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/5">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-purple-600 dark:text-cyan-400" />
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            Dedicated Virtual Account
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Expires in {formatTimer(secondsRemaining)}</span>
                        </div>
                      </div>

                      <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Transfer the exact amount to the temporary virtual account below. Your transfer is automatically monitored and confirmed within seconds.
                      </p>

                      {/* Bank Details Table */}
                      <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Bank Name</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            Providus Bank / Wema
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-white/5">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Account Number
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-lg font-extrabold tracking-wider text-purple-700 dark:text-cyan-400">
                              9048831290
                            </span>
                            <button
                              onClick={handleCopyAccount}
                              className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-purple-600 shadow-sm border border-slate-200 hover:bg-slate-50 dark:bg-white/10 dark:border-white/10 dark:text-cyan-300"
                              title="Copy account number"
                            >
                              {copiedAccount ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-500" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-white/5 text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Account Name</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Hammet AI Academy Ltd
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-white/5 text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Exact Amount</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            ₦{finalTotal.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-white/5 text-xs">
                          <span className="text-slate-500 dark:text-slate-400">
                            Transfer Narration
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                              HMT-8942-AI
                            </span>
                            <button
                              onClick={handleCopyRef}
                              className="text-[10px] text-purple-600 underline dark:text-cyan-400"
                            >
                              {copiedRef ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3">
                        <Button
                          onClick={handleExecutePayment}
                          className="w-full rounded-xl bg-purple-600 py-3.5 font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 text-base"
                          size="lg"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          <span>I Have Sent ₦{finalTotal.toLocaleString()}</span>
                        </Button>

                        <div className="text-center text-[11px] text-slate-400">
                          Automated confirmation takes 5–15 seconds once transfer leaves your bank.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right: Order Summary Sidebar */}
              <div>
                <div className="sticky top-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Summary
                  </h3>

                  <div className="space-y-3 border-b border-slate-100 pb-4 text-xs dark:border-white/5">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="truncate max-w-[200px]" title={item.title}>
                          {item.title}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    {couponApplied && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Discount (20%)</span>
                        <span>-₦{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between py-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Total Payable
                    </span>
                    <span className="text-2xl font-extrabold text-purple-600 dark:text-cyan-400">
                      ₦{finalTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500 dark:bg-white/[0.03] dark:text-slate-400 space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>Instant Access Provisioning</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Upon confirmation, your curriculum licenses, GPU compute credentials, and Skill Passport are immediately unlocked in your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: PROCESSING OVERLAY ────────────────────────────────────── */}
        {step === "processing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-[500px] rounded-3xl border border-black/[0.06] bg-white p-10 text-center shadow-2xl dark:border-white/[0.08] dark:bg-[#151026]"
          >
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-cyan-500/20 dark:border-t-cyan-400" />
              <Lock className="absolute h-6 w-6 text-purple-600 dark:text-cyan-400" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Authorizing Payment
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please wait while our financial gateway securely settles the transaction...
            </p>

            <div className="mt-6 space-y-2 text-xs font-semibold text-purple-700 dark:text-cyan-300">
              {processingStage === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Connecting to banking switch...
                </motion.div>
              )}
              {processingStage === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Verifying transaction ledger & settlement...
                </motion.div>
              )}
              {processingStage >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Issuing accredited school licenses...
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: CELEBRATORY SUCCESS CONFIRMATION ──────────────────────── */}
        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
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
                Payment Confirmed
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
                Payment Successful! 🎉
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Congratulations! Your payment has been settled and your lifetime curriculum access is officially activated.
              </p>
            </div>

            {/* Official Digital Receipt Card */}
            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Transaction Reference</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {transactionRef || "TXN-HMT-894102"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 py-3 dark:border-white/5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Payment Method</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {paymentMethod === "card" ? `Card (${cardBrand})` : "Direct Bank Transfer"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 py-3 dark:border-white/5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Date & Time</span>
                <span className="text-slate-700 dark:text-slate-300">{paymentDate}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 py-3 dark:border-white/5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total Amount Paid</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₦{paidTotal.toLocaleString()}
                </span>
              </div>

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

            {/* Primary Action Button to Start Course */}
            <div className="mt-8 flex flex-col gap-3">
              <Button
                onClick={handleStartCourse}
                size="lg"
                className="w-full rounded-xl bg-purple-600 py-3.5 font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 text-base transition-all hover:scale-[1.01]"
              >
                <span>Start Course</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
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
        )}
      </div>
    </div>
  );
}
