// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/utils/getTranslations";

const DEFAULT_LOCALE = "en";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ja jau ir valoda URL, neko nedari
  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));
  if (hasLocale) return NextResponse.next();

  // Ja nav valodas, pievieno default (piemēram, / → /en, /faq → /en/faq)
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

// ✅ Šis matcher izpildās uz visiem ceļiem, kuri nesatur statiskos resursus
export const config = {
  matcher: [
    // Pārliecināmies, ka netrigerējas uz _next, favicon utt.
    "/((?!_next|favicon.ico|api|.*\\..*).*)",
  ],
};
