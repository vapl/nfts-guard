import en from "@/locales/en.json";
import es from "@/locales/es.json";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export type Translation = typeof en;

const translations: Record<Locale, Translation> = {
  en,
  es,
};

export function getTranslations(locale: Locale): typeof en {
  const messages = translations[locale];
  if (!messages) {
    throw new Error(`Translations for locale '${locale}' not found.`);
  }
  return messages;
}
