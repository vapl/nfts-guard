// app/api/holder-distribution/route.ts

import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contractAddress = searchParams.get("contractAddress");

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Missing contract address" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("nft_owners")
    .select("wallet, token_count")
    .eq("contract_address", contractAddress);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch holder data" },
      { status: 500 }
    );
  }

  const buckets = {
    "1": 0,
    "2-5": 0,
    "6-10": 0,
    "11+": 0,
  };

  data?.forEach(({ token_count }) => {
    if (token_count === 1) buckets["1"]++;
    else if (token_count >= 2 && token_count <= 5) buckets["2-5"]++;
    else if (token_count >= 6 && token_count <= 10) buckets["6-10"]++;
    else buckets["11+"]++;
  });

  return NextResponse.json(buckets);
}
