"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import CharacterCount from "./CharacterCount";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxChars?: number;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  optional?: boolean;
  tip?: string;
  compact?: boolean;
  /** Slot rendered at the end of the label row (replaces the "optional" badge if present) */
  headerEnd?: React.ReactNode;
}

function TipTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const iconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (show && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition(rect.top < 120 ? "bottom" : "top");
    }
  }, [show]);

  return (
    <span className="relative inline-flex">
      <button
        ref={iconRef}
        type="button"
        className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary transition-colors hover:bg-primary/20"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        aria-label="Writing tip"
      >
        i
      </button>
      {show && (
        <span
          className={`absolute z-50 w-64 rounded-lg bg-text-primary px-3 py-2 text-xs leading-relaxed text-white shadow-lg start-0 ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Insight Tip
          </span>
          {text}
        </span>
      )}
    </span>
  );
}

export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  maxChars,
  required = false,
  multiline = false,
  rows = 3,
  optional = false,
  tip,
  compact = false,
  headerEnd,
}: TextFieldProps) {
  const { t } = useI18n();
  const inputClasses =
    "form-field w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className={`flex flex-col ${compact ? "gap-0.5" : "gap-1.5"}`}>
      <div className="flex items-center justify-between">
        <label className={`flex items-center gap-1.5 font-medium text-text-primary ${compact ? "text-xs" : "text-sm"}`}>
          {label}
          {required && <span className="text-coral ms-0.5">*</span>}
          {tip && <TipTooltip text={tip} />}
        </label>
        {headerEnd ?? (optional && !compact && (
          <span className="text-xs text-text-muted">
            {t.common.optional}
          </span>
        ))}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      {maxChars && <CharacterCount current={value.length} max={maxChars} />}
    </div>
  );
}
