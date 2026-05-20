"use client";

import { useI18n } from "@/lib/i18n";
import type { FacebookAdContent, CtaOption } from "@/lib/types";
import PlaceholderImage from "../shared/PlaceholderImage";

interface FacebookFeedPreviewProps {
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

export default function FacebookFeedPreview({ data }: FacebookFeedPreviewProps) {
  const { t } = useI18n();
  const pageName = data.pageName || t.facebook.pageName;
  const primaryText = data.primaryText || "Your primary text will appear here...";
  const headline = data.headline || "Headline";
  const description = data.description || "Description text";

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Post header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        {data.profileImage ? (
          <img
            src={data.profileImage}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-sm font-bold text-white">
            {pageName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-[#050505]">{pageName}</div>
          <div className="flex items-center gap-1 text-xs text-[#65676b]">
            <span>Sponsored</span>
            <span>·</span>
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="#65676b">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.7 5.3a.5.5 0 0 1 0 .7l-5 5a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L6.3 10l4.7-4.7a.5.5 0 0 1 .7 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Primary text */}
      <div className="px-4 pb-3 text-[15px] leading-[1.33] text-[#050505]">
        {primaryText}
      </div>

      {/* Ad image */}
      {data.adImage ? (
        <img
          src={data.adImage}
          alt=""
          className="w-full object-cover"
          style={{ aspectRatio: "1.91 / 1" }}
        />
      ) : (
        <PlaceholderImage />
      )}

      {/* Link preview bar */}
      <div className="flex items-center justify-between border-t border-[#e4e6ea] bg-[#f0f2f5] px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs uppercase text-[#65676b]">
            example.com
          </div>
          <div className="truncate text-[15px] font-semibold leading-tight text-[#050505]">
            {headline}
          </div>
          <div className="truncate text-sm text-[#65676b]">{description}</div>
        </div>
        <button className="ms-3 shrink-0 rounded-md bg-[#e4e6ea] px-4 py-2 text-[15px] font-semibold text-[#050505]">
          {CTA_LABELS[data.ctaButton]}
        </button>
      </div>

      {/* Engagement bar */}
      <div className="flex items-center justify-between border-t border-[#e4e6ea] px-4 py-2">
        <div className="flex gap-4">
          <span className="text-[13px] font-semibold text-[#65676b]">
            Like
          </span>
          <span className="text-[13px] font-semibold text-[#65676b]">
            Comment
          </span>
          <span className="text-[13px] font-semibold text-[#65676b]">
            Share
          </span>
        </div>
      </div>
    </div>
  );
}
