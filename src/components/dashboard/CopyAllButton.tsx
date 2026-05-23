"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Platform, PlatformContent, GoogleAdContent, FacebookAdContent, LinkedInAdContent, PinterestAdContent } from "@/lib/types";

interface CopyAllButtonProps {
  platform: Platform;
  content: PlatformContent;
}

function formatGoogleContent(t: ReturnType<typeof useI18n>["t"], data: GoogleAdContent): string {
  const lines: string[] = [];
  if (data.companyUrl) lines.push(`${t.google.companyUrl}: ${data.companyUrl}`);
  if (data.displayPath1) lines.push(`${t.google.displayPath1}: ${data.displayPath1}`);
  if (data.displayPath2) lines.push(`${t.google.displayPath2}: ${data.displayPath2}`);
  const posLabel = (pos: number | null) => pos ? ` (${t.google.position} ${pos})` : "";
  (data.headlines || []).forEach((h, i) => {
    if (h.text) lines.push(`${t.google.headline} ${i + 1}${posLabel(h.position)}: ${h.text}`);
  });
  (data.descriptions || []).forEach((d, i) => {
    if (d.text) lines.push(`${t.google.description} ${i + 1}${posLabel(d.position)}: ${d.text}`);
  });
  return lines.join("\n");
}

function formatFacebookContent(t: ReturnType<typeof useI18n>["t"], data: FacebookAdContent): string {
  const lines: string[] = [];
  if (data.pageName) lines.push(`${t.facebook.pageName}: ${data.pageName}`);
  if (data.primaryText) lines.push(`${t.facebook.primaryText}: ${data.primaryText}`);
  if (data.headline) lines.push(`${t.facebook.headline}: ${data.headline}`);
  if (data.description) lines.push(`${t.facebook.description}: ${data.description}`);
  lines.push(`${t.facebook.ctaButton}: ${data.ctaButton}`);
  lines.push(`${t.facebook.adFormat}: ${data.adFormat}`);
  return lines.join("\n");
}

function formatLinkedInContent(t: ReturnType<typeof useI18n>["t"], data: LinkedInAdContent): string {
  const lines: string[] = [];
  if (data.companyName) lines.push(`${t.linkedin.companyName}: ${data.companyName}`);
  if (data.introText) lines.push(`${t.linkedin.introText}: ${data.introText}`);
  if (data.headline) lines.push(`${t.linkedin.headline}: ${data.headline}`);
  if (data.description) lines.push(`${t.linkedin.description}: ${data.description}`);
  lines.push(`${t.linkedin.ctaButton}: ${data.ctaButton}`);
  lines.push(`${t.linkedin.adFormat}: ${data.adFormat}`);
  return lines.join("\n");
}

function formatPinterestContent(t: ReturnType<typeof useI18n>["t"], data: PinterestAdContent): string {
  const lines: string[] = [];
  if (data.pinTitle) lines.push(`${t.pinterest.pinTitle}: ${data.pinTitle}`);
  if (data.pinDescription) lines.push(`${t.pinterest.pinDescription}: ${data.pinDescription}`);
  if (data.destinationUrl) lines.push(`${t.pinterest.destinationUrl}: ${data.destinationUrl}`);
  if (data.boardName) lines.push(`${t.pinterest.boardName}: ${data.boardName}`);
  return lines.join("\n");
}

export default function CopyAllButton({ platform, content }: CopyAllButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    let text = "";
    switch (platform) {
      case "google":
        text = formatGoogleContent(t, content as GoogleAdContent);
        break;
      case "facebook":
      case "instagram":
        text = formatFacebookContent(t, content as FacebookAdContent);
        break;
      case "linkedin":
        text = formatLinkedInContent(t, content as LinkedInAdContent);
        break;
      case "pinterest":
        text = formatPinterestContent(t, content as PinterestAdContent);
        break;
    }

    await navigator.clipboard.writeText(`${t.platforms[platform]}\n${"=".repeat(20)}\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopyAll}
      className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {t.common.copied}
        </>
      ) : (
        <>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {t.dashboard.copyAllForPlatform}
        </>
      )}
    </button>
  );
}
