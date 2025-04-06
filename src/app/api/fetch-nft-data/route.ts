import { NextResponse } from "next/server";
import { fetchAndAnalyzeNFTData } from "@/lib/fetchAndStoreNFTData";
import { supabase } from "@/lib/supabase/supabase";
import { generateHolderDistributionData } from "@/lib/analysis/generateHolderDistributionData";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";
import { upsertHolderDistribution } from "@/lib/supabase/helpers/upsertHolderDistribution";

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

    // ✅ Fetch core NFT data + risk analysis
    const result = await fetchAndAnalyzeNFTData(contractAddress, timePeriod);

    // ✅ Safety Score calculation
    const washIndex = result?.washTradingAnalysis?.washTradingIndex ?? 0;
    const rugRisk = result?.rugPullAnalysis?.risk_level ?? "N/A";
    const safetyScore = calculateSafetyScore(washIndex, rugRisk);

    // ✅ Holder Distribution calculation
    const { data: owners, error } = await supabase
      .from("nft_owners")
      .select("wallet, token_count")
      .eq("contract_address", contractAddress);

    if (error || !owners) {
      console.error("❌ Supabase error fetching holders:", error);
      return NextResponse.json(
        { error: "Error fetching holders" },
        { status: 500 }
      );
    }

    const holderDistribution =
      owners && Array.isArray(owners)
        ? generateHolderDistributionData(owners as NFTCollectionOwnerProps[])
        : null;

    if (holderDistribution) {
      await upsertHolderDistribution(contractAddress, holderDistribution);
    }

    return NextResponse.json({
      contractAddress,
      safetyScore,
      riskLevel: rugRisk,
      holderDistribution,
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

function calculateSafetyScore(washIndex: number, rugRisk: string): number {
  let score = 100;
  if (washIndex > 50) score -= 30;
  else if (washIndex > 20) score -= 15;

  if (rugRisk === "High") score -= 40;
  else if (rugRisk === "Medium") score -= 20;

  return Math.max(0, Math.min(score, 100));
}
