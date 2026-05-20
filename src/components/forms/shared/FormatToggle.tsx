"use client";

interface FormatToggleProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function FormatToggle({
  options,
  value,
  onChange,
  label,
}: FormatToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              value === opt.value
                ? "bg-primary text-white"
                : "border border-border bg-bg-white text-text-secondary hover:border-primary hover:text-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
