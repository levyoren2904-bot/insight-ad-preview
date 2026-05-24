"use client";

import { useI18n } from "@/lib/i18n";
import type { FacebookAdContent, CtaOption } from "@/lib/types";
import PlaceholderImage from "../shared/PlaceholderImage";
import CarouselPreview from "../shared/CarouselPreview";

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
  const isCarousel = data.adFormat === "carousel";
  const isStory = data.adFormat === "story";

  // Story format: 9:16 fullscreen-style layout
  if (isStory) {
    return (
      <div
        className="relative mx-auto overflow-hidden rounded-2xl bg-black shadow-md"
        style={{ aspectRatio: "9 / 16", maxWidth: "320px" }}
      >
        {data.adImage ? (
          <img
            src={data.adImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1877F2]/20 to-[#1877F2]/5">
            <PlaceholderImage aspectRatio="aspect-[9/16]" className="w-full h-full" />
          </div>
        )}

        {/* Top gradient + profile */}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-3">
          <div className="flex items-center gap-2">
            {data.profileImage ? (
              <img src={data.profileImage} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-xs font-bold text-white ring-2 ring-white">
                {pageName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-xs font-semibold text-white drop-shadow">{pageName}</div>
            <div className="ms-auto text-[10px] text-white/80">Sponsored</div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-1/3 rounded-full bg-white" />
          </div>
        </div>

        {/* Bottom gradient + CTA */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="mb-3 text-sm font-semibold text-white drop-shadow">
            {headline}
          </div>
          <button className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-[#050505]">
            {CTA_LABELS[data.ctaButton]} ↑
          </button>
        </div>
      </div>
    );
  }

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

      {/* Image area - carousel or single */}
      {isCarousel ? (
        <CarouselPreview
          images={data.carouselImages || [null, null, null]}
          aspectRatio="1 / 1"
          headline={headline}
          ctaLabel={CTA_LABELS[data.ctaButton]}
          ctaStyle="facebook"
        />
      ) : data.adImage ? (
        <img
          src={data.adImage}
          alt=""
          className="w-full object-cover"
          style={{ aspectRatio: "1.91 / 1" }}
        />
      ) : (
        <PlaceholderImage />
      )}

      {/* Link preview bar - only for single image format */}
      {!isCarousel && (
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
      )}

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
