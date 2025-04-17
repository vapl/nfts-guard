export const RISK_RULES = {
  rugPull: {
    high: {
      whaleDrop: 20, // %
      floorDrop24h: -30, // %
      largeTransfers: 10, // count
      sellerToBuyerRatio: 2,
    },
    medium: {
      whaleDrop: 10,
      floorDrop7d: -20,
      sellerToBuyerRatio: 1.5,
    },
  },

  rugPullPercentWeights: {
    whaleDrop: 25,
    floorDrop: 20,
    largeTransfers: 15,
    sellerToBuyerRatio: 15,
    fewSellers: 12.5,
    fewBuyers: 12.5,
  },

  washTrading: {
    highThreshold: 50, // %
    mediumThreshold: 20, // %
  },

  whaleDefinition: {
    minTokenCount: 11,
    minOwnershipPercentage: 1,
  },

  safetyScoreWeights: {
    rugPull: 0.3,
    washTrading: 0.3,
    whaleDump: 0.15,
    liquidity: 0.1,
    floorPrice: 0.05,
    volatility: 0.1,
  },
};
