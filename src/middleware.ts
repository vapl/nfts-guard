import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/utils/getTranslations";

const DEFAULT_LOCALE = "en";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pārbauda, vai ceļš jau satur lokalizāciju (/en, /lv, /de, utt.)
  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));

  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/", // Izpildīt tikai uz galvenās lapas pieprasījumiem
};
