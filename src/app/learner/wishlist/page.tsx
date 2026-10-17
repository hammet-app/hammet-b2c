"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Star,
  Clock,
  Award,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/store/use-wishlist";
import { useCart } from "@/lib/store/use-cart";
import { cn } from "@/lib/utils/utils";

export default function WishlistPage() {
  const router = useRouter();
  const wishlistItems = useWishlist((state) => state.items);
  const removeItem = useWishlist((state) => state.removeItem);
  const { addItem, hasItem } = useCart();

  const handleMoveToCart = (item: (typeof wishlistItems)[0]) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      type: item.type,
    });
    removeItem(item.id);
  };

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
              <Heart className="h-4 w-4" />
              <span>Saved Courses & Schools</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Wishlist
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Courses and diploma tracks you&apos;ve saved for future study.
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="rounded-2xl border border-black/[0.05] bg-white/70 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200">
              {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"} Saved
            </div>
          )}
        </motion.header>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="rounded-3xl border border-black/[0.06] bg-white p-12 sm:p-16 text-center shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-cyan-400">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Your wishlist is currently empty
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore our AI Schools catalog and tap the heart icon on courses you want to save for later.
            </p>
            <Button
              onClick={() => router.push("/learner/ai-schools")}
              className="mt-6 rounded-xl bg-purple-600 px-6 py-2.5 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              Browse AI Schools
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item, idx) => {
              const inCart = hasItem(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02]"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        {item.type === "school" ? "Diploma School" : "Specialized Course"}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Icon & Title */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                        {item.type === "school" ? (
                          <GraduationCap className="h-5 w-5" />
                        ) : (
                          <BookOpen className="h-5 w-5" />
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Features summary */}
                    <div className="mb-6 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-purple-500" />
                        <span>Self-paced curriculum</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-3.5 w-3.5 text-purple-500" />
                        <span>Verifiable Skill Credential included</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="border-t border-slate-100 pt-4 dark:border-white/5">
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Enrollment Fee</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.price === 0 ? "Free" : `₦${item.price.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMoveToCart(item)}
                        className={cn(
                          "w-full rounded-xl font-bold transition shadow-sm",
                          inCart
                            ? "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                            : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shadow-purple-600/20"
                        )}
                        disabled={inCart}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>{inCart ? "Already in Cart" : "Move to Cart"}</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
