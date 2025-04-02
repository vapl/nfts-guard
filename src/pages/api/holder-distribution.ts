import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { contractAddress } = req.query;

  if (!contractAddress || typeof contractAddress !== "string") {
    return res.status(400).json({ error: "Missing contract address" });
  }

  const { data, error } = await supabase
    .from("nft_owners")
    .select("wallet, token_count")
    .eq("contract_address", contractAddress);

  if (error) {
    return res.status(500).json({ error: "Failed to fetch holder data" });
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

  res.status(200).json(buckets);
}
