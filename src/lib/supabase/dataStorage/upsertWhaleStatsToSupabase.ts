import { supabase } from "@/lib/supabase/supabase";
import { WhaleStats } from "@/types/apiTypes/globalApiTypes";

export async function upsertWhaleStatsToSupabase(
  contractAddress: string,
  stats: WhaleStats
) {
  const { error } = await supabase.from("nft_whale_stats").upsert(
    {
      contract_address: contractAddress,
      total_whales: stats.totalWhales,
      total_buys: stats.totalBuys,
      total_sells: stats.totalSells,
      total_transfers: stats.totalTransfers,
      total_eth_spent: stats.totalEthSpent,
      avg_hold_time: stats.avgHoldTime,
      avg_volatility: stats.avgVolatility,
      type_counts: stats.typeCounts,
      top_wallet: stats.topWhale?.wallet ?? null,
      top_wallet_eth: stats.topWhale?.total_eth_spent ?? null,
      last_updated: new Date().toISOString(),
    },
    { onConflict: "contract_address" }
  );

  if (error) {
    console.error("❌ Failed to upsert whale stats:", error);
    throw error;
  }
}
