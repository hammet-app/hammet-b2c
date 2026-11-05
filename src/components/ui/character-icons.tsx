"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface CharacterIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

/**
 * Electric Blue Mailbox / Neuro Bot with antenna and playful doodle eyes
 * Inspired by Image 3 doodle #1
 */
export function NeuroBotIcon({ className, size = "md" }: CharacterIconProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[#0080FF] text-white shadow-sm transition-transform hover:scale-105 select-none",
        sizeClasses[size],
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="h-4/5 w-4/5" fill="none">
        {/* Mailbox / Robot body */}
        <rect x="9" y="14" width="22" height="18" rx="4" fill="white" stroke="#111827" strokeWidth="2.5" />
        {/* Domed head/roof */}
        <path d="M9 16C9 10 14 7 20 7C26 7 31 10 31 16" fill="white" stroke="#111827" strokeWidth="2.5" />
        {/* Antenna / flag */}
        <path d="M12 7V4" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="12" y="2" width="5" height="3" fill="#FF4757" stroke="#111827" strokeWidth="1.5" />
        {/* Doodle Eyes */}
        <circle cx="16" cy="18" r="1.8" fill="#111827" />
        <circle cx="24" cy="18" r="1.8" fill="#111827" />
        {/* Cute mouth */}
        <path d="M18 24C19 25 21 25 22 24" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Warm Amber Tensor Gem / Cube with playful doodle eyes
 * Inspired by Image 3 doodle #2
 */
export function TensorCubieIcon({ className, size = "md" }: CharacterIconProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[#FFA000] text-white shadow-sm transition-transform hover:scale-105 select-none",
        sizeClasses[size],
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="h-4/5 w-4/5" fill="none">
        {/* Hexagonal prism / tensor stone */}
        <path
          d="M20 7L31 13V27L20 33L9 27V13L20 7Z"
          fill="white"
          stroke="#111827"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Doodle eyes */}
        <circle cx="16" cy="20" r="1.8" fill="#111827" />
        <circle cx="24" cy="20" r="1.8" fill="#111827" />
        {/* Cute smile */}
        <path d="M18.5 24C19.5 25.2 20.5 25.2 21.5 24" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Coral Red Roadmap Milestone Sign with doodle eyes
 * Inspired by Image 3 doodle #3
 */
export function MilestoneSignIcon({ className, size = "md" }: CharacterIconProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[#FF473A] text-white shadow-sm transition-transform hover:scale-105 select-none",
        sizeClasses[size],
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="h-4/5 w-4/5" fill="none">
        {/* Signpost stick */}
        <path d="M20 18V34" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pointing sign */}
        <path
          d="M10 8H26L31 13L26 18H10V8Z"
          fill="white"
          stroke="#111827"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Doodle eyes */}
        <circle cx="17" cy="13" r="1.7" fill="#111827" />
        <circle cx="23" cy="13" r="1.7" fill="#111827" />
      </svg>
    </div>
  );
}

/**
 * Emerald Green Fresh Knowledge Apple with doodle eyes
 * Inspired by Image 3 doodle #4
 */
export function KnowledgeAppleIcon({ className, size = "md" }: CharacterIconProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[#10B981] text-white shadow-sm transition-transform hover:scale-105 select-none",
        sizeClasses[size],
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="h-4/5 w-4/5" fill="none">
        {/* Apple stem & leaf */}
        <path d="M20 7C20 10 19 12 18 13" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 8C22 7 25 7 26 9C26 11 23 11 20 8Z" fill="#34D399" stroke="#111827" strokeWidth="1.5" />
        {/* Apple body */}
        <path
          d="M14 13C10 13 8 17 8 22C8 28 12 33 16 33C18 33 19 32 20 32C21 32 22 33 24 33C28 33 32 28 32 22C32 17 30 13 26 13C23 13 21 15 20 15C19 15 17 13 14 13Z"
          fill="white"
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* Doodle eyes */}
        <circle cx="16" cy="22" r="1.8" fill="#111827" />
        <circle cx="24" cy="22" r="1.8" fill="#111827" />
        {/* Cute blush dots */}
        <circle cx="13" cy="25" r="1" fill="#F472B6" />
        <circle cx="27" cy="25" r="1" fill="#F472B6" />
      </svg>
    </div>
  );
}

/**
 * Indigo / Deep Purple Neural Lightbulb & Chip with doodle eyes
 * Inspired by Image 3 doodle #5
 */
export function QuantumBulbIcon({ className, size = "md" }: CharacterIconProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[#4F46E5] text-white shadow-sm transition-transform hover:scale-105 select-none",
        sizeClasses[size],
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="h-4/5 w-4/5" fill="none">
        {/* Lightbulb glass */}
        <path
          d="M13 18C13 13.5 16 10 20 10C24 10 27 13.5 27 18C27 21 25.5 23.5 24 25V28H16V25C14.5 23.5 13 21 13 18Z"
          fill="white"
          stroke="#111827"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Bulb base */}
        <path d="M17 28H23V31H17V28Z" fill="#E0E7FF" stroke="#111827" strokeWidth="2" />
        {/* Doodle eyes */}
        <circle cx="17.5" cy="18" r="1.8" fill="#111827" />
        <circle cx="22.5" cy="18" r="1.8" fill="#111827" />
        {/* Tiny neural chip floating */}
        <rect x="26" y="6" width="9" height="9" rx="2" fill="#818CF8" stroke="#111827" strokeWidth="1.5" />
        <circle cx="30.5" cy="10.5" r="1.2" fill="#111827" />
      </svg>
    </div>
  );
}

/**
 * Cyan AI Terminal with smiling prompt eyes
 */
export function TerminalDoodleIcon({ className, size = "md" }: CharacterIconProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[#06B6D4] text-white shadow-sm transition-transform hover:scale-105 select-none",
        sizeClasses[size],
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="h-4/5 w-4/5" fill="none">
        {/* Terminal screen */}
        <rect x="8" y="10" width="24" height="20" rx="4" fill="white" stroke="#111827" strokeWidth="2.5" />
        {/* Command prompt >_ with eyes */}
        <path d="M13 16L17 19L13 22" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="19" r="1.6" fill="#111827" />
        <circle cx="26" cy="19" r="1.6" fill="#111827" />
      </svg>
    </div>
  );
}

/**
 * A horizontal row of all 5 Notion-style colorful character doodle icons
 */
export function CharacterIconRow({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <NeuroBotIcon size={size} />
      <TensorCubieIcon size={size} />
      <MilestoneSignIcon size={size} />
      <KnowledgeAppleIcon size={size} />
      <QuantumBulbIcon size={size} />
    </div>
  );
}
