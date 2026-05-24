"use client";

import { forwardRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Platform } from "@/lib/types";
import { useSafeZone } from "./SafeZoneContext";
import { platformHasSafeZones } from "./SafeZoneOverlay";
import { EyeIcon, EyeOffIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewContainerProps {
  children: React.ReactNode;
  platform: Platform;
}

const PreviewContainer = forwardRef<HTMLDivElement, PreviewContainerProps>(
  function PreviewContainer({ children, platform }, ref) {
    const { t } = useI18n();
    const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
    const { show, toggle } = useSafeZone();
    const showSafeZoneToggle = platformHasSafeZones(platform);

    return (
      <div
        ref={ref}
        className="sticky top-6 rounded-xl border border-border bg-bg-subtle p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            {t.submission.livePreview}
          </h2>
          <div className="flex items-center gap-2">
            {showSafeZoneToggle && (
              <Button
                size="sm"
                variant={show ? "default" : "outline"}
                onClick={toggle}
                className={show ? "bg-coral text-white hover:bg-coral/90" : ""}
              >
                {show ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
                {t.dashboard.safeZone}
              </Button>
            )}
            <div className="flex gap-1 rounded-lg bg-bg-light p-1">
              <button
                onClick={() => setMode("desktop")}
                aria-label={t.common.desktop}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  mode === "desktop"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <MonitorIcon className="size-3" />
                {t.common.desktop}
              </button>
              <button
                onClick={() => setMode("mobile")}
                aria-label={t.common.mobile}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  mode === "mobile"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <SmartphoneIcon className="size-3" />
                {t.common.mobile}
              </button>
            </div>
          </div>
        </div>

        {/* Safe zone explainer - only when active */}
        {show && showSafeZoneToggle && (
          <div className="mb-3 rounded-lg border border-coral/30 bg-coral/5 px-3 py-2 text-xs text-coral">
            {t.dashboard.safeZoneHint}
          </div>
        )}

        <div className="flex justify-center">
          <div
            className={`w-full transition-all duration-300 ${
              mode === "mobile" ? "max-w-[375px]" : "max-w-full"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

export default PreviewContainer;
