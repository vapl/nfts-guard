import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "NFTs Guard – NFT Scam Detector & Rug Pull Analysis",
  description:
    "Scan any NFT collection for rug pulls, wash trading, whale manipulation and scams. Get a free safety score instantly using on-chain analytics.",
  keywords: [
    "NFT Scam Detector",
    "NFT Rug Pull Checker",
    "Wash Trading Analysis",
    "NFT Safety Score",
    "Web3 Security Tool",
    "NFT Risk Analysis",
    "NFT Security Audit",
  ],
  metadataBase: new URL("https://nftsguard.com"),
  openGraph: {
    title: "NFTs Guard – NFT Scam Detector & Rug Pull Analysis",
    description:
      "Protect yourself from scams. Analyze any NFT project and get a free safety score instantly.",
    url: "https://nftsguard.com",
    siteName: "NFTs Guard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NFTs Guard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NFTs Guard – NFT Scam Detector",
    description:
      "Scan NFT collections for rug pulls, wash trading & scams. Free safety score in seconds.",
    site: "@nftsguard",
    creator: "@nftsguard",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  authors: [{ name: "NFTs Guard Team", url: "https://nftsguard.com" }],
  creator: "NFTs Guard",
  publisher: "NFTs Guard",
};
