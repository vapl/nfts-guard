"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, Locale } from "@/utils/getTranslations"; // Pārliecinās, ka Locale ir importēts

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || "/"; // Nodrošina, ka nav `null`

  const switchLanguage = (newLocale: Locale) => {
    // Izmanto striktu tipu
    if (!pathname) return;

    const segments = pathname.split("/");

    // Pārbauda, vai segments[1] ir valoda un aizstāj to
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.unshift(newLocale); // Ja nav valodas segments, pievieno to
    }

    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2 mb-4">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLanguage(locale as Locale)} // Konvertē uz `Locale`
          className={`px-2 py-1 text-sm rounded ${
            pathname.startsWith(`/${locale}`)
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
