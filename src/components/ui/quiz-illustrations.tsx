"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/utils";

/**
 * A hand-drawn style lecturer walking a learner through a quiz board.
 * The artwork keeps its own warm palette so it stays legible in dark mode.
 */
export function QuizLecturerIllustration({
  className,
}: {
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const float = reduceMotion
    ? undefined
    : {
        y: [0, -7, 0],
      };
  const floatTransition = (duration: number, delay = 0) =>
    reduceMotion
      ? undefined
      : {
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut" as const,
        };

  return (
    <div
      className={cn(
        "relative select-none pointer-events-none transform-gpu",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 380 322"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient
            id="quizLecturerBlob"
            x1="54"
            y1="38"
            x2="332"
            y2="304"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#EDE9FE" />
            <stop offset="52%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#CFFAFE" />
          </linearGradient>

          <linearGradient
            id="quizLecturerBlazer"
            x1="250"
            y1="200"
            x2="332"
            y2="314"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient
            id="quizLecturerBoard"
            x1="30"
            y1="50"
            x2="246"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#211A45" />
            <stop offset="100%" stopColor="#120F2A" />
          </linearGradient>

          <radialGradient
            id="quizLecturerGlow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft organic backdrop */}
        <path
          d="M55 293C15 247 13 156 57 93C101 30 196 11 268 39C340 67 374 142 354 213C334 284 259 321 179 316C127 313 85 322 55 293Z"
          fill="url(#quizLecturerBlob)"
        />
        <circle cx="196" cy="166" r="146" fill="url(#quizLecturerGlow)" />

        {/* Chalkboard card */}
        <g>
          <rect
            x="30"
            y="58"
            width="232"
            height="174"
            rx="22"
            fill="#0B0815"
            opacity="0.22"
          />
          <rect
            x="20"
            y="48"
            width="232"
            height="174"
            rx="22"
            fill="url(#quizLecturerBoard)"
            stroke="#8B5CF6"
            strokeWidth="4"
          />
          <rect
            x="33"
            y="61"
            width="206"
            height="148"
            rx="13"
            stroke="#A78BFA"
            strokeWidth="1.4"
            opacity="0.35"
          />

          <text
            x="46"
            y="83"
            fill="#67E8F9"
            fontFamily="Poppins, ui-sans-serif, system-ui, sans-serif"
            fontSize="11"
            fontWeight="700"
            letterSpacing="2.6"
          >
            QUIZ TIME
          </text>

          <circle
            cx="137"
            cy="137"
            r="38"
            stroke="#A78BFA"
            strokeWidth="2.6"
            strokeDasharray="6 7"
            opacity="0.9"
          />
          <text
            x="137"
            y="154"
            fill="#F5F3FF"
            fontFamily="Poppins, ui-sans-serif, system-ui, sans-serif"
            fontSize="52"
            fontWeight="700"
            textAnchor="middle"
          >
            ?
          </text>

          <rect
            x="46"
            y="184"
            width="166"
            height="16"
            rx="8"
            fill="#312A5C"
          />
          <circle cx="56" cy="192" r="4" fill="#A78BFA" />
          <rect
            x="66"
            y="189"
            width="92"
            height="6"
            rx="3"
            fill="#C4B5FD"
            opacity="0.55"
          />

          <rect
            x="46"
            y="206"
            width="166"
            height="16"
            rx="8"
            fill="#1E3A46"
          />
          <circle cx="56" cy="214" r="4" fill="#22D3EE" />
          <rect
            x="66"
            y="211"
            width="72"
            height="6"
            rx="3"
            fill="#A5F3FC"
            opacity="0.6"
          />
          <path
            d="M196 210L200 214L207 206"
            stroke="#34D399"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Lecturer */}
        <g>
          {/* Hair bun and back hair */}
          <circle cx="311" cy="80" r="18" fill="#241A33" />
          <path
            d="M306 63C316 69 321 82 317 94"
            stroke="#4C1D95"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <ellipse cx="290" cy="116" rx="31" ry="34" fill="#241A33" />

          {/* Neck and shoulders — trimmed further so the head sits naturally on the collar */}
          <rect
            x="279"
            y="148"
            width="22"
            height="44"
            rx="9"
            fill="#A66A4C"
          />
          <path
            d="M250 306C247 254 252 196 270 184C278 178 299 178 307 184C325 196 330 254 327 314Z"
            fill="url(#quizLecturerBlazer)"
          />

          {/* Blouse and collar */}
          <path
            d="M278 184L289 211L301 184C296 181 283 181 278 184Z"
            fill="#F5F3FF"
          />
          <path
            d="M278 184L289 211M301 184L289 211"
            stroke="#DDD6FE"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Pointing arm */}
          <path
            d="M259 217C248 207 241 196 229 183"
            stroke="#6D28D9"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <circle cx="225" cy="179" r="9" fill="#A66A4C" />

          {/* Pointer stick */}
          <motion.g
            animate={reduceMotion ? undefined : { rotate: [-5, 4, -5] }}
            transition={floatTransition(3.4)}
            style={{
              transformOrigin: "225px 179px",
              transformBox: "view-box",
            }}
          >
            <path
              d="M225 179L179 124"
              stroke="#FBBF24"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="179" cy="124" r="4" fill="#FDE68A" />
          </motion.g>

          {/* Clipboard arm */}
          <path
            d="M318 224C330 237 337 250 340 263"
            stroke="#6D28D9"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle cx="341" cy="268" r="8.5" fill="#A66A4C" />

          {/* Face */}
          <ellipse cx="290" cy="119" rx="25" ry="28" fill="#B77A58" />
          <circle cx="264" cy="121" r="6" fill="#A66A4C" />
          <circle cx="316" cy="121" r="6" fill="#A66A4C" />
          <circle cx="264" cy="130" r="2.6" fill="#FBBF24" />

          {/* Hairline */}
          <path
            d="M266 111C266 92 276 82 291 82C306 82 315 94 314 113C309 101 302 95 291 95C279 95 272 100 266 111Z"
            fill="#241A33"
          />
          <path
            d="M266 112C263 123 264 134 270 142"
            stroke="#241A33"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Brows */}
          <path
            d="M274 106C278 103 283 103 287 105"
            stroke="#241A33"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M295 105C299 103 304 103 308 106"
            stroke="#241A33"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Glasses */}
          <circle
            cx="281"
            cy="117"
            r="9"
            fill="#FFFFFF"
            fillOpacity="0.18"
            stroke="#241A33"
            strokeWidth="2.4"
          />
          <circle
            cx="302"
            cy="117"
            r="9"
            fill="#FFFFFF"
            fillOpacity="0.18"
            stroke="#241A33"
            strokeWidth="2.4"
          />
          <path
            d="M290 117H293"
            stroke="#241A33"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M272 116L264 119M311 116L316 119"
            stroke="#241A33"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Eyes & smile */}
          <circle cx="281" cy="118" r="2.2" fill="#241A33" />
          <circle cx="302" cy="118" r="2.2" fill="#241A33" />
          <path
            d="M288 126C288 129 290 130 292 130"
            stroke="#8C5138"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M283 136C287 140 295 140 299 135"
            stroke="#241A33"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="271" cy="131" r="4.5" fill="#F472B6" opacity="0.2" />
          <circle cx="309" cy="131" r="4.5" fill="#F472B6" opacity="0.2" />

          {/* Clipboard */}
          <g transform="rotate(7 344 276)">
            <rect
              x="325"
              y="250"
              width="40"
              height="54"
              rx="7"
              fill="#FFFFFF"
              stroke="#241A33"
              strokeWidth="2.6"
            />
            <rect
              x="336"
              y="246"
              width="18"
              height="8"
              rx="3"
              fill="#A78BFA"
              stroke="#241A33"
              strokeWidth="2"
            />
            <path
              d="M333 264L337 268L343 260M333 276L337 280L343 272M333 288L337 292L343 284"
              stroke="#10B981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M347 264H357M347 276H357M347 288H357"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Floating question bubble */}
        <motion.g
          animate={float}
          transition={floatTransition(4.2, 0.2)}
        >
          <circle
            cx="34"
            cy="38"
            r="19"
            fill="#FFFFFF"
            stroke="#8B5CF6"
            strokeWidth="3"
          />
          <text
            x="34"
            y="46"
            fill="#7C3AED"
            fontFamily="Poppins, ui-sans-serif, system-ui, sans-serif"
            fontSize="21"
            fontWeight="700"
            textAnchor="middle"
          >
            ?
          </text>
        </motion.g>

        {/* Floating grade badge */}
        <motion.g
          animate={float}
          transition={floatTransition(4.8, 1.1)}
        >
          <circle
            cx="344"
            cy="42"
            r="23"
            fill="#FDE68A"
            stroke="#F59E0B"
            strokeWidth="3"
          />
          <text
            x="344"
            y="50"
            fill="#92400E"
            fontFamily="Poppins, ui-sans-serif, system-ui, sans-serif"
            fontSize="19"
            fontWeight="700"
            textAnchor="middle"
          >
            A+
          </text>
        </motion.g>

        {/* Floating success bubble */}
        <motion.g
          animate={float}
          transition={floatTransition(5.1, 0.6)}
        >
          <circle
            cx="50"
            cy="264"
            r="21"
            fill="#D1FAE5"
            stroke="#10B981"
            strokeWidth="3"
          />
          <path
            d="M41 264L47 270L59 256"
            stroke="#059669"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Sparkles */}
        <motion.g
          animate={
            reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }
          }
          transition={floatTransition(3.2)}
        >
          <path
            d="M238 34C238 40 234 44 228 44C234 44 238 48 238 54C238 48 242 44 248 44C242 44 238 40 238 34Z"
            fill="#8B5CF6"
          />
          <path
            d="M366 140C366 145 363 148 358 148C363 148 366 151 366 156C366 151 369 148 374 148C369 148 366 145 366 140Z"
            fill="#22D3EE"
          />
          <path
            d="M172 286C172 291 169 294 164 294C169 294 172 297 172 302C172 297 175 294 180 294C175 294 172 291 172 286Z"
            fill="#FBBF24"
          />
          <circle cx="152" cy="48" r="3.4" fill="#F472B6" />
          <circle cx="264" cy="300" r="3.4" fill="#8B5CF6" />
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * Smooth animated question mark for quiz hero section.
 * Features gentle float, subtle pulse, and a satisfying bounce-in animation.
 */
export function QuizQuestionMark({
  className,
}: {
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const float = reduceMotion
    ? undefined
    : { y: [0, -8, 0] };
  const floatTransition = reduceMotion
    ? undefined
    : { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const };

  const pulse = reduceMotion
    ? undefined
    : { opacity: [0.8, 1, 0.8] };
  const pulseTransition = reduceMotion
    ? undefined
    : { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div
      className={cn("relative select-none pointer-events-none", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient
            id="qmGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient
            id="qmGlow"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </linearGradient>
          <filter id="qmShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#8B5CF6" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer glow ring - pulse */}
        {reduceMotion ? (
          <circle cx="60" cy="60" r="48" fill="url(#qmGlow)" opacity="0.2" />
        ) : (
          <motion.circle
            cx="60"
            cy="60"
            r={48}
            fill="url(#qmGlow)"
            animate={{ r: [48, 52, 48], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Main question mark shape - float */}
        <motion.g
          filter="url(#qmShadow)"
          animate={float}
          transition={floatTransition}
        >
          {/* Dot - animated bounce */}
          {reduceMotion ? (
            <circle cx="60" cy="92" r="8" fill="url(#qmGradient)" />
          ) : (
            <motion.circle
              cx="60"
              cy="92"
              r={8}
              fill="url(#qmGradient)"
              animate={{ scale: [1, 1.15, 1], y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Curve - animated draw */}
          {reduceMotion ? (
            <path
              d="M60 24 C60 24 60 32 60 44 C60 56 68 64 68 74 C68 82 60 86 52 86 C44 86 38 80 36 72"
              stroke="url(#qmGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{ pathLength: 1 } as React.CSSProperties }
            />
          ) : (
            <motion.path
              d="M60 24 C60 24 60 32 60 44 C60 56 68 64 68 74 C68 82 60 86 52 86 C44 86 38 80 36 72"
              stroke="url(#qmGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              animate={{ pathLength: [0, 1, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ pathLength: 1 }}
            />
          )}
        </motion.g>

        {/* Sparkle accents */}
        {reduceMotion ? (
          <>
            <path
              d="M28 30 C28 34 26 36 22 36 C26 36 28 38 28 42 C28 38 30 36 34 36 C30 36 28 34 28 30 Z"
              fill="#F472B6"
              opacity="0.8"
            />
            <path
              d="M90 90 C90 94 88 96 84 96 C88 96 90 98 90 102 C90 98 92 96 96 96 C92 96 90 94 90 90 Z"
              fill="#22D3EE"
              opacity="0.8"
            />
            <circle cx="92" cy="28" r="3" fill="#FBBF24" opacity="0.9" />
          </>
        ) : (
          <motion.g
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M28 30 C28 34 26 36 22 36 C26 36 28 38 28 42 C28 38 30 36 34 36 C30 36 28 34 28 30 Z"
              fill="#F472B6"
              opacity="0.8"
            />
            <path
              d="M90 90 C90 94 88 96 84 96 C88 96 90 98 90 102 C90 98 92 96 96 96 C92 96 90 94 90 90 Z"
              fill="#22D3EE"
              opacity="0.8"
            />
            <circle cx="92" cy="28" r="3" fill="#FBBF24" opacity="0.9" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
