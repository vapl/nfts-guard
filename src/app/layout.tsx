import { Michroma, Geist, Geist_Mono } from "next/font/google";
import { defaultMetadata } from "@/app/metadata";
import { ScanProvider } from "@/context/ScanContext";
import ThemeProvider from "@/components/ClientProvider";
import "@/app/globals.css";

import { LayoutProps } from "@/types/layout";
import Script from "next/script";

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
      className={`${geistSans.variable} ${geistMono.variable} ${michroma.variable}`}
    >
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-DMM184GK4N"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DMM184GK4N');
            `,
          }}
        />
      </head>

      <body className="antialiased bg-background text-text transition-colors duration-300">
        <ThemeProvider>
          <ScanProvider>{children}</ScanProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
