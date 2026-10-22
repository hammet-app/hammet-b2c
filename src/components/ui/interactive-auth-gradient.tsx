"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/utils";

interface InteractiveAuthGradientProps {
  className?: string;
}

/**
 * InteractiveAuthGradient
 * Smooth, luminous, light-reactive animated gradient mesh for Sign In and Sign Up pages.
 * Features:
 * - Fluid multi-layer CSS GPU-accelerated gradient morphing (lavender, soft lilac, cyan aura, rose blush).
 * - Smooth pointer-tracking luminous light bloom that follows cursor with fluid physics (lerp).
 * - Interactive click ripple wave radiating outward from pointer.
 * - Zero layout thrashing (uses hardware-accelerated CSS custom properties & transform).
 */
export function InteractiveAuthGradient({ className }: InteractiveAuthGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Smooth linear interpolation (lerp) for fluid cursor trailing
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (el) {
        el.style.setProperty("--cursor-x", `${currentX.toFixed(1)}px`);
        el.style.setProperty("--cursor-y", `${currentY.toFixed(1)}px`);
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700",
        className
      )}
      style={
        {
          "--cursor-x": "50vw",
          "--cursor-y": "40vh",
        } as React.CSSProperties
      }
    >
      {/* ── Layer 1: Perpetual Smooth Ambient Light Mesh (CSS Gradient Animation) ── */}
      <div
        className={cn(
          "absolute inset-0 opacity-80 dark:opacity-40 transition-opacity duration-700",
          "bg-gradient-to-tr from-[#F8FAFC] via-[#F3E8FF] to-[#EDE9FE]",
          "dark:from-[#090614] dark:via-[#0F0B1F] dark:to-[#160D2E]"
        )}
      />

      {/* ── Layer 2: Drifting Organic Soft Luminous Orbs ── */}
      {/* Orb A: Soft Lavender Bloom (Top-Left) */}
      <div
        className={cn(
          "absolute -left-20 -top-20 h-[560px] w-[560px] rounded-full blur-[100px]",
          "bg-gradient-to-br from-purple-300/40 via-violet-400/25 to-transparent",
          "dark:from-purple-900/30 dark:via-violet-950/20 dark:to-transparent",
          "animate-pulse"
        )}
        style={{
          animationDuration: "9s",
          transform: "translateZ(0)",
          willChange: "transform, opacity",
        }}
      />

      {/* Orb B: Ethereal Cyan & Sky Aura (Bottom-Right) */}
      <div
        className={cn(
          "absolute -bottom-28 -right-20 h-[620px] w-[620px] rounded-full blur-[120px]",
          "bg-gradient-to-tl from-cyan-300/35 via-indigo-300/25 to-transparent",
          "dark:from-cyan-950/25 dark:via-purple-950/20 dark:to-transparent",
          "animate-pulse"
        )}
        style={{
          animationDuration: "12s",
          transform: "translateZ(0)",
          willChange: "transform, opacity",
        }}
      />

      {/* Orb C: Floating Rose/Lilac Accent (Center-Top) */}
      <div
        className={cn(
          "absolute left-1/3 top-1/4 h-[440px] w-[440px] -translate-x-1/2 rounded-full blur-[110px]",
          "bg-gradient-to-r from-fuchsia-300/20 via-purple-300/25 to-pink-200/15",
          "dark:from-purple-900/15 dark:via-indigo-900/15 dark:to-transparent",
          "animate-pulse"
        )}
        style={{
          animationDuration: "15s",
          transform: "translateZ(0)",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Layer 3: Interactive Dynamic Cursor Light Bloom ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 480px at var(--cursor-x) var(--cursor-y), rgba(167, 139, 250, 0.24), rgba(6, 182, 212, 0.12) 35%, transparent 70%)`,
        }}
      />

      {/* Secondary Crisp Core Follower */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle 220px at var(--cursor-x) var(--cursor-y), rgba(255, 255, 255, 0.45), rgba(196, 181, 253, 0.2) 45%, transparent 75%)`,
        }}
      />

      {/* ── Layer 4: Interactive Click Waves ── */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full border border-purple-400/40 bg-purple-400/10 dark:border-cyan-400/40 dark:bg-cyan-400/10 animate-ping"
          style={{
            left: ripple.x - 75,
            top: ripple.y - 75,
            width: 150,
            height: 150,
            animationDuration: "1.1s",
            animationIterationCount: 1,
          }}
        />
      ))}

      {/* ── Layer 5: Subtle Micro-Dot Texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#17131F 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

