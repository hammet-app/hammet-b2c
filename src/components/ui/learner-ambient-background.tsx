/**
 * A deliberately light-weight ambient background for the learner shell.
 *
 * It only animates transforms on a handful of blurred gradient orbs, so the
 * compositor can keep it running without repainting page content. Animation is
 * disabled automatically for visitors who prefer reduced motion.
 */
export function LearnerAmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Soft base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.10),transparent_58%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.07),transparent_52%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.16),transparent_58%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.09),transparent_52%)]" />

      {/* Slow-drifting colour orbs */}
      <div className="learner-orb learner-orb-one absolute -left-32 top-[-10%] h-[420px] w-[420px] rounded-full bg-purple-400/20 blur-[90px] dark:bg-purple-600/20" />
      <div className="learner-orb learner-orb-two absolute -right-40 top-[18%] h-[460px] w-[460px] rounded-full bg-cyan-300/20 blur-[100px] dark:bg-cyan-500/16" />
      <div className="learner-orb learner-orb-three absolute bottom-[-18%] left-[22%] h-[480px] w-[480px] rounded-full bg-indigo-300/18 blur-[110px] dark:bg-indigo-600/18" />

      {/* Faint dot grid adds texture without an image request */}
      <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] dark:opacity-[0.055]" />

      {/* Top fade keeps the sticky header visually clean */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F5F3FF] to-transparent dark:from-[#0D0A17]" />
    </div>
  );
}
