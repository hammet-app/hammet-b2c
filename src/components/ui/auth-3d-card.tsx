"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils/utils";

/**
 * Auth3DCard
 * Interactive, solid, physical 3D card for the Auth side (Reference Image 1).
 * Features:
 * - Real-time gyroscopic mouse tilt & parallax depth
 * - Solid beveled edges, deep ambient shadows, and specular light sheen
 * - True 3D layered stacking (translateZ) for the floating glass tiles & typography
 * - Smooth harmonic float animations
 */
export function Auth3DCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Mouse tilt tracking values (-1 to 1)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring smoothing for buttery physics
  const springConfig = { stiffness: 180, damping: 22 };
  const smoothX = useSpring(x, { ...springConfig });
  const smoothY = useSpring(y, { ...springConfig });

  // Map mouse offsets to 3D rotation angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  // Dynamic light sheen position
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize from -0.5 to 0.5
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);

    setSheenPos({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.45,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setSheenPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      className="relative w-full max-w-[560px] select-none py-10"
      style={{ perspective: 1200 }}
    >
      {/* Interactive 3D Tilting Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.025 }}
        transition={{ duration: 0.3 }}
        className="relative min-h-[580px] w-full cursor-pointer rounded-[72px] sm:rounded-[88px] bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] p-10 sm:p-14 text-white shadow-[0_45px_110px_rgba(91,33,182,0.48),0_20px_45px_rgba(0,0,0,0.35)] dark:from-[#5B21B6] dark:via-[#3B178A] dark:to-[#1E0F4E] dark:shadow-[0_45px_120px_rgba(6,182,212,0.18)]"
      >
        {/* Solid 3D Bevel Rim Highlight (Light source from top-left) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[72px] sm:rounded-[88px] border-t-2 border-l-2 border-white/35 border-b-4 border-r-4 border-purple-950/70"
          style={{
            boxShadow:
              "inset 0 3px 14px rgba(255,255,255,0.3), inset 0 -8px 26px rgba(0,0,0,0.45)",
          }}
        />

        {/* Dynamic Specular Sheen Reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[72px] sm:rounded-[88px] transition-opacity duration-300"
          style={{
            opacity: sheenPos.opacity,
            background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 30%, transparent 65%)`,
          }}
        />

        {/* ── 3D FLOATING BACKGROUND ELEMENTS (At different translateZ heights) ── */}

        {/* Top-Left Floating Frosted Glass Squircle */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotate: [10, 14, 10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transform: "translateZ(55px)" }}
          className="pointer-events-none absolute -left-4 -top-8 h-28 w-28 rounded-[32px] border border-white/30 bg-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.15)] backdrop-blur-md"
        />

        {/* Top-Right Glowing Cyan Wireframe Ring */}
        <motion.div
          animate={{
            y: [5, -5, 5],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 24, repeat: Infinity, ease: "linear" },
          }}
          style={{ transform: "translateZ(70px)" }}
          className="pointer-events-none absolute -right-3 top-8 h-18 w-18 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_24px_rgba(6,182,212,0.4)] backdrop-blur-sm"
        />

        {/* Floating Diamond Accent Cube (Bottom-Left) */}
        <motion.div
          animate={{
            y: [-4, 5, -4],
            rotate: [45, 50, 45],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transform: "translateZ(45px)" }}
          className="pointer-events-none absolute bottom-12 left-10 h-7 w-7 rounded-[8px] bg-cyan-400/35 border border-cyan-300/60 shadow-[0_0_16px_rgba(6,182,212,0.6)]"
        />

        {/* ── 3D FOREGROUND CONTENT (Pops out in 3D space) ── */}
        <div
          className="relative z-10 flex flex-col justify-between h-full"
          style={{ transform: "translateZ(45px)" }}
        >
          <div>
            {/* Hammet Brand Tagline */}
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300 drop-shadow-sm">
              HAMMET
            </p>

            {/* Main Headline: Learn. Build. Create. */}
            <h2 className="mt-7 text-[clamp(3.4rem,5.8vw,5.6rem)] font-black leading-[0.92] tracking-[-0.055em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
              Learn.
              <br />
              Build.
              <br />
              <span className="text-[#00F0FF] drop-shadow-[0_0_24px_rgba(0,240,255,0.6)]">
                Create.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mt-8 max-w-[380px] text-base leading-relaxed text-purple-100/90 font-medium drop-shadow-sm">
              Education for people who want to understand what they build—and build something worth understanding.
            </p>
          </div>

          {/* Interactive Status Indicator Badge */}
          <div className="mt-12 flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-poppins font-semibold tracking-wide text-purple-200">
              Cohort 2026 Ready
            </span>
          </div>
        </div>

        {/* ── BOTTOM-RIGHT OVERLAPPING 3D FROSTED GLASS CARDS (Matching Image 1) ── */}
        <div
          className="pointer-events-none absolute -bottom-10 -right-8 h-[240px] w-[320px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Back Frosted Card (Translucent White) */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [-7, -5, -7],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transform: "translateZ(75px)" }}
            className="absolute right-12 top-6 h-36 w-56 rounded-[32px] border border-white/30 bg-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          >
            <div className="p-4 flex flex-col justify-between h-full text-white/80">
              <div className="flex items-center justify-between">
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="text-[10px] font-mono opacity-60">GPU NODE</span>
              </div>
              <div className="h-1.5 w-16 rounded-full bg-white/30" />
            </div>
          </motion.div>

          {/* Front Frosted Card (Translucent Cyan Glow) */}
          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [8, 11, 8],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transform: "translateZ(105px)" }}
            className="absolute right-0 top-18 h-36 w-56 rounded-[32px] border border-cyan-300/40 bg-cyan-400/20 shadow-[0_24px_70px_rgba(6,182,212,0.35)] backdrop-blur-xl"
          >
            <div className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between text-cyan-200">
                <span className="text-[10px] font-mono font-bold">140 tok/s</span>
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
              </div>
              <div className="text-xs font-bold text-white">Active Neural Graph</div>
            </div>
          </motion.div>

          {/* Pulsing Glowing Core Sphere behind cards */}
          <motion.div
            style={{ transform: "translateZ(40px)" }}
            className="absolute left-10 top-10 h-20 w-20 rounded-full border border-purple-300/30 bg-purple-400/20 blur-md"
          />
        </div>
      </motion.div>
    </div>
  );
}

