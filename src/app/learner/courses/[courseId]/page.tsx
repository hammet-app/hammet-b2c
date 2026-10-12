"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, AlertCircle, Lock, PlayCircle, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { AiSchoolCourse } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/use-cart";

const MOCK_MODULES = [
  { id: "m1", title: "Module 1: Introduction to AI", description: "Learn the fundamentals of Artificial Intelligence, its history, and modern applications.", duration: "45 mins" },
  { id: "m2", title: "Module 2: Machine Learning Basics", description: "Understand supervised and unsupervised learning, and build your first model.", duration: "1h 15m" },
  { id: "m3", title: "Module 3: Neural Networks", description: "Deep dive into perceptrons, activation functions, and deep learning architectures.", duration: "2h 30m" },
  { id: "m4", title: "Module 4: Real-world AI Projects", description: "Apply what you've learned to solve real business problems using AI tools.", duration: "1h 45m" }
];

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { accessToken, refreshToken } = useAuth();
  const { addItem, hasItem, hasPaidItem } = useCart();
  
  const [course, setCourse] = useState<AiSchoolCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!accessToken || !courseId) return;

    // We don't have a direct getCourse endpoint, so we fetch all courses from all schools or mock it.
    // For now, we mock fetching the specific course details by searching through AI schools.
    // In a real scenario, there would be a `/learner/courses/${courseId}` endpoint.
    async function fetchCourse() {
      try {
        setLoading(true);
        // HACK: Fetch all schools, then their courses to find this one.
        const schoolsData = await learnerApi.getAiSchools(accessToken!, refreshToken);
        let foundCourse: AiSchoolCourse | null = null;
        
        for (const school of schoolsData.aiSchools) {
          const courseData = await learnerApi.getAiSchoolCourses(school.id, accessToken!, refreshToken);
          const match = courseData.courses.find(c => c.id === courseId);
          if (match) {
            foundCourse = match;
            break;
          }
        }

        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          // If not found (e.g. mock data), set a placeholder
          setCourse({
            id: courseId,
            title: "Advanced AI Concepts",
            description: "An intensive course covering advanced AI topics.",
            price: 50000,
            aiSchoolId: "mock-school-id",
            slug: "advanced-ai",
            position: 1
          });
        }
        setError(null);
      } catch (err) {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, accessToken, refreshToken]);

  if (!mounted) return null;

  const isPaid = course ? (hasPaidItem(course.id) || hasPaidItem(course.aiSchoolId)) : false;
  const inCart = course ? hasItem(course.id) : false;

  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10 bg-[#F5F3FF] dark:bg-[#0D0A17]">
      <div className="mx-auto max-w-[1000px]">
        <button 
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-40 rounded-3xl bg-white/[0.5] dark:bg-white/[0.03]" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/[0.5] dark:bg-white/[0.03]" />)}
            </div>
          </div>
        ) : error || !course ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-500/10 dark:bg-red-500/[0.05]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{error || "Course not found"}</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                  <BookOpen className="h-3.5 w-3.5" />
                  Course Overview
                </div>
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                  {course.title}
                </h1>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {course.description}
                </p>
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Course Modules</h2>
                {MOCK_MODULES.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all ${isPaid ? 'border-purple-200 bg-white hover:border-purple-300 dark:border-purple-500/20 dark:bg-white/[0.02] dark:hover:border-purple-500/40 cursor-pointer' : 'border-black/[0.06] bg-slate-50/50 dark:border-white/[0.06] dark:bg-white/[0.01]'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isPaid ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                        {isPaid ? <PlayCircle className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${isPaid ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                            {mod.title}
                          </h3>
                          <span className="text-xs font-medium text-slate-400">{mod.duration}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar / Purchase Card */}
            <div>
              <div className="sticky top-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-[#120E1D]">
                <div className="mb-6">
                  {isPaid ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">Purchased</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {course.price === 0 ? "Free" : `₦${course.price.toLocaleString()}`}
                    </div>
                  )}
                </div>

                {isPaid ? (
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md h-12 rounded-xl text-md"
                    onClick={() => alert("Starting course module...")}
                  >
                    <PlayCircle className="mr-2 h-5 w-5" /> Start Course
                  </Button>
                ) : inCart ? (
                  <Button 
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-md h-12 rounded-xl text-md"
                    onClick={() => router.push('/learner/checkout')}
                  >
                    Go to Checkout
                  </Button>
                ) : (
                  <Button 
                    className={`w-full text-white shadow-md h-12 rounded-xl text-md transition-colors ${course.price === 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-purple-600 hover:bg-purple-700"}`}
                    onClick={() => {
                      addItem({ id: course.id, type: 'course', title: course.title, price: course.price, schoolId: course.aiSchoolId });
                    }}
                  >
                    {course.price === 0 ? "Enroll for Free" : "Add to Cart"}
                  </Button>
                )}

                {!isPaid && (
                  <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    Includes full lifetime access to all modules and future updates.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

