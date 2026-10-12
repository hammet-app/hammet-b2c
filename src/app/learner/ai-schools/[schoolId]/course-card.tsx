"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AiSchoolCourse } from "@/lib/api/types";
import { useCart } from "@/lib/store/use-cart";
import { useWishlist } from "@/lib/store/use-wishlist";

export function CourseCard({ course, schoolId, index, mounted }: { course: AiSchoolCourse, schoolId: string, index: number, mounted: boolean }) {
  const router = useRouter();
  const { addItem, hasItem, hasPaidItem } = useCart();
  const wishlist = useWishlist();
  const isWishlisted = wishlist.hasItem(course.id);
  const [hovered, setHovered] = useState(false);

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
        <div className="grid lg:grid-cols-[1fr_auto]">
          {/* Course content */}
          <Link href={`/learner/courses/${course.id}`} className="p-6 sm:p-7 block hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
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
              {mounted && (hasPaidItem(course.id) || hasPaidItem(schoolId)) ? (
                <span className="text-emerald-600 dark:text-emerald-400">Paid</span>
              ) : (course.price || 0) === 0 ? "Free" : `₦${(course.price || 0).toLocaleString()}`}
            </div>
            
            <Button 
              variant="default"
              className={`w-full lg:w-auto px-6 py-2 shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] ${
                (course.price || 0) === 0 
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300" 
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-500/20 dark:text-purple-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (hasPaidItem(course.id) || hasPaidItem(schoolId)) {
                  router.push(`/learner/courses/${course.id}`);
                } else if (hasItem(course.id)) {
                  router.push('/learner/checkout');
                } else {
                  addItem({ id: course.id, type: 'course', title: course.title, price: (course.price || 0), schoolId: schoolId });
                }
              }}
            >
              {!mounted ? null : (hasPaidItem(course.id) || hasPaidItem(schoolId)) ? "Start course" : hasItem(course.id) ? "Checkout" : (course.price || 0) === 0 ? "Free" : "Add to cart"}
            </Button>
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (isWishlisted) {
                      wishlist.removeItem(course.id);
                    } else {
                      wishlist.addItem({ id: course.id, type: 'course', title: course.title, price: course.price });
                    }
                  }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isWishlisted 
                      ? "border-purple-600 bg-purple-50 text-purple-600 dark:border-cyan-400 dark:bg-cyan-900/30 dark:text-cyan-400" 
                      : "border-slate-300 bg-white/50 text-slate-500 hover:border-purple-600 hover:text-purple-600 hover:shadow-sm dark:border-slate-600 dark:bg-black/50 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                <Button 
                  className={`px-6 shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] ${
                    (course.price || 0) === 0 
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300" 
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-500/20 dark:text-purple-300"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasPaidItem(course.id) || hasPaidItem(schoolId)) {
                      router.push(`/learner/courses/${course.id}`);
                    } else if (hasItem(course.id)) {
                      router.push('/learner/checkout');
                    } else {
                      addItem({ id: course.id, type: 'course', title: course.title, price: (course.price || 0), schoolId: schoolId });
                    }
                  }}
                >
                  {!mounted ? null : (hasPaidItem(course.id) || hasPaidItem(schoolId)) ? "Start course" : hasItem(course.id) ? "Checkout" : (course.price || 0) === 0 ? "Free" : "Add to cart"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

