"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BookOpen, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { AiSchool } from "@/lib/api/types";

export default function AiSchoolsPage() {
  const { accessToken, refreshToken } = useAuth();
  
  const [schools, setSchools] = useState<AiSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function fetchSchools() {
      try {
        setLoading(true);
        const data = await learnerApi.getAiSchools(accessToken!, refreshToken);
        setSchools(data.aiSchools);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load AI Schools");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, [accessToken, refreshToken]);

  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 max-w-2xl"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            AI Schools
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl dark:text-white">
            Available AI Schools
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Explore our specialized AI learning paths and schools tailored to your goals.
          </p>
        </motion.header>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[200px] animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.03]" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-500/10 dark:bg-red-500/[0.05]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{error}</p>
          </div>
        ) : schools.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-12 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <BookOpen className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h3 className="text-lg font-semibold tracking-[-0.025em]">No AI Schools available</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Check back later for new offerings.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {schools.map((school, index) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Link
                  href={`/learner/ai-schools/${school.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.03]"
                >
                  <div className="mb-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-[-0.03em]">{school.name}</h2>
                  </div>
                  
                  <p className="mb-6 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400 line-clamp-3">
                    {school.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
                    <span className="text-sm font-semibold text-purple-600 dark:text-cyan-400">
                      View Courses
                    </span>
                    <ArrowRight className="h-4 w-4 text-purple-600 transition-transform group-hover:translate-x-1 dark:text-cyan-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
