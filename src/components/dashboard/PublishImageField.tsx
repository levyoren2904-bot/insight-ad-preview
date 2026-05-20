"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface PublishImageFieldProps {
  label: string;
  imageUrl: string | null;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  isEmpty: boolean;
}

export default function PublishImageField({
  label,
  imageUrl,
  checked,
  onCheck,
  isEmpty,
}: PublishImageFieldProps) {
  const { t } = useI18n();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageUrl.split("/").pop() || "image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      onCheck(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch {
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
      onCheck(true);
    }
  };

  if (isEmpty) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border-light bg-bg-subtle/50 p-4 opacity-50">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border-light text-xs text-text-muted">
          -
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-text-muted">{label}</div>
          <div className="text-xs text-text-muted italic">
            {t.publishing.skipNoImage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        checked
          ? "border-teal/30 bg-teal/5"
          : "border-border bg-bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <div className="text-sm font-semibold text-text-muted">{label}</div>
        </div>
        <button
          onClick={() => onCheck(!checked)}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
            checked
              ? "border-teal bg-teal text-white"
              : "border-border hover:border-primary"
          }`}
        >
          {checked && (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </button>
      </div>

      {/* Image preview */}
      {imageUrl && (
        <div className="mb-3 overflow-hidden rounded-lg border border-border">
          <img
            src={imageUrl}
            alt={label}
            className="h-32 w-full object-cover"
          />
        </div>
      )}

      <button
        onClick={handleDownload}
        className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-colors ${
          downloaded
            ? "bg-teal text-white"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        {downloaded ? t.publishing.imageDownloaded : t.publishing.downloadImage}
      </button>
    </div>
  );
}
