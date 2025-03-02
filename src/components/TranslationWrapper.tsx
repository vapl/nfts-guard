"use client";

import { TranslationProvider } from "@/context/TranslationContext";
import { ReactNode } from "react";
import { getTranslations, Locale, locales } from "@/utils/getTranslations";
import { useParams } from "next/navigation";

export default function TranslationWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams<{ locale?: string }>(); // Pieņemam, ka locale var būt undefined
  const locale = params?.locale as Locale | undefined;

  if (!locale || !locales.includes(locale)) {
    throw new Error("Invalid locale");
  }

  const messages = getTranslations(locale);

  return (
    <TranslationProvider locale={locale} messages={messages}>
      {children}
    </TranslationProvider>
  );
}
