"use client";

import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-slate-500 shadow-sm ring-1 ring-black/5 transition-all hover:bg-white/90 hover:text-slate-900 dark:bg-white/[0.04] dark:text-slate-400 dark:ring-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white",
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 0 : 1,
          opacity: theme === "dark" ? 0 : 1,
          rotate: theme === "dark" ? -90 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="h-[18px] w-[18px]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : 90,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="h-[18px] w-[18px]" />
      </motion.div>
    </button>
  );
}

