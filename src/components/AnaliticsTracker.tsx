"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as gtag from "@/lib/gtag";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    gtag.pageview(pathname);
  }, [pathname]);

  return null;
}
