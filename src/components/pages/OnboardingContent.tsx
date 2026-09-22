"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass,
  Route,
  Check,
} from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { AuthShell } from "@/components/ui/auth-shell";
import { learnerApi } from "@/lib/api/learner";
import { Interest, ProfileOnboarding } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/auth-context";

type LearningMode = "focus" | "guided";

const interests: {
  id: Interest;
  title: string;
  description: string;
}[] = [
    {
      id: "generative_ai",
      title: "Generative AI",
      description: "Create with AI",
    },
    {
      id: "ai_agents",
      title: "AI Agents",
      description: "Build systems that act",
    },
    {
      id: "automation",
      title: "Automation",
      description: "Make work happen automatically",
    },
    {
      id: "machine_learning",
      title: "Machine Learning",
      description: "Understand intelligent systems",
    },
    {
      id: "programming",
      title: "Programming",
      description: "Build software",
    },
    {
      id: "data_analytics",
      title: "Data & Analytics",
      description: "Turn data into insight",
    },
    {
      id: "ai_business",
      title: "AI for Business",
      description: "Apply AI to real problems",
    },
  ];

const steps = ["welcome", "learning", "interests", "ready"] as const;

type Step = (typeof steps)[number];

export default function OnboardingContent() {
  const router = useRouter();
  const { user, accessToken, refreshToken } = useAuth()

  const [step, setStep] = useState<Step>("welcome");
  const [learningMode, setLearningMode] =
    useState<LearningMode | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStepIndex = steps.indexOf(step);

  function goNext() {
    const nextStep = steps[currentStepIndex + 1];

    if (nextStep) {
      setStep(nextStep);
    }
  }

  function goBack() {
    const previousStep = steps[currentStepIndex - 1];

    if (previousStep) {
      setStep(previousStep);
    }
  }

  function toggleInterest(interest: Interest) {
    setSelectedInterests((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, interest];
    });
  }

  async function completeOnboarding() {
    if (!learningMode || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!accessToken) return;
      /*
       * Replace this endpoint with the final onboarding endpoint.
       *
       * The frontend payload is intentionally shaped around the
       * information onboarding owns, rather than the entire profile.
       
      learnerApi.completeOnboarding(
        { learningMode: learningMode, interests: selectedInterests } satisfies ProfileOnboarding,
        accessToken,
        refreshToken
      )
        */

      router.replace("/learner");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to complete onboarding. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (user?.role != "learner") {
    return notFound()
  }

  return (
    <AuthShell>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-10 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-0 dark:text-neutral-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-2">
              {steps.map((item, index) => (
                <div
                  key={item}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index <= currentStepIndex
                    ? "w-8 bg-purple-600"
                    : "w-3 bg-neutral-200 dark:bg-neutral-800"
                    }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                  <Sparkles className="h-6 w-6" />
                </div>

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-400">
                  Welcome to Hammet
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                  Your learning here becomes part of something bigger.
                </h1>

                <p className="mt-5 max-w-lg text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                  Learn, build, and keep a record of what you can actually
                  do. Your Hammet profile can grow into a digital passport
                  containing the work you create here and the work you bring
                  from elsewhere.
                </p>

                <button
                  type="button"
                  onClick={goNext}
                  className="mt-10 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 font-semibold text-white transition hover:bg-purple-800"
                >
                  Let&apos;s get started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === "learning" && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                  Your learning style
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                  How do you want to learn?
                </h1>

                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                  Choose the experience that sounds more like you.
                </p>

                <div className="mt-8 grid gap-4">
                  <button
                    type="button"
                    onClick={() => setLearningMode("guided")}
                    className={`group rounded-2xl border p-6 text-left transition ${learningMode === "guided"
                      ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600/20 dark:border-purple-400 dark:bg-purple-500/10"
                      : "border-neutral-200 bg-white hover:border-purple-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-purple-700"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                        <Route className="h-5 w-5" />
                      </div>

                      {learningMode === "guided" && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-neutral-950 dark:text-white">
                      Guided
                    </h2>

                    <p className="mt-2 leading-6 text-neutral-600 dark:text-neutral-400">
                      Give me a structured path and show me what to do next.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLearningMode("focus")}
                    className={`group rounded-2xl border p-6 text-left transition ${learningMode === "focus"
                      ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500/20 dark:border-cyan-400 dark:bg-cyan-500/10"
                      : "border-neutral-200 bg-white hover:border-cyan-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-cyan-700"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                        <Compass className="h-5 w-5" />
                      </div>

                      {learningMode === "focus" && (
                        <Check className="h-5 w-5 text-cyan-600" />
                      )}
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-neutral-950 dark:text-white">
                      Focus
                    </h2>

                    <p className="mt-2 leading-6 text-neutral-600 dark:text-neutral-400">
                      Let me choose what I want to work on and explore
                      independently.
                    </p>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!learningMode}
                  className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === "interests" && (
              <motion.div
                key="interests"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-400">
                  Your direction
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                  What do you want to explore?
                </h1>

                <p className="mt-4 text-lg leading-7 text-neutral-600 dark:text-neutral-400">
                  Pick up to 3. This helps us understand what learning
                  experiences people need next.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {interests.map((interest) => {
                    const selected = selectedInterests.includes(interest.id);

                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`rounded-2xl border p-5 text-left transition ${selected
                          ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600/20 dark:border-purple-400 dark:bg-purple-500/10"
                          : "border-neutral-200 bg-white hover:border-purple-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-purple-700"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-semibold text-neutral-950 dark:text-white">
                              {interest.title}
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                              {interest.description}
                            </p>
                          </div>

                          {selected && (
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {selectedInterests.length}/3 selected
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 font-semibold text-white transition hover:bg-purple-800"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === "ready" && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                  <Check className="h-6 w-6" />
                </div>

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                  You&apos;re ready
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                  Time to start building.
                </h1>

                <p className="mt-5 max-w-lg text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                  Your Hammet journey starts here. As you learn and create,
                  your digital passport grows with you.
                </p>

                {error && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={completeOnboarding}
                  disabled={isSubmitting}
                  className="mt-10 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Setting things up..." : "Enter Hammet"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthShell>
  );
}