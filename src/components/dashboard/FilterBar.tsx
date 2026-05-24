"use client";

import { useI18n } from "@/lib/i18n";
import type { SubmissionStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

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
      <div className="relative flex-1 min-w-[200px]">
        <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.common.search}
          className="ps-9"
        />
      </div>

      {/* Status filter */}
      <Select
        value={statusFilter}
        onValueChange={(v) => onStatusChange(v as SubmissionStatus | "all")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
