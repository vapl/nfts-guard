import { supabase } from "@/lib/supabase";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";

/**
 * ✅ Fetches NFT ownership data for rug pull analysis (only whales included)
 */
async function getWhaleOwners(
  contractAddress: string,
  days: number
): Promise<NFTCollectionOwnerProps[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("nft_owners")
    .select("wallet, token_count, ownership_percentage, is_whale")
    .eq("contract_address", contractAddress)
    .eq("is_whale", true)
    .gte("last_updated", startDate.toISOString());

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
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("nft_transfers")
    .select("from_wallet, to_wallet, amount, timestamp")
    .eq("contract_address", contractAddress)
    .gte("timestamp", startDate.toISOString());

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
  const transfers = await getNFTTransfers(contractAddress, days);
  const uniqueSellers = new Set(transfers.map((t) => t.from_wallet));
  const uniqueBuyers = new Set(transfers.map((t) => t.to_wallet));
  const largeTransfers = transfers.filter((t) => t.amount > 10).length;
  const sellerToBuyerRatio = uniqueSellers.size / (uniqueBuyers.size || 1);

  // ✅ 5️⃣ Noteikšana, vai pastāv Rug Pull risks
  let rugPullRisk = "Low";
  if (
    whaleDropPercent > 20 ||
    floor_price_24h < -30 ||
    largeTransfers > 10 ||
    sellerToBuyerRatio > 2
  ) {
    rugPullRisk = "High";
  } else if (
    whaleDropPercent > 10 ||
    floor_price_7d < -20 ||
    sellerToBuyerRatio > 1.5
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
    riskLevel: rugPullRisk,
    whaleDropPercent: whaleDropPercent.toFixed(2),
    floorPrice24h: floor_price_24h,
    floorPrice7d: floor_price_7d,
    floorPrice30d: floor_price_30d,
    uniqueSellers: uniqueSellers.size,
    uniqueBuyers: uniqueBuyers.size,
    largeTransfers,
    sellerToBuyerRatio: sellerToBuyerRatio.toFixed(2),
  };
}

export { detectRugPull };
