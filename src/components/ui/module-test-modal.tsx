"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  ArrowRight,
  RotateCcw,
  X,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useLearnerStore, ModuleTestQuestion } from "@/lib/store/use-learner-store";

// Programmed question banks mapped by moduleId or course track
export const MODULE_QUESTIONS_BANK: Record<string, ModuleTestQuestion[]> = {
  m1: [
    {
      id: "m1-q1",
      question: "What is the primary role of neural weights in a foundation model?",
      options: [
        "They store hardcoded factual databases like an SQL table.",
        "They represent continuous numerical parameters adjusted during gradient descent to minimize loss.",
        "They act as physical CPU clock speeds for token streaming.",
        "They encrypt the model's training data to preserve privacy.",
      ],
      correctIndex: 1,
      explanation:
        "Neural weights are continuous parameters learned through backpropagation that govern how token representations interact across transformer layers.",
    },
    {
      id: "m1-q2",
      question: "How does setting sampling temperature to 0.0 affect model output?",
      options: [
        "It forces the model to choose random tokens.",
        "It makes inference deterministic by greedily selecting the token with highest log probability.",
        "It increases the context window size dynamically.",
        "It bypasses the tokenizer to speed up generation.",
      ],
      correctIndex: 1,
      explanation:
        "Temperature = 0.0 eliminates random sampling and performs argmax greedy decoding, always returning the highest probability token.",
    },
    {
      id: "m1-q3",
      question: "Why are high-dimensional vector embeddings superior to lexical keyword search?",
      options: [
        "Embeddings require zero GPU memory to compute.",
        "Embeddings capture geometric semantic meaning and synonym relationships beyond exact word matches.",
        "Embeddings only work on numbers rather than text.",
        "Embeddings permanently prevent token hallucination.",
      ],
      correctIndex: 1,
      explanation:
        "Vector embeddings project text into dense semantic spaces where conceptual similarity correlates with cosine distance.",
    },
    {
      id: "m1-q4",
      question: "Where does factual hallucination primarily originate in an autoregressive model?",
      options: [
        "From overheating server cooling systems.",
        "From probabilistic token continuation in under-represented regions of latent space without external grounding.",
        "From syntax compiler errors during tokenization.",
        "From using HTTP instead of WebSocket protocols.",
      ],
      correctIndex: 1,
      explanation:
        "Autoregressive LLMs predict the most plausible next token based on statistical patterns; when lacking grounded context, plausible-sounding false claims emerge.",
    },
  ],
  m2: [
    {
      id: "m2-q1",
      question: "What is the core breakthrough of the Multi-Head Self-Attention mechanism?",
      options: [
        "It calculates dependencies between every pair of tokens in a sequence regardless of distance.",
        "It replaces neural networks with binary decision trees.",
        "It downloads external web pages during training.",
        "It compresses video files into plain text.",
      ],
      correctIndex: 0,
      explanation:
        "Self-attention computes Query-Key dot products across all tokens in parallel, dynamically weighting relevant context across the sequence.",
    },
    {
      id: "m2-q2",
      question: "In LoRA (Low-Rank Adaptation), how are trainable parameters minimized?",
      options: [
        "By deleting half the layers of the base model.",
        "By decomposing weight update matrices into two low-rank matrices (A and B) where rank r << d.",
        "By converting floating-point weights into strings.",
        "By training only the first word of every sentence.",
      ],
      correctIndex: 1,
      explanation:
        "LoRA freezes pretrained weights and injects low-rank decomposition matrices into attention projections, reducing trainable parameters by > 99%.",
    },
    {
      id: "m2-q3",
      question: "What is the memory advantage of 4-bit NormalFloat (NF4) quantization?",
      options: [
        "It eliminates the need for any GPU RAM entirely.",
        "It reduces model VRAM footprint by up to 75% while maintaining near 16-bit perplexity.",
        "It speeds up internet connection bandwidth.",
        "It converts text into audio format automatically.",
      ],
      correctIndex: 1,
      explanation:
        "NF4 quantization maps weights to 16 discrete levels optimized for normal distributions, fitting 8B parameter models into under 6GB VRAM.",
    },
    {
      id: "m2-q4",
      question: "How do context guardrails mitigate prompt injection attacks?",
      options: [
        "By shutting down the user's computer.",
        "By validating incoming user tokens against semantic boundaries and separating system instructions from untrusted data.",
        "By charging users a fee per character.",
        "By only allowing 1-word responses.",
      ],
      correctIndex: 1,
      explanation:
        "Guardrails audit input/output semantics and enforce structural privilege separation between developer system prompts and user payloads.",
    },
  ],
  m3: [
    {
      id: "m3-q1",
      question: "What is the core purpose of the Model Context Protocol (MCP)?",
      options: [
        "A universal open protocol standardizing how AI models securely access external tools, prompts, and resources.",
        "A proprietary programming language made by Microsoft.",
        "A method to overclock consumer graphics cards.",
        "A web design layout framework.",
      ],
      correctIndex: 0,
      explanation:
        "MCP provides standardized JSON-RPC client-server primitives for discovery, execution, and permission gating of tools and resources.",
    },
    {
      id: "m3-q2",
      question: "Why is state checkpointing critical in production autonomous agent swarms?",
      options: [
        "It guarantees state recovery after process crashes and enables human-in-the-loop time-travel debugging.",
        "It makes agents run without any electricity.",
        "It translates Python code into JavaScript.",
        "It forces the agent to agree with all user commands.",
      ],
      correctIndex: 0,
      explanation:
        "Checkpointing persists agent state graphs across iterations, allowing seamless resumption, retry loops, and safety approval pauses.",
    },
    {
      id: "m3-q3",
      question: "How does BM25 hybrid search complement dense vector retrieval?",
      options: [
        "BM25 captures exact keyword/serial/ID matches while dense embeddings capture semantic conceptual intent.",
        "BM25 generates synthetic 3D graphics.",
        "BM25 converts documents into speech.",
        "BM25 only searches Wikipedia.",
      ],
      correctIndex: 0,
      explanation:
        "Combining BM25 lexical sparse search with dense embeddings delivers superior recall across technical jargon, exact SKU codes, and semantic nuance.",
    },
    {
      id: "m3-q4",
      question: "What is the primary role of a cross-encoder reranker in RAG pipelines?",
      options: [
        "It re-scores retrieved document chunks with joint attention between query and passage for maximum precision.",
        "It deletes duplicate files on the operating system.",
        "It translates text into French.",
        "It compresses PDF files into ZIP archives.",
      ],
      correctIndex: 0,
      explanation:
        "A cross-encoder evaluates the query and passage together through all transformer layers, producing a highly calibrated relevance score.",
    },
  ],
  m4: [
    {
      id: "m4-q1",
      question: "In LangGraph, how are cyclical multi-agent workflows modeled?",
      options: [
        "As a linear waterfall script that crashes on loops.",
        "As a state graph with nodes (agent functions) and conditional edges routing execution based on state.",
        "As an HTML table rendered in the browser.",
        "As an Excel macro spreadsheet.",
      ],
      correctIndex: 1,
      explanation:
        "LangGraph formalizes multi-agent coordination as cyclic state machines with explicit state schemas and conditional edge transitions.",
    },
    {
      id: "m4-q2",
      question: "Why should external tool arguments always be validated with Pydantic schemas?",
      options: [
        "To enforce strict type safety and reject malformed hallucinated arguments before executing dangerous code.",
        "To make Python code run in C++ mode.",
        "To encrypt database passwords in plain text.",
        "To speed up CSS styling.",
      ],
      correctIndex: 0,
      explanation:
        "Pydantic schema validation ensures the LLM's generated JSON matches exact parameter types, preventing invalid API calls and security flaws.",
    },
    {
      id: "m4-q3",
      question: "What prevents an autonomous self-correcting coding agent from looping indefinitely?",
      options: [
        "An explicit max_iterations limit and deterministic state rollback guardrails.",
        "Turning off the internet connection.",
        "Restricting the agent to 1 line of code.",
        "Using only open-source software.",
      ],
      correctIndex: 0,
      explanation:
        "Production agent loops must define recursion limits, terminal exit conditions, and fallback strategies when convergence fails.",
    },
    {
      id: "m4-q4",
      question: "What does the Ragas 'Faithfulness' metric evaluate in a production RAG system?",
      options: [
        "Whether all statements in the generated answer are grounded exclusively in the retrieved context passages.",
        "How fast the server responded in milliseconds.",
        "Whether the user clicked the like button.",
        "How many words were in the original question.",
      ],
      correctIndex: 0,
      explanation:
        "Faithfulness measures factual grounding by calculating the ratio of claims in the generated response that can be directly verified by the context.",
    },
  ],
};

interface ModuleTestModalProps {
  moduleId: string;
  moduleNumber: string;
  moduleTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onTestPassed?: () => void;
}

export function ModuleTestModal({
  moduleId,
  moduleNumber,
  moduleTitle,
  isOpen,
  onClose,
  onTestPassed,
}: ModuleTestModalProps) {
  const completeModuleTest = useLearnerStore((state) => state.completeModuleTest);
  const existingResult = useLearnerStore(
    (state) => state.moduleTestResults[moduleId]
  );

  const questions =
    MODULE_QUESTIONS_BANK[moduleId] ?? MODULE_QUESTIONS_BANK.m1;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIdx];
  const selectedOption = selectedAnswers[currentQuestionIdx];
  const isAnswered = selectedOption !== undefined;

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: index }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Calculate final score
      let score = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          score += 1;
        }
      });
      completeModuleTest(moduleId, score, questions.length);
      setTestFinished(true);
      if (score / questions.length >= 0.75 && onTestPassed) {
        onTestPassed();
      }
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTestFinished(false);
  };

  // Score calculation for finished state
  let finalScore = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      finalScore += 1;
    }
  });
  const passed = finalScore / questions.length >= 0.75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white p-6 sm:p-8 shadow-2xl dark:bg-[#0E091E] text-slate-900 dark:text-white z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {!testFinished ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-300">
              <HelpCircle className="h-4 w-4" />
              <span>MODULE {moduleNumber} KNOWLEDGE BENCHMARK</span>
            </div>

            <h3 className="mt-1 font-poppins text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {moduleTitle}
            </h3>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                <span>
                  Question {currentQuestionIdx + 1} of {questions.length}
                </span>
                <span>
                  Pass threshold: 75% ({Math.ceil(questions.length * 0.75)}/{questions.length})
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="mt-6">
              <p className="font-poppins text-base font-bold leading-snug text-slate-900 dark:text-white">
                {currentQ.question}
              </p>

              {/* Options */}
              <div className="mt-4 space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let optionClass =
                    "border-black/[0.08] dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] hover:border-purple-300 dark:hover:border-cyan-400/40 text-slate-700 dark:text-slate-200";

                  if (showExplanation) {
                    if (isCorrect) {
                      optionClass =
                        "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                    } else if (isSelected && !isCorrect) {
                      optionClass =
                        "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300";
                    } else {
                      optionClass = "opacity-50 border-transparent bg-transparent";
                    }
                  } else if (isSelected) {
                    optionClass =
                      "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-cyan-300 font-semibold";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={cn(
                        "w-full text-left rounded-2xl border p-3.5 sm:p-4 text-xs sm:text-sm transition-all duration-200 flex items-start gap-3",
                        optionClass
                      )}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 font-mono text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {showExplanation && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {showExplanation && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Rationale Explanation Drawer */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-purple-50/70 dark:bg-purple-950/20 p-4 text-xs leading-relaxed"
                  >
                    <span className="font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-cyan-300 block mb-1">
                      Technical Rationale:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">
                      {currentQ.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Question / Finish Button */}
              {showExplanation && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 font-poppins text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition"
                  >
                    <span>
                      {currentQuestionIdx < questions.length - 1
                        ? "Next Question"
                        : "Complete Benchmark"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Test Results Screen */
          <div className="text-center py-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-100 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-500/30 text-purple-600 dark:text-cyan-400">
              {passed ? (
                <Award className="h-10 w-10 text-emerald-500" />
              ) : (
                <HelpCircle className="h-10 w-10 text-amber-500" />
              )}
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border">
              {passed ? (
                <span className="text-emerald-500 border-emerald-400/40 bg-emerald-500/10">
                  BENCHMARK PASSED // GRADE A+
                </span>
              ) : (
                <span className="text-amber-500 border-amber-400/40 bg-amber-500/10">
                  SCORE UNDER THRESHOLD // RETAKE RECOMMENDED
                </span>
              )}
            </div>

            <h3 className="mt-3 font-poppins text-2xl font-black text-slate-900 dark:text-white">
              {passed ? "Module Knowledge Verified!" : "Review Module & Try Again"}
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              You scored{" "}
              <strong className="text-slate-900 dark:text-white font-extrabold">
                {finalScore} out of {questions.length} correct (
                {Math.round((finalScore / questions.length) * 100)}%)
              </strong>
              .{" "}
              {passed
                ? "This module has been stamped as verified on your AI Skill Passport."
                : "You need at least 75% to achieve the accredited module completion badge."}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRetake}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 dark:border-white/15 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Benchmark</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition"
              >
                <span>Done &amp; Continue Course</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

