"use client";

import { useI18n } from "@/lib/i18n";
import type { FacebookAdContent, CtaOption } from "@/lib/types";
import PlaceholderImage from "../shared/PlaceholderImage";

interface InstagramFeedPreviewProps {
  data: FacebookAdContent;
}

const CTA_LABELS: Record<CtaOption, string> = {
  learn_more: "Learn More",
  shop_now: "Shop Now",
  sign_up: "Sign Up",
  contact_us: "Contact Us",
  download: "Download",
  get_offer: "Get Offer",
  book_now: "Book Now",
};

export default function InstagramFeedPreview({
  data,
}: InstagramFeedPreviewProps) {
  const { t } = useI18n();
  const pageName = data.pageName || t.facebook.pageName;
  const primaryText = data.primaryText || "Your caption will appear here...";

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Post header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          {data.profileImage ? (
            <img
              src={data.profileImage}
              alt=""
              className="h-8 w-8 rounded-full object-cover ring-2 ring-[#e4405f]/30"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-xs font-bold text-white">
              {pageName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-sm font-semibold text-[#262626]">
              {pageName.toLowerCase().replace(/\s/g, "")}
            </span>
            <div className="text-[10px] text-[#8e8e8e]">Sponsored</div>
          </div>
        </div>
        <svg className="h-6 w-6 text-[#262626]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      </div>

      {/* Ad image - square for Instagram */}
      {data.adImage ? (
        <img
          src={data.adImage}
          alt=""
          className="w-full object-cover"
          style={{ aspectRatio: "1 / 1" }}
        />
      ) : (
        <PlaceholderImage aspectRatio="aspect-square" />
      )}

      {/* CTA button */}
      <div className="border-b border-[#efefef] px-3 py-2">
        <button className="w-full rounded-md bg-[#0095f6] py-1.5 text-sm font-semibold text-white">
          {CTA_LABELS[data.ctaButton]}
        </button>
      </div>

      {/* Action icons */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex gap-4">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-sm text-[#262626]">
          <span className="font-semibold">
            {pageName.toLowerCase().replace(/\s/g, "")}
          </span>{" "}
          {primaryText}
        </p>
      </div>
    </div>
  );
}
