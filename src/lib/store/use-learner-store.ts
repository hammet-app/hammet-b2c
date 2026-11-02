import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LearnerProject {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  track: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Production";
  estimatedHours: number;
  description: string;
  tags: string[];
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  rubric: string[];
  submission?: {
    repoUrl: string;
    demoUrl: string;
    notes: string;
    submittedAt: string;
    grade: string;
  };
  earnedBadgeId?: string;
}

export interface SkillBadge {
  id: string;
  title: string;
  category: "neural" | "agents" | "rag" | "safety" | "fullstack" | "pro";
  desc: string;
  issued: string;
  status: "Verified" | "Minted" | "In Review";
  grade: "Grade A+" | "Grade A" | "Fellowship Honors";
  verificationHash: string;
  skills: string[];
  projectTitle: string;
  accentColor: string;
  glowColor: string;
  iconType: "neural" | "agent" | "rag" | "safety" | "code" | "crown";
}

export interface ModuleTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleTestResult {
  moduleId: string;
  passed: boolean;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

interface LearnerState {
  // Projects
  projects: LearnerProject[];
  startProject: (projectId: string) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  submitProject: (
    projectId: string,
    submission: { repoUrl: string; demoUrl: string; notes: string }
  ) => SkillBadge | null;

  // Badges
  badges: SkillBadge[];
  activeCelebrationBadge: SkillBadge | null;
  triggerCelebration: (badge: SkillBadge) => void;
  closeCelebration: () => void;

  // Module Tests
  moduleTestResults: Record<string, ModuleTestResult>;
  completeModuleTest: (
    moduleId: string,
    score: number,
    totalQuestions: number
  ) => void;

  // School & Certificate State
  schoolCompleted: boolean;
  toggleSchoolCompleted: () => void;

  // Pro Subscription State
  isPro: boolean;
  togglePro: () => void;
  proPassportTheme: "gold" | "obsidian" | "holographic";
  setProPassportTheme: (theme: "gold" | "obsidian" | "holographic") => void;

  // Portfolio
  portfolioTemplate: "bento" | "terminal" | "showcase" | "academic";
  setPortfolioTemplate: (
    template: "bento" | "terminal" | "showcase" | "academic"
  ) => void;
  portfolioBio: string;
  setPortfolioBio: (bio: string) => void;

  // Account Separation (user_learner test account vs Real Accounts)
  activeUserId: string | null;
  syncAccountState: (userId?: string) => void;
}

export const INITIAL_BADGES: SkillBadge[] = [
  {
    id: "badge-neural-architect",
    title: "Neural Architect",
    category: "neural",
    desc: "4-bit LoRA adapter training, quantization & benchmark evaluation",
    issued: "Oct 2026",
    status: "Verified",
    grade: "Grade A+",
    verificationHash: "0x7F2A...4B9E",
    skills: ["LoRA", "4-bit Quantization", "Unsloth", "PyTorch", "Perplexity Audits"],
    projectTitle: "Domain-Adapted Llama 3 8B Fine-Tuning with Unsloth",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.45)",
    iconType: "neural",
  },
  {
    id: "badge-agentic-swarm",
    title: "Agentic Swarm Engineer",
    category: "agents",
    desc: "Built multi-agent orchestrator with LangGraph, MCP tools & checkpoints",
    issued: "Oct 2026",
    status: "Verified",
    grade: "Grade A",
    verificationHash: "0x3D9B...881A",
    skills: ["LangGraph", "MCP Protocol", "State Persistence", "Tool Calling", "Multi-Agent"],
    projectTitle: "Autonomous Support Swarm with Tool Calling & Human-in-the-Loop",
    accentColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.45)",
    iconType: "agent",
  },
  {
    id: "badge-hybrid-rag",
    title: "Hybrid RAG Specialist",
    category: "rag",
    desc: "Deployed Milvus contextual vector retrieval pipeline with 98% recall",
    issued: "Oct 2026",
    status: "Verified",
    grade: "Grade A+",
    verificationHash: "0x9E11...55CF",
    skills: ["Milvus", "BM25 Hybrid", "Cross-Encoder Reranking", "Context Compression"],
    projectTitle: "Multi-Modal Hybrid RAG Pipeline with Milvus & Cross-Encoder",
    accentColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.45)",
    iconType: "rag",
  },
  {
    id: "badge-ai-safety",
    title: "AI Safety & Guardrails",
    category: "safety",
    desc: "Implemented defense-in-depth against prompt injections & data exfiltration",
    issued: "Oct 2026",
    status: "Verified",
    grade: "Grade A",
    verificationHash: "0x4C77...118D",
    skills: ["Llama Guard", "Prompt Injection Defense", "Canary Tokens", "PII Redaction"],
    projectTitle: "Enterprise Adversarial Red-Teaming & Semantic Firewalls",
    accentColor: "#EF4444",
    glowColor: "rgba(239, 68, 68, 0.45)",
    iconType: "safety",
  },
];

export const INITIAL_PROJECTS: LearnerProject[] = [
  {
    id: "proj-1",
    courseId: "course-01",
    courseTitle: "Introduction to AI",
    title: "Personal AI Study Buddy",
    track: "AI Foundations",
    level: "Beginner",
    estimatedHours: 4,
    description:
      "Build a small chat assistant that explains course concepts in plain language, using a clear system prompt and a handful of example questions.",
    tags: ["Prompt Engineering", "LLM APIs", "Python"],
    status: "completed",
    progress: 100,
    rubric: [
      "Answers five course questions in plain language",
      "System prompt sets tone, scope, and refusal rules",
      "Handles empty and off-topic input gracefully",
    ],
    submission: {
      repoUrl: "https://github.com/hammet-learners/ai-study-buddy",
      demoUrl: "https://ai-study-buddy.hammet.dev",
      notes: "Tested with five course questions and refined the system prompt for clarity.",
      submittedAt: "Oct 10, 2026",
      grade: "Grade A",
    },
  },
  {
    id: "proj-2",
    courseId: "course-01",
    courseTitle: "Introduction to AI",
    title: "Compare Two AI Models on One Task",
    track: "AI Foundations",
    level: "Beginner",
    estimatedHours: 3,
    description:
      "Send the same five prompts to two different models and write a short comparison of accuracy, tone, and response time.",
    tags: ["Model Evaluation", "Prompt Design", "Markdown"],
    status: "in-progress",
    progress: 50,
    rubric: [
      "Five identical prompts sent to both models",
      "Responses recorded in a comparison table",
      "Conclusion explains which model won and why",
    ],
  },
  {
    id: "proj-3",
    courseId: "course-02",
    courseTitle: "Generative AI Fundamentals",
    title: "Design a Prompt Library for Everyday Work",
    track: "Generative AI",
    level: "Beginner",
    estimatedHours: 4,
    description:
      "Collect reusable prompts for writing, summarising, and planning, each with a clear goal and an example output.",
    tags: ["Prompt Engineering", "Documentation", "Templates"],
    status: "not-started",
    progress: 0,
    rubric: [
      "At least six prompts across three use cases",
      "Each prompt includes a goal, input, and example output",
      "Every prompt tested and refined once",
    ],
  },
  {
    id: "proj-4",
    courseId: "course-02",
    courseTitle: "Generative AI Fundamentals",
    title: "Build a One-Page Document Summariser",
    track: "Generative AI",
    level: "Intermediate",
    estimatedHours: 6,
    description:
      "Turn a long article or PDF into a one-page summary with key points and action items using an LLM API.",
    tags: ["LLM APIs", "Summarisation", "Python"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Handles documents up to ten pages",
      "Summary lists five key points and three action items",
      "Empty or unreadable input shows a helpful error",
    ],
  },
  {
    id: "proj-5",
    courseId: "course-03",
    courseTitle: "AI Tools for Everyday Work",
    title: "Automate a Weekly Status Report",
    track: "AI at Work",
    level: "Beginner",
    estimatedHours: 3,
    description:
      "Use an AI tool to turn a week of notes into a clear status update with progress, blockers, and next steps.",
    tags: ["AI Productivity", "Templates", "Google Docs"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Template covers progress, blockers, and next steps",
      "Report generated from real notes in under ten minutes",
      "Output reviewed and edited by hand",
    ],
  },
  {
    id: "proj-6",
    courseId: "course-04",
    courseTitle: "Building with AI & Agents",
    title: "Ship a Small AI-Powered Web App",
    track: "AI Applications",
    level: "Intermediate",
    estimatedHours: 8,
    description:
      "Connect a simple web form to an LLM API and deploy it, with loading, error, and empty states handled.",
    tags: ["Next.js", "API Routes", "Vercel"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Form sends a prompt and displays the response",
      "Loading and error states are visible",
      "App is deployed and shareable by URL",
    ],
  },
];

export const useLearnerStore = create<LearnerState>()(
  persist(
    (set, get) => ({
      activeUserId: "user_learner",
      projects: INITIAL_PROJECTS,
      badges: INITIAL_BADGES,
      activeCelebrationBadge: null,
      moduleTestResults: {
        m1: {
          moduleId: "m1",
          passed: true,
          score: 4,
          totalQuestions: 4,
          completedAt: "Oct 12, 2026",
        },
      },
      schoolCompleted: false,
      isPro: false,
      proPassportTheme: "gold",
      portfolioTemplate: "bento",
      portfolioBio:
        "Applied AI Engineer specializing in multi-agent orchestration with LangGraph, parameter-efficient LoRA fine-tuning, and high-recall hybrid RAG architectures. Building verifiable, production-grade intelligence.",

      syncAccountState: (userId?: string) => {
        if (!userId) return;
        const currentActive = get().activeUserId;
        if (currentActive === userId) return;

        // When a real account (NOT 'user_learner') logs in
        if (userId !== "user_learner") {
          const userKey = `hammet-learner-real-${userId}`;
          const savedData = typeof window !== "undefined" ? localStorage.getItem(userKey) : null;
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              set({ ...parsed, activeUserId: userId });
              return;
            } catch {}
          }

          // Fresh real account starts completely clean!
          set({
            activeUserId: userId,
            badges: [],
            projects: INITIAL_PROJECTS.map((p) => ({
              ...p,
              status: "not-started",
              progress: 0,
              submission: undefined,
              earnedBadgeId: undefined,
            })),
            moduleTestResults: {},
            schoolCompleted: false,
            isPro: false,
            portfolioBio: "Learner at Hammet AI Academy.",
          });
        } else {
          // 'user_learner' is the dedicated test account with rich demo sandbox data
          set({
            activeUserId: "user_learner",
            badges: INITIAL_BADGES,
            projects: INITIAL_PROJECTS,
            schoolCompleted: false,
            moduleTestResults: {
              m1: {
                moduleId: "m1",
                passed: true,
                score: 4,
                totalQuestions: 4,
                completedAt: "Oct 12, 2026",
              },
            },
          });
        }
      },

      startProject: (projectId: string) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId && p.status === "not-started"
              ? { ...p, status: "in-progress", progress: 15 }
              : p
          ),
        }));
      },

      updateProjectProgress: (projectId: string, progress: number) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, progress } : p
          ),
        }));
      },

      submitProject: (projectId: string, submission) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return null;

        const newBadge: SkillBadge = {
          id: `badge-${Date.now()}`,
          title: project.title.split("with")[0].trim().slice(0, 24) || "Production AI Engineer",
          category: project.track.toLowerCase().includes("agent")
            ? "agents"
            : project.track.toLowerCase().includes("rag")
            ? "rag"
            : project.track.toLowerCase().includes("fine")
            ? "neural"
            : "fullstack",
          desc: project.description.slice(0, 85) + "...",
          issued: "Oct 2026",
          status: "Verified",
          grade: "Grade A+",
          verificationHash: `0x${Math.random().toString(16).slice(2, 6).toUpperCase()}...${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
          skills: project.tags,
          projectTitle: project.title,
          accentColor: "#10B981",
          glowColor: "rgba(16, 185, 129, 0.45)",
          iconType: "code",
        };

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  status: "completed",
                  progress: 100,
                  submission: {
                    ...submission,
                    submittedAt: "Oct 2026",
                    grade: "Grade A+",
                  },
                  earnedBadgeId: newBadge.id,
                }
              : p
          ),
          badges: [newBadge, ...state.badges],
          activeCelebrationBadge: newBadge,
        }));

        return newBadge;
      },

      triggerCelebration: (badge: SkillBadge) => {
        set({ activeCelebrationBadge: badge });
      },

      closeCelebration: () => {
        set({ activeCelebrationBadge: null });
      },

      completeModuleTest: (moduleId: string, score: number, totalQuestions: number) => {
        const passed = score / totalQuestions >= 0.75;
        set((state) => ({
          moduleTestResults: {
            ...state.moduleTestResults,
            [moduleId]: {
              moduleId,
              passed,
              score,
              totalQuestions,
              completedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            },
          },
        }));
      },

      toggleSchoolCompleted: () => {
        set((state) => ({ schoolCompleted: !state.schoolCompleted }));
      },

      togglePro: () => {
        set((state) => ({ isPro: !state.isPro }));
      },

      setProPassportTheme: (theme) => {
        set({ proPassportTheme: theme });
      },

      setPortfolioTemplate: (template) => {
        set({ portfolioTemplate: template });
      },

      setPortfolioBio: (bio) => {
        set({ portfolioBio: bio });
      },
    }),
    {
      name: "hammet-learner-master-store",
    }
  )
);
