"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface VibrantIconProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  style?: React.CSSProperties;
}

const sizeMap = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

/**
 * 1. Glowing Magic AI Sparkle (Replaces generic 4-point Lucide star)
 * Multi-layer iridescent starburst with glowing radial gradient and celestial sparkles
 */
export function GlowingMagicSparkle({ className, size = "md", style }: VibrantIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={cn("shrink-0 select-none", sizeMap[size], className)}
    >
      <defs>
        <linearGradient id="aiSparkleGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="45%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <radialGradient id="aiSparkleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background Soft Bloom */}
      <circle cx="16" cy="16" r="10" fill="url(#aiSparkleGlow)" />
      {/* Primary 4-Point Celestial Star */}
      <path
        d="M16 2C16 9.73 9.73 16 2 16C9.73 16 16 22.27 16 30C16 22.27 22.27 16 30 16C22.27 16 16 9.73 16 2Z"
        fill="url(#aiSparkleGrad)"
      />
      {/* Core Highlight */}
      <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" opacity="0.9" />
      {/* Accent Micro Star Top Right */}
      <path
        d="M26 4C26 6.2 24.2 8 22 8C24.2 8 26 9.8 26 12C26 9.8 27.8 8 30 8C27.8 8 26 6.2 26 4Z"
        fill="#38BDF8"
      />
      {/* Micro Star Bottom Left */}
      <circle cx="7" cy="25" r="1.5" fill="#E879F9" />
    </svg>
  );
}

/**
 * 2. Quantum Neural Lightbulb (Ideal for School of AI Foundations)
 * Glowing futuristic bulb with neural synapses and violet-cyan gradients
 */
export function QuantumNeuralIcon({ className, size = "md" }: VibrantIconProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", sizeMap[size], className)}
    >
      <defs>
        <linearGradient id="neuralBulbGrad" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      {/* Filament Aura */}
      <circle cx="18" cy="15" r="12" fill="#8B5CF6" fillOpacity="0.15" />
      {/* Bulb Contour */}
      <path
        d="M11 15C11 11.134 14.134 8 18 8C21.866 8 25 11.134 25 15C25 17.65 23.53 19.95 21.37 21.13C20.84 21.42 20.5 21.98 20.5 22.58V24H15.5V22.58C15.5 21.98 15.16 21.42 14.63 21.13C12.47 19.95 11 17.65 11 15Z"
        stroke="url(#neuralBulbGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#neuralBulbGrad)"
        fillOpacity="0.1"
      />
      {/* Internal Neural Nodes & Connections */}
      <circle cx="18" cy="13" r="2" fill="#38BDF8" />
      <circle cx="14.5" cy="17" r="1.5" fill="#A855F7" />
      <circle cx="21.5" cy="17" r="1.5" fill="#C084FC" />
      <path d="M18 13L14.5 17M18 13L21.5 17" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
      {/* Base Connector */}
      <path d="M15 27H21M16 30H20" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 3. AI Safety & Red-Teaming Shield (Ideal for School of AI Safety)
 * Hardened cyber shield with emerald-cyan verification matrix and biometric lock
 */
export function AiSafetyShieldIcon({ className, size = "md" }: VibrantIconProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", sizeMap[size], className)}
    >
      <defs>
        <linearGradient id="safetyShieldGrad" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      {/* Shield Body */}
      <path
        d="M18 5L28 9V17C28 23.5 23.7 29.5 18 31C12.3 29.5 8 23.5 8 17V9L18 5Z"
        fill="url(#safetyShieldGrad)"
        fillOpacity="0.18"
        stroke="url(#safetyShieldGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Verification Checkmark / Core */}
      <path
        d="M14 18L17 21L23 15"
        stroke="#10B981"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent Cyber Ring */}
      <circle cx="18" cy="18" r="6" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}

/**
 * 4. Autonomous Agent Swarm Drone (Ideal for Autonomous Agents & Multi-Modal Frameworks)
 * Futuristic AI agent orb with orbital antennas and glowing cyan core
 */
export function AutonomousAgentIcon({ className, size = "md" }: VibrantIconProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", sizeMap[size], className)}
    >
      <defs>
        <linearGradient id="agentOrbGrad" x1="4" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Outer Orbit */}
      <ellipse cx="18" cy="18" rx="14" ry="7" stroke="#A855F7" strokeWidth="1.4" strokeDasharray="3 2" transform="rotate(-25 18 18)" opacity="0.7" />
      {/* Satellite Node */}
      <circle cx="28" cy="12" r="2" fill="#F59E0B" />
      {/* Central Agent Core */}
      <circle cx="18" cy="18" r="7.5" fill="url(#agentOrbGrad)" fillOpacity="0.25" stroke="url(#agentOrbGrad)" strokeWidth="2.2" />
      {/* Cute Cyber Optical Sensor / Eye */}
      <circle cx="18" cy="18" r="3" fill="#FFFFFF" />
      <circle cx="19" cy="17" r="1.2" fill="#8B5CF6" />
    </svg>
  );
}

/**
 * 5. Dynamic School Icon Selector
 * Returns the matching unique, colored icon based on school ID or name
 */
export function SchoolVibrantIcon({
  schoolId,
  schoolName,
  size = "md",
  className,
}: {
  schoolId?: string;
  schoolName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const identifier = (schoolId || schoolName || "").toLowerCase();

  if (identifier.includes("safety") || identifier.includes("red-team") || identifier.includes("alignment")) {
    return <AiSafetyShieldIcon size={size} className={className} />;
  }
  if (identifier.includes("agent") || identifier.includes("autonomous") || identifier.includes("swarm")) {
    return <AutonomousAgentIcon size={size} className={className} />;
  }
  // Default to Quantum Neural Lightbulb for foundations or generic
  return <QuantumNeuralIcon size={size} className={className} />;
}

