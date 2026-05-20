"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import he from "./he.json";
import en from "./en.json";

type Locale = "he" | "en";
type Dictionary = typeof he;

const dictionaries: Record<Locale, Dictionary> = { he, en };

interface I18nContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("he");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "he" ? "rtl" : "ltr";
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "he" ? "en" : "he");
  }, [locale, setLocale]);

  const value: I18nContextValue = {
    locale,
    dir: locale === "he" ? "rtl" : "ltr",
    t: dictionaries[locale],
    setLocale,
    toggleLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
