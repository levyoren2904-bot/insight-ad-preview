"use client";

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
}: TextFieldProps) {
  const inputClasses =
    "form-field w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-coral ms-0.5">*</span>}
        </label>
        {optional && (
          <span className="text-xs text-text-muted">
            {optional ? "אופציונלי" : ""}
          </span>
        )}
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
