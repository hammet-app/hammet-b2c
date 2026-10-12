"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/store/use-cart";
import { Button } from "@/components/ui/button";

export function CartDropdown() {
  const [open, setOpen] = useState(false);
  const cartItems = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const getTotal = useCart((state) => state.getTotal);

  return (
    <div 
      className="relative z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/learner/checkout"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
        aria-label="View Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartItems.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-sm">
            {cartItems.length}
          </span>
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl dark:border-white/[0.06] dark:bg-[#18181B]"
          >
            <div className="p-4 text-slate-900 dark:text-white">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <ShoppingCart className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">Your cart is empty.</p>
                  <Link href="/learner/ai-schools" className="mt-2 text-xs text-purple-600 hover:underline dark:text-cyan-400">
                    Keep shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="mb-4 flex items-start justify-between gap-3 border-b border-black/[0.04] pb-4 last:mb-0 last:border-0 last:pb-0 dark:border-white/[0.04]">
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate text-sm font-medium text-slate-900 dark:text-white" title={item.title}>
                            {item.title}
                          </h4>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {item.price === 0 ? "Free" : `₦${item.price.toLocaleString()}`}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
                    <div className="mb-4 flex items-center justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-lg">₦{getTotal().toLocaleString()}</span>
                    </div>
                    <Link href="/learner/checkout" className="block w-full">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                        Go to Checkout
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

