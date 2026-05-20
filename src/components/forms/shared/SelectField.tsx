"use client";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-coral ms-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-field w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
