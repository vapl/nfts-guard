"use client";

import React from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { useScan, Result } from "@/context/ScanContext";
import Image from "next/image";

interface ScanResultsFreeProps {
  results: Result[];
}

const ScanResultsFree: React.FC<ScanResultsFreeProps> = ({ results }) => {
  const { isLoading, error } = useScan();

  // 🔄 Ielādes animācija
  if (isLoading) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <p className="text-center animate-pulse">
          🔍 Scanning NFT... Please wait.
        </p>
      </div>
    );
  }

  // ❌ Kļūdas paziņojums
  if (error) {
    return (
      <div className="bg-red-800 text-white p-6 rounded-lg shadow-md">
        <p className="text-center">❌ {error}</p>
      </div>
    );
  }

  // ⚠️ Ja nav rezultātu
  if (!results.length) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <p className="text-center">
          🚫 No scan results available. Please verify an NFT.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-start">Scan Results</h3>
      {results.map((result) => (
        <div
          key={result.id}
          className="p-6 rounded-xl shadow-xl border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* NFT Attēls */}
            <div className="col-span-2 md:col-span-1">
              <Image
                width={1000}
                height={100}
                src={result.image || "/images/CryptoPunks.webp"}
                alt={result.name}
                className="w-full h-40 md:h-60 object-cover rounded-lg border border-gray-700"
                onError={(e) =>
                  (e.currentTarget.src = "/images/CryptoPunks.webp")
                }
              />
            </div>

            {/* Detalizēta informācija */}
            <div className="col-span-2 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="flex w-full flex-col">
                  <div className="flex py-1 justify-between items-start align-center">
                    <h3 className="text-2xl font-bold break-words">
                      {result.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium text-nowrap ${
                        result.safetyScore >= 70
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {result.safetyScore >= 70
                        ? "Verified Authentic"
                        : "Potential Risk"}
                    </span>
                  </div>
                  <h5 className="text-xl text-start font-bold break-words">
                    #{result.tokenId}
                  </h5>
                </div>
              </div>
              <p className="text-gray-400 text-start">
                Contract: {result.contract.slice(0, 6)}...
                {result.contract.slice(-4)}
              </p>

              {/* Statistika */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: "Current Price",
                    value: `${result.currentPrice} ETH`,
                  },
                  { label: "Last Sale", value: `${result.lastSale} ETH` },
                  {
                    label: "Collection Floor",
                    value: `${result.collectionFloor} ETH`,
                  },
                  {
                    label: "Rarity Rank",
                    value: `#${result.rarityRank} / ${result.totalSupply}`,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-black/40 p-3 rounded-lg text-center border border-white/10 text-nowrap"
                  >
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Drošības statuss */}
              <div className="mt-4 flex items-center gap-2">
                {result.safetyScore >= 70 ? (
                  <ShieldCheck className="text-green-400" size={20} />
                ) : (
                  <AlertTriangle className="text-yellow-400" size={20} />
                )}
                <p className="text-md">
                  Safety Score: <strong>{result.safetyScore}/100</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScanResultsFree;
