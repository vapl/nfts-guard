export type ScanSummaryInput = {
  contractAddress: string;
  safetyScore: number;
  washTradingIndex: number;
  rugPullRiskLevel: "Low" | "Medium" | "High" | "Uncertain" | "N/A";
  whaleDumpPercent: number;
  sellerBuyerRatio: number;
  uniqueBuyers: number;
  uniqueSellers: number;
  liquidityScore: number;
  volatilityIndex: number;
  volumeTotal: number;
  holderDistribution: {
    whalesPercent: number;
    decentralizationScore: number;
  };
};

export type HolderRiskMetrics = {
  whalesPercent: number;
  decentralizationScore: number;
};
