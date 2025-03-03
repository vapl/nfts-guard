"use client"; // ✅ Obligāti vajag, lai nebūtu SSR kļūdas!

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="opacity-0">Loading...</div>; // 🔥 Novērš hydration kļūdu!

  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
}
