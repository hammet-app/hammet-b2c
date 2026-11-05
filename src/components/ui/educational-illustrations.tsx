"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

/**
 * 1. HugeAcademicWatermark
 * Placed in the background of school cards.
 * Combines a prominent Graduation Mortarboard, Academic Laurel Wreath, and Open Book of Knowledge.
 */
export function HugeAcademicWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
    >
      <defs>
        <linearGradient id="academicWatermarkGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Laurel Wreath Left */}
      <path
        d="M32 120C28 105 30 85 40 70C42 67 40 64 36 65C28 78 22 98 26 122C28 126 33 125 32 120Z"
        fill="url(#academicWatermarkGrad)"
      />
      <path
        d="M26 100C18 92 18 78 24 68C26 65 23 62 20 64C12 76 12 94 20 105C23 108 28 105 26 100Z"
        fill="url(#academicWatermarkGrad)"
      />
      <path
        d="M42 142C36 132 35 118 42 106C44 103 41 100 37 102C28 116 30 132 38 146C41 149 45 146 42 142Z"
        fill="url(#academicWatermarkGrad)"
      />

      {/* Laurel Wreath Right */}
      <path
        d="M168 120C172 105 170 85 160 70C158 67 160 64 164 65C172 78 178 98 174 122C172 126 167 125 168 120Z"
        fill="url(#academicWatermarkGrad)"
      />
      <path
        d="M174 100C182 92 182 78 176 68C174 65 177 62 180 64C188 76 188 94 180 105C177 108 172 105 174 100Z"
        fill="url(#academicWatermarkGrad)"
      />
      <path
        d="M158 142C164 132 165 118 158 106C156 103 159 100 163 102C172 116 170 132 162 146C159 149 155 146 158 142Z"
        fill="url(#academicWatermarkGrad)"
      />

      {/* Graduation Mortarboard Cap (Top Diamond) */}
      <path
        d="M100 28L166 60L100 92L34 60L100 28Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cap Skull Under-Brim */}
      <path
        d="M58 72V104C58 118 76 128 100 128C124 128 142 118 142 104V72"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mortarboard Tassel & Button */}
      <circle cx="100" cy="60" r="3.5" fill="currentColor" />
      <path
        d="M100 60C125 65 158 75 162 105C163 115 168 125 168 135"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="4 2"
      />
      <path
        d="M164 135H172V148H164V135Z"
        fill="currentColor"
      />

      {/* Open Academic Codex / Book below */}
      <path
        d="M44 148C62 138 82 140 100 150C118 140 138 138 156 148V176C138 166 118 168 100 178C82 168 62 166 44 176V148Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M100 150V178" stroke="currentColor" strokeWidth="2.4" />
      {/* Text lines on book */}
      <path d="M56 156C68 150 82 152 92 158" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      <path d="M56 164C68 158 82 160 92 166" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      <path d="M108 158C118 152 132 150 144 156" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      <path d="M108 166C118 160 132 158 144 164" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/**
 * 2. HugeCourseAcademicWatermark
 * Placed in the background of course cards.
 * Combines an Open Illuminated Book, Academic Degree Scroll, and Radiant Knowledge Stars.
 */
export function HugeCourseAcademicWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
    >
      {/* Radiant Aura rays */}
      <path d="M90 12V24M90 156V168M18 90H30M150 90H162" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <path d="M38 38L48 48M132 132L142 142M38 142L48 132M132 48L142 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Graduation Scroll Rolled */}
      <path
        d="M32 42C32 36 38 32 45 32H135C142 32 148 36 148 42C148 48 142 52 135 52H45C38 52 32 48 32 42Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M42 32V52" stroke="currentColor" strokeWidth="2" />
      <path d="M138 32V52" stroke="currentColor" strokeWidth="2" />

      {/* Open Comprehensive Book */}
      <path
        d="M34 82C54 72 74 74 90 84C106 74 126 72 146 82V142C126 132 106 134 90 144C74 134 54 132 34 142V82Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M90 84V144" stroke="currentColor" strokeWidth="2.6" />

      {/* Page Content Ribbons */}
      <path d="M48 94C60 88 74 90 82 95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <path d="M48 106C60 100 74 102 82 107" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <path d="M48 118C60 112 74 114 82 119" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />

      <path d="M98 95C106 90 120 88 132 94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <path d="M98 107C106 102 120 100 132 106" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <path d="M98 119C106 114 120 112 132 118" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />

      {/* Degree Wax Ribbon Seal */}
      <circle cx="140" cy="138" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M135 150L132 165L140 160L148 165L145 150" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
      <path d="M136 138L139 141L145 135" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 3. HugeEducationalHeroIllustration
 * The grand centerpiece educational illustration for the "My learning" top header banner!
 * Features:
 * - A 3D-styled, multifaceted Graduation Mortarboard with gold-tinted tassel and depth
 * - Open Illuminated AI Codex with glowing neural circuits
 * - Floating Holographic Skill Badges & Certificates
 * - Ambient celestial glow and interactive floating motion
 */
export function HugeEducationalHeroIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative select-none pointer-events-none transform-gpu", className)}>
      {/* Hardware-accelerated ambient shadow layer - cached once by GPU, zero scroll repaint */}
      <div className="pointer-events-none absolute inset-x-8 bottom-3 h-16 rounded-full bg-purple-500/25 blur-xl dark:bg-cyan-500/20 transform-gpu" />

      <svg
        viewBox="0 0 340 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-full w-full"
      >
        <defs>
          {/* Radial Ambient Backlight */}
          <radialGradient id="heroGlowGrad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#818CF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>

          {/* Graduation Cap Facet Gradients */}
          <linearGradient id="capTopGrad" x1="60" y1="50" x2="280" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="45%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="capUnderGrad" x1="100" y1="120" x2="240" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#581C87" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          {/* Gold Tassel Gradient */}
          <linearGradient id="goldTasselGrad" x1="220" y1="90" x2="270" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Book / Tome Leather Cover Gradient */}
          <linearGradient id="bookCoverGrad" x1="50" y1="180" x2="290" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B0764" />
            <stop offset="50%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Illuminated Pages Gradient */}
          <linearGradient id="pagesGrad" x1="70" y1="190" x2="270" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F5F3FF" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>

          {/* Holographic Cyan-Emerald Accent */}
          <linearGradient id="holoCircuitGrad" x1="80" y1="210" x2="260" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Ambient Back Glow */}
        <ellipse cx="170" cy="140" rx="140" ry="110" fill="url(#heroGlowGrad)" />

        {/* ── BASE: OPEN ILLUMINATED CODEX / ACADEMIC BOOK ─────────────────── */}
        <g id="academicBook">
          {/* Book Spine / Cover Shadow */}
          <path
            d="M50 205C85 190 130 193 170 208C210 193 255 190 290 205V250C255 235 210 238 170 253C130 238 85 235 50 250V205Z"
            fill="url(#bookCoverGrad)"
            stroke="#6B21A8"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Book Pages Thickness Stack (3D Depth) */}
          <path
            d="M52 201C86 186 130 189 170 204C210 189 254 186 288 201V242C254 227 210 230 170 245C130 230 86 227 52 242V201Z"
            fill="url(#pagesGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.8"
          />

          {/* Top Page with Golden Border */}
          <path
            d="M55 197C88 182 131 185 170 200C209 185 252 182 285 197V236C252 221 209 224 170 239C131 224 88 221 55 236V197Z"
            fill="#FFFFFF"
            stroke="#DDD6FE"
            strokeWidth="1.5"
          />

          {/* Book Center Binding */}
          <path d="M170 200V240" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Page Neural Circuit Matrix */}
          <path
            d="M75 208C92 201 112 203 130 208M75 218C92 211 112 213 130 218M75 228C92 221 112 223 130 228"
            stroke="url(#holoCircuitGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <circle cx="85" cy="207" r="2.2" fill="#06B6D4" />
          <circle cx="118" cy="219" r="2.2" fill="#8B5CF6" />
          <circle cx="98" cy="227" r="2.2" fill="#10B981" />

          {/* Right Page Academic Text & Degree Stamp */}
          <path
            d="M210 208C228 203 248 201 265 208M210 218C228 213 248 211 265 218M210 228C228 223 248 221 265 228"
            stroke="#818CF8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Gold Embossed Academic Seal on Right Page */}
          <circle cx="238" cy="218" r="9" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
          <path d="M234 218L237 221L243 215" stroke="#CA8A04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── CENTERPIECE: HUGE 3D GRADUATION CAP (MORTARBOARD) ───────────── */}
        <g id="graduationCap">
          {/* Cap Lower Head Cap / Brim Depth */}
          <path
            d="M105 108V146C105 168 134 184 170 184C206 184 235 168 235 146V108"
            fill="url(#capUnderGrad)"
            stroke="#4C1D95"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Cap Inner Rim Highlight */}
          <path
            d="M116 116C128 134 148 142 170 142C192 142 212 134 224 116"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Main Diamond Mortarboard Top with Chamfered Rim */}
          <path
            d="M170 44L288 88L170 132L52 88L170 44Z"
            fill="url(#capTopGrad)"
            stroke="#C4B5FD"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Top Diamond Facet Highlight (3D Glass Light Reflection) */}
          <path
            d="M170 48L280 88L170 126L60 88L170 48Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.35"
          />
          <polygon
            points="170,52 250,84 170,116 90,84"
            fill="#C084FC"
            fillOpacity="0.18"
          />

          {/* Central Mortarboard Button */}
          <ellipse cx="170" cy="88" rx="8" ry="5" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
          <ellipse cx="170" cy="87" rx="4" ry="2.5" fill="#FFFFFF" />

          {/* Golden Silk Tassel Draping to the Right */}
          <path
            d="M170 88C198 94 246 108 252 145C254 158 260 172 260 186"
            stroke="url(#goldTasselGrad)"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Golden Ring Holder */}
          <circle cx="260" cy="186" r="4.5" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
          {/* Luxurious Tassel Fringe */}
          <path
            d="M256 190H264L266 216C266 220 254 220 254 216L256 190Z"
            fill="url(#goldTasselGrad)"
            stroke="#B45309"
            strokeWidth="1.4"
          />
          {/* Tassel Fringe Strands */}
          <line x1="257" y1="200" x2="257" y2="216" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
          <line x1="260" y1="198" x2="260" y2="217" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
          <line x1="263" y1="200" x2="263" y2="216" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* ── FLOATING ACCENTS: DIPLOMA SCROLL, STARS & BADGES ─────────────── */}
        {/* Floating Rolled Diploma Scroll Top-Left */}
        <g id="floatingDiploma" transform="rotate(-18 68 76)">
          <rect x="42" y="66" width="56" height="18" rx="5" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2" />
          <ellipse cx="42" cy="75" rx="5" ry="9" fill="#E9D5FF" stroke="#8B5CF6" strokeWidth="1.8" />
          {/* Red/Gold Ribbon Knot */}
          <rect x="66" y="64" width="8" height="22" rx="2" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          <path d="M68 86L64 96L70 93L76 96L72 86" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
        </g>

        {/* Floating Sparkle Stars */}
        <path
          d="M280 45C280 52 274 57 267 57C274 57 280 62 280 69C280 62 286 57 293 57C286 57 280 52 280 45Z"
          fill="#38BDF8"
        />
        <circle cx="280" cy="57" r="2.5" fill="#FFFFFF" />

        <path
          d="M48 135C48 140 44 144 39 144C44 144 48 148 48 153C48 148 52 144 57 144C52 144 48 140 48 135Z"
          fill="#F43F5E"
        />

        <path
          d="M302 120C302 124 298 127 294 127C298 127 302 130 302 134C302 130 306 127 310 127C306 127 302 124 302 120Z"
          fill="#FBBF24"
        />

        {/* Glowing AI Neural Spark Node */}
        <circle cx="70" cy="180" r="4.5" fill="#A855F7" />
        <circle cx="70" cy="180" r="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
