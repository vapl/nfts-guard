// src/app/metadata.ts
import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "NFTs Guard - Protect Your NFTs",
  description:
    "Verify NFT authenticity and protect yourself from scams with NFTs Guard. Enjoy 3 free scans daily or upgrade for unlimited checks.",
  keywords: [
    "NFT",
    "NFT Security",
    "Blockchain Verification",
    "Crypto Scam Protection",
    "Digital Collectibles",
  ],
  authors: [{ name: "NFTs Guard Team", url: "https://nftsguard.com" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "NFTs Guard - Verify Your NFTs",
    description:
      "Real-time NFT verification to avoid scams and protect your digital assets.",
    url: "https://nftsguard.com",
    siteName: "NFTs Guard",
    images: [
      {
        url: "https://nftsguard.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NFTs Guard Dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@nftsguard",
    creator: "@nftsguard",
    title: "NFTs Guard - Verify Your NFTs",
    description:
      "Never get scammed again! Verify NFTs before you buy with NFTs Guard.",
    images: ["https://nftsguard.com/twitter-image.jpg"],
  },
};

export default defaultMetadata;
