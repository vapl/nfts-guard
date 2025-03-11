import { viemClient } from "@/lib/alchemy";
import { Log, parseAbiItem } from "viem"; // Viem nodrošina šo tipu

/**
 * Analizē NFT kolekcijas likviditāti
 */
export async function analyzeLiquidity(contractAddress: string) {
  try {
    const latestBlock = await viemClient.getBlockNumber();
    const blocksPerDay = 7200; // Aptuveni 12 sek. blokam Ethereum
    const blocksInPeriod = blocksPerDay * 7; // 7 dienas

    const transferEvent = parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    );

    const trades: Log[] = await viemClient.getLogs({
      address: contractAddress as `0x${string}`,
      fromBlock: latestBlock - BigInt(blocksInPeriod),
      toBlock: latestBlock,
      event: transferEvent,
    });

    if (trades.length === 0) {
      return {
        liquidityScore: "Low",
        avgTimeOnMarket: "N/A",
        totalTrades: 0,
      };
    }

    const timestamps = trades.map((trade) => Number(trade.blockNumber));
    timestamps.sort((a, b) => a - b);

    const timeDiffs = timestamps
      .map((time, index) => (index === 0 ? 0 : time - timestamps[index - 1]))
      .filter((diff) => diff > 0);

    const avgTimeOnMarket =
      timeDiffs.reduce((sum, t) => sum + t, 0) / timeDiffs.length || 0;

    return {
      liquidityScore: avgTimeOnMarket < blocksPerDay ? "High" : "Medium",
      avgTimeOnMarket: `${(avgTimeOnMarket / blocksPerDay).toFixed(2)} days`,
      totalTrades: trades.length,
    };
  } catch (error) {
    console.error("❌ Error fetching liquidity data:", error);
    return {
      liquidityScore: "Unknown",
      avgTimeOnMarket: "N/A",
      totalTrades: 0,
    };
  }
}
