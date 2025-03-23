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
    "Rug pull analysis",
    "Wash trading analysis",
  ],
  authors: [{ name: "NFTs Guard Team", url: "https://nftsguard.com" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@nftsguard",
    creator: "@nftsguard",
    title: "NFTs Guard - Verify Your NFTs",
    description:
      "Never get scammed again! Verify NFTs before you buy with NFTs Guard.",
  },
};

export default defaultMetadata;
