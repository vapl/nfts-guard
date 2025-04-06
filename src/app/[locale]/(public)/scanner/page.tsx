import React from "react";
import ScannerPage from "@/components/scanner/ScannerPage";
import Head from "next/head";

const page = () => {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "NFTs Guard Scanner",
              url: "https://nftsguard.com/scanner",
              applicationCategory: "SecurityApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
              description:
                "Scan NFT collections for rug pulls, wash trading, and risk scoring using on-chain analytics.",
              browserRequirements: "Requires web3 wallet for advanced features",
            }),
          }}
        />
      </Head>

      <div className="min-h-screen">
        <ScannerPage />
      </div>
    </>
  );
};

export default page;
