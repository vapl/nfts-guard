import { NextRequest, NextResponse } from "next/server";
import { detectWashTrading } from "@/lib/nftscan";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ contractAddress: string }> }
) {
  const params = await context.params;
  const { contractAddress } = params;

  const searchParams = request.nextUrl.searchParams;
  const scanPeriod =
    (searchParams.get("period") as "24h" | "7d" | "30d" | "6m") || "7d";

  if (!contractAddress) {
    return NextResponse.json(
      { error: "❌ Invalid or missing contract address" },
      { status: 400 }
    );
  }

  console.log(
    "🚀 Fetching wash trading data for collection:",
    contractAddress,
    `Period: ${scanPeriod}`
  );

  try {
    const result = await detectWashTrading(contractAddress, scanPeriod);
    return NextResponse.json({ washTrading: result });
  } catch (error) {
    console.error("❌ Error detecting wash trading:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
