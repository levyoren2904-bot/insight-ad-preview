"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface CopyFieldProps {
  label: string;
  value: string;
  multiline?: boolean;
}

export default function CopyField({ label, value, multiline }: CopyFieldProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!value) return null;

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border-light bg-bg-subtle p-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-medium text-text-muted">{label}</div>
        <div
          className={`text-sm text-text-primary ${multiline ? "whitespace-pre-wrap" : "truncate"}`}
        >
          {value}
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-light hover:text-primary"
        title={t.common.copy}
      >
        {copied ? (
          <svg className="h-4 w-4 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
