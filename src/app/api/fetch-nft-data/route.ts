import { NextResponse } from "next/server";
import { fetchAndAnalyzeNFTData } from "@/lib/fetchAndStoreNFTData";

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

    const result = await fetchAndAnalyzeNFTData(contractAddress, timePeriod);

    // Optionally calculate safetyScore here based on result
    const washIndex = result?.washTradingAnalysis?.washTradingIndex ?? 0;
    const rugRisk = result?.rugPullAnalysis?.risk_level ?? "N/A";

    const safetyScore = calculateSafetyScore(washIndex, rugRisk);

    return NextResponse.json({
      contractAddress,
      safetyScore,
      riskLevel: result?.rugPullAnalysis.risk_level ?? "N/A",
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
