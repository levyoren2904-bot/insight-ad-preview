"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface PublishFieldProps {
  label: string;
  value: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  isEmpty: boolean;
}

export default function PublishField({
  label,
  value,
  checked,
  onCheck,
  isEmpty,
}: PublishFieldProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCheck(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEmpty) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border-light bg-bg-subtle/50 p-4 opacity-50">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border-light text-xs text-text-muted">
          -
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-text-muted">{label}</div>
          <div className="text-xs text-text-muted italic">
            {t.publishing.skipEmpty}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        checked
          ? "border-teal/30 bg-teal/5"
          : "border-border bg-bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-text-muted">{label}</div>
        <button
          onClick={() => onCheck(!checked)}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
            checked
              ? "border-teal bg-teal text-white"
              : "border-border hover:border-primary"
          }`}
        >
          {checked && (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </button>
      </div>

      <div className="mb-3 rounded-lg bg-bg-subtle p-3 text-base leading-relaxed text-text-primary">
        {value}
      </div>

      <button
        onClick={handleCopy}
        className={`w-full rounded-lg py-3 text-sm font-bold transition-colors ${
          copied
            ? "bg-teal text-white"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        {copied ? t.publishing.fieldCopied : t.common.copy}
      </button>
    </div>
  );
}
