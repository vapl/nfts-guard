import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveScanSummary(
  contractAddress: string,
  summary: string
) {
  const { error } = await supabase.from("nft_scan_summary").upsert({
    contract_address: contractAddress,
    summary,
  });

  if (error) console.error("[saveScanSummary]", error);
}
