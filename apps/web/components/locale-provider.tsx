"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "zh-CN";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
}

const STORAGE_KEY = "fincloud-sentinel-locale";
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh-CN");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== "en" && stored !== "zh-CN") return;
    const frame = window.requestAnimationFrame(() => setLocale(stored));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    toggleLocale: () => {
      setLocale((current) => {
        const next = current === "en" ? "zh-CN" : "en";
        window.localStorage.setItem(STORAGE_KEY, next);
        return next;
      });
    },
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
