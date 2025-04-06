// app/api/get-analysis/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase";

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
    const { data, error } = await supabase
      .from("nft_ai_analysis_results")
      .select("summary, explanations")
      .eq("contract_address", contractAddress)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary: data?.summary ?? null,
      explanations: data?.explanations ?? null,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
