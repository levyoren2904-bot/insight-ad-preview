"use client";

import type { Platform, AdFormat } from "@/lib/types";
import { useSafeZone } from "./SafeZoneContext";

interface SafeZoneOverlayProps {
  platform: Platform;
  adFormat?: AdFormat;
  children: React.ReactNode;
}

/**
 * Wraps an image preview and shows where the platform UI elements
 * cover the image when the safe-zone toggle (in PreviewContainer) is on.
 * Reads its visibility from SafeZoneContext.
 */
export default function SafeZoneOverlay({
  platform,
  adFormat = "feed_image",
  children,
}: SafeZoneOverlayProps) {
  const { show } = useSafeZone();
  const zones = getSafeZones(platform, adFormat);

  return (
    <div className="relative">
      {children}
      {show && zones.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {zones.map((zone, i) => (
            <div
              key={i}
              className="absolute border-2 border-dashed border-coral/80 bg-coral/25 backdrop-blur-[1px]"
              style={{
                top: zone.top,
                left: zone.left,
                right: zone.right,
                bottom: zone.bottom,
                width: zone.width,
                height: zone.height,
              }}
            >
              <span className="absolute start-1.5 top-1 rounded bg-coral px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                {zone.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ZoneRect {
  label: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
}

export function platformHasSafeZones(platform: Platform): boolean {
  return platform !== "google";
}

function getSafeZones(platform: Platform, adFormat: AdFormat): ZoneRect[] {
  switch (platform) {
    case "facebook":
      if (adFormat === "story") {
        return [
          { label: "Profile", top: "0", left: "0", right: "0", height: "14%" },
          { label: "CTA", bottom: "0", left: "0", right: "0", height: "18%" },
        ];
      }
      return [
        { label: "CTA", bottom: "0", right: "0", width: "30%", height: "15%" },
      ];

    case "instagram":
      if (adFormat === "story") {
        return [
          { label: "Profile", top: "0", left: "0", right: "0", height: "12%" },
          { label: "Swipe Up", bottom: "0", left: "0", right: "0", height: "16%" },
        ];
      }
      return [
        { label: "Actions", top: "30%", right: "0", width: "12%", height: "40%" },
        { label: "Caption", bottom: "0", left: "0", right: "0", height: "12%" },
      ];

    case "linkedin":
      return [
        { label: "CTA", bottom: "0", left: "0", right: "0", height: "14%" },
      ];

    case "pinterest":
      return [
        { label: "Title", bottom: "0", left: "0", right: "0", height: "20%" },
        { label: "Save", top: "0", right: "0", width: "20%", height: "12%" },
      ];

    default:
      return [];
  }
}
