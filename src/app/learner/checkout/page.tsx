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
  CheckCircle2,
  Lock,
  Award,
  Zap,
  Tag,
  AlertCircle,
  GraduationCap,
  CreditCard,
  Building2,
  Smartphone,
  RefreshCw,
  Clock,
  QrCode,
  Link2,
  Check,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { cartApi } from "@/lib/api/cart";
import { getCartItemsFromDB } from "@/lib/db";
import { paymentApi } from "@/lib/api/payment";
import { OrderResponse } from "@/lib/api/types";

type CheckoutStep = "review" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, accessToken, refreshToken } = useAuth();
  const { items, couponCode, discountPercentage, applyCoupon, removeCoupon } =
    useCart();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("review");

  // Payment Link State
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [paymentLinkData, setPaymentLinkData] = useState<{ paymentUrl: string } | null>(null);
  const [copiedPaymentLink, setCopiedPaymentLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);

  // Coupon code logic
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponFeedback, setCouponFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("checkoutOrder");

    if (!savedOrder) {
      return;
    }

    try {
      const parsedOrder = JSON.parse(savedOrder) as OrderResponse;
      setOrder(parsedOrder);
      setStep("payment");
    } catch (error) {
      console.error("Failed to load checkout order:", error);
      sessionStorage.removeItem("checkoutOrder");
    }
  }, []);

  const rawTotal = Number(order?.subtotal ?? (order as any)?.sub_total ?? 0);
  const finalTotal = Number(order?.total ?? 0);
  const discountAmount = order ? Math.max(0, rawTotal - finalTotal) : 0;

  const orderItems = useMemo(() => {
    if (order?.orders && order.orders.length > 0) {
      return order.orders.map((item: any) => ({
        productId: item.productId ?? item.product_id ?? item.id ?? "",
        productType: item.productType ?? item.product_type ?? "course",
        productName: item.productName ?? item.product_name ?? item.title ?? "Curriculum Track",
        productPrice: Number(item.productPrice ?? item.product_price ?? item.price ?? 0),
      }));
    }
    return items.map((i) => ({
      productId: i.productId || i.id,
      productType: i.type,
      productName: i.title,
      productPrice: Number(i.price ?? 0),
    }));
  }, [order, items]);

  const invalidItems = useMemo(() => {
    return (order?.invalid ?? []).map((item: any) => ({
      productName: item.productName ?? item.product_name ?? "Unavailable Track",
      productPrice: Number(item.productPrice ?? item.product_price ?? item.price ?? 0),
    }));
  }, [order]);

  const couponApplied = !!couponCode;

  // Creating order for checkout
  const handleProceedToPayment = async () => {
    if (!accessToken) {
      setGatewayError("Please sign in again before checking out.");
      return;
    }

    if (!order) {
      try {
        setIsCreatingOrder(true);
        // Best effort: ensure local items exist on the remote backend before checkout initialization
        try {
          const localItems = await getCartItemsFromDB();
          for (const item of localItems) {
            await cartApi.addItem(item, accessToken);
          }
        } catch {}

        const newOrder = await cartApi.checkout(accessToken, refreshToken);
        setOrder(newOrder);
        sessionStorage.setItem("checkoutOrder", JSON.stringify(newOrder));
        setStep("payment");
      } catch (err: unknown) {
        setGatewayError(
          err instanceof Error ? err.message : "Failed to prepare checkout order. Please try again.",
        );
      } finally {
        setIsCreatingOrder(false);
      }
      return;
    }

    setStep("payment");
  };

  // Direct Paystack Redirect
  const handlePaystackRedirect = async () => {
    if (!accessToken) {
      setGatewayError("Please sign in again before making payment.");
      return;
    }

    let activeOrder = order;
    if (!activeOrder?.id) {
      try {
        setIsGeneratingLink(true);
        activeOrder = await cartApi.checkout(accessToken, refreshToken);
        setOrder(activeOrder);
        sessionStorage.setItem("checkoutOrder", JSON.stringify(activeOrder));
      } catch (err: unknown) {
        setGatewayError(
          err instanceof Error ? err.message : "Failed to create checkout order.",
        );
        setIsGeneratingLink(false);
        return;
      }
    }

    if (!activeOrder?.id) {
      setGatewayError("Your order has not been created yet.");
      setIsGeneratingLink(false);
      return;
    }

    setGatewayError(null);
    setIsGeneratingLink(true);

    try {
      const paymentUrl = await paymentApi.initPayment(
        activeOrder.id,
        accessToken,
        refreshToken,
      );

      if (!paymentUrl || !/^https?:\/\//i.test(paymentUrl)) {
        throw new Error("The payment service returned an invalid link.");
      }

      setPaymentLinkData({ paymentUrl });
      window.location.assign(paymentUrl);
    } catch (err: unknown) {
      setGatewayError(
        err instanceof Error
          ? err.message
          : "Failed to initialize payment. Please try again.",
      );
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyPaymentLink = async () => {
    if (!order?.id || !accessToken) return;
    try {
      setIsGeneratingLink(true);
      const paymentUrl = await paymentApi.initPayment(
        order.id,
        accessToken,
        refreshToken,
      );
      if (paymentUrl) {
        setPaymentLinkData({ paymentUrl });
        await navigator.clipboard.writeText(paymentUrl);
        setCopiedPaymentLink(true);
        setTimeout(() => setCopiedPaymentLink(false), 2000);
      }
    } catch {
      // ignore
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!couponInput.trim() || !accessToken) return;

    setCouponFeedback(null);
    setGatewayError(null);

    try {
      // Your coupon API should return the updated OrderResponse.
      const updatedOrder = await cartApi.applyCoupon(
        order!.id,
        couponInput.trim(),
        accessToken,
        refreshToken,
      );

      setOrder(updatedOrder);

      // Keep the updated order available if the page is refreshed.
      sessionStorage.setItem("checkoutOrder", JSON.stringify(updatedOrder));
    } catch (error) {
      setCouponFeedback({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to apply coupon. Please try again.",
      });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput("");
    setCouponFeedback(null);
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
                Confirm your selected curriculum tracks and proceed to secure
                checkout.
              </p>
            </div>
            {invalidItems.length > 0 && (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
                  <AlertCircle className="h-4 w-4" />
                  <span>Some items are unavailable</span>
                </div>

                <div className="mt-3 space-y-2">
                  {invalidItems.map((item, index) => (
                    <div
                      key={`${item.productName}-${index}`}
                      className="flex justify-between gap-3 text-sm text-amber-900 dark:text-amber-200"
                    >
                      <span>{item.productName}</span>
                      <span className="shrink-0">
                        ₦{(item.productPrice ?? 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!order && items.length === 0 ? (
              <div className="rounded-3xl border border-black/[0.06] bg-white p-12 text-center shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                <ShoppingCart className="mx-auto mb-4 h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No checkout order found
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Please return to your cart and start checkout again.
                </p>
                <Link href="/learner/ai-schools">
                  <Button className="mt-5 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                    Return to AI Schools
                  </Button>
                </Link>
              </div>
            ) : orderItems.length === 0 ? (
              // Keep your existing empty-cart design here.
              <div className="rounded-3xl border border-black/[0.06] bg-white p-12 text-center shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No valid items available
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  The items in your cart may no longer be available.
                </p>
              </div>
            ) : (
              // Keep your existing grid and order-summary layout here.
              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                {/* Left: Cart Items List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {orderItems.length}{" "}
                      {orderItems.length === 1
                        ? "Curriculum Track"
                        : "Curriculum Tracks"}
                    </span>
                    {/*<button
                      onClick={clearCart}
                      className="text-xs font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition"
                    >
                      Clear Cart
                    </button>*/}
                  </div>

                  {orderItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] transition hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                          {item.productType === "ai_school" ? (
                            <GraduationCap className="h-6 w-6" />
                          ) : (
                            <BookOpen className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                              {item.productType === "ai_school"
                                ? "Diploma School"
                                : "Specialized Course"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              • Lifetime Access
                            </span>
                          </div>
                          <h3 className="mt-1 font-bold text-slate-900 dark:text-white sm:text-base">
                            {item.productName}
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

                          <button
                            onClick={() => {
                              if (!accessToken) return;
                              cartApi.editOrder(
                                {
                                  product_id: item.productId,
                                  product_type: item.productType,
                                },
                                accessToken,
                                refreshToken,
                              );
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition"
                            title="Remove item"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.productPrice === 0
                              ? "Free"
                              : `₦${(item.productPrice ?? 0).toLocaleString()}`}
                          </span>
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
                          <span className="font-mono font-bold tracking-wider">
                            {couponCode}
                          </span>
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
                            : "text-red-500 dark:text-red-400",
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
                          {finalTotal === 0
                            ? "Free"
                            : `₦${finalTotal.toLocaleString()}`}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          Taxes & certificate fee included
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleProceedToPayment}
                      disabled={isCreatingOrder || orderItems.length === 0}
                      className="mt-2 w-full rounded-xl bg-purple-600 py-3 font-bold text-white"
                      size="lg"
                    >
                      {isCreatingOrder
                        ? "Creating order..."
                        : "Proceed to Payment"}
                      {!isCreatingOrder && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>

                    <div className="mt-5 space-y-2 text-center text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-center gap-1.5 text-[11px]">
                        <Lock className="h-3 w-3 text-slate-400" />
                        <span>Secured via Paystack</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Supported: Payment Link • Mastercard • Visa • Verve •
                        Bank Transfer
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 shadow-xs">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Paystack Secure Gateway
                          </h2>
                          <div className="flex items-center bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs dark:bg-white/10 dark:border-white/10">
                            <PaystackLogo className="h-3.5 w-auto" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Complete payment on Paystack&apos;s official verified checkout
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

                  {/* Summary Breakdown in Main Card with POS / Card Terminal Background Watermark */}
                  <div className="mt-6 rounded-2xl bg-[#F5F3FF]/70 p-5 border border-purple-100 dark:bg-white/[0.02] dark:border-white/5 relative overflow-hidden">
                    {/* POS Terminal & Contactless Wave Watermark Graphic in Background */}
                    <svg
                      className="absolute -right-3 -bottom-5 h-36 w-36 text-purple-600/[0.08] dark:text-cyan-400/[0.08] pointer-events-none select-none rotate-6"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {/* POS Terminal Body */}
                      <rect x="25" y="10" width="50" height="80" rx="8" />
                      {/* Screen */}
                      <rect x="33" y="18" width="34" height="22" rx="3" fill="currentColor" fillOpacity="0.1" />
                      {/* Screen status lines */}
                      <line x1="38" y1="26" x2="52" y2="26" strokeWidth="2" />
                      <line x1="38" y1="32" x2="62" y2="32" strokeWidth="2" />
                      {/* Keypad dots */}
                      <circle cx="39" cy="50" r="2.5" fill="currentColor" />
                      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
                      <circle cx="61" cy="50" r="2.5" fill="currentColor" />
                      <circle cx="39" cy="60" r="2.5" fill="currentColor" />
                      <circle cx="50" cy="60" r="2.5" fill="currentColor" />
                      <circle cx="61" cy="60" r="2.5" fill="currentColor" />
                      <circle cx="39" cy="70" r="2.5" fill="currentColor" />
                      <circle cx="50" cy="70" r="2.5" fill="currentColor" />
                      <circle cx="61" cy="70" r="2.5" fill="currentColor" />
                      {/* Card Slot at bottom */}
                      <line x1="35" y1="82" x2="65" y2="82" strokeWidth="3" />
                      {/* Contactless waves above terminal */}
                      <path d="M42 6 C47 3 53 3 58 6" strokeWidth="2" />
                      <path d="M37 2 C45 -2 55 -2 63 2" strokeWidth="2" />
                    </svg>

                    <div className="relative z-10">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            Total Payable
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-100/90 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-cyan-400" />
                            Paystack Checkout
                          </span>
                        </div>
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
                        <Smartphone className="h-4 w-4 text-purple-600 dark:text-cyan-400 shrink-0" />
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
                      className="w-full h-13 rounded-2xl bg-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      {isGeneratingLink ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Connecting to Paystack...</span>
                        </>
                      ) : (
                        <>
                          <PaystackLogo className="h-4 w-auto" monochrome />
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


function PaystackLogo({
  className = "h-4 w-auto",
  monochrome = false,
}: {
  className?: string;
  monochrome?: boolean;
}) {
  return (
    <svg
      viewBox="-131.2 222 600.2 106.9"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="Paystack"
      role="img"
    >
      {/* 4 horizontal bars */}
      <path
        d="m-45.8 232.2h-80.4c-2.7 0-5 2.3-5 5.1v9.1c0 2.8 2.3 5.1 5 5.1h80.4c2.8 0 5-2.3 5.1-5.1v-9c0-2.9-2.3-5.2-5.1-5.2zm0 50.5h-80.4c-1.3 0-2.6.5-3.5 1.5-1 1-1.5 2.2-1.5 3.6v9.1c0 2.8 2.3 5.1 5 5.1h80.4c2.8 0 5-2.2 5.1-5.1v-9.1c-.1-2.9-2.3-5.1-5.1-5.1zm-35.1 25.2h-45.3c-1.3 0-2.6.5-3.5 1.5s-1.5 2.2-1.5 3.6v9.1c0 2.8 2.3 5.1 5 5.1h45.2c2.8 0 5-2.3 5-5v-9.1c.1-3-2.1-5.3-4.9-5.2zm40.2-50.5h-85.5c-1.3 0-2.6.5-3.5 1.5s-1.5 2.2-1.5 3.6v9.1c0 2.8 2.3 5.1 5 5.1h85.4c2.8 0 5-2.3 5-5.1v-9.1c.1-2.8-2.2-5-4.9-5.1zm0 0"
        fill={monochrome ? "currentColor" : "#00c3f7"}
      />
      {/* paystack wordmark */}
      <path
        d="m52.8 252.6c-2.5-2.6-5.4-4.6-8.7-6s-6.8-2.1-10.4-2.1c-3.5-.1-6.9.7-10.1 2.2-2.1 1-4 2.4-5.6 4.1v-1.6c0-.8-.3-1.6-.8-2.2s-1.3-1-2.2-1h-11.1c-.8 0-1.6.3-2.1 1-.6.6-.9 1.4-.8 2.2v74.8c0 .8.3 1.6.8 2.2.6.6 1.3.9 2.1.9h11.4c.8 0 1.5-.3 2.1-.9.6-.5 1-1.3.9-2.2v-25.6c1.6 1.8 3.7 3.1 6 3.9 3 1.1 6.1 1.7 9.3 1.7 3.6 0 7.2-.7 10.5-2.1s6.3-3.4 8.8-6c2.6-2.7 4.6-5.9 6-9.4 1.6-3.9 2.3-8.1 2.2-12.3.1-4.2-.7-8.4-2.2-12.4-1.5-3.3-3.5-6.5-6.1-9.2zm-10.2 27.1c-.6 1.6-1.5 3-2.7 4.3-2.3 2.5-5.6 3.9-9 3.9-1.7 0-3.4-.3-5-1.1-1.5-.7-2.9-1.6-4.1-2.8s-2.1-2.7-2.7-4.3c-1.3-3.4-1.3-7.1 0-10.5.6-1.6 1.6-3 2.7-4.2 1.2-1.2 2.6-2.2 4.1-2.9 1.6-.7 3.3-1.1 5-1.1 1.8 0 3.4.3 5.1 1.1 1.5.7 2.9 1.6 4 2.8 1.2 1.2 2 2.6 2.7 4.2 1.2 3.5 1.1 7.2-.1 10.6zm79.6-33.6h-11.3c-.8 0-1.6.3-2.1.9-.6.6-.9 1.4-.9 2.3v1.4c-1.4-1.7-3.2-3-5.1-3.9-3.1-1.5-6.5-2.2-9.9-2.2-7.3 0-14.2 2.9-19.4 8-2.7 2.7-4.8 5.9-6.2 9.4-1.6 3.9-2.4 8.1-2.3 12.4-.1 4.2.7 8.4 2.3 12.4 1.5 3.5 3.5 6.7 6.2 9.4 5.1 5.2 12.1 8.1 19.3 8.1 3.4.1 6.8-.7 9.9-2.2 1.9-1 3.8-2.3 5.2-3.9v1.5c0 .8.3 1.6.9 2.2.6.5 1.3.9 2.1.9h11.3c.8 0 1.6-.3 2.1-.9.6-.6.9-1.4.9-2.2v-50.3c0-.8-.3-1.6-.8-2.2-.6-.7-1.4-1.1-2.2-1.1zm-15.3 33.6c-.6 1.6-1.5 3-2.7 4.3-1.2 1.2-2.5 2.2-4 2.9-3.2 1.5-6.9 1.5-10.1 0-1.5-.7-2.9-1.7-4.1-2.9s-2.1-2.7-2.7-4.3c-1.2-3.4-1.2-7.1 0-10.5.6-1.6 1.5-2.9 2.7-4.2 1.2-1.2 2.5-2.2 4.1-2.9 3.2-1.5 6.9-1.5 10 0 1.5.7 2.9 1.6 4 2.8s2 2.6 2.7 4.2c1.4 3.5 1.4 7.2.1 10.6zm127.9-6.8c-1.6-1.4-3.5-2.6-5.5-3.4-2.1-.9-4.4-1.5-6.6-2l-8.6-1.7c-2.2-.4-3.8-1-4.6-1.7-.7-.5-1.2-1.3-1.2-2.2s.5-1.7 1.6-2.4c1.5-.8 3.1-1.2 4.8-1.1 2.2 0 4.4.5 6.4 1.3 2 .9 3.9 1.8 5.7 3 2.5 1.6 4.7 1.3 6.2-.5l4.1-4.7c.8-.8 1.2-1.8 1.3-2.9-.1-1.2-.7-2.2-1.6-3-1.7-1.5-4.5-3.1-8.2-4.7s-8.4-2.4-13.9-2.4c-3.4-.1-6.7.4-9.9 1.4-2.7.9-5.3 2.2-7.6 3.9-2.1 1.6-3.7 3.6-4.9 6-1.1 2.3-1.7 4.8-1.7 7.3 0 4.7 1.4 8.5 4.2 11.3s6.5 4.7 11.1 5.6l9 2c1.9.3 3.9.9 5.7 1.8 1 .4 1.6 1.4 1.6 2.5 0 1-.5 1.9-1.6 2.7s-2.9 1.3-5.3 1.3-4.9-.5-7.1-1.6c-2.1-1-4-2.3-5.8-3.8-.8-.6-1.6-1.1-2.6-1.5-1-.3-2.3 0-3.6 1.1l-4.9 3.7c-1.4 1-2.1 2.7-1.7 4.3.3 1.7 1.6 3.3 4.1 5.2 6.2 4.2 13.6 6.4 21.1 6.2 3.5 0 7-.4 10.3-1.4 2.9-.9 5.6-2.2 8-4 2.2-1.6 4-3.7 5.2-6.2 1.2-2.4 1.8-5 1.8-7.7.1-2.4-.4-4.8-1.4-7-1-1.6-2.3-3.3-3.9-4.7zm49.4 13.7c-.5-.9-1.4-1.5-2.5-1.7-1 0-2.1.3-2.9.9-1.4.9-3 1.4-4.6 1.5-.5 0-1.1-.1-1.6-.2-.6-.1-1.1-.4-1.5-.8-.5-.5-.9-1.1-1.2-1.7-.4-1-.6-2-.5-3v-20.5h14.6c.9 0 1.7-.4 2.3-1s1-1.3 1-2.2v-8.7c0-.9-.3-1.7-1-2.2-.6-.6-1.4-.9-2.2-.9h-14.7v-14c0-.8-.3-1.7-.9-2.2s-1.3-.8-2.1-.9h-11.4c-.8 0-1.6.3-2.2.9s-1 1.4-1 2.2v14h-6.5c-.8 0-1.6.3-2.2 1-.5.6-.8 1.4-.8 2.2v8.7c0 .8.3 1.6.8 2.2.5.7 1.3 1 2.2 1h6.5v24.4c-.1 2.9.5 5.8 1.7 8.4 1.1 2.2 2.5 4.1 4.4 5.7 1.8 1.5 3.9 2.6 6.2 3.2 2.3.7 4.7 1.1 7.1 1.1 3.1 0 6.3-.5 9.3-1.5 2.8-.9 5.3-2.5 7.3-4.6 1.3-1.3 1.4-3.4.4-4.9zm61.8-40.5h-11.3c-.8 0-1.5.3-2.1.9s-.9 1.4-.9 2.3v1.4c-1.4-1.7-3.1-3-5.1-3.9-3.1-1.5-6.5-2.2-9.9-2.2-7.3 0-14.2 2.9-19.4 8-2.7 2.7-4.8 5.9-6.2 9.4-1.6 3.9-2.4 8.1-2.3 12.3-.1 4.2.7 8.4 2.3 12.4 1.4 3.5 3.6 6.7 6.2 9.4 5.1 5.2 12 8.1 19.3 8.1 3.4.1 6.8-.7 9.9-2.1 2-1 3.8-2.3 5.2-3.9v1.5c0 .8.3 1.6.9 2.1.6.6 1.3.9 2.1.9h11.3c1.7 0 3-1.3 3-3v-50.3c0-.8-.3-1.6-.8-2.2-.5-.7-1.3-1.1-2.2-1.1zm-15.2 33.6c-.6 1.6-1.5 3-2.7 4.3-1.2 1.2-2.5 2.2-4 2.9-1.6.7-3.3 1.1-5.1 1.1s-3.4-.4-5-1.1c-1.5-.7-2.9-1.7-4.1-2.9s-2.1-2.7-2.6-4.3c-1.2-3.4-1.2-7.1 0-10.5.6-1.6 1.5-3 2.6-4.2 1.2-1.2 2.6-2.2 4.1-2.9 1.6-.7 3.3-1.1 5-1.1s3.4.3 5.1 1.1c1.5.7 2.8 1.6 4 2.8s2.1 2.6 2.7 4.2c1.3 3.4 1.3 7.2 0 10.6zm77.2 6.1-6.5-5c-1.2-1-2.4-1.3-3.4-.9-.9.4-1.7 1-2.4 1.7-1.4 1.7-3.1 3.2-4.9 4.5-2 1.1-4.1 1.7-6.3 1.5-2.6 0-5-.7-7.1-2.2s-3.7-3.5-4.5-6c-.6-1.7-.9-3.4-.9-5.1 0-1.8.3-3.5.9-5.3.6-1.6 1.4-3 2.6-4.2s2.5-2.2 4-2.8c1.6-.7 3.3-1.1 5.1-1.1 2.2-.1 4.4.5 6.3 1.6 1.9 1.2 3.5 2.7 4.9 4.5.6.7 1.4 1.3 2.3 1.7 1 .4 2.2.1 3.4-.9l6.5-4.9c.8-.5 1.4-1.3 1.7-2.2.4-1 .3-2.1-.3-3-2.5-3.9-5.9-7.1-10-9.4-4.3-2.4-9.4-3.7-15.1-3.7-4 0-8 .8-11.8 2.3-3.6 1.5-6.8 3.6-9.5 6.3s-4.9 5.9-6.4 9.5c-3.1 7.5-3.1 15.9 0 23.4 1.5 3.5 3.6 6.8 6.4 9.4 5.7 5.6 13.3 8.6 21.3 8.6 5.7 0 10.8-1.3 15.1-3.7 4.1-2.3 7.6-5.5 10.1-9.5.5-.9.6-2 .3-2.9-.4-.8-1-1.6-1.8-2.2zm60.2 11.7-17.9-26.2 15.3-20.2c.7-.9 1-2.2.6-3.3-.3-.8-1-1.6-2.9-1.6h-12.1c-.7 0-1.4.2-2 .5-.8.4-1.4 1-1.8 1.7l-12.2 17.1h-2.9v-40.4c0-.8-.3-1.6-.9-2.2s-1.3-.9-2.1-.9h-11.3c-.8 0-1.6.3-2.2.9s-.9 1.3-.9 2.2v74.5c0 .9.3 1.6.9 2.2s1.4.9 2.2.9h11.3c.8 0 1.6-.3 2.1-.9.6-.6.9-1.4.9-2.2v-19.7h3.2l13.3 20.4c.8 1.5 2.3 2.4 3.9 2.4h12.7c1.9 0 2.7-.9 3.1-1.7.5-1.2.4-2.5-.3-3.5zm-281.8-51.4h-12.7c-1 0-1.9.3-2.6 1-.6.6-1 1.3-1.2 2.1l-9.4 34.8h-2.3l-10-34.8c-.2-.7-.5-1.4-1-2.1-.6-.7-1.4-1.1-2.3-1.1h-12.9c-1.7 0-2.7.5-3.2 1.7-.3 1-.3 2.1 0 3.1l16 49c.3.7.6 1.5 1.2 2 .6.6 1.5.9 2.4.9h6.8l-.6 1.6-1.5 4.5c-.5 1.4-1.3 2.6-2.5 3.5-1.1.8-2.4 1.3-3.8 1.2-1.2 0-2.3-.3-3.4-.7-1.1-.5-2.1-1.1-3-1.8-.8-.6-1.8-.9-2.9-.9h-.1c-1.2.1-2.3.7-2.9 1.8l-4 5.9c-1.6 2.6-.7 4.2.3 5.1 2.2 2 4.7 3.5 7.5 4.4 3.1 1.1 6.3 1.6 9.5 1.6 5.8 0 10.6-1.6 14.3-4.7 3.8-3.4 6.7-7.8 8.1-12.8l18.6-60.6c.4-1.1.5-2.2.1-3.2-.1-.7-.8-1.5-2.5-1.5zm0 0"
        fill={monochrome ? "currentColor" : "#011B33"}
        className={monochrome ? "" : "dark:fill-white"}
      />
    </svg>
  );
}
