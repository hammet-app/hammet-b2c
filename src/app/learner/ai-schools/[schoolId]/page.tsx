"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, AlertCircle, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { AiSchoolCourse } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";
import { useCart } from "@/lib/store/use-cart";
import { CourseCard } from "./course-card";

export default function AiSchoolDetailsPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const { schoolId } = use(params);
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const { accessToken, refreshToken } = useAuth();
  
  const [courses, setCourses] = useState<AiSchoolCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { addItem, hasItem, hasPaidItem } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!accessToken || !schoolId) return;

    async function fetchCourses() {
      try {
        setLoading(true);
        const data = await learnerApi.getAiSchoolCourses(schoolId, accessToken!, refreshToken);
        setCourses(data.courses.sort((a, b) => (a.position || 0) - (b.position || 0)));
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load courses");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [schoolId, accessToken, refreshToken]);

  // Calculate full school price
  const fullSchoolPrice = courses.reduce((total, course) => total + course.price, 0) * 0.8; // 20% discount for full school
  const isSchoolPaid = hasPaidItem(schoolId);
  const isSchoolInCart = hasItem(schoolId);

  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10 relative overflow-hidden bg-[#F8F7FF] dark:bg-[#0B0813] transition-colors duration-500">
      <div className="pointer-events-none absolute right-0 top-10 -z-10 h-[450px] w-[450px] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="mx-auto max-w-[1280px]">
        {/* Back navigation */}
        <Link 
          href="/learner/ai-schools"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Schools
        </Link>

        {/* Page heading */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
              <BookOpen className="h-3.5 w-3.5" />
              School of AI foundation
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl dark:text-white">
              Available Courses
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Select and enroll in the courses that match your learning goals, or purchase the entire school.
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {courses.length > 0 && mounted && !isSchoolPaid && (
              <div className="rounded-2xl border border-black/[0.06] bg-slate-50 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="mb-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Buy Full School</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get access to all courses</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    ₦{fullSchoolPrice.toLocaleString()}
                  </div>
                  <Button 
                    className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    onClick={() => {
                      trackEvent("checkout_started", { properties: { schoolId, price: fullSchoolPrice } });
                      if (isSchoolInCart) {
                        router.push('/learner/checkout');
                      } else {
                        addItem({ id: schoolId, type: 'school', title: 'School of AI foundation', price: fullSchoolPrice });
                      }
                    }}
                  >
                    {isSchoolInCart ? "Checkout" : "Add to cart"}
                  </Button>
                </div>
              </div>
            )}
            {courses.length > 0 && mounted && isSchoolPaid && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-5 dark:bg-emerald-500/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">School Purchased</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">You have access to all courses</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[140px] animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.03]" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-500/10 dark:bg-red-500/[0.05]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-12 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <BookOpen className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h3 className="text-lg font-semibold tracking-[-0.025em]">No courses available</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This school currently has no courses published.</p>
          </div>
        ) : (
          <div className="space-y-4 relative">
            {courses.map((course, index) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                schoolId={schoolId} 
                index={index} 
                mounted={mounted} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
