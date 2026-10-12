"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { FacetedDiamondSketch, FlowingRibbonSketch } from "@/components/ui/geometric-3d-sketches";

/**
 * Interactive Moving 3D Background with:
 * 1. Three.js / Canvas particle constellation reacting dynamically to cursor
 * 2. 3D Faceted Diamond Sketch on the Left (Reference Image 4) in Hammet theme color
 * 3. 3D Flowing Ribbon Sketch on the Right (Reference Image 4) in Hammet theme color
 * 4. Ambient color-shifting aurora light orbs with gentle parallax
 * 5. Hardware-accelerated perspective grid
 */
export function Moving3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for cursor parallax
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Interactive mouse coordinate tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Interactive Canvas Particle & Constellation Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Active scroll detection to pause canvas during heavy scroll frames
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 90);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Particle nodes
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      color: string;
    }

    const numParticles = Math.min(22, Math.floor(window.innerWidth / 60));
    const particles: Particle[] = [];
    const colors = ["#8B5CF6", "#A855F7", "#C084FC", "#38BDF8", "#6366F1"];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        baseAlpha: Math.random() * 0.3 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let cursorX = width / 2;
    let cursorY = height / 2;
    const onCanvasMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    window.addEventListener("mousemove", onCanvasMove, { passive: true });

    const render = () => {
      // Pause canvas drawing during rapid scrolling or when scrolled past the hero section to keep 120fps
      if (isScrolling || window.scrollY > 850) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update & Draw Particles in single batch
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = cursorX - p.x;
        const dy = cursorY - p.y;
        if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 1.2;
            p.y -= (dy / dist) * force * 1.2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha;
        ctx.fill();
      }

      // Batch all connecting constellation lines into ONE single stroke call
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          if (Math.abs(dx2) < 95 && Math.abs(dy2) < 95) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.strokeStyle = "rgba(139, 92, 246, 0.12)";
      ctx.lineWidth = 0.75;
      ctx.globalAlpha = 1.0;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onCanvasMove);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-0 overflow-hidden select-none"
      style={{ contain: "strict", transform: "translateZ(0)" }}
    >
      {/* ── 1. INTERACTIVE CANVAS PARTICLE CONSTELLATION ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60 dark:opacity-80"
        style={{ transform: "translateZ(0)" }}
      />

      {/* ── 2. AMBIENT MOVING AURORA LIGHT MESH (Cached GPU Compositor surfaces) ── */}
      {/* Primary Purple Pulsing Nebula */}
      <div
        className="absolute -left-36 -top-36 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-500/18 via-violet-600/12 to-transparent blur-[60px] dark:from-purple-600/22 dark:via-violet-800/18"
        style={{ contain: "strict", transform: "translateZ(0)" }}
      />

      {/* Secondary Cyan Drifting Orb */}
      <div
        className="absolute right-[-120px] top-[24%] h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-cyan-400/12 via-sky-500/8 to-transparent blur-[60px] dark:from-cyan-500/18 dark:via-blue-700/12"
        style={{ contain: "strict", transform: "translateZ(0)" }}
      />

      {/* Deep Violet Center Floating Nebula */}
      <div
        className="absolute bottom-[-140px] left-[25%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-600/12 via-indigo-500/8 to-transparent blur-[60px] dark:from-violet-700/18 dark:via-purple-900/12"
        style={{ contain: "strict", transform: "translateZ(0)" }}
      />

      {/* ── 3. LEFT FLANK: 3D FACETED DIAMOND SKETCH (Matching Reference Image 4) ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [-12, 12, -12],
          rotateZ: [-2, 3, -2],
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.2 },
        }}
        className="absolute left-2 sm:left-6 lg:left-12 top-[18%] hidden sm:block z-0"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="relative group">
          <FacetedDiamondSketch className="w-56 h-56 lg:w-72 lg:h-72 opacity-75 dark:opacity-85" />
          <div className="absolute -bottom-2 left-6 text-[10px] font-mono font-bold tracking-widest uppercase text-purple-600/60 dark:text-purple-400/60 select-none">
            Hammet :: Geometry v4
          </div>
        </div>
      </motion.div>

      {/* ── 4. RIGHT FLANK: 3D FLOWING RIBBON SKETCH (Matching Reference Image 4) ── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [14, -14, 14],
          rotateZ: [2, -3, 2],
        }}
        transition={{
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.2 },
        }}
        className="absolute right-2 sm:right-6 lg:right-10 top-[28%] hidden sm:block z-0"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="relative group">
          <FlowingRibbonSketch className="w-64 h-72 lg:w-80 lg:h-96 opacity-75 dark:opacity-85" />
        </div>
      </motion.div>

      {/* ── 5. GEOMETRIC SOLID WIREFRAMES (Compositor-friendly float) ── */}
      {/* Floating Polyhedron - Top Center-Right */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-3, 3, -3],
        }}
        transition={{
          y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute right-[22%] top-[8%] h-24 w-24 opacity-40 dark:opacity-35 pointer-events-none"
        style={{ contain: "paint", transform: "translateZ(0)" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
          <polygon
            points="50,10 90,35 90,75 50,95 10,75 10,35"
            stroke="url(#wireGrad1)"
            strokeWidth="1.8"
            fill="rgba(168, 85, 247, 0.05)"
          />
          <line x1="50" y1="10" x2="50" y2="95" stroke="url(#wireGrad1)" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="10" y1="35" x2="90" y2="75" stroke="url(#wireGrad1)" strokeWidth="1.2" opacity="0.6" />
          <line x1="90" y1="35" x2="10" y2="75" stroke="url(#wireGrad1)" strokeWidth="1.2" opacity="0.6" />
          <circle cx="50" cy="50" r="12" fill="url(#wireGradSphere)" opacity="0.8" />
          <defs>
            <linearGradient id="wireGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <radialGradient id="wireGradSphere" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.05" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Floating Isometric Cube - Bottom Center-Left */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [2, -2, 2],
        }}
        transition={{
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 18, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute left-[15%] bottom-[18%] h-28 w-28 opacity-35 dark:opacity-30 pointer-events-none"
        style={{ contain: "paint", transform: "translateZ(0)" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
          <polygon points="50,15 82,33 50,51 18,33" fill="rgba(6, 182, 212, 0.12)" stroke="#06B6D4" strokeWidth="1.8" />
          <polygon points="18,33 50,51 50,87 18,69" fill="rgba(168, 85, 247, 0.15)" stroke="#A855F7" strokeWidth="1.8" />
          <polygon points="50,51 82,33 82,69 50,87" fill="rgba(124, 58, 237, 0.2)" stroke="#7C3AED" strokeWidth="1.8" />
          <circle cx="50" cy="51" r="3.5" fill="#38BDF8" />
        </svg>
      </motion.div>

      {/* ── 6. SUBTLE 3D SCAN GRID HORIZON ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-80 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(800px) rotateX(68deg)",
          transformOrigin: "bottom center",
        }}
      />
    </div>
  );
}
