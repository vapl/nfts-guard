const mockNFTResults = [
  {
    id: "1",
    name: "Bored Ape #567",
    tokenId: "567",
    image: "https://boredapeyachtclub.com/api/images/567.png",
    contract: "0xDEADBEEF123456...",
    isVerifiedContract: true,
    hasHiddenFunctions: false,
    currentPrice: 25.3,
    lastSale: 18.5,
    collectionFloor: 22.0,
    rarityRank: 123,
    totalSupply: 10000,
    salesVolume7d: 320,
    safetyScore: {
      score: 75,
      reason: [
        { factor: "New contract", impact: "-10" },
        { factor: "Low trading volume", impact: "-5" },
        { factor: "Wash trading detected", impact: "-10" },
      ],
    },
    ownersCount: 5,
    transactionCount: 12,
    transferCount: 25,
    suspiciousTransfers: {
      detected: false,
      reason: "",
    },
    whaleHolders: {
      percentage: 60,
      suspiciousActivity: {
        detected: true,
        reason: "3 largest holders sold 60% of their holdings in 24h",
      },
    },
    anonymousCreators: {
      detected: true,
      reason: "No public team information available",
    },
    rugPullRisk: {
      level: "High" as const,
      reason: "Contract age 6 months, no major outflows",
      lastLargeOutflow: "2023-12-15",
    },
    washTradingRisk: {
      level: "High" as const,
      percentage: "25%",
      detectedInTransactions: 5,
      reason: "Detected in 5/20 transactions, same buyer-seller pattern",
    },
    socialSignals: {
      twitterFollowers: 150000,
      discordMembers: 90000,
      twitterEngagement: "8% (Moderate)",
    },
    contractCreationDate: "2024-02-15",
    firstSaleDate: "2024-02-20",
    lastActivity: "2024-03-02",
    metadataHosting: {
      provider: "IPFS",
      securityRisk: "Low" as const, // Stingrs literals
    },
    userReports: {
      count: 3,
      context: "Last 30 days, user-submitted",
    },
  },
  {
    id: "2",
    name: "Scam Ape #999",
    tokenId: "999",
    image: "/images/placeholder.png",
    contract: "0xSCAM123456...",
    isVerifiedContract: false,
    hasHiddenFunctions: true,
    currentPrice: 1.0,
    lastSale: 0.5,
    collectionFloor: 0.8,
    rarityRank: 5000,
    totalSupply: 10000,
    salesVolume7d: 10,
    safetyScore: {
      score: 30,
      reason: [
        { factor: "Unverified contract", impact: "-30" },
        { factor: "High rug pull risk", impact: "-40" },
      ],
    },
    ownersCount: 2,
    transactionCount: 5,
    transferCount: 5,
    suspiciousTransfers: {
      detected: true,
      reason: "Large outflows to unknown wallets",
    },
    whaleHolders: {
      percentage: 10,
      suspiciousActivity: {
        detected: false,
        reason: "",
      },
    },
    anonymousCreators: {
      detected: true,
      reason: "No team info",
    },
    rugPullRisk: {
      level: "High" as const,
      reason: "Recent large outflow",
      lastLargeOutflow: "2024-03-01",
    },
    washTradingRisk: {
      level: "Low" as const,
      percentage: "5%",
      detectedInTransactions: 0,
      reason: "No pattern detected",
    },
    socialSignals: {
      twitterFollowers: 100,
      discordMembers: 50,
      twitterEngagement: "2% (Low)",
    },
    contractCreationDate: "2024-03-01",
    firstSaleDate: "2024-03-02",
    lastActivity: "2024-03-02",
    metadataHosting: {
      provider: "Private Server",
      securityRisk: "High" as const,
    },
    userReports: {
      count: 5,
      context: "Last 30 days, user-submitted",
    },
  },
];

export default mockNFTResults;
