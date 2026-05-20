"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, toggleLocale, t } = useI18n();

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary"
    >
      <span className={locale === "he" ? "font-bold" : ""}>
        {t.common.hebrew}
      </span>
      <span className="text-text-muted">|</span>
      <span className={locale === "en" ? "font-bold" : ""}>
        {t.common.english}
      </span>
    </button>
  );
}
