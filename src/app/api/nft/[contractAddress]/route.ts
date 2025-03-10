import { NextRequest, NextResponse } from "next/server";
import { getNFTCollectionData } from "@/lib/nft"; // ❌ Noņem getNFTMetadata

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ contractAddress: string }> }
) {
  const params = await context.params;
  const { contractAddress } = params;

  if (!contractAddress) {
    return NextResponse.json(
      { error: "❌ Invalid or missing contract address" },
      { status: 400 }
    );
  }

  console.log("🚀 Fetching NFT collection data for contract:", contractAddress);

  try {
    const collectionData = await getNFTCollectionData(contractAddress);
    return NextResponse.json({ collection: collectionData });
  } catch (error) {
    console.error("❌ Error fetching NFT metadata:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
