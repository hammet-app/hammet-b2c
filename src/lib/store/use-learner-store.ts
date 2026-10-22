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
    courseTitle: "Introduction to AI & Neural Models",
    title: "Interactive LLM Capability Diagnostic Matrix",
    track: "Neural Foundations",
    level: "Beginner",
    estimatedHours: 6,
    description:
      "Build an interactive visual evaluation matrix comparing proprietary and open-source models across mathematical reasoning, coding, and context limits.",
    tags: ["Streamlit", "OpenAI API", "HuggingFace", "Python"],
    status: "completed",
    progress: 100,
    rubric: [
      "Benchmarked at least 4 foundation models on GSM8K and HumanEval",
      "Interactive slider for latency, token pricing, and context trade-offs",
      "Clear Markdown diagnostic summary generated automatically",
    ],
    submission: {
      repoUrl: "https://github.com/alexchen/llm-diagnostic-matrix",
      demoUrl: "https://llm-matrix.hammet.dev",
      notes: "Implemented dynamic benchmarking using HuggingFace evaluate pipeline.",
      submittedAt: "Oct 10, 2026",
      grade: "Grade A+",
    },
    earnedBadgeId: "badge-neural-architect",
  },
  {
    id: "proj-1b",
    courseId: "course-01",
    courseTitle: "Introduction to AI & Neural Models",
    title: "Vector Latent Space Visualizer & Semantic Clustering Engine",
    track: "Neural Foundations",
    level: "Beginner",
    estimatedHours: 8,
    description:
      "Map text embeddings into 3D dimensionality-reduced space using UMAP and t-SNE with interactive cluster inspection.",
    tags: ["PyTorch", "UMAP", "Three.js", "FastAPI"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Embed at least 2,000 custom sentences using sentence-transformers",
      "Interactive 3D cluster rotation with hover token metadata",
      "Cosine distance nearest-neighbor query under 5ms",
    ],
  },
  {
    id: "proj-1c",
    courseId: "course-01",
    courseTitle: "Introduction to AI & Neural Models",
    title: "Multi-Class Token Classifier with Custom Contrastive Loss",
    track: "Neural Foundations",
    level: "Intermediate",
    estimatedHours: 10,
    description:
      "Train a lightweight feedforward neural probe on frozen transformer representations with supervised InfoNCE contrastive loss.",
    tags: ["PyTorch", "Contrastive Learning", "CUDA", "NumPy"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Custom InfoNCE loss implementation with temperature hyperparameter",
      "Validation accuracy exceeding 91% on GLUE benchmark split",
      "Zero gradient leakage to upstream frozen transformer backbone",
    ],
  },
  {
    id: "proj-1d",
    courseId: "course-01",
    courseTitle: "Introduction to AI & Neural Models",
    title: "Real-Time Token Perplexity & Anomaly Scanner",
    track: "Neural Foundations",
    level: "Intermediate",
    estimatedHours: 8,
    description:
      "Build a real-time proxy that calculates token cross-entropy loss on incoming streams and detects AI-generated vs human-written text.",
    tags: ["Tokenizer", "Perplexity", "FastAPI", "Python"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Calculate sliding-window perplexity without memory leaks",
      "Classification ROC-AUC score above 0.88",
      "Benchmark throughput of 200+ requests per second",
    ],
  },
  {
    id: "proj-1e",
    courseId: "course-01",
    courseTitle: "Introduction to AI & Neural Models",
    title: "Foundational Byte-Pair Encoding (BPE) Tokenizer from Scratch",
    track: "Neural Foundations",
    level: "Beginner",
    estimatedHours: 7,
    description:
      "Implement a full Byte-Pair Encoding tokenization algorithm from raw unicode strings, including vocabulary merge tables and special token masks.",
    tags: ["Algorithms", "NLP", "BPE", "Python"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Vocabulary training over 5MB corpus producing 32k tokens",
      "Encode and decode invertibility guarantee (x == decode(encode(x)))",
      "Special token preservation (<|im_start|>, <|im_end|>)",
    ],
  },
  {
    id: "proj-2",
    courseId: "course-02",
    courseTitle: "Generative AI Fundamentals",
    title: "Live Hallucination Detector & Context Guardrail",
    track: "Transformer Latent Space",
    level: "Intermediate",
    estimatedHours: 10,
    description:
      "Train a token probability classifier that audits generated LLM responses in real-time and flags hallucinated facts before returning to the user.",
    tags: ["Token Probabilities", "FastAPI", "DSPy", "Llama 3"],
    status: "in-progress",
    progress: 65,
    rubric: [
      "Perplexity threshold detector for ungrounded entity claims",
      "Streaming token analysis with < 25ms interception latency",
      "Automated fallback to verified retrieval when hallucination score > 0.4",
    ],
  },
  {
    id: "proj-8",
    courseId: "course-02",
    courseTitle: "Generative AI Fundamentals",
    title: "Domain-Adapted Llama 3 8B Fine-Tuning with Unsloth & LoRA",
    track: "Neural Fine-Tuning",
    level: "Advanced",
    estimatedHours: 16,
    description:
      "Curate instruction datasets, calculate token perplexity, and train rank-16 parameter-efficient adapters on local GPUs with 4-bit quantization.",
    tags: ["PyTorch", "HuggingFace", "Weights & Biases", "CUDA", "Unsloth"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Loss convergence verified below 0.85 without catastrophic forgetting",
      "Adapter exported to GGUF format for Ollama runtime",
      "Benchmark evaluated on custom held-out test split",
    ],
  },
  {
    id: "proj-2c",
    courseId: "course-02",
    courseTitle: "Generative AI Fundamentals",
    title: "Multi-Head Attention Math & KV-Cache Latency Optimizer",
    track: "Transformer Latent Space",
    level: "Advanced",
    estimatedHours: 12,
    description:
      "Implement multi-head scaled dot-product attention from scratch with FlashAttention-inspired tiling and persistent key-value caching.",
    tags: ["PyTorch", "FlashAttention", "KV-Cache", "GPU Tiling"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Exact mathematical numerical equivalence to PyTorch SDPA",
      "KV-cache speedup of > 3.2x on generation sequences > 1k tokens",
      "Peak VRAM reduction through chunked block computation",
    ],
  },
  {
    id: "proj-2d",
    courseId: "course-02",
    courseTitle: "Generative AI Fundamentals",
    title: "Direct Preference Optimization (DPO) Alignment Pipeline",
    track: "Neural Fine-Tuning",
    level: "Advanced",
    estimatedHours: 14,
    description:
      "Align an instruction-tuned model using pairwise human preference datasets with Direct Preference Optimization (DPO) without reinforcement learning complexity.",
    tags: ["DPO", "TRL", "Alignment", "PyTorch"],
    status: "not-started",
    progress: 0,
    rubric: [
      "DPO loss function implemented with reference model KL penalty",
      "Win rate increase on Anthropic HH-RLHF benchmark > 22%",
      "Safeguard against reward hacking on repetitive responses",
    ],
  },
  {
    id: "proj-2e",
    courseId: "course-02",
    courseTitle: "Generative AI Fundamentals",
    title: "Specular Speculative Decoding Inference Engine",
    track: "Transformer Latent Space",
    level: "Advanced",
    estimatedHours: 15,
    description:
      "Pair a 1B draft model with an 8B target model to achieve 2.4x generation speedup using verification acceptance masks.",
    tags: ["Speculative Decoding", "Inference Optimization", "vLLM", "C++"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Speculative draft acceptance rate > 70% on standard code generation",
      "Identical output token distribution verified against target model",
      "Wall-clock speedup verified on batch size 1",
    ],
  },
  {
    id: "proj-3",
    courseId: "course-03",
    courseTitle: "AI Tools for Everyday Work",
    title: "Personal Autonomous Task Orchestrator with MCP Protocol",
    track: "Agent Workflows",
    level: "Intermediate",
    estimatedHours: 8,
    description:
      "Implement a persistent Model Context Protocol (MCP) server that connects Cursor/Claude to local sqlite databases and git repositories.",
    tags: ["MCP Protocol", "Cursor AI", "SQLite", "Node.js/TypeScript"],
    status: "in-progress",
    progress: 40,
    rubric: [
      "Configured 3 custom MCP tools (Database Query, File Staging, Test Runner)",
      "Role-based permission gating for file system modifications",
      "Comprehensive error diagnostics returned over JSON-RPC 2.0",
    ],
  },
  {
    id: "proj-3b",
    courseId: "course-03",
    courseTitle: "AI Tools for Everyday Work",
    title: "GraphRAG Knowledge Graph Extractor with Neo4j & Cypher",
    track: "Vector RAG",
    level: "Advanced",
    estimatedHours: 14,
    description:
      "Extract entity-relation triplets from complex unstructured PDFs and index them into Neo4j graph databases for multi-hop reasoning.",
    tags: ["GraphRAG", "Neo4j", "Cypher", "LangChain"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Extract entities and relationship edges with schema validation",
      "Execute multi-hop Cypher queries answering relational questions",
      "Combined vector similarity + graph traverse hybrid ranking",
    ],
  },
  {
    id: "proj-3c",
    courseId: "course-03",
    courseTitle: "AI Tools for Everyday Work",
    title: "Enterprise Semantic Firewall & Prompt Injection Shield",
    track: "Agent Workflows",
    level: "Intermediate",
    estimatedHours: 10,
    description:
      "Deploy an API proxy inspecting user prompts and external tool inputs with semantic classification, regex canary tokens, and PII anonymization.",
    tags: ["Security", "LlamaGuard", "FastAPI", "Regex"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Block 100% of standard jailbreaks (DAN, cipher encoding)",
      "Redact credit cards, social security numbers, and emails with zero data loss",
      "Latency impact under 18ms per prompt",
    ],
  },
  {
    id: "proj-3d",
    courseId: "course-03",
    courseTitle: "AI Tools for Everyday Work",
    title: "Local Offline AI Assistant with Ollama & Whisper Voice",
    track: "Agent Workflows",
    level: "Beginner",
    estimatedHours: 8,
    description:
      "Build a 100% offline, privacy-first desktop voice assistant running Whisper for speech-to-text and quantized Phi-3 for local reasoning.",
    tags: ["Whisper", "Ollama", "Python", "Local AI"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Zero network packets transmitted during entire session",
      "Voice response latency under 800ms on Apple Silicon / RTX GPUs",
      "Local audio device integration with push-to-talk hotkey",
    ],
  },
  {
    id: "proj-3e",
    courseId: "course-03",
    courseTitle: "AI Tools for Everyday Work",
    title: "Automated Synthetic Dataset Generator with DSPy Assertions",
    track: "Agent Workflows",
    level: "Intermediate",
    estimatedHours: 10,
    description:
      "Build a programmatic pipeline that generates, validates, and filters 10,000 instruction-answer pairs with mathematical consistency checks.",
    tags: ["DSPy", "Synthetic Data", "Pydantic", "Python"],
    status: "not-started",
    progress: 0,
    rubric: [
      "DSPy assertions pruning low-quality or hallucinated answers",
      "Automatic generation of negative hard samples",
      "Export to HuggingFace datasets format with metadata",
    ],
  },
  {
    id: "proj-4",
    courseId: "course-04",
    courseTitle: "Building with AI & Agents",
    title: "Autonomous Support Swarm with Tool Calling & Human-in-the-Loop",
    track: "Stateful Systems",
    level: "Production",
    estimatedHours: 16,
    description:
      "Design and deploy an asynchronous multi-agent support orchestrator with LangGraph, SQLite checkpointing, and tool execution guardrails.",
    tags: ["LangGraph", "FastAPI", "OpenAI Tools", "Docker", "PostgreSQL"],
    status: "completed",
    progress: 100,
    rubric: [
      "Deterministic state recovery across process crashes via SQLite saver",
      "Strict Pydantic schema validation on external tool arguments",
      "Average execution latency under 1.4 seconds with async dispatch",
    ],
    submission: {
      repoUrl: "https://github.com/alexchen/langgraph-support-swarm",
      demoUrl: "https://support-swarm.hammet.dev",
      notes: "Integrated SQLiteSaver checkpointing and human escalation webhook.",
      submittedAt: "Oct 12, 2026",
      grade: "Grade A",
    },
    earnedBadgeId: "badge-agentic-swarm",
  },
  {
    id: "proj-5",
    courseId: "course-04",
    courseTitle: "Building with AI & Agents",
    title: "Multi-Modal Hybrid RAG Pipeline with Milvus & Cross-Encoder",
    track: "Stateful Systems",
    level: "Advanced",
    estimatedHours: 14,
    description:
      "Build a high-recall information retrieval system combining BM25 lexical search with dense vector embeddings and cross-encoder re-scoring.",
    tags: ["Milvus", "SentenceTransformers", "Claude 3.5", "Python", "Reranker"],
    status: "completed",
    progress: 100,
    rubric: [
      "Contextual chunking preserving table structure and equations",
      "Sub-50ms vector query execution at 100k embedding scale",
      "Automated evaluation with Ragas metrics (faithfulness > 0.92)",
    ],
    submission: {
      repoUrl: "https://github.com/alexchen/hybrid-milvus-rag",
      demoUrl: "https://hybrid-rag.hammet.dev",
      notes: "Deployed BGE-Reranker-Large with Milvus HNSW indexing.",
      submittedAt: "Oct 13, 2026",
      grade: "Grade A+",
    },
    earnedBadgeId: "badge-hybrid-rag",
  },
  {
    id: "proj-6",
    courseId: "course-04",
    courseTitle: "Building with AI & Agents",
    title: "Self-Correcting Code Generation Agent with Docker Sandbox",
    track: "Stateful Systems",
    level: "Production",
    estimatedHours: 18,
    description:
      "Build an autonomous coding agent that writes unit tests, writes implementation code, runs code in isolated ephemeral Docker containers, inspects stack traces, and iterates until all tests pass.",
    tags: ["Docker", "LangGraph", "Python AST", "vLLM", "Sandbox"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Isolated container sandboxing preventing host breakout",
      "Automated syntax validation via AST before execution",
      "Maximum of 4 self-correcting loops with state rollback",
    ],
  },
  {
    id: "proj-7",
    courseId: "course-04",
    courseTitle: "Building with AI & Agents",
    title: "Enterprise Multi-Agent Financial Research Swarm",
    track: "Stateful Systems",
    level: "Production",
    estimatedHours: 20,
    description:
      "Orchestrate a team of 4 specialized autonomous agents (SEC Filing Extractor, Sentiment Analyzer, Earnings Model Auditor, Report Synthesizer) compiling live Wall Street research briefs.",
    tags: ["SEC EDGAR API", "LangGraph Swarms", "FastAPI", "Markdown Generator"],
    status: "not-started",
    progress: 0,
    rubric: [
      "Parallel tool execution with asyncio gathering",
      "Automated citation footnotes linked to original 10-K filings",
      "Output formatted in publication-ready executive PDF briefs",
    ],
  },
  {
    id: "proj-4e",
    courseId: "course-04",
    courseTitle: "Building with AI & Agents",
    title: "Deterministic Hierarchical Plan-and-Solve Agent Orchestrator",
    track: "Stateful Systems",
    level: "Production",
    estimatedHours: 15,
    description:
      "Design a meta-planner agent that decomposes ambiguous user goals into directed acyclic dependency graphs (DAG) executed by specialized subagents with rollback capability.",
    tags: ["DAG Planner", "Subagent Routing", "LangGraph", "Redis"],
    status: "not-started",
    progress: 0,
    rubric: [
      "DAG topological sort execution preventing circular dependencies",
      "Subagent error retry with reflection feedback loop",
      "State checkpoints stored in Redis with 100% recovery rate",
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
