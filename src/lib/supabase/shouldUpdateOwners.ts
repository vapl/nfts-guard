import { supabase } from "@/lib/supabase/supabase";

export async function shouldUpdateOwners(
  contractAddress: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("nft_owners")
    .select("last_updated")
    .eq("contract_address", contractAddress)
    .order("last_updated", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch last_updated from nft_owners:", error);
    return true; // default to true if uncertain
  }

  if (!data?.last_updated) {
    return true; // No previous scan found
  }

  const lastUpdate = new Date(data.last_updated);
  const hoursSince = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

  return hoursSince >= 24;
}
