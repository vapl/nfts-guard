import type { Metadata } from "next";
import "@/app/metadata";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkEffect from "@/components/NetworkEffect";

export const metadata: Metadata = {
  title: "NFTs Guard | Scan NFT Risks Now",
  description:
    "Protect your NFTs! Scan for scams, wash trading, and contract risks instantly. Stay secure in Web3 with NFTs Guard.",
};

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="mx-auto w-full max-w-[2160px]">
        <NetworkEffect />

        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
