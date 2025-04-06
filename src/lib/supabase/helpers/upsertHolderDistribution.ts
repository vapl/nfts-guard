// helper/upsertHolderDistribution.ts
import { supabase } from "@/lib/supabase/supabase";
import { HolderDistribution } from "@/types/apiTypes/holderDistribution";

export async function upsertHolderDistribution(
  contractAddress: string,
  holderDistribution: HolderDistribution
) {
  const { error } = await supabase.from("nft_ai_analysis_results").upsert({
    contract_address: contractAddress,
    holder_distribution: holderDistribution,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("❌ Failed to upsert holder distribution:", error);
  }
}
