import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase";
import { getLatestUpdateTime } from "@/lib/supabase/helpers/getLatestUpdateTime";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contractAddress = searchParams.get("contractAddress");

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Missing contract address" },
      { status: 400 }
    );
  }

  try {
    // 1. Get summary + updated time
    const { data, error } = await supabase
      .from("nft_ai_analysis_results")
      .select("summary, explanations, updated_at")
      .eq("contract_address", contractAddress)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch analysis" },
        { status: 500 }
      );
    }

    // 2. Get last updated time from core NFT data
    const latestUpdate = await getLatestUpdateTime(contractAddress);

    // 3. Decide if refresh is needed
    const requiresRefresh =
      data?.updated_at && latestUpdate
        ? new Date(latestUpdate) > new Date(data.updated_at)
        : true; // if missing → force refresh

    return NextResponse.json({
      summary: data?.summary ?? null,
      explanations: data?.explanations ?? null,
      updated_at: data?.updated_at ?? null,
      requiresRefresh,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
