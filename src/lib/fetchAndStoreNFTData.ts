import { detectWashTrading } from "@/lib/analysis/detectWashTrading";
import { getCollectionData } from "@/lib/reservoir/getReservoirCollections";
import { getNFTSales } from "@/lib/reservoir/getReservoirSales";
import { getNFTTransfers } from "@/lib/reservoir/getReservoirTransfers";
import { getNFTCollectionOwners } from "@/lib/reservoir/getReservoirOwners";
import { detectRugPull } from "@/lib//analysis/detectRugPull";
import { getNFTWhaleActivity } from "@/lib/analysis/analysisWhaleActivity";
import { calculateSafetyScore } from "./analysis/calculateSafetyScore";
import { NFTScanResult } from "@/types/apiTypes/globalApiTypes";

/**
 * ✅ Fetches and stores all NFT-related data for a given contract address
 */
export async function fetchAndAnalyzeNFTData(
  contractAddress: string,
  timePeriod: 1 | 7 | 30 | 90 | 365
): Promise<NFTScanResult | null> {
  try {
    // ✅ Validējam timePeriod
    const allowedPeriods = [1, 7, 30, 90, 365] as const;
    if (!allowedPeriods.includes(timePeriod)) {
      throw new Error(
        `Invalid timePeriod: ${timePeriod}. Allowed values: ${allowedPeriods.join(
          ", "
        )}`
      );
    }

    // ✅ 1️⃣ Iegūst kolekcijas datus un saglabā DB
    const collectionData = await getCollectionData(contractAddress);
    console.log("✅ Collection Data Fetched:", collectionData);

    // ✅ 2️⃣ Iegūst pārdošanas darījumus un saglabā DB
    const salesData = await getNFTSales(contractAddress, timePeriod);
    console.log(`✅ Sales Data Fetched (${salesData.length} records)`);

    // ✅ 3️⃣ Iegūst transakcijas un saglabā DB
    const transferData = await getNFTTransfers(contractAddress, timePeriod);
    console.log(`✅ Transfer Data Fetched (${transferData.length} records)`);

    // ✅ 4️⃣ Iegūst kolekcijas īpašniekus un saglabā DB
    const ownersData = await getNFTCollectionOwners(contractAddress);
    console.log(`✅ Owners Data Fetched (${ownersData.length} records)`);

    // ✅ 5️⃣ Izsauc Wash Trading analīzi pēc tam, kad pārdošanas dati ir ielādēti
    const washTradingAnalysis = await detectWashTrading(
      contractAddress,
      timePeriod
    );

    // ✅ 6️⃣ Izsauc Rug Pull analīzi
    const rugPullAnalysis = await detectRugPull(contractAddress, timePeriod);
    console.log("✅ Rug Pull Analysis Completed:", rugPullAnalysis);

    // Izsauc Whale Activity analīzi
    const whaleActivityAnalysis = await getNFTWhaleActivity(
      contractAddress,
      timePeriod
    );
    console.log("Whale activity analysis completed: ", whaleActivityAnalysis);

    const safetyScore = calculateSafetyScore({
      rugPullRiskLevel: rugPullAnalysis.risk_level as "Low" | "Medium" | "High",
      washTradingIndex: washTradingAnalysis.washTradingIndex ?? 0,
      whaleDumpPercent: Number(rugPullAnalysis.whale_drop_percent ?? 0),
      liquidityRatio:
        collectionData.on_sale_count / collectionData.total_supply,
      floorDropPercent: collectionData.floor_price_change_7d,
      volatilityRiskLevel: collectionData.volatility_risk_level, // 👈 svarīgi!
    });

    const riskLevel =
      safetyScore >= 70 ? "Low" : safetyScore >= 40 ? "Medium" : "High";

    const liquidity = {
      liquidity_ratio:
        collectionData.on_sale_count / collectionData.total_supply,
      score:
        collectionData.on_sale_count < collectionData.total_supply * 0.3
          ? 100
          : 50,
    };

    const priceData = {
      floor_price_1d: collectionData.floor_price_change_24h,
      floor_price_7d: collectionData.floor_price_change_7d,
      floor_price_30d: collectionData.floor_price_change_30d,
    };

    const volatility = {
      riskLevel: collectionData.volatility_risk_level,
      index: collectionData.volatility_index,
    };

    const salesStats = {
      volumeTotal: collectionData.volume_all ?? 0,
      salesCount: collectionData.sales_count ?? 0,
    };

    return {
      collectionData,
      salesData,
      transferData,
      ownersData,
      washTradingAnalysis,
      rugPullAnalysis,
      whaleActivityAnalysis,
      safetyScore,
      riskLevel,
      liquidity,
      priceData,
      volatility,
      salesStats,
    };
  } catch (error) {
    console.error("❌ Error fetching, storing, or analyzing NFT data:", error);
    return null;
  }
}
