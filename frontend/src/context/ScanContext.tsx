"use client";

import React, { createContext, useContext, useState } from "react";

export interface Result {
  id: string;
  name: string;
  tokenId: string;
  contract: string;
  image?: string;
  currentPrice: number;
  lastSale: number;
  collectionFloor: number;
  rarityRank: number;
  totalSupply: number;
  safetyScore: number;
}

interface ScanContextType {
  results: Result[];
  isLoading: boolean;
  error: string | null;
  scanNFT: (input: string) => Promise<void>;
  clearResults: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider = ({ children }: { children: React.ReactNode }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock NFT scan function
  const scanNFT = async (input: string) => {
    setIsLoading(true);
    setError(null);

    // Simulē skenēšanu (mock API)
    setTimeout(() => {
      if (input.trim()) {
        setResults([
          {
            id: "1",
            name: "CryptoPunk",
            tokenId: "1234",
            contract: input,
            image: "/images/CryptoPunks.webp",
            currentPrice: 100,
            lastSale: 90,
            collectionFloor: 80,
            rarityRank: 1,
            totalSupply: 10000,
            safetyScore: 95,
          },
        ]);
      } else {
        setError("Invalid contract address or token ID.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return (
    <ScanContext.Provider
      value={{ results, isLoading, error, scanNFT, clearResults }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScan must be used within a ScanProvider");
  }
  return context;
};
