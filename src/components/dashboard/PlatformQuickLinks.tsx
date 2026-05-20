"use client";

import { useI18n } from "@/lib/i18n";
import type { Platform } from "@/lib/types";

interface PlatformQuickLinksProps {
  platform: Platform;
}

const PLATFORM_URLS: Record<Platform, { label: string; url: string }> = {
  google: { label: "Google Ads", url: "https://ads.google.com" },
  facebook: { label: "Meta Ads Manager", url: "https://www.facebook.com/adsmanager" },
  instagram: { label: "Meta Ads Manager", url: "https://www.facebook.com/adsmanager" },
  linkedin: { label: "LinkedIn Campaign Manager", url: "https://www.linkedin.com/campaignmanager" },
  pinterest: { label: "Pinterest Ads", url: "https://ads.pinterest.com" },
};

export default function PlatformQuickLinks({ platform }: PlatformQuickLinksProps) {
  const { t } = useI18n();
  const link = PLATFORM_URLS[platform];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-border bg-bg-white px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      {link.label}
    </a>
  );
}
