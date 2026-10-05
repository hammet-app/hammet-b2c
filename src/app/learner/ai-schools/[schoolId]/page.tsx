"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { AiSchoolCourse } from "@/lib/api/types";
import { Button } from "@/components/ui/button";

export default function AiSchoolDetailsPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const { schoolId } = use(params);
  const { accessToken, refreshToken } = useAuth();
  
  const [courses, setCourses] = useState<AiSchoolCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !schoolId) return;

    async function fetchCourses() {
      try {
        setLoading(true);
        const data = await learnerApi.getAiSchoolCourses(schoolId, accessToken!, refreshToken);
        setCourses(data.courses);
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

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `Pay ₦${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
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
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 max-w-2xl"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <BookOpen className="h-3.5 w-3.5" />
            School Courses
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl dark:text-white">
            Available Courses
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Select and enroll in the courses that match your learning goals.
          </p>
        </motion.header>

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
          <div className="space-y-4">
            {courses.map((course, index) => (
              <motion.article
                key={course.id}
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
                  <div className="p-6 sm:p-7">
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
                  </div>

                  {/* Course purchase section */}
                  <div className="flex items-center justify-between gap-5 border-t border-black/[0.05] p-6 sm:p-7 lg:w-[240px] lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white lg:mb-4">
                      {course.price === 0 ? "Free" : `₦${course.price.toLocaleString()}`}
                    </div>
                    
                    <Button 
                      variant="default"
                      className={`w-full lg:w-auto px-6 py-2 shadow-md text-white transition-colors ${course.price === 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-purple-600 hover:bg-purple-700"}`}
                      onClick={() => alert("Payment flow placeholder: Ready to integrate")}
                    >
                      {formatPrice(course.price)}
                    </Button>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-purple-600 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
