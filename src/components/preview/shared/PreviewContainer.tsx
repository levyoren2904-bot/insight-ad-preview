"use client";

import { forwardRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface PreviewContainerProps {
  children: React.ReactNode;
}

const PreviewContainer = forwardRef<HTMLDivElement, PreviewContainerProps>(function PreviewContainer({ children }, ref) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div ref={ref} className="sticky top-6 rounded-xl border border-border bg-bg-subtle p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          {t.submission.livePreview}
        </h2>
        <div className="flex gap-1 rounded-lg bg-bg-light p-1">
          <button
            onClick={() => setMode("desktop")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === "desktop"
                ? "bg-primary text-white"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.common.desktop}
          </button>
          <button
            onClick={() => setMode("mobile")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === "mobile"
                ? "bg-primary text-white"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.common.mobile}
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            mode === "mobile" ? "max-w-[375px]" : "max-w-full"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

export default PreviewContainer;
