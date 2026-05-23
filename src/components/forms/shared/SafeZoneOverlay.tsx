"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Platform, AdFormat } from "@/lib/types";

interface SafeZoneOverlayProps {
  platform: Platform;
  adFormat?: AdFormat;
  children: React.ReactNode;
}

/**
 * Wraps an image preview and optionally shows safe zone overlays
 * indicating where platform UI elements cover the image.
 */
export default function SafeZoneOverlay({
  platform,
  adFormat = "feed_image",
  children,
}: SafeZoneOverlayProps) {
  const { t } = useI18n();
  const [showZones, setShowZones] = useState(false);

  const zones = getSafeZones(platform, adFormat);
  if (zones.length === 0) return <>{children}</>;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {children}

        {/* Safe zone overlays */}
        {showZones && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
            {zones.map((zone, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: zone.top,
                  left: zone.left,
                  right: zone.right,
                  bottom: zone.bottom,
                  width: zone.width,
                  height: zone.height,
                }}
              >
                <div className="h-full w-full bg-coral/20 backdrop-blur-[1px]" />
                <span className="absolute start-1 top-0.5 text-[8px] font-bold text-coral/80">
                  {zone.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setShowZones(!showZones)}
        className={`flex items-center gap-1 self-start rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
          showZones
            ? "bg-coral/10 text-coral"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {showZones ? (
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z" />
          ) : (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </>
          )}
        </svg>
        {t.dashboard.safeZone}
      </button>
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

function getSafeZones(platform: Platform, adFormat: AdFormat): ZoneRect[] {
  switch (platform) {
    case "facebook":
      if (adFormat === "story") {
        return [
          // Top: profile pic + name area
          { label: "Profile", top: "0", left: "0", right: "0", height: "14%" },
          // Bottom: CTA + swipe up area
          {
            label: "CTA",
            bottom: "0",
            left: "0",
            right: "0",
            height: "18%",
          },
        ];
      }
      return [
        // Bottom-right: CTA overlay
        {
          label: "CTA",
          bottom: "0",
          right: "0",
          width: "30%",
          height: "15%",
        },
      ];

    case "instagram":
      if (adFormat === "story") {
        return [
          // Top: profile + name
          { label: "Profile", top: "0", left: "0", right: "0", height: "12%" },
          // Bottom: CTA swipe
          {
            label: "Swipe Up",
            bottom: "0",
            left: "0",
            right: "0",
            height: "16%",
          },
        ];
      }
      return [
        // Right side: like/comment/share/save
        {
          label: "Actions",
          top: "30%",
          right: "0",
          width: "12%",
          height: "40%",
        },
        // Bottom: caption area
        {
          label: "Caption",
          bottom: "0",
          left: "0",
          right: "0",
          height: "12%",
        },
      ];

    case "linkedin":
      return [
        // Bottom: CTA button area
        {
          label: "CTA",
          bottom: "0",
          left: "0",
          right: "0",
          height: "14%",
        },
      ];

    case "pinterest":
      return [
        // Bottom: title overlay
        {
          label: "Title",
          bottom: "0",
          left: "0",
          right: "0",
          height: "20%",
        },
        // Top-right: save button
        {
          label: "Save",
          top: "0",
          right: "0",
          width: "20%",
          height: "12%",
        },
      ];

    default:
      return [];
  }
}
