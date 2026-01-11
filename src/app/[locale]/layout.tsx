import { locales } from "@/utils/getTranslations";
import TranslationWrapper from "@/components/TranslationWrapper";
import { ScanLimiterProvider } from "@/context/ScanContext";

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslationWrapper>
      <ScanLimiterProvider>{children}</ScanLimiterProvider>
    </TranslationWrapper>
  );
}
