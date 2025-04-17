import { supabase } from "@/lib/supabase/supabase";
import { getDateDaysAgo } from "@/utils/dateUtils";
import { RISK_RULES } from "@/lib/config/riskRulesConfig";
import { RugPullResult } from "@/types/apiTypes/globalApiTypes";

export async function detectRugPull(
  contractAddress: string,
  days: number = 30
): Promise<RugPullResult> {
  try {
    const startDate = getDateDaysAgo(days);
    const earlierDate = getDateDaysAgo(days * 2);

    // 1. Whale īpašnieku skaits
    const { data: currentWhales } = await supabase
      .from("nft_owners")
      .select("wallet")
      .eq("contract_address", contractAddress)
      .eq("is_whale", true)
      .gte("last_updated", startDate);

    const { data: initialWhales } = await supabase
      .from("nft_owners")
      .select("wallet")
      .eq("contract_address", contractAddress)
      .eq("is_whale", true)
      .gte("last_updated", earlierDate);

    const currentWhaleCount = currentWhales?.length ?? 0;
    const initialWhaleCount = initialWhales?.length || 1; // izvairāmies no /0
    const whaleDropPercent =
      ((initialWhaleCount - currentWhaleCount) / initialWhaleCount) * 100;

    // 2. Floor price
    const { data: priceData } = await supabase
      .from("nft_collections")
      .select(
        "floor_price_change_24h, floor_price_change_7d, floor_price_change_30d"
      )
      .eq("contract_address", contractAddress)
      .single();

    const floor_price_24h = priceData?.floor_price_change_24h ?? 0;
    const floor_price_7d = priceData?.floor_price_change_7d ?? 0;
    const floor_price_30d = priceData?.floor_price_change_30d ?? 0;

    // 3. NFT pārsūtījumi
    const { data: transfers } = await supabase
      .from("nft_transfers")
      .select("from_wallet, to_wallet, amount")
      .eq("contract_address", contractAddress)
      .gte("timestamp", startDate);

    const uniqueSellers = new Set(transfers?.map((t) => t.from_wallet)).size;
    const uniqueBuyers = new Set(transfers?.map((t) => t.to_wallet)).size;

    const { data: meta } = await supabase
      .from("nft_collections")
      .select("total_supply")
      .eq("contract_address", contractAddress)
      .single();

    const totalSupply = meta?.total_supply ?? 10000;
    const largeTransferThreshold = Math.max(Math.floor(totalSupply * 0.01), 2);

    const largeTransfers =
      transfers?.filter((t) => t.amount > largeTransferThreshold).length ?? 0;
    const sellerToBuyerRatio = uniqueSellers / (uniqueBuyers || 1);

    // 4. Riska aprēķins
    const R = RISK_RULES.rugPull;
    let risk: RugPullResult["risk_level"] = "Low";

    if (uniqueSellers < 3 || uniqueBuyers < 3) {
      risk = "Uncertain";
    } else if (
      whaleDropPercent > R.high.whaleDrop ||
      floor_price_24h < R.high.floorDrop24h ||
      largeTransfers > R.high.largeTransfers ||
      sellerToBuyerRatio > R.high.sellerToBuyerRatio
    ) {
      risk = "High";
    } else if (
      whaleDropPercent > R.medium.whaleDrop ||
      floor_price_7d < R.medium.floorDrop7d ||
      sellerToBuyerRatio > R.medium.sellerToBuyerRatio ||
      uniqueSellers < 5 ||
      uniqueBuyers < 5
    ) {
      risk = "Medium";
    }

    // 5. Rug Pull risk percent (0–100%)
    const W = RISK_RULES.rugPullPercentWeights;
    let rug_pull_percent = 0;

    if (risk !== "Uncertain") {
      if (whaleDropPercent > R.high.whaleDrop) rug_pull_percent += W.whaleDrop;
      if (floor_price_24h < R.high.floorDrop24h)
        rug_pull_percent += W.floorDrop;
      if (largeTransfers > R.high.largeTransfers)
        rug_pull_percent += W.largeTransfers;
      if (sellerToBuyerRatio > R.high.sellerToBuyerRatio)
        rug_pull_percent += W.sellerToBuyerRatio;
      if (uniqueSellers < 3) rug_pull_percent += W.fewSellers;
      if (uniqueBuyers < 3) rug_pull_percent += W.fewBuyers;
    }

    rug_pull_percent = Math.min(rug_pull_percent, 100);

    return {
      risk_level: risk,
      rug_pull_percent: Number(rug_pull_percent.toFixed(1)), // <- JAUNS LAUKS
      whale_drop_percent: Number(whaleDropPercent.toFixed(2)),
      floor_price_24h,
      floor_price_7d,
      floor_price_30d,
      unique_sellers: uniqueSellers,
      unique_buyers: uniqueBuyers,
      large_transfers: largeTransfers,
      seller_to_buyer_ratio: sellerToBuyerRatio.toFixed(2),
    };
  } catch (error) {
    console.error("Error detecting rug pull:", error);
    throw new Error("Failed to detect rug pull");
  }
}
