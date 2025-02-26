import { Michroma, Geist, Geist_Mono } from "next/font/google";
import { defaultMetadata } from "@/app/metadata";
import { ScanProvider } from "@/context/ScanContext";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${michroma.variable}`}
    >
      <body className="antialiased bg-background text-text transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScanProvider>{children}</ScanProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
