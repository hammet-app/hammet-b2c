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
  Link2,
  QrCode,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { paymentApi, type PaymentLinkData } from "@/lib/api/payment";

type CheckoutStep = "review" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    clearCart,
    couponCode,
    discountPercentage,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getFinalTotal,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("review");

  // Payment Link State
  const [paymentLinkData, setPaymentLinkData] = useState<PaymentLinkData | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copiedPaymentLink, setCopiedPaymentLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);

  // Coupon code logic
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const rawTotal = getTotal();
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalTotal();
  const couponApplied = !!couponCode;

  // Auto-generate payment link whenever proceeding to payment step
  const handleProceedToPayment = async () => {
    setGatewayError(null);
    setStep("payment");
    if (!paymentLinkData && items.length > 0) {
      setIsGeneratingLink(true);
      try {
        const res = await paymentApi.createPaymentLink(
          {
            items,
            amount: finalTotal,
            currency: "NGN",
            email: user?.email,
            customerName: user?.fullName,
          },
          accessToken
        );
        if (res.success && res.data) {
          setPaymentLinkData(res.data);
        } else if (res.error) {
          setGatewayError(res.error);
        }
      } catch (err: any) {
        console.error("Error creating payment link:", err);
        setGatewayError(err?.message || "Failed to initialize payment link with backend.");
      } finally {
        setIsGeneratingLink(false);
      }
    }
  };

  // Direct Paystack Redirect
  const handlePaystackRedirect = async () => {
    setGatewayError(null);
    if (paymentLinkData?.paymentUrl) {
      window.location.href = paymentLinkData.paymentUrl;
      return;
    }
    setIsGeneratingLink(true);
    try {
      const res = await paymentApi.createPaymentLink(
        {
          items,
          amount: finalTotal,
          currency: "NGN",
          email: user?.email,
          customerName: user?.fullName,
        },
        accessToken
      );
      if (res.success && res.data?.paymentUrl) {
        setPaymentLinkData(res.data);
        window.location.href = res.data.paymentUrl;
      } else {
        const errorMsg =
          res.error ||
          "Backend checkout failed: Paystack did not return an authorization URL. Please contact support.";
        setGatewayError(errorMsg);
      }
    } catch (err: any) {
      console.error("Paystack redirect error:", err);
      setGatewayError(err?.message || "Failed to connect to checkout gateway.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

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

  const handleCopyPaymentLink = () => {
    if (!paymentLinkData?.paymentUrl) return;
    navigator.clipboard.writeText(paymentLinkData.paymentUrl);
    setCopiedPaymentLink(true);
    setTimeout(() => setCopiedPaymentLink(false), 2400);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-6 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-[960px]">
        {/* Navigation Breadcrumb & Security Indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure Checkout</span>
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
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your cart is currently empty
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Explore our AI schools and specialized masterclasses to unlock hands-on AI engineering tracks.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/learner/ai-schools">
                    <Button className="rounded-xl bg-purple-600 px-6 font-semibold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">
                      Explore AI Schools
                    </Button>
                  </Link>
                  <Link href="/learner/learn">
                    <Button variant="outline" className="rounded-xl">
                      My Learning Hub
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                {/* Left: Cart Items List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {items.length} {items.length === 1 ? "Curriculum Track" : "Curriculum Tracks"}
                    </span>
                    <button
                      onClick={clearCart}
                      className="text-xs font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] transition hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                          {item.type === "ai_school" ? (
                            <GraduationCap className="h-6 w-6" />
                          ) : (
                            <BookOpen className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                              {item.type === "ai_school" ? "Diploma School" : "Specialized Course"}
                            </span>
                            <span className="text-[11px] text-slate-400">• Lifetime Access</span>
                          </div>
                          <h3 className="mt-1 font-bold text-slate-900 dark:text-white sm:text-base">
                            {item.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Award className="h-3.5 w-3.5 text-amber-500" />
                            <span>Accredited Skill Certificate</span>
                            <span>•</span>
                            <Zap className="h-3.5 w-3.5 text-purple-500" />
                            <span>Full Sandbox Access</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Price Controls */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden bg-slate-50 dark:bg-white/[0.03]">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity ?? 1) - 1))}
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10 transition"
                              title="Decrease quantity"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono font-semibold text-slate-900 dark:text-white">
                              {item.quantity ?? 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10 transition"
                              title="Increase quantity"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition"
                            title="Remove item"
                            aria-label={`Remove ${item.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.price === 0
                              ? "Free"
                              : `₦${(item.price * (item.quantity ?? 1)).toLocaleString()}`}
                          </span>
                          {(item.quantity ?? 1) > 1 && (
                            <div className="text-[10px] text-slate-400">
                              ₦{item.price.toLocaleString()} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Code Input Card */}
                  <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Have a Promo / Referral Code?
                      </span>
                    </div>

                    {couponApplied ? (
                      <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2.5 border border-emerald-200 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="font-mono font-bold tracking-wider">{couponCode}</span>
                          <span>applied ({discountPercentage}% off)</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. HAMMET20 or HAMMETAI"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs uppercase font-mono text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          className="rounded-xl px-4 text-xs font-semibold"
                        >
                          Apply
                        </Button>
                      </form>
                    )}

                    {couponFeedback && (
                      <p
                        className={cn(
                          "mt-2 text-xs flex items-center gap-1.5",
                          couponFeedback.success
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500 dark:text-red-400"
                        )}
                      >
                        {couponFeedback.success ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                        <span>{couponFeedback.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Order Summary Sticky Card */}
                <div>
                  <div className="sticky top-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Order Summary
                    </h3>

                    <div className="space-y-3 border-b border-slate-100 pb-4 text-sm dark:border-white/5">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
                        <span>Curriculum Subtotal</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ₦{rawTotal.toLocaleString()}
                        </span>
                      </div>

                      {couponApplied && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>Coupon Discount ({discountPercentage}%)</span>
                          </span>
                          <span>-₦{discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
                        <span>Accreditation & Sandbox Access</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Included
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
                      onClick={handleProceedToPayment}
                      className="mt-2 w-full rounded-xl bg-purple-600 py-3 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                      size="lg"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="mt-5 space-y-2 text-center text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-center gap-1.5 text-[11px]">
                        <Lock className="h-3 w-3 text-slate-400" />
                        <span>Secured via Paystack</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Supported: Payment Link • Mastercard • Visa • Verve • Bank Transfer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2: PAYSTACK REDIRECT CHECKOUT ────────────────────────────── */}
        {step === "payment" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                  Checkout with Paystack
                </h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  You will be securely redirected to Paystack to complete your curriculum enrollment.
                </p>
              </div>
              <button
                onClick={() => setStep("review")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Cart</span>
              </button>
            </div>
            {/* ── UNIFIED PAYSTACK REDIRECT INTERFACE ────────────────────────────── */}
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              {/* Left: Paystack Checkout Gateway Card */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm dark:border-white/[0.06] dark:bg-[#140F24]">
                  {/* Gateway Status Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 dark:border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          Paystack Secure Gateway
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Complete payment on Paystack's official verified checkout
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Gateway Active</span>
                      </span>
                    </div>
                  </div>

                  {/* Summary Breakdown in Main Card */}
                  <div className="mt-6 rounded-2xl bg-[#F5F3FF]/70 p-5 border border-purple-100 dark:bg-white/[0.02] dark:border-white/5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Total Payable
                      </span>
                      <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-purple-700 dark:text-cyan-400">
                        ₦{finalTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-purple-100/70 pt-3 dark:border-white/5 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Paying account:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {user?.email || "learner@hammetedu.com"}
                      </span>
                    </div>
                  </div>

                  {/* Supported Payment Channels */}
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Accepted Payment Channels on Paystack
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 text-xs font-medium text-slate-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-300">
                        <CreditCard className="h-4 w-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                        <span>Debit Card</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 text-xs font-medium text-slate-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-300">
                        <Building2 className="h-4 w-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                        <span>Bank Transfer</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 text-xs font-medium text-slate-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-300">
                        <Zap className="h-4 w-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                        <span>USSD</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 text-xs font-medium text-slate-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-300">
                        <Sparkles className="h-4 w-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                        <span>Apple Pay</span>
                      </div>
                    </div>
                  </div>

                  {/* Gateway Error Notification */}
                  {gatewayError && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:border-red-500/20 dark:text-red-400">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white">Checkout Error</div>
                        <div className="mt-0.5 text-xs text-red-700 dark:text-red-300 leading-relaxed">{gatewayError}</div>
                      </div>
                    </div>
                  )}

                  {/* Primary Call to Action Button */}
                  <div className="mt-8 space-y-3">
                    <Button
                      onClick={handlePaystackRedirect}
                      disabled={isGeneratingLink}
                      size="lg"
                      className="w-full h-13 rounded-2xl bg-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isGeneratingLink ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Connecting to Paystack...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay ₦{finalTotal.toLocaleString()} with Paystack</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Immediate local curriculum unlock upon payment confirmation</span>
                    </div>
                  </div>

                  {/* Alternate Device / Cross-Device Option */}
                  <div className="mt-8 border-t border-slate-100 pt-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Paying on another device or sharing link?
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowQrCode((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>{showQrCode ? "Hide QR" : "Show QR Code"}</span>
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Link2 className="h-3.5 w-3.5" />
                        </div>
                        <input
                          type="text"
                          readOnly
                          placeholder="Paystack checkout link will appear once connected..."
                          value={
                            paymentLinkData?.paymentUrl ||
                            (isGeneratingLink
                              ? "Generating secure Paystack link..."
                              : "")
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-24 py-2 font-mono text-xs text-slate-700 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                        />
                        {paymentLinkData?.paymentUrl && (
                          <button
                            onClick={handleCopyPaymentLink}
                            className="absolute right-1 top-1 bottom-1 flex items-center gap-1 rounded-lg bg-white px-2 text-[11px] font-semibold text-purple-700 shadow-xs border border-slate-200 hover:bg-slate-50 dark:bg-white/10 dark:border-white/10 dark:text-purple-300"
                          >
                            {copiedPaymentLink ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* QR Code expansion */}
                    <AnimatePresence>
                      {showQrCode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 border border-slate-200/60 dark:bg-white/[0.02] dark:border-white/5"
                        >
                          <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-white p-2 shadow-inner border border-slate-200 dark:border-white/10">
                            <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-900 rounded-lg">
                              {Array.from({ length: 36 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "rounded-xs",
                                    i % 2 === 0 || i % 5 === 0 ? "bg-white" : "bg-purple-400"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Scan with your smartphone camera to pay on mobile
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Trust and reassurance footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Paystack PCI-DSS Certified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                    <span>Instant Automated Webhook Settlement</span>
                  </div>
                </div>
              </div>

              {/* Right: Order Summary Sidebar */}
              <div>
                <div className="sticky top-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-[#140F24]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 border-b border-slate-100 pb-4 text-xs dark:border-white/5">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="truncate max-w-[200px]" title={item.title}>
                          {item.title}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ₦{((item.price) * (item.quantity ?? 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    {couponApplied && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Discount ({discountPercentage}%)</span>
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
                      <span>Instant Access Guarantee</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Upon confirmation, your curriculum licenses and Skill Passport are immediately unlocked in your account with zero delay.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
