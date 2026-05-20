"use client";

import { useI18n } from "@/lib/i18n";
import { Platform, PLATFORM_LIST } from "@/lib/types";

interface PlatformTabsProps {
  activePlatform: Platform;
  onSelect: (platform: Platform) => void;
  allowedPlatforms: Platform[];
}

const PLATFORM_ICONS: Record<Platform, string> = {
  google: "G",
  facebook: "f",
  instagram: "IG",
  linkedin: "in",
  pinterest: "P",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  google: "bg-[#4285F4]",
  facebook: "bg-[#1877F2]",
  instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
  linkedin: "bg-[#0A66C2]",
  pinterest: "bg-[#E60023]",
};

export default function PlatformTabs({
  activePlatform,
  onSelect,
  allowedPlatforms,
}: PlatformTabsProps) {
  const { t } = useI18n();

  const platforms = PLATFORM_LIST.filter((p) => allowedPlatforms.includes(p));

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const isActive = activePlatform === platform;
        return (
          <button
            key={platform}
            onClick={() => onSelect(platform)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "border border-border bg-bg-white text-text-secondary hover:border-primary/50"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${PLATFORM_COLORS[platform]}`}
            >
              {PLATFORM_ICONS[platform]}
            </span>
            {t.platforms[platform]}
          </button>
        );
      })}
    </div>
  );
}
