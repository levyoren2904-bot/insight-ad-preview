"use client";

import type { GoogleAdContent } from "@/lib/types";

interface GoogleSearchPreviewProps {
  data: GoogleAdContent;
}

export default function GoogleSearchPreview({ data }: GoogleSearchPreviewProps) {
  const url = data.companyUrl || "example.co.il";
  const displayPath = data.displayPath ? `/${data.displayPath}` : "";
  const headline1 = data.headline1 || "Headline 1";
  const headline2 = data.headline2 || "Headline 2";
  const headline3 = data.headline3;
  const description1 = data.description1 || "Your ad description will appear here.";
  const description2 = data.description2;

  const headlineParts = [headline1, headline2, headline3].filter(Boolean);

  return (
    <div className="rounded-lg bg-white p-4 font-sans">
      {/* Sponsored label */}
      <div className="mb-1 text-xs text-[#70757a]">Sponsored</div>

      {/* URL line */}
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-light text-[10px] font-bold text-text-muted">
          {url.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm text-[#202124]">{url}</div>
          <div className="text-xs text-[#4d5156]">
            https://{url}{displayPath}
          </div>
        </div>
      </div>

      {/* Headlines */}
      <h3 className="mb-1 cursor-pointer text-xl leading-[1.3] text-[#1a0dab] hover:underline">
        {headlineParts.join(" | ")}
      </h3>

      {/* Descriptions */}
      <p className="text-sm leading-[1.58] text-[#4d5156]">
        {description1}
        {description2 ? ` ${description2}` : ""}
      </p>
    </div>
  );
}
