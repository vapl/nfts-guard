import { NextRequest, NextResponse } from "next/server";
import { getNFTCollectionData, getNFTMetadata } from "@/lib/nft";

export async function GET(
  request: NextRequest,
  context: { params?: { contractAddress?: string; tokenId?: string } }
) {
  console.log("✅ API Call Received! Params:", context.params);

  const contractAddress = context.params?.contractAddress;
  const tokenId = context.params?.tokenId || "1"; // Ja nav norādīts tokenId, izmanto pirmo NFT

  if (!contractAddress) {
    console.error("❌ Missing contract address!");
    return NextResponse.json(
      { error: "Invalid or missing contract address" },
      { status: 400 }
    );
  }

  console.log("🔹 Contract Address:", contractAddress, "Token ID:", tokenId);

  try {
    const collectionData = await getNFTCollectionData(contractAddress);
    const nftMetadata = await getNFTMetadata(contractAddress, tokenId);

    return NextResponse.json({
      collection: collectionData,
      nft: nftMetadata,
    });
  } catch (error) {
    console.error("❌ Error fetching NFT data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
