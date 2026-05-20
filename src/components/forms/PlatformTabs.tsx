"use client";

import { useI18n } from "@/lib/i18n";
import { Platform, PLATFORM_LIST } from "@/lib/types";
import PlatformLogo from "@/components/ui/PlatformLogo";

interface PlatformTabsProps {
  activePlatform: Platform;
  onSelect: (platform: Platform) => void;
  allowedPlatforms: Platform[];
}

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
            <PlatformLogo
              platform={platform}
              size={18}
              className={isActive ? "brightness-0 invert" : ""}
            />
            {t.platforms[platform]}
          </button>
        );
      })}
    </div>
  );
}
