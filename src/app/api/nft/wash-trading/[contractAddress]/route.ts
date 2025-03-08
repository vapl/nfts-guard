import { NextRequest, NextResponse } from "next/server";
import { detectWashTrading } from "@/lib/nftscan"; // Importē wash trading analīzes funkciju

export async function GET(request: NextRequest, context: any) {
  const { contractAddress } = context.params;

  if (!contractAddress) {
    return NextResponse.json(
      { error: "❌ Invalid or missing contract address" },
      { status: 400 }
    );
  }

  console.log("🚀 Fetching wash trading data for collection:", contractAddress);

  try {
    const result = await detectWashTrading(contractAddress); // Analizē kolekciju
    return NextResponse.json({ washTrading: result });
  } catch (error) {
    console.error("❌ Error detecting wash trading:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
