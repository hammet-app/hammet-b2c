"use client";

import React from "react";

interface DoodleProps {
  className?: string;
  accentColor?: string; // Color for the sweater/shirt or accent fill (e.g. Hammet purple #8B5CF6 or coral #EC4899)
  inkColor?: string; // Stroke line color (default #17131F or current theme)
}

/**
 * DoodleReading
 * Matches Reference Image 5 (center-bottom): Person sitting on chair reading a book with a stack of books beside them.
 */
export function DoodleReading({
  className = "w-48 h-48",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Stack of books on the floor */}
        <g stroke={inkColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="white">
          {/* Floor book open */}
          <path d="M 235 255 L 255 250 L 265 255 L 245 260 Z" />
          {/* Bottom book in stack */}
          <rect x="210" y="240" width="45" height="8" rx="2" fill="white" />
          {/* Middle book */}
          <rect x="213" y="232" width="42" height="7" rx="2" fill={accentColor} fillOpacity="0.3" />
          {/* Top book */}
          <rect x="212" y="224" width="40" height="7" rx="2" fill="white" />
        </g>

        {/* Chair Frame */}
        <g stroke={inkColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Chair backrest */}
          <path d="M 185 185 L 195 260" />
          <path d="M 160 215 L 165 265" />
          <ellipse cx="175" cy="215" rx="26" ry="10" fill="white" />
          <path d="M 195 185 C 190 155 188 140 188 135" />
        </g>

        {/* Legs & Feet (Black Trousers) */}
        <path
          d="M 170 210 C 160 210 140 205 130 215 C 120 225 110 240 95 250 C 90 253 82 258 75 258 C 70 258 72 263 78 263 C 90 263 105 252 118 240 C 130 230 145 220 168 220 Z"
          fill={inkColor}
        />
        <path
          d="M 180 215 C 170 225 155 235 145 250 C 140 258 135 265 125 265 C 120 265 122 270 128 270 C 140 270 152 258 162 242 C 170 230 178 222 185 220 Z"
          fill={inkColor}
        />

        {/* Torso / Shirt (Accent Colored Fill from Image 5) */}
        <path
          d="M 175 145 C 170 155 162 170 158 185 C 155 195 158 205 170 210 C 180 210 185 198 188 185 C 192 168 190 155 182 145 Z"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Arms & Hands holding the Book */}
        <path
          d="M 175 150 C 165 155 150 162 145 175 C 142 182 148 188 158 185"
          fill="none"
          stroke={inkColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 185 150 C 195 158 198 170 188 180"
          fill="none"
          stroke={inkColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* The Open Book */}
        <g stroke={inkColor} strokeWidth="3" strokeLinejoin="round" fill="white">
          <path d="M 160 170 L 150 160 L 165 155 L 172 165 Z" />
          <path d="M 172 165 L 180 155 L 192 162 L 182 172 Z" />
          <path d="M 172 165 L 172 175" />
        </g>

        {/* Head & Hair */}
        {/* Head Skin */}
        <ellipse cx="178" cy="125" rx="10" ry="13" fill="white" stroke={inkColor} strokeWidth="2.5" />
        {/* Eye & Brow */}
        <circle cx="175" cy="126" r="1.5" fill={inkColor} />
        <path d="M 173 122 Q 176 120 178 122" stroke={inkColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Hair (Wavy Black) */}
        <path
          d="M 170 115 C 165 118 163 125 165 132 C 167 135 172 138 170 142 C 168 145 163 145 160 142 C 158 135 160 120 170 112 C 178 106 190 112 188 122 C 187 125 185 125 182 120 C 180 115 174 112 170 115 Z"
          fill={inkColor}
        />
      </svg>
    </div>
  );
}

/**
 * DoodleRunning
 * Matches Reference Image 5 (top-center): Person in colored sweater leaping/sprinting forward with hair flowing back and arm pointing ahead.
 */
export function DoodleRunning({
  className = "w-52 h-48",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 320 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Flowing Hair Wind Trails */}
        <path d="M 100 85 Q 90 85 85 82" stroke={inkColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M 190 145 Q 185 148 180 145" stroke={inkColor} strokeWidth="2" strokeLinecap="round" />

        {/* Back Leg with Sneaker */}
        <path
          d="M 135 160 C 125 165 110 180 100 195 C 96 202 92 210 90 220"
          stroke={inkColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Sneaker Back */}
        <path
          d="M 85 220 L 98 215 L 105 228 L 88 232 Z"
          fill="white"
          stroke={inkColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Front Leg (Bent in Run) */}
        <path
          d="M 155 155 C 165 165 175 180 165 198 C 158 210 145 220 135 228"
          stroke={inkColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Sneaker Front */}
        <path
          d="M 130 228 L 142 222 L 150 236 L 126 238 Z"
          fill="white"
          stroke={inkColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Swept Back Left Arm */}
        <path
          d="M 140 120 C 120 122 105 135 95 145"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <ellipse cx="92" cy="147" rx="5" ry="3" fill="white" stroke={inkColor} strokeWidth="2.5" />

        {/* Torso / Wind-Swept Sweater (Accent Color) */}
        <path
          d="M 130 115 C 145 105 165 108 178 115 C 185 120 175 145 165 160 C 150 162 135 158 130 145 C 125 135 125 122 130 115 Z"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Outstretched Right Arm Pointing Forward */}
        <path
          d="M 170 120 C 190 122 220 130 245 138 C 255 142 262 145 268 147"
          stroke={accentColor}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M 170 120 C 190 122 220 130 245 138 C 255 142 262 145 268 147"
          stroke={inkColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Pointing Hand */}
        <path
          d="M 268 147 Q 275 148 278 146 Q 275 152 268 152 Z"
          fill="white"
          stroke={inkColor}
          strokeWidth="2"
        />

        {/* Head */}
        <ellipse cx="180" cy="100" rx="9" ry="11" fill="white" stroke={inkColor} strokeWidth="2.5" />
        <circle cx="184" cy="99" r="1.5" fill={inkColor} />

        {/* Long Streamlined Black Hair flying back */}
        <path
          d="M 180 92 C 170 85 140 85 115 95 C 105 100 108 108 120 108 C 140 105 165 108 175 108 Z"
          fill={inkColor}
        />
      </svg>
    </div>
  );
}

/**
 * DoodleCoffee
 * Matches Reference Image 5 (top-right): Person carrying a giant coffee mug with splash.
 */
export function DoodleCoffee({
  className = "w-52 h-48",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 300 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Coffee Splashing Out in Big Inky Wave */}
        <path
          d="M 180 75 C 170 50 150 40 135 45 C 120 50 122 65 130 70 C 140 75 145 85 135 95 C 125 105 115 110 105 100 C 98 90 105 75 115 70 C 105 60 90 65 85 80 C 80 100 95 125 120 135 C 145 140 170 120 185 95 Z"
          fill={inkColor}
        />
        {/* Flying Droplets */}
        <circle cx="100" cy="50" r="3" fill={inkColor} />
        <circle cx="85" cy="115" r="2.5" fill={inkColor} />
        <circle cx="75" cy="130" r="2" fill={inkColor} />
        <circle cx="195" cy="40" r="3.5" fill={inkColor} />

        {/* Giant Coffee Mug */}
        <g stroke={inkColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="white">
          {/* Mug Rim */}
          <ellipse cx="210" cy="85" rx="36" ry="16" />
          {/* Mug Body */}
          <path d="M 174 85 C 180 125 190 155 210 165 C 230 155 240 125 246 85" fill="white" />
          {/* Mug Handle */}
          <path d="M 242 100 C 260 105 262 135 238 140" fill="none" strokeWidth="4" />
        </g>

        {/* Legs running underneath mug */}
        <path
          d="M 200 175 C 215 190 230 205 248 215"
          stroke={inkColor}
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Shoe right */}
        <path d="M 245 215 L 258 210 L 262 225 L 242 225 Z" fill="white" stroke={inkColor} strokeWidth="2.5" />

        <path
          d="M 185 175 C 175 190 165 205 150 218"
          stroke={inkColor}
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Shoe left */}
        <path d="M 145 218 L 158 212 L 160 226 L 140 226 Z" fill="white" stroke={inkColor} strokeWidth="2.5" />

        {/* Person's Torso hugging the mug */}
        <path
          d="M 175 130 C 165 140 165 160 175 175 C 190 175 200 168 205 155 C 205 140 195 130 175 130 Z"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="3"
        />

        {/* Head peeking from behind the mug */}
        <circle cx="165" cy="120" r="10" fill="white" stroke={inkColor} strokeWidth="2.5" />
        <circle cx="163" cy="119" r="1.5" fill={inkColor} />
        <path d="M 160 115 C 163 110 170 112 172 118" stroke={inkColor} strokeWidth="2.5" />

        {/* Arm wrapped tightly around mug */}
        <path
          d="M 170 145 C 185 150 205 150 215 135"
          fill="none"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * DoodleFloat
 * Matches Reference Image 5 (middle-left): Person floating horizontally in mid-air with relaxed posture.
 */
export function DoodleFloat({
  className = "w-52 h-44",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Legs floating horizontal/arched */}
        <path
          d="M 50 170 C 60 150 80 135 110 130 C 130 128 145 135 160 145"
          stroke={inkColor}
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Bare Feet */}
        <path d="M 45 175 C 40 172 45 165 52 168 Z" fill="white" stroke={inkColor} strokeWidth="2" />

        {/* Torso floating with arch */}
        <path
          d="M 140 140 C 155 125 180 125 205 135 C 220 145 230 160 215 170 C 190 175 160 165 140 140 Z"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="3"
        />

        {/* Arms outstretched floating down */}
        <path
          d="M 155 135 C 145 150 135 168 125 180"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 205 140 C 215 155 225 170 235 180"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Head tilted backwards */}
        <ellipse cx="225" cy="135" rx="10" ry="12" fill="white" stroke={inkColor} strokeWidth="2.5" />
        <path d="M 228 132 Q 231 133 234 132" stroke={inkColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Long hair flowing downward */}
        <path
          d="M 225 145 C 235 160 245 175 255 180 C 260 182 265 175 255 165 C 248 155 240 145 235 138 Z"
          fill={inkColor}
        />
      </svg>
    </div>
  );
}

/**
 * DoodleDog
 * Matches Reference Image 5 (top-left): Person sitting cross-legged with spotted dog.
 */
export function DoodleDog({
  className = "w-52 h-48",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* ── Person Sitting Cross-legged ── */}
        {/* Legs crossed on floor */}
        <path
          d="M 65 240 C 75 220 95 210 120 215 C 135 220 140 235 125 245 C 105 250 80 250 65 240 Z"
          fill="none"
          stroke={inkColor}
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Sneakers */}
        <ellipse cx="70" cy="245" rx="10" ry="6" fill="white" stroke={inkColor} strokeWidth="2" />
        <ellipse cx="130" cy="245" rx="10" ry="6" fill="white" stroke={inkColor} strokeWidth="2" />

        {/* Torso */}
        <path
          d="M 95 160 C 90 180 92 205 100 220 C 115 220 125 210 125 190 C 125 170 120 160 95 160 Z"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="3"
        />

        {/* Arm reaching out to pet dog */}
        <path
          d="M 115 170 C 135 170 155 172 175 165"
          fill="none"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Hand petting */}
        <ellipse cx="178" cy="164" rx="5" ry="3" fill="white" stroke={inkColor} strokeWidth="2" />

        {/* Head (Bald / Clean hair with friendly face) */}
        <circle cx="108" cy="140" r="12" fill="white" stroke={inkColor} strokeWidth="2.5" />
        <circle cx="113" cy="138" r="1.5" fill={inkColor} />
        <path d="M 110 144 Q 114 148 118 144" stroke={inkColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* ── Friendly Spotted Dog ── */}
        <g stroke={inkColor} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="white">
          {/* Dog Body */}
          <path d="M 190 245 C 185 210 188 180 195 165 C 205 160 215 168 220 185 C 225 205 228 230 230 245 Z" />
          {/* Dog Head */}
          <path d="M 195 165 C 190 150 192 135 205 130 C 215 130 225 140 220 155 C 215 165 205 168 195 165 Z" />
          {/* Dog Snout & Nose */}
          <path d="M 195 142 C 185 140 180 145 185 152 C 190 155 195 152 195 148 Z" />
          <circle cx="184" cy="144" r="2.5" fill={inkColor} />
          {/* Dog Droopy Ear */}
          <path d="M 215 135 C 225 145 225 165 218 170" fill={accentColor} fillOpacity="0.4" />
          {/* Dog Tail wagging */}
          <path d="M 230 225 C 245 215 255 200 250 185" fill="none" strokeWidth="3.5" />
          {/* Dog Paws */}
          <ellipse cx="192" cy="248" rx="8" ry="4" />
          <ellipse cx="225" cy="248" rx="8" ry="4" />
        </g>
        {/* Purple Accent Spots on Dog (Matching Image 5) */}
        <circle cx="205" cy="190" r="7" fill={accentColor} fillOpacity="0.5" />
        <circle cx="215" cy="215" r="5" fill={accentColor} fillOpacity="0.5" />
        <circle cx="200" cy="225" r="4" fill={accentColor} fillOpacity="0.5" />
      </svg>
    </div>
  );
}

/**
 * DoodleGroovy
 * Matches Reference Image 5 (middle-right): Person walking with swagger and loose arms.
 */
export function DoodleGroovy({
  className = "w-48 h-48",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Groovy Sparkle Symbols */}
        <path d="M 230 160 L 235 155 L 240 160 L 235 165 Z" fill={accentColor} />
        <circle cx="70" cy="210" r="8" stroke={inkColor} strokeWidth="2.5" />
        <path d="M 68 180 Q 72 176 76 180" stroke={inkColor} strokeWidth="2" strokeLinecap="round" />

        {/* Back Leg with swagger bend */}
        <path
          d="M 125 180 C 130 200 135 225 150 240"
          stroke={inkColor}
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Back Shoe */}
        <path d="M 148 240 L 160 236 L 165 248 L 145 248 Z" fill="white" stroke={inkColor} strokeWidth="2" />

        {/* Front Leg kicked back */}
        <path
          d="M 115 180 C 105 195 95 210 82 225"
          stroke={inkColor}
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Front Shoe */}
        <path d="M 78 225 L 88 220 L 94 234 L 75 232 Z" fill="white" stroke={inkColor} strokeWidth="2" />

        {/* Torso swaying with groove */}
        <path
          d="M 120 120 C 130 130 135 155 125 180 C 115 180 110 160 110 140 C 110 125 115 120 120 120 Z"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="3"
        />

        {/* Left Arm loose & curved */}
        <path
          d="M 115 125 C 95 130 80 145 75 165"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Right Arm loose in groove */}
        <path
          d="M 125 125 C 145 130 165 145 170 165"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Head tilted with swagger */}
        <ellipse cx="140" cy="110" rx="9" ry="11" fill="white" stroke={inkColor} strokeWidth="2.5" />
        <circle cx="143" cy="108" r="1.5" fill={inkColor} />
        {/* Messy Hair */}
        <path
          d="M 135 102 C 140 95 150 96 152 104 C 150 108 142 108 135 102 Z"
          fill={inkColor}
        />
      </svg>
    </div>
  );
}

/**
 * DoodlePeekingCoder
 * Coder with headphones and glasses peeking over a card's top horizontal border line.
 * Hands grip the exact baseline at y=110 so it sits perfectly flush on top of any container.
 */
export function DoodlePeekingCoder({
  className = "w-32 h-24",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 200 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Head */}
        <path
          d="M 60 70 C 60 30 140 30 140 70 C 140 95 130 110 100 110 C 70 110 60 95 60 70 Z"
          fill="white"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Hair - Short texture */}
        <path
          d="M 64 52 C 72 32 100 24 136 38 C 132 44 126 42 120 46 C 114 42 104 46 98 42 C 92 46 84 44 78 50 C 72 48 66 52 64 52 Z"
          fill={inkColor}
        />

        {/* Headphones Band */}
        <path
          d="M 52 68 C 50 25 150 25 148 68"
          fill="none"
          stroke={accentColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Left Ear Cup */}
        <rect
          x="46"
          y="56"
          width="12"
          height="24"
          rx="6"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="2.5"
        />
        {/* Right Ear Cup */}
        <rect
          x="142"
          y="56"
          width="12"
          height="24"
          rx="6"
          fill={accentColor}
          stroke={inkColor}
          strokeWidth="2.5"
        />

        {/* Glasses */}
        <rect
          x="72"
          y="62"
          width="22"
          height="16"
          rx="5"
          fill="white"
          stroke={inkColor}
          strokeWidth="2.5"
        />
        <rect
          x="106"
          y="62"
          width="22"
          height="16"
          rx="5"
          fill="white"
          stroke={inkColor}
          strokeWidth="2.5"
        />
        <line x1="94" y1="68" x2="106" y2="68" stroke={inkColor} strokeWidth="2.5" />
        {/* Happy Eyes inside glasses */}
        <circle cx="83" cy="70" r="2.5" fill={inkColor} />
        <circle cx="117" cy="70" r="2.5" fill={inkColor} />
        {/* Eyebrows */}
        <path d="M 74 58 Q 83 54 92 58" stroke={inkColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M 108 58 Q 117 54 126 58" stroke={inkColor} strokeWidth="2" strokeLinecap="round" />

        {/* Big Smile */}
        <path
          d="M 88 88 Q 100 98 112 88"
          stroke={inkColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Left Hand gripping horizontal borderline at y=110 */}
        <g stroke={inkColor} strokeWidth="2.5" strokeLinecap="round" fill="white">
          <path d="M 42 110 C 42 96 49 96 52 110" />
          <path d="M 50 110 C 50 94 57 94 60 110" />
          <path d="M 58 110 C 58 96 65 96 68 110" />
          <path d="M 66 110 C 66 100 72 100 74 110" />
        </g>

        {/* Right Hand gripping horizontal borderline at y=110 */}
        <g stroke={inkColor} strokeWidth="2.5" strokeLinecap="round" fill="white">
          <path d="M 126 110 C 126 100 132 100 134 110" />
          <path d="M 132 110 C 132 96 139 96 142 110" />
          <path d="M 140 110 C 140 94 147 94 150 110" />
          <path d="M 148 110 C 148 96 155 96 158 110" />
        </g>
      </svg>
    </div>
  );
}

/**
 * DoodlePeekingGirl
 * Friendly student girl with high hair bun peeking over a card's top horizontal border line.
 * Hands grip the exact baseline at y=110.
 */
export function DoodlePeekingGirl({
  className = "w-32 h-26",
  accentColor = "#8B5CF6",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 200 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Top Hair Bun */}
        <circle
          cx="100"
          cy="26"
          r="18"
          fill={inkColor}
        />
        {/* Bun Scrunchie / Tie */}
        <ellipse cx="100" cy="40" rx="12" ry="4" fill={accentColor} />

        {/* Head */}
        <path
          d="M 64 72 C 64 42 136 42 136 72 C 136 96 126 110 100 110 C 74 110 64 96 64 72 Z"
          fill="white"
          stroke={inkColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Side Bangs / Hair Waved */}
        <path
          d="M 64 68 C 64 48 85 42 100 48 C 115 42 136 48 136 68 C 136 78 132 85 130 90 C 126 80 128 66 118 64 C 110 62 104 68 100 68 C 96 68 90 62 82 64 C 72 66 74 80 70 90 C 68 85 64 78 64 68 Z"
          fill={inkColor}
        />

        {/* Friendly Winking/Smiling Eyes */}
        <path
          d="M 78 72 Q 85 66 92 72"
          stroke={inkColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 108 72 Q 115 66 122 72"
          stroke={inkColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Cute Blushing Cheeks */}
        <ellipse cx="76" cy="82" rx="5" ry="3" fill="#EC4899" fillOpacity="0.4" />
        <ellipse cx="124" cy="82" rx="5" ry="3" fill="#EC4899" fillOpacity="0.4" />

        {/* Small Nose & Happy Smile */}
        <path d="M 100 76 Q 102 80 100 82" stroke={inkColor} strokeWidth="1.75" strokeLinecap="round" />
        <path
          d="M 92 88 Q 100 97 108 88"
          stroke={inkColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Left Hand gripping horizontal borderline at y=110 */}
        <g stroke={inkColor} strokeWidth="2.5" strokeLinecap="round" fill="white">
          <path d="M 46 110 C 46 96 53 96 56 110" />
          <path d="M 54 110 C 54 94 61 94 64 110" />
          <path d="M 62 110 C 62 96 69 96 72 110" />
        </g>

        {/* Right Hand gripping horizontal borderline at y=110 */}
        <g stroke={inkColor} strokeWidth="2.5" strokeLinecap="round" fill="white">
          <path d="M 128 110 C 128 96 135 96 138 110" />
          <path d="M 136 110 C 136 94 143 94 146 110" />
          <path d="M 144 110 C 144 96 151 96 154 110" />
        </g>
      </svg>
    </div>
  );
}

/**
 * DoodlePeekingBot
 * Friendly sleek AI robot companion peeking over a card's top horizontal border line.
 * Antenna with glowing signal pulse, cyan LED visor eyes, and mechanical fingers gripping at y=110.
 */
export function DoodlePeekingBot({
  className = "w-32 h-26",
  accentColor = "#06B6D4",
  inkColor = "#17131F",
}: DoodleProps) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 200 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Antenna */}
        <line x1="100" y1="46" x2="100" y2="22" stroke={inkColor} strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="18" r="7" fill={accentColor} stroke={inkColor} strokeWidth="2.5" />
        {/* Antenna Pulse Ring */}
        <circle cx="100" cy="18" r="12" stroke={accentColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

        {/* Robot Head Body */}
        <rect
          x="60"
          y="46"
          width="80"
          height="64"
          rx="22"
          fill="white"
          stroke={inkColor}
          strokeWidth="3.5"
        />

        {/* Visor Screen */}
        <rect
          x="70"
          y="56"
          width="60"
          height="30"
          rx="12"
          fill="#0F172A"
          stroke={inkColor}
          strokeWidth="2"
        />

        {/* Glowing Happy Curved Eyes */}
        <path
          d="M 80 72 Q 86 64 92 72"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 108 72 Q 114 64 120 72"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Speaker / Grille Mouth */}
        <line x1="88" y1="96" x2="112" y2="96" stroke={inkColor} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="92" y1="101" x2="108" y2="101" stroke={inkColor} strokeWidth="2" strokeLinecap="round" />

        {/* Ear Bolts */}
        <rect x="52" y="66" width="8" height="16" rx="3" fill={accentColor} stroke={inkColor} strokeWidth="2" />
        <rect x="140" y="66" width="8" height="16" rx="3" fill={accentColor} stroke={inkColor} strokeWidth="2" />

        {/* Mechanical Left Fingers gripping horizontal borderline at y=110 */}
        <g stroke={inkColor} strokeWidth="2.5" strokeLinecap="round" fill="white">
          <rect x="42" y="98" width="7" height="12" rx="3.5" />
          <rect x="50" y="95" width="7" height="15" rx="3.5" />
          <rect x="58" y="98" width="7" height="12" rx="3.5" />
        </g>

        {/* Mechanical Right Fingers gripping horizontal borderline at y=110 */}
        <g stroke={inkColor} strokeWidth="2.5" strokeLinecap="round" fill="white">
          <rect x="135" y="98" width="7" height="12" rx="3.5" />
          <rect x="143" y="95" width="7" height="15" rx="3.5" />
          <rect x="151" y="98" width="7" height="12" rx="3.5" />
        </g>
      </svg>
    </div>
  );
}


