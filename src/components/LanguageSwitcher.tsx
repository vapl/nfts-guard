"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/utils/getTranslations";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split("/");
    segments[1] = newLocale; // Aizstāj [locale] daļu
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2 mb-4">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLanguage(locale)}
          className="px-2 py-1 text-sm bg-gray-700 text-white rounded"
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
