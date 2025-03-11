import { viemClient } from "@/lib/alchemy";
import { Log, parseAbiItem } from "viem";

/**
 * Vērtē tirgotāju reputāciju, pamatojoties uz darījumu vēsturi
 */
export async function evaluateTraderReputation(contractAddress: string) {
  try {
    const latestBlock = await viemClient.getBlockNumber();
    const blocksInPeriod = 7200 * 30; // 30 dienas

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
      return { reputationScore: "Low", activeTraders: 0, newTraders: 0 };
    }

    const traderActivity: Record<string, number> = {};
    const newTraders: Set<string> = new Set();

    trades.forEach((trade) => {
      const from = trade.topics[1]; // Sūtītājs
      const to = trade.topics[2]; // Saņēmējs

      if (from && to) {
        traderActivity[from] = (traderActivity[from] || 0) + 1;
        traderActivity[to] = (traderActivity[to] || 0) + 1;

        if (traderActivity[from] === 1) newTraders.add(from);
        if (traderActivity[to] === 1) newTraders.add(to);
      }
    });

    const totalTraders = Object.keys(traderActivity).length;
    const newTraderPercentage = parseFloat(
      ((newTraders.size / totalTraders) * 100).toFixed(2)
    );

    return {
      reputationScore: newTraderPercentage > 50 ? "Unstable" : "Stable",
      activeTraders: totalTraders,
      newTraders: newTraders.size,
      newTraderPercentage: `${newTraderPercentage}%`,
    };
  } catch (error) {
    console.error("❌ Error fetching trader reputation:", error);
    return {
      reputationScore: "Unknown",
      activeTraders: 0,
      newTraders: 0,
      newTraderPercentage: "N/A",
    };
  }
}
