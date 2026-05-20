"use client";

import { useI18n } from "@/lib/i18n";
import type { SubmissionStatus } from "@/lib/types";

interface FilterBarProps {
  statusFilter: SubmissionStatus | "all";
  onStatusChange: (status: SubmissionStatus | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FilterBar({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  const { t } = useI18n();

  const statusOptions: { value: SubmissionStatus | "all"; label: string }[] = [
    { value: "all", label: t.dashboard.allStatuses },
    { value: "pending", label: t.status.pending },
    { value: "approved", label: t.status.approved },
    { value: "needs_changes", label: t.status.needsChanges },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <svg
          className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.common.search}
          className="w-full rounded-lg border border-border bg-bg-white py-2 pe-3 ps-9 text-sm text-text-primary outline-none transition-colors focus:border-primary"
        />
      </div>

      {/* Status filter */}
      <div className="flex gap-1 rounded-lg bg-bg-white p-1 border border-border">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-primary text-white"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
