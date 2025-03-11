import { getNFTCollectionData, fetchNFTPriceHistory } from "@/lib/nft";
import { getMarketDepthViem } from "@/lib/marketDepth";
import { analyzeLiquidity } from "@/lib/liquidityAnalisys";
import { evaluateTraderReputation } from "@/lib/traderReputation";

/**
 * Aprēķina wash trading risku, balstoties uz statistisko analīzi
 */
function analyzeWashTrading(trades: any[], floorPrice: number) {
  if (trades.length < 5) return "Low";

  const prices = trades.map((t) => t.trade_price);
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance =
    prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) /
    prices.length;
  const stdDev = Math.sqrt(variance);

  const priceDeviation = Math.abs(avgPrice - floorPrice) / floorPrice;

  console.log(
    `📊 Avg Price: ${avgPrice.toFixed(2)}, Std Dev: ${stdDev.toFixed(
      2
    )}, Deviation from Floor: ${priceDeviation.toFixed(2)}`
  );

  if (priceDeviation > 0.3) return "High";
  if (stdDev > avgPrice * 0.5) return "High";
  if (stdDev > avgPrice * 0.2) return "Medium";

  return "Low";
}

/**
 * Pārbauda ping-pong darījumus pēc adresēm un NFT token ID
 */
function detectPingPongTrading(trades: any[]) {
  const nftTransferHistory: Record<string, string[]> = {};
  const pairInteractions: Record<string, number> = {};
  const pingPongTrades: any[] = [];

  trades.forEach((trade) => {
    const { from, to, token_id } = trade;
    const pairKey = [from, to].sort().join("-");

    pairInteractions[pairKey] = (pairInteractions[pairKey] || 0) + 1;

    if (!nftTransferHistory[token_id]) {
      nftTransferHistory[token_id] = [];
    }
    nftTransferHistory[token_id].push(from, to);

    if (pairInteractions[pairKey] > 2) {
      pingPongTrades.push({
        ...trade,
        pingPongCount: pairInteractions[pairKey],
      });
    }
  });

  const suspiciousNFTs = Object.keys(nftTransferHistory).filter(
    (tokenId) => new Set(nftTransferHistory[tokenId]).size <= 2
  );

  return {
    pingPongTrades,
    suspiciousNFTs,
    suspiciousPairsCount: suspiciousNFTs.length,
  };
}

/**
 * Identificē ļoti ātrus darījumus (<10 min starplaiks)
 */
function detectQuickTrades(trades: any[]) {
  const quickTrades = trades.filter((trade, index, array) => {
    if (index === 0) return false;
    const prevTrade = array[index - 1];
    const timeDiff =
      Math.abs(
        new Date(trade.timestamp).getTime() -
          new Date(prevTrade.timestamp).getTime()
      ) / 1000;
    return timeDiff < 600;
  });

  return quickTrades;
}

/**
 * Identificē neparasti aktīvus kontus
 */
function detectHighFrequencyTrading(trades: any[]) {
  const addressActivity: Record<string, number> = {};

  trades.forEach(({ from, to }) => {
    addressActivity[from] = (addressActivity[from] || 0) + 1;
    addressActivity[to] = (addressActivity[to] || 0) + 1;
  });

  const totalActivity = Object.values(addressActivity).reduce(
    (sum, count) => sum + count,
    0
  );
  const averageActivity = totalActivity / Object.keys(addressActivity).length;

  const suspiciousAddresses = Object.keys(addressActivity)
    .filter((addr) => addressActivity[addr] > averageActivity * 3)
    .map((addr) => ({
      address: addr,
      activityCount: addressActivity[addr],
      timesAboveAverage: (addressActivity[addr] / averageActivity).toFixed(1),
    }));

  return { suspiciousAddresses, averageActivity };
}

/**
 * Wash trading detektēšanas galvenā funkcija
 */
export const detectWashTrading = async (
  contractAddress: string,
  scanPeriod: "24h" | "7d" | "30d" | "6m" = "7d"
) => {
  console.log(
    `📡 Detecting wash trading for: ${contractAddress}, Period: ${scanPeriod}`
  );

  if (!contractAddress || typeof contractAddress !== "string") {
    return { error: "❌ Invalid contract address" };
  }

  const [
    collectionData,
    tradeHistory,
    marketDepth,
    liquidity,
    traderReputation,
  ] = await Promise.all([
    getNFTCollectionData(contractAddress),
    fetchNFTPriceHistory(contractAddress, scanPeriod),
    getMarketDepthViem(contractAddress),
    analyzeLiquidity(contractAddress),
    evaluateTraderReputation(contractAddress),
  ]);

  if (!tradeHistory.trades || tradeHistory.trades.length === 0) {
    return {
      washTradingRisk: "Low",
      reason: "No trade history found",
      totalTradeVolume: "0",
      trades: [],
      detailedAnalysis: null,
    };
  }

  const floorPrice = Number(collectionData.floorPrice) || 0;
  const washTradingRisk = analyzeWashTrading(tradeHistory.trades, floorPrice);
  const pingPongAnalysis = detectPingPongTrading(tradeHistory.trades);
  const highFrequencyAnalysis = detectHighFrequencyTrading(tradeHistory.trades);
  const quickTrades = detectQuickTrades(tradeHistory.trades);

  let severityScore = 0;
  if (pingPongAnalysis.suspiciousPairsCount > 0) severityScore += 3;
  if (highFrequencyAnalysis.suspiciousAddresses.length > 2) severityScore += 2;
  if (quickTrades.length > 5) severityScore += 3;
  if (washTradingRisk === "High") severityScore += 2;

  const riskLevel =
    severityScore >= 6 ? "High" : severityScore >= 3 ? "Medium" : "Low";

  return {
    washTradingRisk: riskLevel,
    reason:
      severityScore > 0
        ? "Multiple suspicious indicators detected"
        : "Standard statistical analysis",
    totalTradeVolume: `${tradeHistory.volume.toFixed(2)} ETH`,
    filteredTradeVolume: `${tradeHistory.trades
      .filter(
        (trade: { from: string; to: string }) =>
          !highFrequencyAnalysis.suspiciousAddresses.some(
            (addr) => addr.address === trade.from || addr.address === trade.to
          )
      )
      .reduce(
        (sum: any, trade: { trade_price: any }) => sum + trade.trade_price,
        0
      )
      .toFixed(2)} ETH`,
    trades: tradeHistory.trades.slice(0, 50),
    detailedAnalysis: {
      price: {
        avgPrice:
          tradeHistory.trades.reduce(
            (sum: any, t: { trade_price: any }) => sum + t.trade_price,
            0
          ) / tradeHistory.trades.length,
        totalVolume: tradeHistory.volume,
        totalTrades: tradeHistory.trades.length,
      },
      pingPong: pingPongAnalysis,
      quickTrades: {
        count: quickTrades.length,
        suspiciousTrades: quickTrades.slice(0, 10),
      },
      highFrequency: highFrequencyAnalysis,
      marketDepth,
      liquidity,
      traderReputation,
    },
  };
};
