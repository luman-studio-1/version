"use client";

import { useEffect, useState } from "react";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  foreground: string;
}

const FALLBACK: ThemeColors = {
  primary: "#fe8f52",
  secondary: "#059494",
  accent: "#f2df7d",
  foreground: "#111827",
};

/** Reads brand color tokens from CSS custom properties so 3D materials stay
 * theme-safe instead of hardcoding hex values. */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(FALLBACK);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    setColors({
      primary: read("--primary", FALLBACK.primary),
      secondary: read("--secondary", FALLBACK.secondary),
      accent: read("--accent", FALLBACK.accent),
      foreground: read("--foreground", FALLBACK.foreground),
    });
  }, []);

  return colors;
}
