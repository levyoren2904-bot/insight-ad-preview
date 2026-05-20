"use client";

interface PlaceholderImageProps {
  className?: string;
  aspectRatio?: string;
}

export default function PlaceholderImage({
  className = "",
  aspectRatio = "aspect-[1.91/1]",
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex items-center justify-center bg-bg-light ${aspectRatio} ${className}`}
    >
      <div className="flex items-center gap-1 opacity-30">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[8px] font-medium text-primary">marketing</span>
          <span className="inline-block h-1 w-1 rounded-full bg-primary" />
          <span className="inline-block h-1 w-1 rounded-full bg-teal" />
        </div>
        <span className="text-sm font-bold text-text-primary">insight</span>
      </div>
    </div>
  );
}
