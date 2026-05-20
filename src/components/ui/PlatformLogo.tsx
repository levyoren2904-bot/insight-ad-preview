"use client";

import Image from "next/image";
import type { Platform } from "@/lib/types";

interface PlatformLogoProps {
  platform: Platform;
  size?: number;
  className?: string;
}

export default function PlatformLogo({
  platform,
  size = 20,
  className = "",
}: PlatformLogoProps) {
  return (
    <Image
      src={`/platforms/${platform}.svg`}
      alt={platform}
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    />
  );
}
