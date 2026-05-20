"use client";

import Header from "@/components/layout/Header";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-medium text-primary">marketing</span>
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="inline-block h-2 w-2 rounded-full bg-teal" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary">insight</h1>
        <p className="text-lg text-text-secondary">{t.submission.title}</p>
      </main>
    </>
  );
}
