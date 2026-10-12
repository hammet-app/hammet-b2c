"use client";

import { motion } from "motion/react";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/store/use-wishlist";
import { useCart } from "@/lib/store/use-cart";

export default function WishlistPage() {
  const wishlistItems = useWishlist((state) => state.items);
  const removeItem = useWishlist((state) => state.removeItem);
  const { addItem, hasItem } = useCart();

  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10 bg-[#F5F3FF] dark:bg-[#0D0A17]">
      <div className="mx-auto max-w-[1280px]">
        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <Heart className="h-3.5 w-3.5" />
            Saved for later
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Wishlist
          </h1>
        </motion.header>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.06] bg-white p-16 text-center shadow-sm dark:border-white/[0.06] dark:bg-[#18181B]">
            <Heart className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">Your wishlist is empty</h3>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Explore courses and add them to your wishlist to save them for later.
            </p>
            <Link href="/learner/ai-schools">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-all hover:shadow-lg dark:border-white/[0.06] dark:bg-[#18181B]"
              >
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800">
                   <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600">
                     <span className="text-xs uppercase tracking-widest font-bold">{item.type}</span>
                   </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-tight text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400">
                    {item.title}
                  </h3>
                  <div className="mt-auto">
                    <div className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {item.price === 0 ? "Free" : `₦${item.price.toLocaleString()}`}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => {
                           if (!hasItem(item.id)) {
                             addItem(item);
                             removeItem(item.id);
                           }
                        }}
                        className={`w-full ${hasItem(item.id) ? 'bg-slate-200 text-slate-500' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'}`}
                        disabled={hasItem(item.id)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {hasItem(item.id) ? "In Cart" : "Add to Cart"}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        className="w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

