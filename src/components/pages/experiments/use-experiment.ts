"use client";

import { useEffect, useState } from "react";
import { is_enabled } from "@/lib/features/flags";

export function useExperiment(featureKey: string, defaultVariant: "A" | "B" = "B"): "A" | "B" {
  const [variant, setVariant] = useState<"A" | "B">(defaultVariant);

  useEffect(() => {
    // 1. Allow URL query parameter override for QA, testing, and Playwright verification
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlOverride = params.get(`exp_${featureKey}`) || params.get("variant");
      if (urlOverride === "A" || urlOverride === "a") {
        setVariant("A");
        return;
      }
      if (urlOverride === "B" || urlOverride === "b") {
        setVariant("B");
        return;
      }
    }

    // 2. Evaluate from Growthbook / OpenFeature
    let isMounted = true;
    is_enabled(featureKey, true, defaultVariant)
      .then((val) => {
        if (!isMounted) return;
        if (val === "A" || val === "B") {
          setVariant(val);
        }
      })
      .catch((err) => {
        console.warn(`[Experiment] Failed to evaluate flag "${featureKey}":`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [featureKey]);

  return variant;
}

