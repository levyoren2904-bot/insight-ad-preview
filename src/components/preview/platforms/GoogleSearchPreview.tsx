"use client";

import type { GoogleAdContent } from "@/lib/types";

interface GoogleSearchPreviewProps {
  data: GoogleAdContent;
}

export default function GoogleSearchPreview({ data }: GoogleSearchPreviewProps) {
  const url = data.companyUrl || "example.co.il";
  const path1 = data.displayPath1;
  const path2 = data.displayPath2;
  const displayPath = [path1, path2].filter(Boolean).join("/");

  // Simulate Google's RSA rendering: show up to 3 headlines based on position pinning
  const pinnedHeadlines: (string | null)[] = [null, null, null];
  const unpinned: string[] = [];

  for (const h of data.headlines) {
    if (!h.text) continue;
    if (h.position !== null && h.position >= 1 && h.position <= 3) {
      // Pin to position (0-indexed internally)
      if (!pinnedHeadlines[h.position - 1]) {
        pinnedHeadlines[h.position - 1] = h.text;
      } else {
        unpinned.push(h.text);
      }
    } else {
      unpinned.push(h.text);
    }
  }

  // Fill empty positions with unpinned headlines
  const displayHeadlines: string[] = [];
  for (let i = 0; i < 3; i++) {
    if (pinnedHeadlines[i]) {
      displayHeadlines.push(pinnedHeadlines[i]!);
    } else if (unpinned.length > 0) {
      displayHeadlines.push(unpinned.shift()!);
    }
  }

  if (displayHeadlines.length === 0) {
    displayHeadlines.push("Headline 1", "Headline 2");
  }

  // Same logic for descriptions: show up to 2
  const pinnedDescs: (string | null)[] = [null, null];
  const unpinnedDescs: string[] = [];

  for (const d of data.descriptions) {
    if (!d.text) continue;
    if (d.position !== null && d.position >= 1 && d.position <= 2) {
      if (!pinnedDescs[d.position - 1]) {
        pinnedDescs[d.position - 1] = d.text;
      } else {
        unpinnedDescs.push(d.text);
      }
    } else {
      unpinnedDescs.push(d.text);
    }
  }

  const displayDescs: string[] = [];
  for (let i = 0; i < 2; i++) {
    if (pinnedDescs[i]) {
      displayDescs.push(pinnedDescs[i]!);
    } else if (unpinnedDescs.length > 0) {
      displayDescs.push(unpinnedDescs.shift()!);
    }
  }

  const descriptionText =
    displayDescs.length > 0
      ? displayDescs.join(" ")
      : "Your ad description will appear here.";

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
            https://{url}
            {displayPath ? `/${displayPath}` : ""}
          </div>
        </div>
      </div>

      {/* Headlines */}
      <h3 className="mb-1 cursor-pointer text-xl leading-[1.3] text-[#1a0dab] hover:underline">
        {displayHeadlines.join(" | ")}
      </h3>

      {/* Descriptions */}
      <p className="text-sm leading-[1.58] text-[#4d5156]">{descriptionText}</p>
    </div>
  );
}
