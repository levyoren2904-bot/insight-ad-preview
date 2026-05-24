"use client";

import Image from "next/image";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  return (
    <header className="border-b border-border-light bg-bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Image
          src="/logo.png"
          alt="Insight Marketing"
          width={140}
          height={45}
          priority
          className="mix-blend-multiply"
        />
        <LanguageToggle />
      </div>
    </header>
  );
}
