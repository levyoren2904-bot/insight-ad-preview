"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";

interface CarouselPreviewProps {
  images: (string | null)[];
  aspectRatio?: string;
  headline?: string;
  ctaLabel?: string;
  ctaStyle?: "facebook" | "linkedin" | "instagram";
}

/**
 * Generic carousel preview that simulates how the platforms show carousel ads.
 * Shows the active card with a peek of the next one on the right (LTR) / left (RTL).
 * Arrows + dots for navigation.
 */
export default function CarouselPreview({
  images,
  aspectRatio = "1 / 1",
  headline,
  ctaLabel,
  ctaStyle = "facebook",
}: CarouselPreviewProps) {
  const [active, setActive] = useState(0);
  const cards = images.length > 0 ? images : [null, null, null];

  const next = () => setActive((i) => Math.min(i + 1, cards.length - 1));
  const prev = () => setActive((i) => Math.max(i - 1, 0));

  const ctaClasses =
    ctaStyle === "facebook"
      ? "bg-[#e4e6ea] text-[#050505]"
      : ctaStyle === "linkedin"
        ? "border border-[#0a66c2] text-[#0a66c2]"
        : "bg-[#0095f6] text-white";

  return (
    <div className="relative">
      {/* Track - shows active card fully and peeks next/prev */}
      <div className="relative overflow-hidden bg-black/5">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${active * -85}%)`,
            // RTL flips automatically via container dir, but transform direction is logical
          }}
        >
          {cards.map((img, i) => (
            <div
              key={i}
              className="shrink-0 px-1 first:ps-2"
              style={{ width: "85%" }}
            >
              <div className="overflow-hidden rounded-md bg-white shadow-sm">
                {img ? (
                  <img
                    src={img}
                    alt={`Card ${i + 1}`}
                    className="w-full object-cover"
                    style={{ aspectRatio }}
                  />
                ) : (
                  <PlaceholderImage
                    aspectRatio={aspectRatio === "1 / 1" ? "aspect-square" : `aspect-[${aspectRatio.replace(" / ", "/")}]`}
                  />
                )}
                {headline && (
                  <div className="flex items-center justify-between gap-2 p-2.5">
                    <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#050505]">
                      {headline}
                    </div>
                    {ctaLabel && (
                      <button
                        className={`shrink-0 rounded px-2.5 py-1 text-[11px] font-semibold ${ctaClasses}`}
                      >
                        {ctaLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        {active > 0 && (
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute start-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow-sm transition-colors hover:bg-white"
          >
            <ChevronLeftIcon className="size-4 text-[#050505] rtl:rotate-180" />
          </button>
        )}
        {active < cards.length - 1 && (
          <button
            onClick={next}
            aria-label="Next"
            className="absolute end-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow-sm transition-colors hover:bg-white"
          >
            <ChevronRightIcon className="size-4 text-[#050505] rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1 py-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to card ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-4 bg-primary" : "w-1.5 bg-black/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
