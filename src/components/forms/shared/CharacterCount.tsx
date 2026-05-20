"use client";

import { useI18n } from "@/lib/i18n";

interface CharacterCountProps {
  current: number;
  max: number;
}

export default function CharacterCount({ current, max }: CharacterCountProps) {
  const { t } = useI18n();
  const remaining = max - current;
  const percentage = current / max;

  let colorClass = "text-teal";
  if (percentage > 1) colorClass = "text-coral";
  else if (percentage > 0.85) colorClass = "text-yellow";

  return (
    <span className={`text-xs ${colorClass}`}>
      {remaining >= 0
        ? `${remaining} ${t.submission.charactersRemaining}`
        : `${Math.abs(remaining)} ${t.submission.charactersOver}`}
    </span>
  );
}
