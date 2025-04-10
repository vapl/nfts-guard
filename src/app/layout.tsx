import "@/app/globals.css";
import { Michroma, Geist, Geist_Mono } from "next/font/google";
import { defaultMetadata } from "@/app/metadata";
import { ThemeProvider } from "next-themes";

import { LayoutProps } from "@/types/layout";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsTracker from "@/components/AnaliticsTracker";

// Fontu inicializācija
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});

export const metadata = defaultMetadata;

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${michroma.variable}`}
    >
      <head>
        {/* Google Analytics tag */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
        <link rel="canonical" href="https://nftsguard.com/" />
      </head>

      <body className="flex flex-col bg-page-gradient transition-colors duration-300">
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          {children}
          <AnalyticsTracker />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
