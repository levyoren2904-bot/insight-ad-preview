"use client";

import { useI18n } from "@/lib/i18n";
import type { SubmissionStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: SubmissionStatus;
}

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending: "bg-status-pending/10 text-status-pending",
  approved: "bg-status-approved/10 text-status-approved",
  needs_changes: "bg-status-changes/10 text-status-changes",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();

  const labels: Record<SubmissionStatus, string> = {
    pending: t.status.pending,
    approved: t.status.approved,
    needs_changes: t.status.needsChanges,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {labels[status]}
    </span>
  );
}
