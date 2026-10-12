"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface SketchProps {
  className?: string;
}

/**
 * 2D Sketch #1: Autonomous RAG with Contextual Retrieval
 * Cute 2D doodle sketch of a student & AI companion indexing books and floating knowledge scrolls.
 */
export function RagKnowledgeSketch({ className }: SketchProps) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg viewBox="0 0 260 110" className="w-full h-full max-h-24" fill="none">
        {/* Desk / Base line */}
        <path d="M20 95 H240" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="4 4" />

        {/* Stack of books on the left */}
        <path d="M35 95 H75 V85 H35 Z" fill="white" stroke="#1E1929" strokeWidth="2" strokeLinejoin="round" />
        <path d="M32 85 H78 V74 H32 Z" fill="#FEF3C7" stroke="#1E1929" strokeWidth="2" strokeLinejoin="round" />
        <path d="M36 74 H74 V62 H36 Z" fill="white" stroke="#1E1929" strokeWidth="2" strokeLinejoin="round" />
        {/* Book spines */}
        <line x1="42" y1="67" x2="68" y2="67" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="40" y1="79" x2="70" y2="79" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

        {/* Student Doodle Character */}
        {/* Legs / Body sitting */}
        <path d="M100 95 C98 85 102 75 110 72" stroke="#1E1929" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M110 72 C115 65 125 65 130 72 L125 95" stroke="#1E1929" strokeWidth="2.5" strokeLinecap="round" fill="white" />
        {/* Head with hair bun */}
        <circle cx="118" cy="52" r="10" fill="white" stroke="#1E1929" strokeWidth="2.5" />
        <path d="M110 48 C113 42 124 42 127 48" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
        <circle cx="123" cy="38" r="4.5" fill="#1E1929" />
        {/* Doodle Face */}
        <circle cx="115" cy="52" r="1.2" fill="#1E1929" />
        <circle cx="121" cy="52" r="1.2" fill="#1E1929" />
        <path d="M117 56 Q118 58 120 56" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" />
        {/* Arms holding laptop / open document */}
        <path d="M112 75 Q125 80 135 73" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />

        {/* Floating Open Document / Knowledge Scroll */}
        <path d="M145 45 Q158 40 172 46 V72 Q158 66 145 72 Z" fill="white" stroke="#1E1929" strokeWidth="2" strokeLinejoin="round" />
        <path d="M172 46 Q186 40 200 46 V72 Q186 66 172 72 Z" fill="white" stroke="#1E1929" strokeWidth="2" strokeLinejoin="round" />
        <line x1="150" y1="52" x2="166" y2="52" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="150" y1="58" x2="164" y2="58" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="150" y1="64" x2="160" y2="64" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="178" y1="52" x2="194" y2="52" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="178" y1="58" x2="192" y2="58" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* Floating Neural Vector Retrieval Sparks */}
        <path d="M136 34 L138 28 L144 30 L138 32 Z" fill="#F59E0B" />
        <path d="M210 38 L212 32 L218 34 L212 36 Z" fill="#F59E0B" />
        <circle cx="198" cy="28" r="3" fill="#FDE68A" stroke="#1E1929" strokeWidth="1.5" />
        <path d="M172 32 C178 22 190 22 195 26" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />

        {/* Floating Badge */}
        <rect x="180" y="78" width="46" height="16" rx="8" fill="#FEF3C7" stroke="#1E1929" strokeWidth="1.5" />
        <text x="203" y="90" fontSize="8" fontWeight="bold" fill="#92400E" textAnchor="middle" fontFamily="monospace">RAG.index()</text>
      </svg>
    </div>
  );
}

/**
 * 2D Sketch #2: Sync Databases and Workflows into Milvus
 * 2D doodle sketch of a happy robot connecting relational databases to high-dimensional vector clusters.
 */
export function MilvusDatabaseSketch({ className }: SketchProps) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg viewBox="0 0 260 110" className="w-full h-full max-h-24" fill="none">
        {/* Base guideline */}
        <path d="M20 95 H240" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="4 4" />

        {/* Database Cylinder Stack on Left */}
        <g transform="translate(35, 38)">
          <ellipse cx="20" cy="10" rx="18" ry="6" fill="#FFE4E6" stroke="#1E1929" strokeWidth="2" />
          <path d="M2 10 V25 C2 28 10 31 20 31 C30 31 38 28 38 25 V10" fill="#FFE4E6" stroke="#1E1929" strokeWidth="2" />
          <path d="M2 25 V40 C2 43 10 46 20 46 C30 46 38 43 38 40 V25" fill="white" stroke="#1E1929" strokeWidth="2" />
          <path d="M2 40 V55 C2 58 10 61 20 61 C30 61 38 58 38 55 V40" fill="#FFE4E6" stroke="#1E1929" strokeWidth="2" />
          {/* DB Indicator dots */}
          <circle cx="10" cy="24" r="1.5" fill="#E11D48" />
          <circle cx="10" cy="39" r="1.5" fill="#E11D48" />
          <circle cx="10" cy="54" r="1.5" fill="#E11D48" />
        </g>

        {/* Connecting Data Pipeline Tube */}
        <path d="M75 66 C100 66 100 52 120 52" stroke="#E11D48" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
        <polygon points="122,50 126,52 122,54" fill="#E11D48" />

        {/* Robot Character in Center */}
        <g transform="translate(115, 32)">
          {/* Antenna */}
          <line x1="20" y1="8" x2="20" y2="15" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="6" r="3" fill="#FDA4AF" stroke="#1E1929" strokeWidth="1.5" />
          {/* Head */}
          <rect x="6" y="15" width="28" height="22" rx="6" fill="white" stroke="#1E1929" strokeWidth="2.5" />
          {/* Screen / Visor */}
          <rect x="10" y="19" width="20" height="12" rx="3" fill="#FFF1F2" stroke="#1E1929" strokeWidth="1.5" />
          {/* Eyes */}
          <circle cx="16" cy="25" r="1.5" fill="#E11D48" />
          <circle cx="24" cy="25" r="1.5" fill="#E11D48" />
          {/* Body */}
          <path d="M10 38 L30 38 L32 60 L8 60 Z" fill="#FFE4E6" stroke="#1E1929" strokeWidth="2.5" />
          {/* Chest meter */}
          <line x1="15" y1="48" x2="25" y2="48" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Multi-Dimensional Vector Mesh on Right */}
        <g transform="translate(175, 35)">
          <circle cx="20" cy="16" r="5" fill="#E11D48" stroke="#1E1929" strokeWidth="2" />
          <circle cx="50" cy="12" r="4" fill="#FDA4AF" stroke="#1E1929" strokeWidth="1.8" />
          <circle cx="35" cy="45" r="6" fill="white" stroke="#1E1929" strokeWidth="2" />
          <circle cx="10" cy="50" r="4" fill="#FFE4E6" stroke="#1E1929" strokeWidth="1.8" />
          <circle cx="55" cy="48" r="5" fill="#FDA4AF" stroke="#1E1929" strokeWidth="1.8" />

          {/* Vector connection lines */}
          <line x1="20" y1="16" x2="50" y2="12" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="16" x2="35" y2="45" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="35" y1="45" x2="10" y2="50" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="35" y1="45" x2="55" y2="48" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="12" x2="55" y2="48" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
        </g>

        {/* Vector coordinate label */}
        <text x="210" y="92" fontSize="8" fontWeight="bold" fill="#BE123C" textAnchor="middle" fontFamily="monospace">d=1536</text>
      </svg>
    </div>
  );
}

/**
 * 2D Sketch #3: Model Context Protocol (MCP) Tools & Connectors
 * 2D doodle sketch of a clever robot plugging in tools, sockets, and API gears.
 */
export function McpProtocolSketch({ className }: SketchProps) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg viewBox="0 0 260 110" className="w-full h-full max-h-24" fill="none">
        {/* Base line */}
        <path d="M20 95 H240" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="4 4" />

        {/* Terminal / Host box on Left */}
        <g transform="translate(30, 40)">
          <rect x="0" y="0" width="56" height="48" rx="8" fill="white" stroke="#1E1929" strokeWidth="2.5" />
          <rect x="0" y="0" width="56" height="14" rx="8" fill="#FCE7F3" stroke="#1E1929" strokeWidth="2" />
          <circle cx="8" cy="7" r="2" fill="#DB2777" />
          <circle cx="16" cy="7" r="2" fill="#F472B6" />
          {/* Terminal prompt */}
          <text x="8" y="28" fontSize="8" fontWeight="bold" fill="#1E1929" fontFamily="monospace">&gt; mcp</text>
          <text x="8" y="40" fontSize="7" fontWeight="bold" fill="#DB2777" fontFamily="monospace">LIVE_SSE</text>
        </g>

        {/* Cable & Plug in center */}
        <path d="M86 64 C105 64 105 55 120 55" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round" />
        {/* Plug socket */}
        <rect x="120" y="48" width="14" height="14" rx="3" fill="white" stroke="#1E1929" strokeWidth="2" />
        <line x1="124" y1="52" x2="124" y2="58" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
        <line x1="130" y1="52" x2="130" y2="58" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />

        {/* AI Doodle Bot with Tool Belt */}
        <g transform="translate(145, 30)">
          {/* Floating lightbulb idea */}
          <path d="M30 6 Q36 2 42 6 Q44 14 36 17 L36 20 L30 20 Z" fill="#FDF2F8" stroke="#1E1929" strokeWidth="1.8" />
          <line x1="33" y1="22" x2="39" y2="22" stroke="#DB2777" strokeWidth="1.5" />
          {/* Antenna */}
          <line x1="20" y1="12" x2="20" y2="18" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          {/* Head */}
          <rect x="6" y="18" width="28" height="24" rx="8" fill="white" stroke="#1E1929" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="15" cy="28" r="1.8" fill="#1E1929" />
          <circle cx="25" cy="28" r="1.8" fill="#1E1929" />
          {/* Smile */}
          <path d="M18 34 Q20 37 22 34" stroke="#1E1929" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body */}
          <rect x="8" y="43" width="24" height="20" rx="4" fill="#FCE7F3" stroke="#1E1929" strokeWidth="2.5" />
          {/* Tool in Hand: Wrench */}
          <path d="M4 52 L-4 56" stroke="#1E1929" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-8 54 Q-12 56 -8 62 L-4 59" stroke="#1E1929" strokeWidth="2" fill="#FDF2F8" />
        </g>

        {/* External Service Tools on Right */}
        <g transform="translate(198, 44)">
          {/* Gear tool */}
          <circle cx="18" cy="16" r="10" fill="white" stroke="#1E1929" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="18" cy="16" r="4" fill="#DB2777" />
          {/* Database & Browser Icons */}
          <rect x="10" y="34" width="26" height="14" rx="4" fill="#FDF2F8" stroke="#1E1929" strokeWidth="1.8" />
          <text x="23" y="44" fontSize="7" fontWeight="bold" fill="#9D174D" textAnchor="middle">TOOLS</text>
        </g>
      </svg>
    </div>
  );
}

/**
 * 2D Sketch #4: Frontier Research & Agentic Benchmarks
 * 2D doodle sketch of a curious researcher in glasses studying floating radar benchmarks and neural charts.
 */
export function ResearchBenchSketch({ className }: SketchProps) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg viewBox="0 0 260 110" className="w-full h-full max-h-24" fill="none">
        {/* Base line */}
        <path d="M20 95 H240" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="4 4" />

        {/* Curious Student / Researcher Doodle on Left */}
        <g transform="translate(35, 30)">
          {/* Head & Big Round Glasses */}
          <circle cx="25" cy="26" r="14" fill="white" stroke="#1E1929" strokeWidth="2.5" />
          {/* Hair */}
          <path d="M12 22 C12 12 25 10 37 14 C35 10 25 8 16 14" fill="#1E1929" />
          {/* Glasses */}
          <circle cx="21" cy="26" r="5" fill="#DBEAFE" stroke="#1E1929" strokeWidth="2" />
          <circle cx="31" cy="26" r="5" fill="#DBEAFE" stroke="#1E1929" strokeWidth="2" />
          <line x1="26" y1="26" x2="26" y2="26" stroke="#1E1929" strokeWidth="2" />
          {/* Eyes behind glasses */}
          <circle cx="21" cy="26" r="1.5" fill="#1D4ED8" />
          <circle cx="31" cy="26" r="1.5" fill="#1D4ED8" />
          {/* Smile */}
          <path d="M24 33 Q26 36 28 33" stroke="#1E1929" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body with Lab Coat / Hoodie */}
          <path d="M13 41 C13 41 18 40 26 40 C34 40 39 41 39 41 L43 65 L9 65 Z" fill="white" stroke="#1E1929" strokeWidth="2.5" />
          <path d="M26 40 V65" stroke="#1E1929" strokeWidth="1.8" />
          {/* Arm holding magnifying glass */}
          <path d="M37 48 Q48 44 54 38" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          {/* Magnifying glass */}
          <circle cx="58" cy="34" r="7" fill="white" stroke="#1E1929" strokeWidth="2" />
          <line x1="53" y1="39" x2="48" y2="44" stroke="#1E1929" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Floating Benchmark Graph Board in Center/Right */}
        <g transform="translate(115, 32)">
          {/* Board backdrop */}
          <rect x="0" y="0" width="75" height="52" rx="8" fill="white" stroke="#1E1929" strokeWidth="2.2" />
          <rect x="0" y="0" width="75" height="12" rx="8" fill="#EFF6FF" stroke="#1E1929" strokeWidth="1.5" />
          <text x="10" y="9" fontSize="6.5" fontWeight="bold" fill="#1D4ED8" fontFamily="monospace">SWE-bench v2</text>
          {/* Bar Charts */}
          <rect x="12" y="34" width="8" height="12" rx="2" fill="#93C5FD" stroke="#1E1929" strokeWidth="1.5" />
          <rect x="25" y="24" width="8" height="22" rx="2" fill="#60A5FA" stroke="#1E1929" strokeWidth="1.5" />
          <rect x="38" y="16" width="8" height="30" rx="2" fill="#2563EB" stroke="#1E1929" strokeWidth="1.5" />
          <rect x="51" y="20" width="8" height="26" rx="2" fill="#3B82F6" stroke="#1E1929" strokeWidth="1.5" />
          {/* Benchmark line */}
          <path d="M16 32 L29 22 L42 14 L55 18" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="42" cy="14" r="2.5" fill="#EF4444" stroke="#1E1929" strokeWidth="1.2" />
        </g>

        {/* Floating Score Badge on Far Right */}
        <g transform="translate(200, 42)">
          <polygon points="18,4 28,12 28,26 18,34 8,26 8,12" fill="#DBEAFE" stroke="#1E1929" strokeWidth="2" />
          <text x="18" y="18" fontSize="8" fontWeight="bold" fill="#1E40AF" textAnchor="middle">94.2%</text>
          <text x="18" y="26" fontSize="6" fontWeight="bold" fill="#6B7280" textAnchor="middle">PASS</text>
        </g>
      </svg>
    </div>
  );
}

/**
 * 2D Sketch #5: Quantization & vLLM on Edge Hardware
 * 2D doodle sketch of a fast microchip running a smiling high-performance AI model.
 */
export function VllmEdgeChipSketch({ className }: SketchProps) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg viewBox="0 0 260 110" className="w-full h-full max-h-24" fill="none">
        {/* Base line */}
        <path d="M20 95 H240" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="4 4" />

        {/* Big Weight Matrix / Compression Funnel on Left */}
        <g transform="translate(35, 38)">
          <rect x="0" y="4" width="34" height="44" rx="4" fill="white" stroke="#1E1929" strokeWidth="2" strokeDasharray="3 3" />
          <text x="17" y="22" fontSize="7" fontWeight="bold" fill="#0284C7" textAnchor="middle" fontFamily="monospace">FP16</text>
          <text x="17" y="36" fontSize="7" fontWeight="bold" fill="#94A3B8" textAnchor="middle" fontFamily="monospace">70B</text>
          {/* Compression arrow */}
          <path d="M38 26 H56" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="56,23 62,26 56,29" fill="#0284C7" />
        </g>

        {/* Cute Edge Chip in Center */}
        <g transform="translate(110, 30)">
          {/* Chip Pins on Left & Right */}
          <line x1="2" y1="20" x2="10" y2="20" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="28" x2="10" y2="28" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="36" x2="10" y2="36" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />

          <line x1="42" y1="20" x2="50" y2="20" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="28" x2="50" y2="28" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="36" x2="50" y2="36" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />

          {/* Chip Body */}
          <rect x="10" y="10" width="32" height="38" rx="6" fill="#E0F2FE" stroke="#1E1929" strokeWidth="2.5" />
          {/* Core Silicon die */}
          <rect x="16" y="16" width="20" height="24" rx="3" fill="white" stroke="#1E1929" strokeWidth="1.8" />
          {/* Doodle Face on Chip */}
          <circle cx="22" cy="24" r="1.5" fill="#0284C7" />
          <circle cx="30" cy="24" r="1.5" fill="#0284C7" />
          <path d="M23 31 Q26 34 29 31" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" />

          {/* Lightning Bolt Speed symbol */}
          <polygon points="26,2 22,8 26,8 24,14 30,7 26,7" fill="#F59E0B" stroke="#1E1929" strokeWidth="1" />
        </g>

        {/* Quantized 4-bit output on Right */}
        <g transform="translate(178, 38)">
          <rect x="0" y="8" width="48" height="36" rx="6" fill="white" stroke="#1E1929" strokeWidth="2.2" />
          <rect x="0" y="8" width="48" height="12" rx="6" fill="#BAE6FD" stroke="#1E1929" strokeWidth="1.5" />
          <text x="24" y="17" fontSize="7" fontWeight="bold" fill="#0369A1" textAnchor="middle" fontFamily="monospace">INT4 AWQ</text>
          <text x="24" y="32" fontSize="8" fontWeight="black" fill="#0284C7" textAnchor="middle" fontFamily="monospace">140 tok/s</text>
        </g>

        <text x="135" y="92" fontSize="7.5" fontWeight="bold" fill="#0369A1" textAnchor="middle" fontFamily="monospace">vLLM::PagingEngine</text>
      </svg>
    </div>
  );
}

/**
 * 2D Sketch #6: Stateful Memory, Tools, and Execution Loop
 * 2D doodle sketch of an autonomous agent running on a continuous execution loop with memory blocks.
 */
export function AgentLoopSketch({ className }: SketchProps) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg viewBox="0 0 260 110" className="w-full h-full max-h-24" fill="none">
        {/* Base line */}
        <path d="M20 95 H240" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="4 4" />

        {/* Circular Execution Loop in background */}
        <path d="M60 55 C60 30 110 30 135 55 C160 80 210 80 210 55 C210 30 160 30 135 55 C110 80 60 80 60 55 Z" stroke="#7C3AED" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.5" />

        {/* Memory Block on Left */}
        <g transform="translate(35, 40)">
          <rect x="0" y="0" width="36" height="32" rx="6" fill="white" stroke="#1E1929" strokeWidth="2" />
          <rect x="0" y="0" width="36" height="10" rx="6" fill="#EDE9FE" stroke="#1E1929" strokeWidth="1.5" />
          <text x="18" y="8" fontSize="6" fontWeight="bold" fill="#6D28D9" textAnchor="middle" fontFamily="monospace">MEMORY</text>
          <line x1="8" y1="17" x2="28" y2="17" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <line x1="8" y1="23" x2="22" y2="23" stroke="#1E1929" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </g>

        {/* Autonomous Robot Agent in Center */}
        <g transform="translate(115, 26)">
          {/* Antenna */}
          <line x1="20" y1="6" x2="20" y2="12" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="4" r="3" fill="#A78BFA" stroke="#1E1929" strokeWidth="1.5" />
          {/* Head */}
          <rect x="6" y="12" width="28" height="24" rx="8" fill="white" stroke="#1E1929" strokeWidth="2.5" />
          {/* Cute Robot Eyes */}
          <circle cx="15" cy="22" r="2" fill="#7C3AED" />
          <circle cx="25" cy="22" r="2" fill="#7C3AED" />
          {/* Smile */}
          <path d="M17 28 Q20 31 23 28" stroke="#1E1929" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body */}
          <rect x="8" y="38" width="24" height="22" rx="4" fill="#EDE9FE" stroke="#1E1929" strokeWidth="2.5" />
          {/* Gears on chest */}
          <circle cx="20" cy="48" r="4" fill="white" stroke="#1E1929" strokeWidth="1.5" />
          {/* Hands holding action plan */}
          <path d="M8 46 L2 52" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 46 L38 52" stroke="#1E1929" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Execution Tools & Feedback on Right */}
        <g transform="translate(185, 38)">
          <rect x="0" y="0" width="44" height="34" rx="6" fill="white" stroke="#1E1929" strokeWidth="2" />
          <rect x="0" y="0" width="44" height="10" rx="6" fill="#DDD6FE" stroke="#1E1929" strokeWidth="1.5" />
          <text x="22" y="8" fontSize="6.5" fontWeight="bold" fill="#5B21B6" textAnchor="middle" fontFamily="monospace">LOOP::EXEC</text>
          <text x="6" y="21" fontSize="7" fontWeight="bold" fill="#059669" fontFamily="monospace">&gt; [OK] act()</text>
          <text x="6" y="29" fontSize="6" fontWeight="bold" fill="#7C3AED" fontFamily="monospace">&gt; step 14</text>
        </g>
      </svg>
    </div>
  );
}

