import { NextResponse } from "next/server";
import { fetchAndAnalyzeNFTData } from "@/lib/fetchAndStoreNFTData";
import { supabase } from "@/lib/supabase/supabase";
import {
  generateHolderDistributionData,
  generateHolderRiskMetrics,
} from "@/lib/analysis/generateHolderDistributionData";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";
import { upsertHolderDistribution } from "@/lib/supabase/helpers/upsertHolderDistribution";
import { calculateSafetyScore } from "@/lib/analysis/calculateSafetyScore";
import { upsertAnalysis } from "@/lib/supabase/helpers/upsertAnalysis";

export const config = {
  runtime: "nodejs",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contractAddress, timePeriod = 30 } = body;

    if (!contractAddress) {
      return NextResponse.json(
        { error: "Missing contract address" },
        { status: 400 }
      );
    }

    // ✅ 1. Fetch + Analyze NFT data
    const result = await fetchAndAnalyzeNFTData(contractAddress, timePeriod);

    const rugPull = result?.rugPullAnalysis;
    const washIndex = result?.washTradingAnalysis?.washTradingIndex ?? 0;
    const rugRisk = rugPull?.risk_level as
      | "Low"
      | "Medium"
      | "High"
      | "Uncertain"
      | "N/A";

    // ✅ 2. Get holder data and save distribution
    const { data: owners, error } = await supabase
      .from("nft_owners")
      .select("wallet, token_count, ownership_percentage, on_sale_count")
      .eq("contract_address", contractAddress);

    if (error || !owners) {
      console.error("❌ Supabase error fetching holders:", error);
      return NextResponse.json(
        { error: "Error fetching holders" },
        { status: 500 }
      );
    }

    const holderDistribution = generateHolderDistributionData(
      owners as NFTCollectionOwnerProps[]
    );
    await upsertHolderDistribution(contractAddress, holderDistribution);

    const holderRisk = generateHolderRiskMetrics(owners);

    // ✅ 3. Safety Score
    const safetyScore = calculateSafetyScore({
      rugPullRiskLevel: rugRisk,
      washTradingIndex: washIndex,
      whaleDumpPercent: rugPull?.whale_drop_percent ?? 0,
      liquidityRatio: result?.liquidity?.liquidity_ratio ?? 0,
      floorDropPercent: result?.priceData?.floor_price_7d ?? 0,
      volatilityRiskLevel: result?.volatility?.riskLevel ?? "Low",
      salesCount: result?.salesStats?.salesCount ?? 0,
      uniqueBuyers: rugPull?.unique_buyers ?? 0,
      uniqueSellers: rugPull?.unique_sellers ?? 0,
    });

    // ✅ 4. Build full summary input
    const scanInput = {
      contractAddress,
      safetyScore,
      washTradingIndex: washIndex,
      rugPullRiskLevel: rugRisk,
      whaleDumpPercent: rugPull?.whale_drop_percent ?? 0,
      sellerBuyerRatio: parseFloat(rugPull?.seller_to_buyer_ratio ?? "0"),
      uniqueBuyers: rugPull?.unique_buyers ?? 0,
      uniqueSellers: rugPull?.unique_sellers ?? 0,
      liquidityScore: result?.liquidity?.score ?? 0,
      volatilityIndex: result?.volatility?.index ?? 0,
      volumeTotal: result?.salesStats?.volumeTotal ?? 0,
      holderDistribution: {
        whalesPercent: holderRisk.whalesPercent ?? 0,
        decentralizationScore: holderRisk.decentralizationScore ?? 0,
      },
    };

    // ✅ 5. Save to analysis table (so /api/generate-scan-summary will use updated data)
    await upsertAnalysis(contractAddress, { summary: undefined }); // Reset summary so AI route will regenerate
    await supabase.from("nft_ai_analysis_results").upsert({
      contract_address: contractAddress,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      contractAddress,
      safetyScore,
      riskLevel: rugRisk,
      holderDistribution,
      scanInput,
      ...result,
    });
  } catch (error) {
    console.error("❌ API error in fetch-nft-data:", error);
    return NextResponse.json(
      { error: "Server error fetching NFT data" },
      { status: 500 }
    );
  }
}
