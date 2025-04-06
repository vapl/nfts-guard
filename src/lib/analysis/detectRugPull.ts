import { supabase } from "@/lib/supabase/supabase";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";
import { getDateDaysAgo } from "@/utils/dateUtils";
import { RISK_RULES } from "../config/riskRulesConfig";

/**
 * ✅ Fetches NFT ownership data for rug pull analysis (only whales included)
 */
async function getWhaleOwners(
  contractAddress: string,
  days: number
): Promise<NFTCollectionOwnerProps[]> {
  const startDate = getDateDaysAgo(days);

  const { data, error } = await supabase
    .from("nft_owners")
    .select("wallet, token_count, ownership_percentage, is_whale")
    .eq("contract_address", contractAddress)
    .eq("is_whale", true)
    .gte("last_updated", startDate);

  if (error) {
    console.error("❌ Error fetching NFT whale owners:", error);
    return [];
  }
  return data.map((owner) => ({
    ...owner,
    on_sale_count: 0, // Default value for missing property
  }));
}

/**
 * ✅ Fetches floor price history from Supabase
 */
async function getFloorPrice(contractAddress: string): Promise<{
  floor_price_24h: number;
  floor_price_7d: number;
  floor_price_30d: number;
}> {
  const { data, error } = await supabase
    .from("nft_collections")
    .select(
      "floor_price_change_24h, floor_price_change_7d, floor_price_change_30d"
    )
    .eq("contract_address", contractAddress)
    .single();

  if (error || !data) {
    console.error("❌ Error fetching floor price history:", error);
    return { floor_price_24h: 0, floor_price_7d: 0, floor_price_30d: 0 };
  }
  return {
    floor_price_24h: data.floor_price_change_24h ?? 0,
    floor_price_7d: data.floor_price_change_7d ?? 0,
    floor_price_30d: data.floor_price_change_30d ?? 0,
  };
}

/**
 * ✅ Fetches NFT transfers for wallet movement analysis
 */
async function getNFTTransfers(contractAddress: string, days: number) {
  const startDate = getDateDaysAgo(days);

  const { data, error } = await supabase
    .from("nft_transfers")
    .select("from_wallet, to_wallet, amount, timestamp")
    .eq("contract_address", contractAddress)
    .gte("timestamp", startDate);

  if (error) {
    console.error("❌ Error fetching NFT transfers:", error);
    return [];
  }
  return data;
}

/**
 * ✅ Detects potential rug pull risk based on whale activity, NFT transfers, and floor price drops
 */
async function detectRugPull(contractAddress: string, days: number = 30) {
  console.log(
    `🔎 Analyzing rug pull risk for: ${contractAddress} over ${days} days`
  );

  // ✅ 1️⃣ Iegūst whale īpašniekus (tikai lielos turētājus)
  const whales = await getWhaleOwners(contractAddress, days);
  const initialWhales = await getWhaleOwners(contractAddress, days * 2);
  const currentWhaleCount = whales.length;
  const initialWhaleCount = initialWhales.length || 1; // Avoid division by zero

  // ✅ 2️⃣ Aprēķina whale skaita izmaiņas
  const whaleDropPercent =
    ((initialWhaleCount - currentWhaleCount) / initialWhaleCount) * 100;

  // ✅ 3️⃣ Iegūst floor price izmaiņas
  const { floor_price_24h, floor_price_7d, floor_price_30d } =
    await getFloorPrice(contractAddress);

  // ✅ 4️⃣ Analizē NFT pārsūtījumus
  async function getCollectionMetadata(
    contractAddress: string
  ): Promise<{ total_supply: number }> {
    const { data, error } = await supabase
      .from("nft_collections")
      .select("total_supply")
      .eq("contract_address", contractAddress)
      .single();

    if (error || !data) {
      console.warn("⚠️ No total_supply found, using default fallback.");
      return { total_supply: 10000 }; // drošs defaults
    }

    return { total_supply: data.total_supply };
  }

  const { total_supply } = await getCollectionMetadata(contractAddress);

  // Uzskati par "lielu pārsūtījumu" jebko, kas pārsniedz 1% no kolekcijas vai vismaz 2 tokenus
  const largeTransferThreshold = Math.max(Math.floor(total_supply * 0.01), 2);

  const transfers = await getNFTTransfers(contractAddress, days);
  const uniqueSellers = new Set(transfers.map((t) => t.from_wallet));
  const uniqueBuyers = new Set(transfers.map((t) => t.to_wallet));
  const largeTransfers = transfers.filter(
    (t) => t.amount > largeTransferThreshold
  ).length;
  const sellerToBuyerRatio = uniqueSellers.size / (uniqueBuyers.size || 1);

  const R = RISK_RULES.rugPull;
  // ✅ 5️⃣ Noteikšana, vai pastāv Rug Pull risks
  let rugPullRisk = "Low";

  if (uniqueSellers.size < 3 || uniqueBuyers.size < 3) {
    rugPullRisk = "Uncertain";
  } else if (
    whaleDropPercent > R.high.whaleDrop ||
    floor_price_24h < R.high.floorDrop24h ||
    largeTransfers > R.high.largeTransfers ||
    sellerToBuyerRatio > R.high.sellerToBuyerRatio
  ) {
    rugPullRisk = "High";
  } else if (
    whaleDropPercent > R.medium.whaleDrop ||
    floor_price_7d < R.medium.floorDrop7d ||
    sellerToBuyerRatio > R.medium.sellerToBuyerRatio ||
    uniqueSellers.size < 5 ||
    uniqueBuyers.size < 5
  ) {
    rugPullRisk = "Medium";
  }

  console.log(`🚨 Rug Pull Risk Level: ${rugPullRisk}`);

  // ✅ Saglabā rezultātus datubāzē
  await supabase.from("nft_rug_pull_analysis").insert({
    contract_address: contractAddress,
    whale_drop_percent: whaleDropPercent.toFixed(2),
    floor_price_24h,
    floor_price_7d,
    floor_price_30d,
    large_transfers: largeTransfers,
    unique_sellers: uniqueSellers.size,
    unique_buyers: uniqueBuyers.size,
    seller_to_buyer_ratio: sellerToBuyerRatio.toFixed(2),
    risk_level: rugPullRisk,
    detected_at: new Date().toISOString(),
  });

  return {
    risk_level: rugPullRisk,
    whale_drop_percent: whaleDropPercent.toFixed(2),
    floor_price_24h: floor_price_24h,
    floor_price_7d: floor_price_7d,
    floor_price_30d: floor_price_30d,
    unique_sellers: uniqueSellers.size,
    unique_buyers: uniqueBuyers.size,
    large_transfers: largeTransfers,
    seller_to_buyer_ratio: sellerToBuyerRatio.toFixed(2),
  };
}

export { detectRugPull };
