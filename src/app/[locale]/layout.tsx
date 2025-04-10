import { locales } from "@/utils/getTranslations";
import { LayoutProps } from "@/types/layout";
import TranslationWrapper from "@/components/TranslationWrapper";
import { ScanLimiterProvider } from "@/context/ScanContext";

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  await params;

  return (
    <TranslationWrapper>
      <ScanLimiterProvider>{children}</ScanLimiterProvider>
    </TranslationWrapper>
  );
}
