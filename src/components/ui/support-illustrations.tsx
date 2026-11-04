"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils/utils";

/**
 * Friendly support agent illustration used on the learner support desk.
 * Kept as inline SVG so it stays crisp, themeable and cheap to render.
 */
export function SupportHumanIllustration({
  className,
}: {
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const float = reduceMotion
    ? undefined
    : { y: [0, -6, 0] };
  const floatTransition = (duration: number, delay = 0) =>
    reduceMotion
      ? undefined
      : {
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut" as const,
        };

  const wave = reduceMotion
    ? undefined
    : { rotate: [-8, 8, -8] };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative select-none pointer-events-none transform-gpu",
        className,
      )}
    >
      <svg
        viewBox="0 0 360 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient
            id="supportBlob"
            x1="42"
            y1="20"
            x2="320"
            y2="292"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#EDE9FE" />
            <stop offset="55%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#CFFAFE" />
          </linearGradient>

          <linearGradient
            id="supportBlazer"
            x1="112"
            y1="206"
            x2="254"
            y2="300"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient
            id="supportScreen"
            x1="228"
            y1="182"
            x2="318"
            y2="250"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#211A45" />
            <stop offset="100%" stopColor="#120F2A" />
          </linearGradient>

          <radialGradient id="supportGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Organic backdrop */}
        <path
          d="M45 256C12 214 20 130 70 76C120 22 212 8 278 42C344 76 362 156 330 218C298 280 216 300 152 288C108 280 72 290 45 256Z"
          fill="url(#supportBlob)"
        />
        <circle cx="184" cy="156" r="132" fill="url(#supportGlow)" />

        {/* Floating chat bubbles */}
        <motion.g animate={float} transition={floatTransition(4.6, 0.2)}>
          <rect
            x="34"
            y="46"
            width="74"
            height="48"
            rx="16"
            fill="#FFFFFF"
            stroke="#8B5CF6"
            strokeWidth="2.4"
          />
          <path d="M52 94L48 106L66 96" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="56" cy="70" r="3.4" fill="#A78BFA" />
          <circle cx="71" cy="70" r="3.4" fill="#A78BFA" />
          <circle cx="86" cy="70" r="3.4" fill="#A78BFA" />
        </motion.g>

        <motion.g animate={float} transition={floatTransition(5.4, 1.1)}>
          <rect
            x="276"
            y="58"
            width="54"
            height="42"
            rx="14"
            fill="#D1FAE5"
            stroke="#10B981"
            strokeWidth="2.4"
          />
          <path
            d="M290 79L298 87L316 69"
            stroke="#059669"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Person */}
        <g>
          {/* Neck — drawn before the torso so the collar overlaps it cleanly */}
          <rect x="168" y="148" width="24" height="56" rx="10" fill="#A66A4C" />

          {/* Torso / blazer */}
          <path
            d="M108 300C105 246 116 210 150 196C160 192 200 192 210 196C244 210 255 246 252 300Z"
            fill="url(#supportBlazer)"
          />

          {/* Shirt + collar */}
          <path
            d="M166 196L180 228L194 196C188 192 172 192 166 196Z"
            fill="#F5F3FF"
          />
          <path
            d="M166 196L180 228M194 196L180 228"
            stroke="#DDD6FE"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Back hair */}
          <ellipse cx="180" cy="122" rx="38" ry="40" fill="#241A33" />

          {/* Waving arm */}
          <motion.g
            animate={wave}
            transition={floatTransition(3.2)}
            style={{
              transformOrigin: "138px 218px",
              transformBox: "view-box",
            }}
          >
            <path
              d="M141 226C127 212 115 196 106 176"
              stroke="#6D28D9"
              strokeWidth="19"
              strokeLinecap="round"
            />
            <circle cx="103" cy="169" r="10.5" fill="#B77A58" />
            <path
              d="M94 166C90 162 88 158 89 155"
              stroke="#B77A58"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Resting arm toward the laptop */}
          <path
            d="M219 222C232 232 241 244 246 258"
            stroke="#6D28D9"
            strokeWidth="17"
            strokeLinecap="round"
          />
          <circle cx="248" cy="262" r="9" fill="#B77A58" />

          {/* Face */}
          <ellipse cx="180" cy="126" rx="29" ry="32" fill="#B77A58" />
          <circle cx="151" cy="127" r="6.5" fill="#A66A4C" />
          <circle cx="209" cy="127" r="6.5" fill="#A66A4C" />

          {/* Hairline */}
          <path
            d="M152 118C152 97 164 86 181 86C198 86 209 99 208 120C202 107 194 101 181 101C168 101 159 107 152 118Z"
            fill="#241A33"
          />
          <path
            d="M151 119C147 131 149 143 156 151"
            stroke="#241A33"
            strokeWidth="4.2"
            strokeLinecap="round"
          />

          {/* Brows */}
          <path
            d="M162 111C166 108 171 108 175 110"
            stroke="#241A33"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M185 110C189 108 194 108 198 111"
            stroke="#241A33"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Eyes & smile */}
          <circle cx="169" cy="122" r="2.4" fill="#241A33" />
          <circle cx="191" cy="122" r="2.4" fill="#241A33" />
          <path
            d="M174 137C178 141 184 141 188 136"
            stroke="#241A33"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="157" cy="135" r="5" fill="#F472B6" opacity="0.2" />
          <circle cx="203" cy="135" r="5" fill="#F472B6" opacity="0.2" />

          {/* Headset */}
          <path
            d="M143 116C143 82 158 68 181 68C204 68 219 82 219 116"
            stroke="#312E81"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect
            x="136"
            y="112"
            width="17"
            height="26"
            rx="8"
            fill="#4C1D95"
            stroke="#312E81"
            strokeWidth="2.8"
          />
          <rect
            x="209"
            y="112"
            width="17"
            height="26"
            rx="8"
            fill="#4C1D95"
            stroke="#312E81"
            strokeWidth="2.8"
          />
          <path
            d="M219 137C219 151 209 159 198 161"
            stroke="#312E81"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <rect
            x="190"
            y="156"
            width="14"
            height="9"
            rx="4.5"
            fill="#312E81"
          />
        </g>

        {/* Desk */}
        <rect x="26" y="248" width="308" height="14" rx="7" fill="#C4B5FD" />
        <rect x="40" y="262" width="280" height="7" rx="3.5" fill="#DDD6FE" />

        {/* Laptop / support console */}
        <g>
          <rect
            x="226"
            y="176"
            width="98"
            height="68"
            rx="12"
            fill="url(#supportScreen)"
            stroke="#8B5CF6"
            strokeWidth="3.2"
          />
          <rect x="236" y="186" width="78" height="48" rx="7" stroke="#A78BFA" strokeWidth="1.2" opacity="0.4" />
          <rect x="241" y="193" width="34" height="6" rx="3" fill="#67E8F9" opacity="0.9" />
          <rect x="241" y="205" width="56" height="5" rx="2.5" fill="#C4B5FD" opacity="0.65" />
          <rect x="241" y="215" width="44" height="5" rx="2.5" fill="#A5F3FC" opacity="0.55" />
          <circle cx="303" cy="214" r="9" fill="#D1FAE5" />
          <path d="M299 214L302 217L308 210" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="214" y="244" width="122" height="8" rx="4" fill="#8B5CF6" />
        </g>

        {/* Sparkles */}
        <motion.g
          animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
          transition={floatTransition(3.4)}
        >
          <path
            d="M120 54C120 60 116 64 110 64C116 64 120 68 120 74C120 68 124 64 130 64C124 64 120 60 120 54Z"
            fill="#8B5CF6"
          />
          <path
            d="M300 22C300 27 297 30 292 30C297 30 300 33 300 38C300 33 303 30 308 30C303 30 300 27 300 22Z"
            fill="#22D3EE"
          />
          <circle cx="110" cy="236" r="3.4" fill="#FBBF24" />
          <circle cx="336" cy="148" r="3.4" fill="#F472B6" />
        </motion.g>
      </svg>
    </div>
  );
}
