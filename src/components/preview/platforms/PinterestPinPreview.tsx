"use client";

import { useI18n } from "@/lib/i18n";
import type { PinterestAdContent } from "@/lib/types";
import PlaceholderImage from "../shared/PlaceholderImage";

interface PinterestPinPreviewProps {
  data: PinterestAdContent;
}

export default function PinterestPinPreview({ data }: PinterestPinPreviewProps) {
  const { t } = useI18n();
  const pinTitle = data.pinTitle || t.pinterest.pinTitle;
  const pinDescription = data.pinDescription || "Pin description will appear here...";
  const destinationUrl = data.destinationUrl
    ? data.destinationUrl.replace(/^https?:\/\//, "").split("/")[0]
    : "example.com";
  const boardName = data.boardName;

  return (
    <div className="mx-auto max-w-[236px] overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Pin image */}
      <div className="relative">
        {data.pinImage ? (
          <img
            src={data.pinImage}
            alt=""
            className="w-full object-cover"
            style={{ aspectRatio: "2 / 3" }}
          />
        ) : (
          <PlaceholderImage aspectRatio="aspect-[2/3]" />
        )}
        <div className="absolute top-2 start-2 rounded-full bg-[#e60023] px-2 py-0.5 text-[10px] font-semibold text-white">
          Promoted
        </div>
      </div>

      {/* Pin info */}
      <div className="p-3">
        {/* Destination */}
        <div className="mb-1 flex items-center gap-1">
          <svg className="h-3 w-3 text-[#767676]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="truncate text-xs text-[#767676]">
            {destinationUrl}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-1 text-sm font-semibold leading-tight text-[#111111]">
          {pinTitle}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-[#767676]">
          {pinDescription}
        </p>

        {/* Board */}
        {boardName && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-6 w-6 rounded bg-bg-light" />
            <span className="text-xs font-semibold text-[#111111]">
              {boardName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
