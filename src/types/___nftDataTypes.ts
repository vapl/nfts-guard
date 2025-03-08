import { ReactNode } from "react";

export interface NftData {
  owner: ReactNode;
  id: string;
  name: string;
  tokenId: string;
  image?: string;
  contract: string;
  isVerifiedContract: boolean;
  hasHiddenFunctions: boolean;
  currentPrice: number;
  lastSale: number;
  collectionFloor: number;
  rarityRank: number;
  totalSupply: number;
  salesVolume7d: number;
  safetyScore: {
    score: number;
    reason: { factor: string; impact: string }[];
  };
  ownersCount: number;
  transactionCount: number;
  transferCount: number;
  suspiciousTransfers: {
    detected: boolean;
    reason: string;
  };
  whaleHolders: {
    percentage: number;
    suspiciousActivity: {
      detected: boolean;
      reason: string;
    };
  };
  anonymousCreators: {
    detected: boolean;
    reason: string;
  };
  rugPullRisk: {
    level: "Low" | "Medium" | "High";
    reason: string;
    lastLargeOutflow: string;
  };
  washTradingRisk: {
    level: "Low" | "Medium" | "High";
    percentage: string;
    detectedInTransactions: number;
    reason: string;
  };
  socialSignals: {
    twitterFollowers: number;
    discordMembers: number;
    twitterEngagement: string;
  };
  contractCreationDate: string;
  firstSaleDate: string;
  lastActivity: string;
  metadataHosting: {
    provider: string;
    securityRisk: "Low" | "Medium" | "High";
  };
  userReports: {
    count: number;
    context: string;
  };
}
