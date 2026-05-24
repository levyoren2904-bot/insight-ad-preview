"use client";

import type { Platform, AdFormat } from "@/lib/types";
import { useSafeZone } from "./SafeZoneContext";
import { useI18n } from "@/lib/i18n";

interface SafeZoneOverlayProps {
  platform: Platform;
  adFormat?: AdFormat;
  children: React.ReactNode;
}

type ZoneKey = "ctaButton" | "profile" | "actions" | "caption" | "swipeUp" | "title" | "saveButton";

interface ZoneRect {
  key: ZoneKey;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
}

/**
 * Wraps an image preview and shows where the platform UI elements
 * will cover the image when the toggle (in PreviewContainer) is on.
 * Uses a diagonal warning-tape pattern to make it obvious these are
 * areas to AVOID placing important content in.
 */
export default function SafeZoneOverlay({
  platform,
  adFormat = "feed_image",
  children,
}: SafeZoneOverlayProps) {
  const { show } = useSafeZone();
  const { t } = useI18n();
  const zones = getZones(platform, adFormat);

  return (
    <div className="relative">
      {children}
      {show && zones.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {zones.map((zone, i) => (
            <div
              key={i}
              className="absolute border-2 border-coral shadow-[0_0_0_1px_white_inset]"
              style={{
                top: zone.top,
                left: zone.left,
                right: zone.right,
                bottom: zone.bottom,
                width: zone.width,
                height: zone.height,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(248,125,78,0.5) 0 10px, rgba(248,125,78,0.2) 10px 20px)",
              }}
            >
              <span className="absolute start-1 top-1 max-w-[calc(100%-8px)] truncate rounded bg-coral px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                {t.hiddenZones[zone.key]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function platformHasSafeZones(platform: Platform): boolean {
  return platform !== "google";
}

function getZones(platform: Platform, adFormat: AdFormat): ZoneRect[] {
  switch (platform) {
    case "facebook":
      if (adFormat === "story") {
        return [
          { key: "profile", top: "0", left: "0", right: "0", height: "14%" },
          { key: "ctaButton", bottom: "0", left: "0", right: "0", height: "18%" },
        ];
      }
      return [
        { key: "ctaButton", bottom: "0", right: "0", width: "30%", height: "15%" },
      ];

    case "instagram":
      if (adFormat === "story") {
        return [
          { key: "profile", top: "0", left: "0", right: "0", height: "12%" },
          { key: "swipeUp", bottom: "0", left: "0", right: "0", height: "16%" },
        ];
      }
      return [
        { key: "actions", top: "30%", right: "0", width: "12%", height: "40%" },
        { key: "caption", bottom: "0", left: "0", right: "0", height: "12%" },
      ];

    case "linkedin":
      return [
        { key: "ctaButton", bottom: "0", left: "0", right: "0", height: "14%" },
      ];

    case "pinterest":
      return [
        { key: "title", bottom: "0", left: "0", right: "0", height: "20%" },
        { key: "saveButton", top: "0", right: "0", width: "20%", height: "12%" },
      ];

    default:
      return [];
  }
}
