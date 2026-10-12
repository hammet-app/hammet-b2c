"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/use-cart";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ShoppingCart, Trash2, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, getTotal, clearCart, markAsPaid } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate payment
    setTimeout(() => {
      markAsPaid();
      setIsProcessing(false);
      router.push("/learner/ai-schools");
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10 bg-[#F5F3FF] dark:bg-[#0D0A17]">
      <div className="mx-auto max-w-[800px]">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <ShoppingCart className="h-3.5 w-3.5" />
            Checkout
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl dark:text-white">
            Your Cart
          </h1>
        </motion.header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-12 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-semibold tracking-[-0.025em]">Your cart is empty</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Looks like you haven&apos;t added any courses or schools yet.</p>
            <Button
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push("/learner/ai-schools")}
            >
              Browse AI Schools
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase text-purple-600 dark:text-cyan-400">
                        {item.type}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.price === 0 ? "Free" : `₦${item.price.toLocaleString()}`}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <div className="sticky top-24 rounded-2xl border border-black/[0.06] bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.03]">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Summary</h3>
                <div className="flex justify-between py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                  <span className="text-slate-500 dark:text-slate-400">Total items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between py-4 mb-4">
                  <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-cyan-400">
                    ₦{getTotal().toLocaleString()}
                  </span>
                </div>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                  disabled={isProcessing}
                  onClick={handleCheckout}
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                  {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
                <div className="mt-4 text-center text-xs text-slate-500">
                  Secure checkout powered by Hammet
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

