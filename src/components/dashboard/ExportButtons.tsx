"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface ExportButtonsProps {
  previewRef: React.RefObject<HTMLElement | null>;
  filename: string;
}

export default function ExportButtons({
  previewRef,
  filename,
}: ExportButtonsProps) {
  const { t } = useI18n();
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);

  const handleExport = async (format: "png" | "pdf") => {
    if (!previewRef.current) return;
    setExporting(format);

    try {
      const { exportToPng, exportToPdf } = await import("@/lib/export");
      if (format === "png") {
        await exportToPng(previewRef.current, filename);
      } else {
        await exportToPdf(previewRef.current, filename);
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("png")}
        disabled={exporting !== null}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {exporting === "png" ? t.common.loading : t.dashboard.exportPng}
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={exporting !== null}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        {exporting === "pdf" ? t.common.loading : t.dashboard.exportPdf}
      </button>
    </div>
  );
}
