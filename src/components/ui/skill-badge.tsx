"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Sparkles,
  Download,
  X,
  Award,
  Hash,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { SkillBadge, useLearnerStore } from "@/lib/store/use-learner-store";
import { useAuth } from "@/lib/auth/auth-context";

interface SkillBadgeProps {
  badge: SkillBadge;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onSelect?: (badge: SkillBadge) => void;
}

// 5-Point Star SVG helper
function Star({ cx, cy, r, fill = "#FDE047" }: { cx: number; cy: number; r: number; fill?: string }) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return <polygon points={points.join(" ")} fill={fill} filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))" />;
}

// ─── AUTHENTIC CERTIFIER / HERALDIC RIBBON MEDALLION SVG ───
export function CertifierMedallion({
  badge,
  className,
}: {
  badge: SkillBadge;
  className?: string;
}) {
  // Theme definitions matching Certifier reference badges
  const getTheme = () => {
    switch (badge.category) {
      case "neural":
        return {
          id: "theme-neural",
          outerRing: "#1F1607",
          innerDisc: "#2E1F09",
          borderRing: "#F59E0B",
          stitch: "#FDE047",
          ribbonGradStart: "#D97706",
          ribbonGradEnd: "#92400E",
          ribbonFold: "#451A03",
          ribbonBorder: "#FDE68A",
          accentStar: "#FDE047",
          subhead: "GRADUATED FROM COURSE",
          tailColor: "#B45309",
          tailFold: "#78350F",
        };
      case "agents":
        return {
          id: "theme-agents",
          outerRing: "#061A2B",
          innerDisc: "#0B2942",
          borderRing: "#0284C7",
          stitch: "#38BDF8",
          ribbonGradStart: "#0284C7",
          ribbonGradEnd: "#075985",
          ribbonFold: "#082F49",
          ribbonBorder: "#BAE6FD",
          accentStar: "#38BDF8",
          subhead: "GAINED COMPETENCIES IN",
          tailColor: "#0369A1",
          tailFold: "#0C4A6E",
        };
      case "rag":
        return {
          id: "theme-rag",
          outerRing: "#1B0D33",
          innerDisc: "#2A144E",
          borderRing: "#8B5CF6",
          stitch: "#C4B5FD",
          ribbonGradStart: "#7C3AED",
          ribbonGradEnd: "#5B21B6",
          ribbonFold: "#2E1065",
          ribbonBorder: "#DDD6FE",
          accentStar: "#C4B5FD",
          subhead: "VERIFIED ARCHITECT IN",
          tailColor: "#6D28D9",
          tailFold: "#4C1D95",
        };
      case "safety":
        return {
          id: "theme-safety",
          outerRing: "#2B0B14",
          innerDisc: "#43121F",
          borderRing: "#E11D48",
          stitch: "#FDA4AF",
          ribbonGradStart: "#E11D48",
          ribbonGradEnd: "#9F1239",
          ribbonFold: "#4C0519",
          ribbonBorder: "#FECDD3",
          accentStar: "#FDA4AF",
          subhead: "ACCREDITED SPECIALIST IN",
          tailColor: "#BE123C",
          tailFold: "#881337",
        };
      case "pro":
        return {
          id: "theme-pro",
          outerRing: "#120E05",
          innerDisc: "#1F180A",
          borderRing: "#EAB308",
          stitch: "#FEF08A",
          ribbonGradStart: "#CA8A04",
          ribbonGradEnd: "#854D0E",
          ribbonFold: "#422006",
          ribbonBorder: "#FEF9C3",
          accentStar: "#FEF08A",
          subhead: "FELLOWSHIP HONORS",
          tailColor: "#A16207",
          tailFold: "#713F12",
        };
      default:
        return {
          id: "theme-emerald",
          outerRing: "#062319",
          innerDisc: "#0D382A",
          borderRing: "#10B981",
          stitch: "#6EE7B7",
          ribbonGradStart: "#059669",
          ribbonGradEnd: "#065F46",
          ribbonFold: "#022C22",
          ribbonBorder: "#A7F3D0",
          accentStar: "#6EE7B7",
          subhead: "COMPLETED CAPSTONE IN",
          tailColor: "#047857",
          tailFold: "#064E3B",
        };
    }
  };

  const t = getTheme();
  const gradId = `ribbon-grad-${badge.id}`;
  const discGradId = `disc-grad-${badge.id}`;

  return (
    <svg
      viewBox="0 0 240 248"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto drop-shadow-xl select-none", className)}
    >
      <defs>
        {/* Ribbon Gradient */}
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={t.ribbonGradStart} />
          <stop offset="50%" stopColor={t.ribbonGradEnd} />
          <stop offset="100%" stopColor={t.ribbonGradStart} />
        </linearGradient>

        {/* Inner Disc Gradient */}
        <radialGradient id={discGradId} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={t.innerDisc} />
          <stop offset="100%" stopColor={t.outerRing} />
        </radialGradient>

        {/* Soft Drop Shadow for Badge */}
        <filter id="badge-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ── 1. HANGING ROSETTE RIBBON TAILS (BACK LAYER) ── */}
      <g opacity="0.95">
        {/* Left Tail Fold */}
        <polygon points="86,168 70,224 90,214 102,224 98,168" fill={t.tailColor} />
        <polygon points="98,168 102,224 88,198" fill={t.tailFold} opacity="0.4" />

        {/* Right Tail Fold */}
        <polygon points="142,168 138,224 150,214 170,224 154,168" fill={t.tailColor} />
        <polygon points="142,168 138,224 152,198" fill={t.tailFold} opacity="0.4" />
      </g>

      {/* ── 2. CIRCULAR MAIN MEDALLION DISC ── */}
      <g filter="url(#badge-shadow)">
        {/* Outer Heavy Rosette Rim */}
        <circle cx="120" cy="112" r="86" fill={t.outerRing} stroke={t.borderRing} strokeWidth="5" />

        {/* Inset Cream/Metallic Ring */}
        <circle cx="120" cy="112" r="77" fill="none" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="2.5" />

        {/* Inner Radial Disc Body */}
        <circle cx="120" cy="112" r="74" fill={`url(#${discGradId})`} />

        {/* Fine Dotted Security Stitch Line */}
        <circle
          cx="120"
          cy="112"
          r="68"
          fill="none"
          stroke={t.stitch}
          strokeWidth="1.6"
          strokeDasharray="3.5 3.5"
          opacity="0.8"
        />
      </g>

      {/* ── 3. TOP ARCH OF 5 STARS ── */}
      <g>
        <Star cx={78} cy={66} r={4.5} fill={t.accentStar} />
        <Star cx={96} cy={54} r={6.5} fill={t.accentStar} />
        <Star cx={120} cy={48} r={9.5} fill="#FFFFFF" />
        <Star cx={144} cy={54} r={6.5} fill={t.accentStar} />
        <Star cx={162} cy={66} r={4.5} fill={t.accentStar} />
      </g>

      {/* ── 4. SUBHEAD TEXT ABOVE RIBBON ── */}
      <text
        x="120"
        y="83"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="800"
        letterSpacing="1.8"
        fill="#FFFFFF"
        opacity="0.85"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {t.subhead}
      </text>

      {/* ── 5. HORIZONTAL RIBBON BANNER (CROSSING THE CENTER) ── */}
      <g>
        {/* 3D Fold Triangles (behind main bar, giving wrap-around effect) */}
        <polygon points="26,128 38,100 38,138" fill={t.ribbonFold} />
        <polygon points="214,128 202,100 202,138" fill={t.ribbonFold} />

        {/* Left Fishtail Ribbon Notch */}
        <polygon
          points="14,100 38,100 38,136 14,136 24,118"
          fill={t.ribbonGradEnd}
          stroke={t.ribbonBorder}
          strokeWidth="1.2"
        />

        {/* Right Fishtail Ribbon Notch */}
        <polygon
          points="226,100 202,100 202,136 226,136 216,118"
          fill={t.ribbonGradEnd}
          stroke={t.ribbonBorder}
          strokeWidth="1.2"
        />

        {/* Main Center Ribbon Plaque */}
        <rect
          x="32"
          y="98"
          width="176"
          height="38"
          rx="2"
          fill={`url(#${gradId})`}
          stroke={t.ribbonBorder}
          strokeWidth="1.8"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
        />

        {/* Subtle Top Specular Sheen line on Ribbon */}
        <line x1="36" y1="102" x2="204" y2="102" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1" />

        {/* Ribbon Title Text */}
        <text
          x="120"
          y="122"
          textAnchor="middle"
          fontSize={badge.title.length > 18 ? "10" : "11.5"}
          fontWeight="900"
          letterSpacing="1.2"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.6))"
        >
          {badge.title.toUpperCase()}
        </text>
      </g>

      {/* ── 6. BOTTOM GRADUATION CAP & ACADEMY INSIGNIA ── */}
      <g transform="translate(120, 153)">
        {/* Cap Diamond */}
        <polygon
          points="0,-8 14,-2 0,4 -14,-2"
          fill={t.borderRing}
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
        {/* Cap Base */}
        <path
          d="M -9,-1 L -9,4 C -9,7 9,7 9,4 L 9,-1"
          fill={t.borderRing}
          opacity="0.85"
        />
        {/* Tassel */}
        <path
          d="M 0,-4 L 16,0 L 16,8"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Bottom Company Seal Label */}
      <text
        x="120"
        y="173"
        textAnchor="middle"
        fontSize="6.8"
        fontWeight="800"
        letterSpacing="1.6"
        fill="#FFFFFF"
        opacity="0.9"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        HAMMET AI ACADEMY
      </text>
    </svg>
  );
}

// ─── SKILL BADGE CARD COMPONENT ───
export function SkillBadgeComponent({
  badge,
  size = "md",
  interactive = true,
  onSelect,
}: SkillBadgeProps) {
  const { user } = useAuth();
  const learnerName = user?.fullName || "Godswill Chibueze";
  const triggerCelebration = useLearnerStore((state) => state.triggerCelebration);

  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://hammet.ai/verify/badge/${badge.id}?hash=${badge.verificationHash}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Proud to earn the verified ${badge.title} credential from Hammet AI Academy! Validated via test suite and capstone code evaluations.`
  );

  return (
    <>
      {/* ── PHYSICAL BADGE CARD ── */}
      <div
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={() => {
          if (!interactive) return;
          if (onSelect) onSelect(badge);
          else setModalOpen(true);
        }}
        onKeyDown={(e) => {
          if (!interactive) return;
          if (e.key === "Enter" || e.key === " ") {
            if (onSelect) onSelect(badge);
            else setModalOpen(true);
          }
        }}
        className={cn(
          "group relative flex flex-col items-center select-none text-center cursor-pointer transition-all duration-300",
          interactive && "hover:-translate-y-2 hover:scale-[1.02]"
        )}
      >
        {/* Ambient Glow */}
        <div
          className="absolute -inset-2 rounded-[2.5rem] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
          style={{ backgroundColor: badge.glowColor }}
        />

        {/* Card Body */}
        <div
          className={cn(
            "relative w-full rounded-[2.4rem] p-5 sm:p-6 border backdrop-blur-md transition-all duration-300",
            "bg-white/95 dark:bg-[#0E091E]/95",
            "border-black/[0.08] dark:border-white/10 shadow-lg group-hover:shadow-2xl"
          )}
        >
          {/* Top Verification Header */}
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/10 pb-3 mb-3 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-400">
            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              AUTHENTIC BADGE
            </span>
            <span className="font-semibold">{badge.issued}</span>
          </div>

          {/* Authentic Certifier Ribbon Medallion */}
          <div className="relative mx-auto my-2 max-w-[190px] sm:max-w-[210px] transform group-hover:scale-105 transition-transform duration-300">
            <CertifierMedallion badge={badge} />
          </div>

          {/* Badge Title */}
          <h4 className="mt-3 font-poppins text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-300 transition-colors">
            {badge.title}
          </h4>

          {/* Short Description */}
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed px-1">
            {badge.desc}
          </p>

          {/* Bottom Grade & Claim Hint */}
          <div className="mt-4 pt-3.5 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between">
            <span className="rounded-full bg-purple-500/10 border border-purple-400/30 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-purple-700 dark:text-purple-300">
              {badge.grade}
            </span>

            <span className="flex items-center gap-1 font-mono text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Verified Proof
            </span>
          </div>

          {/* Hover Clue */}
          <div className="mt-2 text-[10.5px] font-mono text-purple-600 dark:text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Click to Claim &amp; Share Credential ↗
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE CREDENTIAL PROOF & CLAIM MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.8rem] border border-white/20 bg-white p-6 sm:p-8 shadow-2xl dark:bg-[#0F0A1F] text-slate-900 dark:text-white z-10 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Large Centered Certifier Ribbon Medallion */}
              <div className="relative mx-auto max-w-[210px] my-2 drop-shadow-2xl">
                <CertifierMedallion badge={badge} />
              </div>

              {/* Verified Pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                CRYPTOGRAPHIC MICRO-CREDENTIAL // {badge.grade}
              </div>

              {/* Badge Title & Capstone */}
              <h3 className="mt-2 text-2xl font-black tracking-tight">
                {badge.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {badge.desc}
              </p>

              {/* Credential Attributes */}
              <div className="mt-5 space-y-2 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/30 p-4 font-mono text-xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">ISSUED TO</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {learnerName} (DID: 8f4b-2026)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">HOW EARNED</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Module Test (Score ≥ 80%) + Capstone Approval
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">QUALIFYING CAPSTONE</span>
                  <span className="font-bold text-purple-600 dark:text-cyan-300 truncate max-w-[230px]">
                    {badge.projectTitle}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">VERIFICATION PROOF</span>
                  <span className="font-bold text-amber-500 select-all">
                    {badge.verificationHash}
                  </span>
                </div>
              </div>

              {/* Verified Skills */}
              <div className="mt-4 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Demonstrated Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {badge.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-purple-500/10 border border-purple-400/20 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Simulation Trigger Button */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    triggerCelebration(badge);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 px-4 py-3 font-poppins text-xs font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Simulate Earning This Badge &amp; Celebrate 🎉</span>
                </button>
              </div>

              {/* Action Buttons: LinkedIn, Copy URL */}
              <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-black/[0.08] dark:border-white/10">
                <a
                  href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                    badge.title + " - Hammet AI Academy"
                  )}&organizationName=Hammet+AI&issueYear=2026&issueMonth=10&certUrl=https://hammet.ai/verify/badge/${badge.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#084e96] transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Add to LinkedIn
                </a>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/10 px-4 py-2.5 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/20 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                      Copy Credential URL
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
