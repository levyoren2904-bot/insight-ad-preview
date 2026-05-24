"use client";

import { useI18n } from "@/lib/i18n";
import type { FacebookAdContent, CtaOption } from "@/lib/types";
import PlaceholderImage from "../shared/PlaceholderImage";
import CarouselPreview from "../shared/CarouselPreview";
import SafeZoneOverlay from "../shared/SafeZoneOverlay";

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
  const isCarousel = data.adFormat === "carousel";
  const isStory = data.adFormat === "story";

  // Instagram Story: 9:16 fullscreen with gradient ring
  if (isStory) {
    return (
      <SafeZoneOverlay platform="instagram" adFormat="story">
      <div
        className="relative mx-auto overflow-hidden rounded-2xl bg-black shadow-md"
        style={{ aspectRatio: "9 / 16", maxWidth: "320px" }}
      >
        {data.adImage ? (
          <img src={data.adImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#833AB4]/30 via-[#FD1D1D]/20 to-[#F77737]/20">
            <PlaceholderImage aspectRatio="aspect-[9/16]" className="w-full h-full" />
          </div>
        )}

        {/* Top - profile with IG gradient ring */}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-0.5">
              {data.profileImage ? (
                <img src={data.profileImage} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-black" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-black">
                  {pageName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-xs font-semibold text-white drop-shadow">
              {pageName.toLowerCase().replace(/\s/g, "")}
            </div>
            <div className="ms-auto text-[10px] text-white/80">Sponsored</div>
          </div>
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-1/3 rounded-full bg-white" />
          </div>
        </div>

        {/* Bottom - Swipe up CTA */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-black/70 to-transparent p-4">
          <svg className="mb-1 size-5 animate-bounce text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6" />
          </svg>
          <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black">
            {CTA_LABELS[data.ctaButton]}
          </button>
        </div>
      </div>
      </SafeZoneOverlay>
    );
  }

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

      {/* Image area - carousel or single (always 1:1 for Instagram feed) */}
      {isCarousel ? (
        <CarouselPreview
          images={data.carouselImages || [null, null, null]}
          aspectRatio="1 / 1"
          ctaStyle="instagram"
        />
      ) : (
        <SafeZoneOverlay platform="instagram" adFormat="feed_image">
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
        </SafeZoneOverlay>
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
