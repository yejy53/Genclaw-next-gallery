"use client";

import { useEffect, useState } from "react";
import { copy, type Locale } from "@/lib/gallery";
import { MoonIcon, SunIcon } from "@/components/icons";

export const THEME_STORAGE_KEY = "genclaw-theme";

type Theme = "dark" | "light";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const t = copy[locale];
  // The inline script in the document head has already picked a theme; read it
  // back after mount so the markup stays identical between server and client.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setTheme(
        document.documentElement.dataset.theme === "light" ? "light" : "dark"
      )
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const apply = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Blocked storage costs persistence, not the switch itself.
    }
    setTheme(next);
  };

  return (
    <div className="theme-switch" role="group" aria-label={t.theme}>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        className={theme === "dark" ? "is-active" : undefined}
        onClick={() => apply("dark")}
        title={t.themeDark}
      >
        <MoonIcon size={13} />
        <span className="sr-only">{t.themeDark}</span>
      </button>
      <button
        type="button"
        aria-pressed={theme === "light"}
        className={theme === "light" ? "is-active" : undefined}
        onClick={() => apply("light")}
        title={t.themeLight}
      >
        <SunIcon size={13} />
        <span className="sr-only">{t.themeLight}</span>
      </button>
    </div>
  );
}
