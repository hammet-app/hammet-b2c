"use client";

import { motion } from "motion/react";

/**
 * FacetedDiamondSketch
 * Multifaceted 3D diamond/gemstone vector sketch matching reference image 4.
 * Features 3D polygonal facets with subtle purple gradients, crisp purple stroke lines,
 * and delicate vertex nodes in Hammet's theme colors.
 */
export function FacetedDiamondSketch({
  className = "w-64 h-64",
  glowColor = "#8b5cf6",
}: {
  className?: string;
  glowColor?: string;
}) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="facetTopGrad" x1="160" y1="20" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="facetLeftGrad" x1="30" y1="100" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="facetCenterGrad" x1="160" y1="100" x2="160" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="facetRightGrad" x1="290" y1="100" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="facetBottomLeftGrad" x1="30" y1="100" x2="160" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="facetBottomRightGrad" x1="290" y1="100" x2="160" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#581C87" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Ambient Glow Aura */}
        <polygon
          points="80,25 240,25 295,100 160,255 25,100"
          fill={glowColor}
          opacity="0.08"
        />

        {/* ── Facet Polygons ── */}
        {/* Top Table Facet */}
        <polygon
          points="105,25 215,25 185,100 135,100"
          fill="url(#facetTopGrad)"
          stroke="#A78BFA"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Top-Left Star Facet */}
        <polygon
          points="80,25 105,25 135,100 25,100"
          fill="url(#facetLeftGrad)"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Top-Right Star Facet */}
        <polygon
          points="215,25 240,25 295,100 185,100"
          fill="url(#facetRightGrad)"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Middle Central Kite Facet */}
        <polygon
          points="135,100 185,100 160,255"
          fill="url(#facetCenterGrad)"
          stroke="#A78BFA"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Pavilion Left Facet */}
        <polygon
          points="25,100 135,100 160,255"
          fill="url(#facetBottomLeftGrad)"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Pavilion Right Facet */}
        <polygon
          points="295,100 185,100 160,255"
          fill="url(#facetBottomRightGrad)"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Additional 3D Girdle Cross Lines */}
        <line x1="80" y1="25" x2="25" y2="100" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="240" y1="25" x2="295" y2="100" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="25" y1="100" x2="295" y2="100" stroke="#DDD6FE" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.8" />

        {/* Glowing Vertex Highlight Nodes */}
        <circle cx="160" cy="255" r="3.5" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="1.5" />
        <circle cx="25" cy="100" r="3" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="1.5" />
        <circle cx="295" cy="100" r="3" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="1.5" />
        <circle cx="105" cy="25" r="2.5" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="1.5" />
        <circle cx="215" cy="25" r="2.5" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="1.5" />
        <circle cx="135" cy="100" r="2.5" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1.5" />
        <circle cx="185" cy="100" r="2.5" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/**
 * FlowingRibbonSketch
 * Sinuous 3D wavy ribbon with smooth flowing curves matching reference image 4.
 * Twists and flows gracefully in Hammet's purple/lilac gradient tones.
 */
export function FlowingRibbonSketch({
  className = "w-72 h-80",
}: {
  className?: string;
}) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="ribbonBodyGrad" x1="300" y1="20" x2="20" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#C4B5FD" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#8B5CF6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="ribbonEdgeGrad" x1="0" y1="0" x2="300" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Filled Twisted Ribbon Mesh */}
        <path
          d="M 280,30 C 260,110 240,170 210,210 C 180,250 150,290 80,340 C 50,360 25,380 15,390 C 40,380 90,345 140,300 C 190,250 230,195 250,150 C 270,100 290,50 280,30 Z"
          fill="url(#ribbonBodyGrad)"
        />

        {/* Top/Front Contour Curve */}
        <path
          d="M 280,30 C 260,110 240,170 210,210 C 180,250 150,290 80,340 C 50,360 25,380 15,390"
          stroke="url(#ribbonEdgeGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Bottom/Back Contour Curve */}
        <path
          d="M 290,45 C 270,120 245,185 220,225 C 190,265 145,310 90,355 C 60,375 35,392 20,400"
          stroke="#C4B5FD"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          strokeLinecap="round"
        />

        {/* Interior Striation Lines giving realistic 3D Moire / Silk texture */}
        {[0.15, 0.3, 0.45, 0.6, 0.75].map((factor, i) => (
          <path
            key={i}
            d={`M ${282 - i * 3},${35 + i * 4} C ${263 - i * 4},${113 + i * 5} ${242 - i * 3},${174 + i * 4} ${213 - i * 3},${214 + i * 3} C ${183 - i * 5},${254 + i * 3} ${148 - i * 8},${296 + i * 4} ${83 - i * 6},${344 + i * 3}`}
            stroke="#A78BFA"
            strokeWidth="0.8"
            strokeOpacity={0.45 - i * 0.05}
          />
        ))}
      </svg>
    </div>
  );
}

