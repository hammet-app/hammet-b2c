"use client";

import { useEffect, useState } from "react";
import { isEnabled } from "@/lib/features/flags";

export function useFeatureFlag(key: string, defaultValue = false): boolean {
  const [enabled, setEnabled] = useState(defaultValue);

  useEffect(() => {
    let active = true;

    void isEnabled(key, false, "B", defaultValue).then((value) => {
      if (active && typeof value === "boolean") {
        setEnabled(value);
      }
    });

    return () => {
      active = false;
    };
  }, [key, defaultValue]);

  return enabled;
}
