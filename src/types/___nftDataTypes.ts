export interface NftData {
  id: string;
  name: string;
  tokenId: string;
  image: string;
  contract: string;
  owner: string;
  isVerifiedContract: boolean;
  hasHiddenFunctions: boolean;
  currentPrice: number;
  lastSale: number;
  collectionFloor: number;
  priceSymbol: string;
  floorPrice: number;
  priceCurrency: string;
  marketCap: string;
  uniqueOwners: number;

  // ✅ Drošības rādītājs
  safetyScore: {
    score: number;
    reason: { factor: string; impact: string }[];
  };

  // ✅ Whale aktivitāte
  whaleHolders: {
    percentage: string; // Nodrošina, ka procenti tiek pārvērsti par string
    suspiciousActivity?: {
      detected: boolean;
      reason: string;
    };
  };

  // ✅ Wash Trading analīze
  washTradingRisk: {
    level: "Low" | "Medium" | "High";
    percentage: string;
    detectedInTransactions: number;
    reason: string;
  };

  // ✅ Tirgus dziļuma analīze
  marketDepth: {
    bidAskSpread: string;
    depthAnalysis: string;
  };

  // ✅ Likviditātes analīze
  liquidity: {
    liquidityScore: "Low" | "Medium" | "High";
    avgTimeOnMarket: string;
    totalTrades: number;
  };

  // ✅ Tirgotāju reputācija
  traderReputation: {
    reputationScore: "Stable" | "Unstable" | "High Risk";
    activeTraders: number;
    newTraders: number;
    newTraderPercentage: string;
  };

  // ✅ Lietotāju ziņojumi
  userReports: {
    reportCount: number;
    reports: string[];
  };
}
