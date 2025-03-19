import { NextRequest, NextResponse } from "next/server";
import { fetchAndAnalyzeNFTData } from "@/lib/fetchAndStoreNFTData";

export async function POST(req: NextRequest) {
  try {
    const { contractAddress } = await req.json();

    if (!contractAddress) {
      return NextResponse.json(
        { error: "Missing contract address" },
        { status: 400 }
      );
    }

    console.log(`🔎 Processing NFT analysis for: ${contractAddress}`);

    // Izsaucam backend funkciju, kas analizē NFT
    const result = await fetchAndAnalyzeNFTData(contractAddress, 30); // Analizējam pēdējo 30 dienu periodu

    if (!result) {
      return NextResponse.json(
        { error: "Failed to fetch NFT data" },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
