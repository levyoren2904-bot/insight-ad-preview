"use client";

import { useI18n } from "@/lib/i18n";
import type { LinkedInAdContent, CtaOption } from "@/lib/types";
import PlaceholderImage from "../shared/PlaceholderImage";
import CarouselPreview from "../shared/CarouselPreview";

interface LinkedInFeedPreviewProps {
  data: LinkedInAdContent;
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

export default function LinkedInFeedPreview({ data }: LinkedInFeedPreviewProps) {
  const { t } = useI18n();
  const companyName = data.companyName || t.linkedin.companyName;
  const introText = data.introText || "Your introductory text will appear here...";
  const headline = data.headline || "Headline";
  const description = data.description || "";
  const isCarousel = data.adFormat === "carousel";

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Post header */}
      <div className="flex items-start gap-2 px-4 pt-3 pb-2">
        {data.companyLogo ? (
          <img
            src={data.companyLogo}
            alt=""
            className="h-12 w-12 rounded object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded bg-[#0a66c2] text-lg font-bold text-white">
            {companyName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-[#000000e6]">
            {companyName}
          </div>
          <div className="text-xs text-[#00000099]">Promoted</div>
        </div>
        <svg className="h-6 w-6 shrink-0 text-[#00000099]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="18" cy="12" r="1.5" />
        </svg>
      </div>

      {/* Intro text */}
      <div className="px-4 pb-3 text-sm leading-[1.43] text-[#000000e6]">
        {introText}
      </div>

      {/* Image area - carousel or single */}
      {isCarousel ? (
        <CarouselPreview
          images={data.carouselImages || [null, null, null]}
          aspectRatio="1 / 1"
          headline={headline}
          ctaLabel={CTA_LABELS[data.ctaButton]}
          ctaStyle="linkedin"
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

      {/* Link preview - only for single image format */}
      {!isCarousel && (
        <div className="flex items-center justify-between border-t border-[#e0e0e0] bg-white px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-[#000000e6]">
              {headline}
            </div>
            {description && (
              <div className="truncate text-xs text-[#00000099]">
                {description}
              </div>
            )}
          </div>
          <button className="ms-3 shrink-0 rounded-full border border-[#0a66c2] px-4 py-1.5 text-sm font-semibold text-[#0a66c2]">
            {CTA_LABELS[data.ctaButton]}
          </button>
        </div>
      )}

      {/* Engagement bar */}
      <div className="flex items-center gap-1 border-t border-[#e0e0e0] px-4 py-1">
        <div className="flex -space-x-1">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#378fe9] text-[8px] text-white">
            +
          </span>
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#e74c3c] text-[8px] text-white">
            &#9829;
          </span>
        </div>
        <span className="text-xs text-[#00000099]">42</span>
      </div>
      <div className="flex justify-around border-t border-[#e0e0e0] py-1">
        <button className="flex items-center gap-1 px-2 py-2 text-xs font-semibold text-[#00000099]">
          Like
        </button>
        <button className="flex items-center gap-1 px-2 py-2 text-xs font-semibold text-[#00000099]">
          Comment
        </button>
        <button className="flex items-center gap-1 px-2 py-2 text-xs font-semibold text-[#00000099]">
          Repost
        </button>
        <button className="flex items-center gap-1 px-2 py-2 text-xs font-semibold text-[#00000099]">
          Send
        </button>
      </div>
    </div>
  );
}
