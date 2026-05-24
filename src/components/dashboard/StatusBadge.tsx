"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import type { SubmissionStatus } from "@/lib/types";
import { CircleDashedIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

interface StatusBadgeProps {
  status: SubmissionStatus;
}

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { className: string; Icon: typeof CircleDashedIcon }
> = {
  pending: {
    className: "bg-primary/10 text-primary border-primary/20",
    Icon: CircleDashedIcon,
  },
  approved: {
    className: "bg-teal/10 text-teal border-teal/20",
    Icon: CheckCircle2Icon,
  },
  needs_changes: {
    className: "bg-coral/10 text-coral border-coral/20",
    Icon: AlertCircleIcon,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();
  const { className, Icon } = STATUS_CONFIG[status];

  const labels: Record<SubmissionStatus, string> = {
    pending: t.status.pending,
    approved: t.status.approved,
    needs_changes: t.status.needsChanges,
  };

  return (
    <Badge variant="outline" className={`gap-1 ${className}`}>
      <Icon className="size-3" />
      {labels[status]}
    </Badge>
  );
}
