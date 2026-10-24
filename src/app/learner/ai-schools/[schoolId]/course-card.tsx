"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AiSchool, AiSchoolCourse } from "@/lib/api/types";
//import { useCart } from "@/lib/store/use-cart";
import { useWishlist } from "@/lib/store/use-wishlist";
import { cartApi } from "@/lib/api/cart";

export function CourseCard({
  course,
  school,
  hasCartItem,
  index,
  mounted,
}: {
  course: AiSchoolCourse;
  school?: AiSchool;
  hasCartItem: boolean;
  index: number;
  mounted: boolean;
}) {
  const router = useRouter();
  //const { addItem, hasItem, hasPaidItem } = useCart();
  const wishlist = useWishlist();
  const isWishlisted = wishlist.hasItem(course.id);
  const [hovered, setHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const hasItem = hasCartItem;

  if (!school) return null;

  async function addCourseToCart() {
    setAddError(null);
    setIsAdding(true);
    const result = await cartApi.addItem({
      productId: course.id,
      type: "course",
      title: course.title,
      price: course.price || 0,
    });
    setIsAdding(false);
    if (result.success) router.push("/learner/checkout");
    else setAddError(result.error ?? "Unable to add this course to your cart.");
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: index * 0.06,
        }}
        className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-colors dark:border-white/[0.06] dark:bg-white/[0.03]"
      >
        <div className="relative grid lg:grid-cols-[1fr_auto]">
          {/* Subtle Background Watermark & Ambient Accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
            {/* Subtle radial ambient glow */}
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-purple-500/[0.06] blur-2xl dark:bg-purple-500/[0.10]" />
            <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-cyan-500/[0.04] blur-2xl dark:bg-cyan-500/[0.08]" />

            {/* Subtle Tech Academic Dotted Grid Wash */}
            <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1.2px,transparent_1.2px)] [background-size:18px_18px] opacity-[0.04] dark:opacity-[0.07]" />

            {/* Stylized Open Book & Knowledge Watermark Graphic */}
            <svg
              className="absolute right-4 sm:right-28 lg:right-64 top-1/2 -translate-y-1/2 h-32 w-32 text-purple-700/[0.07] dark:text-purple-300/[0.10] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
              viewBox="0 0 120 120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Book Spine & Pages */}
              <path d="M60 98 C60 98 42 88 18 88 C14 88 10 90 10 94 L10 32 C10 28 14 26 18 26 C42 26 60 36 60 36 C60 36 78 26 102 26 C106 26 110 28 110 32 L110 94 C110 90 106 88 102 88 C78 88 60 98 60 98 Z" />
              <path d="M60 36 L60 98" />

              {/* Page Line Accents */}
              <path
                d="M22 42 C34 42 46 47 52 50"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />
              <path
                d="M22 56 C34 56 46 61 52 64"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />
              <path
                d="M22 70 C34 70 46 75 52 78"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />

              <path
                d="M98 42 C86 42 74 47 68 50"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />
              <path
                d="M98 56 C86 56 74 61 68 64"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />
              <path
                d="M98 70 C86 70 74 75 68 78"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />

              {/* Sparkle/Star Above Book */}
              <path
                d="M60 14 L62 20 L68 22 L62 24 L60 30 L58 24 L52 22 L58 20 Z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </div>

          {/* Course content */}
          <Link
            href={`/learner/courses/${course.id}`}
            className="relative z-10 p-6 sm:p-7 block hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.13em] text-purple-600 dark:text-cyan-400">
                Course
              </span>
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.03em]">
              {course.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {course.description}
            </p>
          </Link>

          {/* Course purchase section */}
          <div className="flex items-center justify-between gap-5 border-t border-black/[0.05] p-6 sm:p-7 lg:w-[240px] lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-white lg:mb-4">
              {(mounted && course.isEntitled) || school.isEntitled ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Paid
                </span>
              ) : (course.price || 0) === 0 ? (
                "Free"
              ) : (
                `₦${(course.price || 0).toLocaleString()}`
              )}
            </div>

            <Button
              variant="default"
              className={`w-full lg:w-auto px-6 py-2 shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] ${
                (course.price || 0) === 0
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-500/20 dark:text-purple-300"
              }`}
              disabled={isAdding}
              onClick={async (e) => {
                e.preventDefault();
                if (course.isEntitled || school.isEntitled) {
                  router.push(`/learner/courses/${course.id}`);
                } else if (hasItem) {
                  router.push("/learner/checkout");
                } else {
                  await addCourseToCart();
                }
              }}
            >
              {!mounted
                ? null
                : course.isEntitled || school.isEntitled
                  ? "Start course"
                  : isAdding
                    ? "Adding…"
                    : hasItem
                    ? "Checkout"
                    : (course.price || 0) === 0
                      ? "Free"
                      : "Add to cart"}
            </Button>
            {addError && (
              <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                {addError}
              </p>
            )}
          </div>
        </div>

        {/* Hover accent */}
        <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-purple-600 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
      </motion.article>

      {/* Hover tooltip/overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end rounded-2xl bg-white/80 p-6 backdrop-blur-md dark:bg-black/80 sm:p-7"
          >
            <div className="pointer-events-auto flex w-full max-w-sm flex-col items-end text-right">
              <h4 className="mb-2 text-lg font-bold leading-tight text-slate-900 dark:text-white">
                {course.title}
              </h4>
              <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
                {course.description}
              </p>

              <div className="flex w-full items-center justify-end gap-3">
                <button
                  disabled={isAdding}
                  onClick={async (e) => {
                    e.preventDefault();
                    if (isWishlisted) {
                      wishlist.removeItem(course.id);
                    } else {
                      wishlist.addItem({
                        id: course.id,
                        type: "course",
                        title: course.title,
                        price: course.price,
                      });
                    }
                  }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isWishlisted
                      ? "border-purple-600 bg-purple-50 text-purple-600 dark:border-cyan-400 dark:bg-cyan-900/30 dark:text-cyan-400"
                      : "border-slate-300 bg-white/50 text-slate-500 hover:border-purple-600 hover:text-purple-600 hover:shadow-sm dark:border-slate-600 dark:bg-black/50 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
                  }`}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>

                <Button
                  disabled={isAdding}
                  className={`px-6 shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] ${
                    (course.price || 0) === 0
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-500/20 dark:text-purple-300"
                  }`}
                  onClick={async (e) => {
                    e.preventDefault();
                    if (course.isEntitled || school.isEntitled) {
                      router.push(`/learner/courses/${course.id}`);
                    } else if (hasItem) {
                      router.push("/learner/checkout");
                    } else {
                      await addCourseToCart();
                    }
                  }}
                >
                  {!mounted
                    ? null
                    : course.isEntitled || school.isEntitled
                      ? "Start course"
                      : isAdding
                        ? "Adding…"
                        : hasItem
                        ? "Checkout"
                        : (course.price || 0) === 0
                          ? "Free"
                          : "Add to cart"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
