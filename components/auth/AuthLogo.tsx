"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AuthLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or the default logo to avoid layout shift
    return <div className="h-24 w-48" />;
  }

  const logoSrc =
    resolvedTheme === "dark"
      ? "/images/LogoBG_Removed-dark1.png"
      : "/images/LogoBG_Removed-light.png";

  return (
    <Link href="/" aria-label="Go to home page" className="inline-block mb-8">
      <Image
        src={logoSrc}
        alt="Sameera Auto Traders Logo"
        width={200}
        height={96}
        priority
        className="h-24 w-auto object-contain drop-shadow-xl"
      />
    </Link>
  );
}
