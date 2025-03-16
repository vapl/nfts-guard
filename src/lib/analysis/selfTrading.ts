import { NFTTransactionProps } from "@/types/apiTypes/globalApiTypes";
import { supabase } from "@/lib/supabase";

/**
 * 🚀 Detect self-trading patterns, including cycles and batch sales
 */
export async function detectSelfTrading(
  sales: NFTTransactionProps[],
  contractAddress: string
) {
  try {
    if (!sales || sales.length === 0) {
      console.warn("⚠️ No sales found.");
      return [];
    }

    // Map to track NFT sales between the same addresses
    const suspiciousPairs = new Map();
    const transactionCycles = new Map();
    const batchTransactions = new Map();

    sales.forEach((sale) => {
      const key = `${sale.token_id}-${sale.from_address}-${sale.to_address}`;
      const cycleKey = `${sale.token_id}-${sale.to_address}-${sale.from_address}`;
      const batchKey = `${sale.tx_hash}-${sale.from_address}-${sale.to_address}`;

      // Count direct repeated transactions
      suspiciousPairs.set(key, (suspiciousPairs.get(key) || 0) + 1);

      // Detect cycles (A → B → A)
      if (transactionCycles.has(cycleKey)) {
        transactionCycles.set(cycleKey, transactionCycles.get(cycleKey) + 1);
      } else {
        transactionCycles.set(cycleKey, 1);
      }

      // Detect multiple NFT transfers in a single transaction (batch sales)
      batchTransactions.set(
        batchKey,
        (batchTransactions.get(batchKey) || 0) + 1
      );
    });

    // Flag repeated transactions between the same addresses
    const flaggedTransactions = [...suspiciousPairs.entries()]
      .filter(([, count]) => count > 1)
      .map(([key, count]) => {
        const [token_id, from_address, to_address] = key.split("-");
        return {
          contract_address: contractAddress,
          token_id,
          from_address,
          to_address,
          count,
          type: "direct_repeat" as const, // Type: direct repeated transactions
        };
      });

    // Flag transaction cycles (A → B → A)
    const flaggedCycles = [...transactionCycles.entries()]
      .filter(([, count]) => count > 1)
      .map(([key, count]) => {
        const [token_id, to_address, from_address] = key.split("-");
        return {
          contract_address: contractAddress,
          token_id,
          from_address,
          to_address,
          count,
          type: "transaction_cycle" as const, // Type: cycles (A → B → A)
        };
      });

    // Flag batch sales (multiple NFTs in one transaction)
    const flaggedBatchSales = [...batchTransactions.entries()]
      .filter(([, count]) => count > 2) // More than 2 NFTs per transaction
      .map(([key, count]) => {
        const [tx_hash, from_address, to_address] = key.split("-");
        return {
          contract_address: contractAddress,
          tx_hash,
          from_address,
          to_address,
          count,
          type: "batch_sale" as const, // Type: multiple NFTs in a single transaction
        };
      });

    const flaggedResults = [
      ...flaggedTransactions,
      ...flaggedCycles,
      ...flaggedBatchSales,
    ];

    console.log(
      `⚠️ Detected ${flaggedResults.length} suspicious self-trading activities.`
    );
    console.log("Flagged results:", flaggedResults);

    // Save flagged transactions to Supabase
    if (flaggedResults.length > 0) {
      await saveSelfTradingToSupabase(flaggedResults);
    }

    return flaggedResults;
  } catch (error) {
    console.error("❌ Error detecting self-trading:", error);
    return [];
  }
}

/**
 * 🚀 Save self-trading alerts to Supabase
 */
interface SuspiciousTradeProps {
  contract_address: string;
  token_id?: string;
  tx_hash?: string;
  from_address: string;
  to_address: string;
  count: number;
  type: "direct_repeat" | "transaction_cycle" | "batch_sale"; // Identifies the type of wash trading
}

async function saveSelfTradingToSupabase(
  suspiciousTrades: SuspiciousTradeProps[]
) {
  try {
    console.log("🔄 Saving self-trading alerts to Supabase...");

    const { error } = await supabase
      .from("nft_self_trading_alerts")
      .insert(suspiciousTrades);

    if (error) {
      console.error("❌ Error saving self-trading alerts:", error);
    } else {
      console.log("✅ Self-trading alerts successfully saved to Supabase!");
    }
  } catch (error) {
    console.error("❌ Critical error saving self-trading alerts:", error);
  }
}
