"use client";

import { TranslationProvider } from "@/context/TranslationContext";
import { ReactNode, useEffect, useState } from "react";
import { getTranslations, Locale, locales } from "@/utils/getTranslations";
import { useParams, usePathname, useRouter } from "next/navigation";

const DEFAULT_LOCALE: Locale = "en";

export default function TranslationWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams<{ locale?: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const [locale, setLocale] = useState<Locale | null>(null);

  useEffect(() => {
    let detectedLocale = params?.locale as Locale | undefined;

    if (!detectedLocale || !locales.includes(detectedLocale)) {
      console.warn(
        `Invalid locale: ${detectedLocale}, redirecting to default locale (${DEFAULT_LOCALE})`
      );
    }

    detectedLocale = DEFAULT_LOCALE;

    if (pathname && !locales.some((loc) => pathname.startsWith(`/${loc}`))) {
      router.replace(`/${DEFAULT_LOCALE}${pathname}`);
    }

    setLocale(detectedLocale);
  }, [params?.locale, pathname, router]);

  if (!locale) return null;

  const messages = getTranslations(locale);

  return (
    <TranslationProvider locale={locale} messages={messages}>
      {children}
    </TranslationProvider>
  );
}
