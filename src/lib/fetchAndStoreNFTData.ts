import { detectWashTrading } from "@/lib/analysis/detectWashTrading";
import { getCollectionData } from "@/lib/reservoir/getReservoirCollections";
import { getNFTSales } from "@/lib/reservoir/getReservoirSales";
import { getNFTTransfers } from "@/lib/reservoir/getReservoirTransfers";
import { getNFTCollectionOwners } from "@/lib/reservoir/getReservoirOwners";
import { detectRugPull } from "@/lib//analysis/detectRugPull";
import { getNFTWhaleActivity } from "@/lib/analysis/analysisWhaleActivity";
import { calculateSafetyScore } from "./analysis/calculateSafetyScore";

/**
 * ✅ Fetches and stores all NFT-related data for a given contract address
 */
export async function fetchAndAnalyzeNFTData(
  contractAddress: string,
  timePeriod: 1 | 7 | 30 | 90 | 365
) {
  console.log(
    `🚀 Starting full data fetch and analysis for contract: ${contractAddress}`
  );

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
    console.log("✅ Wash Trading Analysis Completed:", washTradingAnalysis);

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

    console.log("🎯 All data successfully fetched, stored, and analyzed!");
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
    };
  } catch (error) {
    console.error("❌ Error fetching, storing, or analyzing NFT data:", error);
    return null;
  }
}
