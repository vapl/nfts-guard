"use client";

import React, { useState } from "react";
import NFTResults from "@/components/NftScanResult";
import mockNFTResults from "@/data/mockNFTResults";
import { NftData } from "@/types/___nftDataTypes";

export default function NFTScanner() {
  const [nftInput, setNftInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<NftData | null>(null);

  const handleScan = async () => {
    const validContractOrToken = /^0x[a-fA-F0-9]{40}$|^[0-9]+$/;
    const validUrl = /^(https?:\/\/)?(www\.)?opensea\.io\/assets\/.+/;

    if (!validContractOrToken.test(nftInput) && !validUrl.test(nftInput)) {
      alert("Please enter a valid contract address, token ID, or OpenSea URL");
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      const foundResult = mockNFTResults.find(
        (nft) => nft.tokenId === nftInput || nft.contract.includes(nftInput)
      );
      setResult(
        foundResult
          ? { ...foundResult, owner: foundResult.owner ?? "Unknown" }
          : {
              ...mockNFTResults[0],
              owner: mockNFTResults[0].owner ?? "Unknown",
            }
      );
      setIsScanning(false);
    }, 2000); // Imitē skanēšanu
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800 py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">NFT Scanner</h1>
        <p className="text-gray-400 text-lg mb-6 max-w-xl text-center">
          Enter an NFT contract address or token ID to check its details and
          safety.
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl mb-8">
          <input
            type="text"
            placeholder="Enter NFT contract address or token ID (e.g., 567)"
            value={nftInput}
            onChange={(e) => setNftInput(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleScan}
            className="bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "Scan"}
          </button>
        </div>

        {/* SCAN RESULT */}
        {result && <NFTResults result={result} />}
      </section>
    </>
  );
}
