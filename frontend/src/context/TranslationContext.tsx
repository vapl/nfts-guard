"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale } from "@/utils/getTranslations"; // Izmantojam importēto Translation

type DeepTranslation = {
  [key: string]: string | DeepTranslation;
};

// Konteksta tips
type TranslationContextType = {
  locale: Locale;
  messages: DeepTranslation;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: DeepTranslation;
}) {
  return (
    <TranslationContext.Provider value={{ locale, messages }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      "useTranslations must be used within a TranslationProvider"
    );
  }
  const { messages, locale } = context;

  const t = (key: string): string => {
    return key
      .split(".")
      .reduce((obj: DeepTranslation | string, part: string) => {
        if (typeof obj === "string" || !obj) return key;
        return obj[part] || key;
      }, messages) as string;
  };

  return { t, locale };
}
