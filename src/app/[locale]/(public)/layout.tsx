import type { Metadata } from "next";
import "@/app/metadata";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

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
      {/* Navbar */}
      {/* <Navbar /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
}
